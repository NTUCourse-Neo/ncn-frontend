import { EnrollMethod, Grade } from "@/types/search";

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

// targetGrade
export const MAX_TARGET_GRADE_NUMBER = 6;
export function isTargetGradeFilterActive(grades: Grade[]): boolean {
  return grades.length !== 0 && grades.length !== MAX_TARGET_GRADE_NUMBER;
}
