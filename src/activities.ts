import { SemanticQueryExecuteOperationResponseV1 } from "./shared";

export interface Activities {
  'operation://query/v1/semantic/execute': (input: any) => Promise<SemanticQueryExecuteOperationResponseV1>;
  'operation://asa/v1/weighting/execute': (input: any) => Promise<any>;
}