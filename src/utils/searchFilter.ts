import {
  EnrollMethod,
  GeneralCourseType,
  generalCourseTypes,
  commonTargetDepartments,
  CommonTargetDepartment,
  commonCourseTypes,
  CommonCourseType,
  peArmyCourseTypes,
  PeArmyCourseType,
} from "@/types/filter";

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

// general course type
export const MAX_GENERAL_COURSE_TYPE_NUMBER = generalCourseTypes.length;
export function isGeneralCourseTypeFilterActive(
  courseTypes: GeneralCourseType[]
): boolean {
  return (
    courseTypes.length !== 0 &&
    courseTypes.length !== MAX_GENERAL_COURSE_TYPE_NUMBER
  );
}

// common target dept
export const MAX_COMMON_TARGET_DEPT_NUMBER = commonTargetDepartments.length;
export function isCommonTargetDeptFilterActive(
  targetDepts: CommonTargetDepartment[]
): boolean {
  return (
    targetDepts.length !== 0 &&
    targetDepts.length !== MAX_COMMON_TARGET_DEPT_NUMBER
  );
}

// common course type
export const MAX_COMMON_COURSE_TYPE_NUMBER = commonCourseTypes.length;
export function isCommonCourseTypeFilterActive(
  courseTypes: CommonCourseType[]
): boolean {
  return (
    courseTypes.length !== 0 &&
    courseTypes.length !== MAX_COMMON_COURSE_TYPE_NUMBER
  );
}

// pe army course type
export const MAX_PEARMY_COURSE_TYPE_NUMBER = peArmyCourseTypes.length;
export function isPeArmyCourseTypeFilterActive(
  courseTypes: PeArmyCourseType[]
): boolean {
  return (
    courseTypes.length !== 0 &&
    courseTypes.length !== MAX_PEARMY_COURSE_TYPE_NUMBER
  );
}
