import { Interval } from "types/course";

export const FilterSource = {
  time: null,
  department: null,
  category: null,
  enroll_method: null,
};
export type FilterName = keyof typeof FilterSource;
export type FilterEnable = Record<FilterName, boolean>;
export type EnrollMethod = "1" | "2" | "3";
export type Filter = {
  category: string[]; // TODO: refactor to ENUM
  department: string[]; // TODO: refactor to ENUM
  enroll_method: EnrollMethod[];
  time: Interval[][];
};

export type SearchFieldName =
  | "name"
  | "teacher"
  | "serial"
  | "code"
  | "identifier";
