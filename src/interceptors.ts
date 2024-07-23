import { ActivityInboundCallsInterceptor, Next, ActivityExecuteInput, Headers } from '@temporalio/worker';
import { temporal } from '@temporalio/proto';

class AppIDInterceptor implements ActivityInboundCallsInterceptor {
  private appID: string;

  constructor(appID: string) {
    this.appID = appID;
  }

  private encodePayload(value: string): temporal.api.common.v1.IPayload {
    return {
      metadata: { 'encoding': new TextEncoder().encode('json/plain') },
      data: new TextEncoder().encode(JSON.stringify(value)),
    };
  }

  async execute(input: ActivityExecuteInput, next: Next<ActivityInboundCallsInterceptor, 'execute'>): Promise<any> {
    let headers: Headers =  {
        ...input.headers,
        application_id: this.encodePayload(this.appID)
    }
    return await next({ ...input, headers });
  }
}

export default AppIDInterceptor;
