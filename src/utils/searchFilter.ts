import { EnrollMethod } from "@/types/search";

// enroll method
export const MAX_ENROLL_METHOD_NUMBER = 3;
export function isEnrollMethodFilterActive(
  enrollMethods: EnrollMethod[]
): boolean {
  return (
    enrollMethods.length !== 0 &&
    enrollMethods.length !== MAX_ENROLL_METHOD_NUMBER
  );
}
