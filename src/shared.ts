
export const namespace = 'cdm_v1';
export const taskQueueName = 'workflow://asa/v1';
export const queryQueueName = 'operation-queue://query/v1';
export const weightingQueueName = 'operation-queue://weighting/v1';
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

interface WeightingStatistics {
  converged: boolean;
  iterations: number;
  weighting_efficiency: number;
  min_combination_weight: number;
  max_combination_weight: number;
  weighted_base: number;
  unweighted_base: number;
  effective_base: number;
  weight_cap_convergence: string;
  weight_cap_iterations: number;
}

interface ChoiceFraction {
  quesiton_id: string;
  choice_id: string;
  fraction: number;
}

interface QuestionChoice {
  question_id: string;
  choice_id: string;
}

interface ResultFraction {
  index: QuestionChoice[];
  factor: number;
}

export interface WeightingResult {
  weight_factors_combination: ResultFraction[];
  target_weight_proportions: ChoiceFraction[];
  achieved_weight_proportions: ChoiceFraction[];
  stats: WeightingStatistics;
}