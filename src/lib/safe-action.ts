export type ServerActionResult<T> =
  | { success: true; value: T }
  | { success: false; error: string };

export class ServerActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ServerActionError';
  }
}

/**
 * Wraps a server action callback to handle errors safely and return a standardized {@link ServerActionResult}.
 *
 * This utility function ensures that errors occurring inside server actions are managed gracefully,
 * especially in production environments where React suppresses detailed error messages for security reasons.
 *
 * @remarks
 * - If the callback executes successfully, the result is returned as a {@link ServerActionResult} with `success: true` and the value.
 * - If the callback throws an error:
 *   - If the error is an instance of {@link ServerActionError}, a {@link ServerActionResult} with `success: false` and the error message is returned.
 *   - Otherwise, the error is re-thrown for further handling.
 *
 * This function is particularly useful in server actions for consistent error handling and improved debugging.
 *
 * @typeParam Return - The type of the value returned by the server action callback.
 * @typeParam Args - The type of arguments expected by the server action callback (defaults to an empty tuple `[]`).
 *
 * @param callback - The server action callback function to wrap, which takes any number of arguments and returns a promise.
 *
 * @returns A new function that wraps the original server action callback. When called, it executes the callback and
 *          returns a {@link ServerActionResult} object indicating success or failure.
 *
 * @example
 * ```typescript
 * 'use server';
 *
 * async function performAction(input: string) {
 *   if (!input) throw new ServerActionError('Invalid input!');
 *   return parseInt(input, 10);
 * }
 *
 * const safeAction = createServerAction(performAction);
 *
 * const result = await safeAction('123');
 * // result: { success: true, value: 123 }
 *
 * const errorResult = await safeAction('');
 * // errorResult: { success: false, error: 'Invalid input!' }
 * ```
 */
export function createServerAction<Return, Args extends unknown[] = []>(
  callback: (...args: Args) => Promise<Return>,
): (...args: Args) => Promise<ServerActionResult<Return>> {
  return async (...args: Args) => {
    try {
      const value = await callback(...args);
      return { success: true, value };
    } catch (error) {
      if (error instanceof ServerActionError)
        return { success: false, error: error.message };
      throw error;
    }
  };
}

/**
 * Wraps a server action callback to handle success and throw errors for failed actions.
 *
 * This function simplifies error handling for safe server actions created by `createServerAction`.
 * It throws an error if the action fails.
 * It is designed for use
 * on the client side and is not suitable for files with the `'use server'` directive.
 *
 * @remarks
 * - If the server action callback returns a {@link ServerActionResult} with `success: true`, the value is returned directly.
 * - If the result has `success: false`, an error is thrown using the error message, enabling standard `try-catch` patterns.
 *
 * This utility is particularly useful for client-side code to streamline interaction with server actions
 * and avoid working with errors as values.
 *
 * @typeParam T - The type of the value expected from the server action result.
 * @typeParam Args - The type of arguments expected by the server action callback (defaults to an empty array `[]`).
 *
 * @param callback - A server action callback function that returns a promise resolving to a {@link ServerActionResult}.
 *
 * @returns A wrapped version of the safe server action callback that returns the value on success or throws an error on failure.
 *
 * @example
 * ```typescript
 * // Example of a server action that may succeed or fail
 * const serverAction = createServerAction(async (input: number) => {
 *   if (input < 0) throw new ServerActionError('Input must be non-negative');
 *   return `Processed ${input}`;
 * })
 *
 * // Create a client-side handler for the server action
 * const handleAction = createServerActionHandler(serverAction);
 *
 * async function processInput(input: number) {
 *   try {
 *     const result = await handleAction(input);
 *     console.log('Success:', result); // Logs: Success: Processed 5
 *   } catch (error) {
 *     console.error('Error:', error.message); // Logs: Error: Input must be non-negative
 *   }
 * }
 *
 * // Example usage
 * processInput(5);  // Success: Processed 5
 * processInput(-1); // Error: Input must be non-negative
 * ```
 */
export function createServerActionHandler<T, Args extends unknown[] = []>(
  callback: (...args: Args) => Promise<ServerActionResult<T>>,
) {
  return async (...args: Args) => {
    const result = await callback(...args);
    if (!result.success) {
      throw new ServerActionError(result.error);
    }
    return result.value;
  };
}
