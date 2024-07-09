export async function errorHandler<T extends (...args: any[]) => any>(
  callbackFn: T,
  options?: {
    log?: boolean;
    onError?: (error?: unknown) => void;
    onEndStep?: (error?: unknown) => void;
    onSafeEndStep?: () => void;
  }
): Promise<Awaited<ReturnType<T>> | void> {
  let error: unknown | undefined = undefined;
  try {
    const result = await callbackFn();
    return result;
  } catch (e) {
    error = e;

    if (options?.log) {
      console.log(error);
    }
    if (options?.onError) {
      options.onError(error);
    }
  } finally {
    if (options?.onEndStep) {
      options.onEndStep(error);
    }
    if (!error && options?.onSafeEndStep) {
      options.onSafeEndStep();
    }
  }
}
