import { Interval } from "types/course";

export type Filter = {
  time: Interval[][];
  department: string[];
  enroll_method: EnrollMethod[];
  target_grade: Grade[];
};

export type SearchFieldName =
  | "name"
  | "teacher"
  | "serial"
  | "code"
  | "identifier";

// enroll method filter
export type EnrollMethod = "1" | "2" | "3";

// targetGrade filter
export const grades = [
  {
    label: "大一",
    value: "1",
  },
  {
    label: "大二",
    value: "2",
  },
  {
    label: "大三",
    value: "3",
  },
  {
    label: "大四",
    value: "4",
  },
  {
    label: "碩士",
    value: "m",
  },
  {
    label: "博士",
    value: "d",
  },
] as const;
export type Grade = typeof grades[number]["value"];
