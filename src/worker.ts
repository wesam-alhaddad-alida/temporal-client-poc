import { NativeConnection, Worker } from '@temporalio/worker';
import { namespace, taskQueueName, address } from './shared';

async function run() {

  const workerConnection = await NativeConnection.connect({
    address, // default localhost:7322
  })

  const worker = await Worker.create({
    workflowsPath: require.resolve('./workflows'),
    taskQueue: taskQueueName,
    namespace: namespace,
    connection: workerConnection,
  });

  console.log(`Worker started for namespace: ${namespace}, task queue: ${taskQueueName}`);

  await worker.run();

}

run().catch((err) => {
  console.error('Worker failed: ', err);
  process.exit(1);
});