import { Interval } from "types/course";

export type Filter = {
  time: Interval[][];
  department: string[];
  enroll_method: EnrollMethod[];
  target_grade: Grade[];
  other_limit: OtherLimit[];
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
// need english label in the future
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

// otherLimit filter
// need english label in the future
export const otherLimits = [
  {
    type_label: "上課形式",
    label: "只顯示英文授課",
    value: "english_only",
    avaliable: true,
  },
  {
    type_label: "上課形式",
    label: "只顯示遠距課程",
    value: "remote_only",
    avaliable: true,
  },
  {
    type_label: "課程調整",
    label: "只顯示異動課程",
    value: "change_only",
    avaliable: true,
  },
  {
    type_label: "課程調整",
    label: "只顯示加開課程",
    value: "add_only",
    avaliable: true,
  },
  {
    type_label: "個人設定",
    label: "只顯示沒有先修規定/資格限制的課程",
    value: "no_prerequisite",
    avaliable: true,
  },
  {
    type_label: "個人設定",
    label: "只顯示未衝堂的課程",
    value: "no_clash",
    avaliable: false,
  },
  {
    type_label: "個人設定",
    label: "只顯示未選課程",
    value: "no_enroll",
    avaliable: false,
  },
] as const;
export type OtherLimit = typeof otherLimits[number]["value"];
