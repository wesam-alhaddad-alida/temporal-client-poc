import { Connection, WorkflowClient } from '@temporalio/client';
import { QueryAndWeightCalculation } from './workflows';
import { CDMWorkflowType, WorkflowInput, address, namespace, taskQueueName } from './shared';

const queryInput: any = {
  "query": {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "$id": "https://alida.com/dashboard/<dashboard-id>/<page-id>/<widget-id>/widgetname.schema.json",
        "title": "200_csv_weighting_sc2_x_city",
        "description": "Test Report: https://sit1.alidalabs.com/insights/shared?539a36ab66bb41d48735baef5093d69f&lang=en-US",
        "properties": {
          "grouping_type": "none",
          "entities": [
            {
              "id": "41a7dddd3c84770a37be147e512fbc00",
              "attributes": [
                {
                  "id": "9269b63a0a80fe50f7efe09b790e91f6",
                  "measures": [
                    {
                      "type": "distinct_count",
                      "alias": "w"
                    },
                    {
                      "type": "percent_of_total_distinct",
                      "alias": "w"
                    }
                  ]
                }
              ],
              "survey_filters": {
                "dataset_type": [
                  0
                ],
                "response_status": [
                  2
                ]
              }
            },
            {
              "id": "6660c362a27a6f2991c82baf92c02ca4",
              "attributes": [
                {
                  "id": "8f698dc941633b9b8d690d408aa14a2a"
                }
              ]
            }
          ],
          "transform": {
            "fields": [
              {
                "field": "9269b63a0a80fe50f7efe09b790e91f6.value",
                "hidden": true
              },
              {
                "field": "8f698dc941633b9b8d690d408aa14a2a.value",
                "hidden": true
              },
              {
                "field": "9269b63a0a80fe50f7efe09b790e91f6.id",
                "as": "9269b63a0a80fe50f7efe09b790e91f6"
              },
              {
                "field": "8f698dc941633b9b8d690d408aa14a2a.id",
                "as": "8f698dc941633b9b8d690d408aa14a2a"
              },
              {
                "field": "distinct_count_w",
                "as": "count"
              },
              {
                "field": "percent_of_total_distinct_w",
                "as": "proportion"
              }
            ]
          }
        }
  },
  "content_type": 5
}

const WeightingIntent = {
      "variables": [
          "9269b63a0a80fe50f7efe09b790e91f6",
          "8f698dc941633b9b8d690d408aa14a2a"
        ],
        "proportion": "proportion",
        "count": "count",
        "dimensions": [
          3,
          3
        ],
        "target_fraction": [
          {
            "question_id": "9269b63a0a80fe50f7efe09b790e91f6",
            "choice_id": "3c153687ce6444d307bb407c37e6296b",
            "fraction": 0.4
          },
          {
            "question_id": "9269b63a0a80fe50f7efe09b790e91f6",
            "choice_id": "7e605e9e442f19a9dc8c34be9441174f",
            "fraction": 0.4
          },
          {
            "question_id": "9269b63a0a80fe50f7efe09b790e91f6",
            "choice_id": "c878983d315b4b800c672af79040e128",
            "fraction": 0.2
          },
          {
            "question_id": "8f698dc941633b9b8d690d408aa14a2a",
            "choice_id": "605b5e068ce76d934beea2828d527c29",
            "fraction": 0.4
          },
          {
            "question_id": "8f698dc941633b9b8d690d408aa14a2a",
            "choice_id": "c5fe1b9c3645bc9be911c5de395f5412",
            "fraction": 0.4
          },
          {
            "question_id": "8f698dc941633b9b8d690d408aa14a2a",
            "choice_id": "1433186d03907145158295432044f361",
            "fraction": 0.2
          }
        ]
}

const weightingInput: any = 
{
	"data_location_id": "",
	"intent_id": JSON.stringify(WeightingIntent),
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
			payload: weightingInput,	
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
  console.dir(await handle.result(), {depth: null});
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
