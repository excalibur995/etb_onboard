/**
 * Dummy step executor for `system` type journey steps.
 *
 * Replace individual handlers with real API calls when ready.
 * Each key is `${service}.${operation}`.
 */

export type StepExecutorResult =
  | { success: true; data?: Record<string, unknown> }
  | { success: false; error: string };

type StepHandler = (params: any) => Promise<StepExecutorResult>;

const handlers: Record<string, StepHandler> = {
  'identity-service.verifyCreditCard': async params => {
    // Simulate network delay
    await delay(1200);
    // Dummy logic: always succeeds (replace with real API call)
    return { success: true, data: { verified: true } };
  },
};

const delay = (ms: number) => new Promise<void>(res => setTimeout(() => res(), ms));

export const executeSystemStep = async (
  service: string,
  operation: string,
  params: any,
): Promise<StepExecutorResult> => {
  const key = `${service}.${operation}`;
  const handler = handlers[key];

  if (!handler) {
    console.warn(`[StepExecutor] No handler for: ${key}. Defaulting to success.`);
    await delay(500);
    return { success: true };
  }

  try {
    return await handler(params);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
