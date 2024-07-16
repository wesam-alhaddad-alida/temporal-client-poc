import { proxyActivities } from '@temporalio/workflow';
import { ApplicationFailure } from '@temporalio/common';
import { Activities } from './activities';
import { SemanticQueryExecuteOperationResponseV1, WorkflowInput, queryQueueName } from './shared';

const { 'operation://query/v1/semantic/execute': OperationQueryV1SemanticExecute } = proxyActivities<Activities>({
  startToCloseTimeout: '1 minute',
  retry: {
      initialInterval: 10,
      maximumInterval: 60,
      backoffCoefficient: 2,
      maximumAttempts: 500,
      nonRetryableErrorTypes: ['InvalidQueryDefinitionError', 'IncorrectDataFormat'],
},
  taskQueue: queryQueueName
})

export async function QueryAndWeightCalculation(input: WorkflowInput): Promise<string> {

  const queryOperationInput = input.operations[0].payload

  let rawResult: SemanticQueryExecuteOperationResponseV1;
  try {
    rawResult = await OperationQueryV1SemanticExecute(queryOperationInput);
  } catch (rawQueryServiceErr) {
    console.log(`failed to call service`)
    throw new ApplicationFailure(`query service raw results failed. Error: ${rawQueryServiceErr}`);
  }

  return `Query result data: ${rawResult.data}.  Data Location id: ${rawResult.data_location_id}`;
  
}