
export const namespace = 'cdm_v1';
export const taskQueueName = 'workflow://asa/v1';
export const queryQueueName = 'operation-queue://query/v1';
export const address = 'localhost:7233';

export enum CDMWorkflowType  {
  Short = 'short',
  Long = 'long'
}

export type CDMWorkflowOperation = {
  sequence_id: number;
  activity: string;
  payload: any;
}

export type WorkflowInput = {
  workflow_external_id: string;
  type: CDMWorkflowType;
  client_id: string;
  description: string;
  operations: CDMWorkflowOperation[];
};

export interface SemanticQueryExecuteOperationResponseV1  {
  data: any | null;
  data_location_id: string | null;
}