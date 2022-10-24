import { Interval } from "types/course";

export type Filter = {
  time: Interval[][];
  department: string[];
  enroll_method: EnrollMethod[];
  target_grade: Grade[];
  other_limit: OtherLimit[];
  general_course_type: GeneralCourseType[];
  is_full_year: boolean | null;
  is_selective: boolean | null;
};

// deprecated
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

// general course type
export const generalCourseTypes = [
  {
    value: "A1",
    chinese_label: "A1 - 文學與藝術領域",
    english_label: "A1 - Humanities and Arts",
  },
  {
    value: "A2",
    chinese_label: "A2 - 歷史思維領域",
    english_label: "A2 - Historical Thinking",
  },
  {
    value: "A3",
    chinese_label: "A3 - 世界文明領域",
    english_label: "A3 - World Civilization",
  },
  {
    value: "A4",
    chinese_label: "A4 - 哲學與道德思考領域",
    english_label: "A4 - Philosophy and Moral Thinking",
  },
  {
    value: "A5",
    chinese_label: "A5 - 公民意識與社會分析領域",
    english_label: "A5 - Civic Consciousness and Social Analysis",
  },
  {
    value: "A6",
    chinese_label: "A6 - 量化分析與數學素養領域",
    english_label: "A6 - Quantitative Analysis and Mathematical Literacy",
  },
  {
    value: "A7",
    chinese_label: "A7 - 物質科學領域",
    english_label: "A7 - Physical Science",
  },
  {
    value: "A8",
    chinese_label: "A8 - 生命科學領域",
    english_label: "A8 - Life Science",
  },
  {
    value: "BasicAbility",
    chinese_label: "基本能力課程",
    english_label: "Basic Ability Course",
  },
  {
    value: "Freshman",
    chinese_label: "新生專題/新生講座課程(非通識)",
    english_label: "Freshman Seminar/Lecture Course (Non-General Education)",
  },
] as const;
export type GeneralCourseType = typeof generalCourseTypes[number]["value"];

// for sorting
export const sortOptions = [
  {
    id: "correlation",
    chinese: "相關性",
    english: "Correlation",
  },
  {
    id: "limit_asc",
    chinese: "修課總人數 (遞增)",
    english: "Enrollment Limit (Ascending)",
  },
  {
    id: "limit_desc",
    chinese: "修課總人數 (遞減)",
    english: "Enrollment Limit (Descending)",
  },
  {
    id: "credits_asc",
    chinese: "學分數 (遞增)",
    english: "Credits (Ascending)",
  },
  {
    id: "credits_desc",
    chinese: "學分數 (遞減)",
    english: "Credits (Descending)",
  },
] as const;
export type SortOption = typeof sortOptions[number]["id"];
