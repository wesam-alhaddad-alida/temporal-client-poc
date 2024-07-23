import { NativeConnection, Worker } from '@temporalio/worker';
import { namespace, taskQueueName, address } from './shared';
import AppIDInterceptor from './interceptors';

async function run() {

  const workerConnection = await NativeConnection.connect({
    address, // default localhost:7322
  })

  const worker = await Worker.create({
    workflowsPath: require.resolve('./workflows'),
    taskQueue: taskQueueName,
    interceptors: {
      activityInbound: [(ctx) => new AppIDInterceptor('c806452d-ed9c-4f0d-a670-a5460139e496')]
    },
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