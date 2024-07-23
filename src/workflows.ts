import { proxyActivities } from '@temporalio/workflow';
import { ApplicationFailure } from '@temporalio/common';
import { Activities } from './activities';
import { SemanticQueryExecuteOperationResponseV1, WeightingResult, WorkflowInput, queryQueueName, weightingQueueName } from './shared';

const retryOptions = {
      initialInterval: 10,
      maximumInterval: 60,
      backoffCoefficient: 2,
      maximumAttempts: 500,
      nonRetryableErrorTypes: ['InvalidQueryDefinitionError', 'IncorrectDataFormat'],
}

const { 'operation://query/v1/semantic/execute': OperationQueryV1SemanticExecute } = proxyActivities<Activities>({
  startToCloseTimeout: '1 minute',
  retry: retryOptions,
  taskQueue: queryQueueName
})

const { 'operation://asa/v1/weighting/execute': WeightingV1SemanticExecute } = proxyActivities<Activities>({
  startToCloseTimeout: '1 minute',
  retry: retryOptions,
  taskQueue: weightingQueueName
})

export async function QueryAndWeightCalculation(input: WorkflowInput): Promise<any> {

  const queryOperationInput = input.operations[0].payload

  let rawResult: SemanticQueryExecuteOperationResponseV1;
  try {
    rawResult = await OperationQueryV1SemanticExecute(queryOperationInput);
  } catch (rawQueryServiceErr) {
    console.log(`failed to call service`)
    throw new ApplicationFailure(`query service raw results failed. Error: ${rawQueryServiceErr}`);
  }

  console.log(`Query result data: ${rawResult.data}.  Data Location id: ${rawResult.data_location_id}`);

  const weightingInput = {
    ...input.operations[1].payload,
    data_location_id: rawResult.data_location_id,
  }

  let weightingResult: WeightingResult
  try {
    weightingResult = await WeightingV1SemanticExecute(weightingInput)
  } catch (weightingServiceErr) {
    console.log(`failed to call weighting operation`)
    throw new ApplicationFailure(`query service raw results failed. Error: ${weightingServiceErr}`);
  }

  return weightingResult
  
}