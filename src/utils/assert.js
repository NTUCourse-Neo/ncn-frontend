export function assertNotNil(value, message) {
  if (value === null || value === undefined) {
    console.log(message ?? `${value} is null or undefined`);
    return false;
  }
  return true;
}
