# Temporal Client SDK POC in TypeScript

The client defines the workflow.  In this example the workflow includes calling the CDM query service activity and then the output will feed into the weighting calculator activity (WIP).

### Running this sample:

1. Make sure Temporal Server is running locally (see the [quick install guide](https://docs.temporal.io/server/quick-install/)).
1. For this example, make sure to run CDM dev container and be connected to CDM Sit1 database [CDM](https://github.com/vcilabs/datalake-cdm).  Run the Orchestrator/Query/ASA service.
1. `npm install` to install dependencies.
1. `npm run worker` to start the Worker.
1. In another shell, `npm run client` to run the Workflow Client.
