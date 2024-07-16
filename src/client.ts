import { Connection, WorkflowClient } from '@temporalio/client';
import { QueryAndWeightCalculation } from './workflows';
import { CDMWorkflowType, WorkflowInput, address, namespace, taskQueueName } from './shared';

const queryInput: any =
{
  "query": {
  	"$schema": "https://json-schema.org/draft/2020-12/schema",
  	"$id": "https://alida.com/dashboard/<dashboard-id>/<page-id>/<widget-id>/widgetname.schema.json",
  	"title": "200_sc1_count",
  	"description": "Test Report: https://sit1.alidalabs.com/insights/shared?539a36ab66bb41d48735baef5093d69f&lang=en-US",
  	"properties": {
  	  "entities": [
  	    {
  	      "id": "41a7dddd3c84770a37be147e512fbc00",
  	      "attributes": [
  	        {
  	          "id": "54068b84077e7d00e935012943dbf33d",
  	          "measures": [
  	            {
  	              "type": "distinct_count",
  	              "alias": "cell"
  	            }
  	          ]
  	        }
  	      ],
  	      "survey_filters": {
  	        "dataset_type": [0],
  	        "response_status": [2]
  	      }
  	    }
  	  ]
  	}
  },
  "application_id": "c806452d-ed9c-4f0d-a670-a5460139e496",
  "content_type": 5
}

const workflowInput: WorkflowInput = {
	workflow_external_id: "query-weighting-poc-123",
	type: CDMWorkflowType.Short,
	client_id: "dna-service",
	description: "query followed by weighting",
	operations: [
		{
			sequence_id: 1,
			activity: "queryService",
			payload: queryInput,	
		},
		{
			sequence_id: 2,
			activity: "weighting_calculator",
			payload: {},	
		},
	]
}

async function run() {

  let connectionOptions = {
		address,
  };

  const connection = await Connection.connect(connectionOptions);
  const client = new WorkflowClient({ connection, namespace });

  const handle = await client.start(QueryAndWeightCalculation, {
    args: [workflowInput],
    taskQueue: taskQueueName,
    workflowId: workflowInput.workflow_external_id,
  });

  console.log(
    `Started Workflow ${handle.workflowId} with RunID ${handle.firstExecutionRunId}`
  );
  console.log(await handle.result());
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
