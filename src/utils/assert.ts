export function assertNotNil<T>(
  value: T | null | undefined,
  message?: string
): boolean {
  if (value === null || value === undefined) {
    console.log(message ?? `${value} is null or undefined`);
    return false;
  }
  return true;
}
