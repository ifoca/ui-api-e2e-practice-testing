import { waitForCondition } from '../../../../shared/helpers/waitForCondition.js';

describe('waitForCondition', () => {
  test('resolves immediately when condition is already true', async () => {
    // A function that always returns true — condition met on first check
    const alwaysTrue = jest.fn().mockResolvedValue(true);

    // Should resolve without throwing
    await expect(waitForCondition(alwaysTrue, 1000, 50)).resolves.toBeUndefined();

    expect(alwaysTrue).toHaveBeenCalledTimes(1);
  });

  test('polls until condition becomes true', async () => {
    let callCount = 0;

    // A function that returns false for the first 3 calls, then true
    const eventuallyTrue = jest.fn().mockImplementation(() => {
      callCount++;
      return callCount >= 3; // true on the 3rd call
    });

    await waitForCondition(eventuallyTrue, 2000, 10);

    // Should have been called at least 3 times
    expect(eventuallyTrue.mock.calls.length).toBeGreaterThanOrEqual(3);
  });

  test('rejects with timeout error when condition never becomes true', async () => {
    const neverTrue = jest.fn().mockResolvedValue(false);

    // Short timeout so the test doesn't take long
    await expect(waitForCondition(neverTrue, 150, 30)).rejects.toThrow(
      'waitForCondition: timed out after 150ms',
    );
  });

  test('works with synchronous condition functions', async () => {
    // conditionFn can be sync — the await in waitForCondition handles both
    let counter = 0;
    const syncFn = () => {
      counter++;
      return counter === 2;
    };

    await expect(waitForCondition(syncFn, 1000, 10)).resolves.toBeUndefined();
    expect(counter).toBe(2);
  });
});
