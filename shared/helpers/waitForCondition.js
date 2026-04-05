export const waitForCondition = async (conditionFn, timeout = 5000, interval = 100) => {
  const startTime = Date.now();

  while (true) {
    const elapsed = Date.now() - startTime;

    if (elapsed >= timeout) {
      throw new Error(`waitForCondition: timed out after ${timeout}ms`);
    }

    const result = await conditionFn();

    if (result) return;

    await new Promise((res) => setTimeout(res, interval));
  }
};
