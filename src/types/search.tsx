import { Interval } from "types/course";
import {
  TimeFilter,
  DeptFilter,
  EnrollMethodFilter,
  OtherLimitFilter,
  GeneralCourseTypeFilter,
  CommonTargetDeptFilter,
  CommonCourseTypeFilter,
  PeArmyCourseTypeFilter,
  CourseProviderFilter,
  ProgramFilter,
  GroupingCourseTypeFilter,
  SingleDeptFilter,
} from "@/components/Filters/index";
import { programs as AllPrograms } from "@/data/program";
import { Department } from "types/course";

export type Filter = {
  time: Interval[][]; // time // TODO: wait for new API
  department: string[]; // departments // TODO: wait for new API
  enroll_method: EnrollMethod[]; // enrollMethods // TODO: wait for new API
  // otherLimits
  isEnglishTaught: boolean;
  isDistanceLearning: boolean;
  hasChanged: boolean;
  isAdditionalCourse: boolean;
  noPrerequisite: boolean;
  noConflictOnly: boolean;
  notEnrolledOnly: boolean;
  generalCourseTypes: GeneralCourseType[];
  commonTargetDepartments: CommonTargetDepartment[];
  commonCourseTypes: CommonCourseType[];
  peArmyCourseTypes: PeArmyCourseType[];
  courseProviders: CourseProvider[];
  program: ProgramCode[]; // programs
  is_full_year: boolean | null; // isFullYear
  isCompulsory: boolean | null; // null: all, true: compulsory, false: elective
  time_strict_match: boolean; // timeStrictMatch
  grouping_course_type: string[]; // groupingCourseTypes
  dept: Department | null; // for singleDept, department
  department_course_type: string | null; // for singleDept, departmentCourseTypes
  singleDeptIsCompulsory: boolean | null; // null: all, true: compulsory, false: elective // for singleDept
  suggestedGrade: string | null; // for singleDept, suggestedGrade
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

// refactor these to isCompulsoryOptions
export const isSelectiveOptions = ["all", "selective", "required"] as const;
export type IsSelectiveOption = typeof isSelectiveOptions[number];

// otherLimit filter
// need english label in the future
export const otherLimits = [
  {
    type_label: "上課形式",
    label: "只顯示英文授課",
    value: "isEnglishTaught",
    avaliable: true,
  },
  {
    type_label: "上課形式",
    label: "只顯示遠距課程",
    value: "isDistanceLearning",
    avaliable: true,
  },
  {
    type_label: "課程調整",
    label: "只顯示異動課程",
    value: "hasChanged",
    avaliable: true,
  },
  {
    type_label: "課程調整",
    label: "只顯示加開課程",
    value: "isAdditionalCourse",
    avaliable: true,
  },
  {
    type_label: "個人設定",
    label: "只顯示沒有先修規定/資格限制的課程",
    value: "noPrerequisite",
    avaliable: true,
  },
  {
    type_label: "個人設定",
    label: "只顯示未衝堂的課程",
    value: "noConflictOnly",
    avaliable: false,
  },
  {
    type_label: "個人設定",
    label: "只顯示未加入課程",
    value: "notEnrolledOnly",
    avaliable: false,
  },
] as const;

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

// common target department // TODO: need english label
export const commonTargetDepartments = [
  {
    value: "1",
    chinese_label: "文學院",
  },
  {
    value: "2",
    chinese_label: "理學院",
  },
  {
    value: "3",
    chinese_label: "社會科學院",
  },
  {
    value: "4",
    chinese_label: "醫學院",
  },
  {
    value: "5",
    chinese_label: "工學院",
  },
  {
    value: "6",
    chinese_label: "生物資源暨農學院",
  },
  {
    value: "7",
    chinese_label: "管理學院",
  },
  {
    value: "8",
    chinese_label: "公共衛生學院",
  },
  {
    value: "9",
    chinese_label: "電機資訊學院",
  },
  {
    value: "A",
    chinese_label: "法律學院",
  },
  {
    value: "B",
    chinese_label: "生命科學院",
  },
  {
    value: "H",
    chinese_label: "共同教育中心",
  },
  {
    value: "I",
    chinese_label: "國際學院",
  },
  {
    value: "K",
    chinese_label: "重點科技研究學院與三校聯盟",
  },
  {
    value: "Z",
    chinese_label: "創新設計學院",
  },
] as const;
export type CommonTargetDepartment =
  typeof commonTargetDepartments[number]["value"];

// common course type
export const commonCourseTypes = [
  {
    value: "chinese",
    chinese_label: "國文",
  },
  {
    value: "english",
    chinese_label: "英文",
  },
  {
    value: "foreign_language",
    chinese_label: "外文",
  },
  {
    value: "can_be_foreign_language",
    chinese_label: "可充當外文",
  },
  {
    value: "common_selective",
    chinese_label: "共同選修",
  },
] as const;
export type CommonCourseType = typeof commonCourseTypes[number]["value"];

// PE/Army course type
export const peArmyCourseTypes = [
  {
    chinese_label: "健康體適能",
    value: "health",
  },
  {
    chinese_label: "專項運動學群",
    value: "special_sport",
  },
  {
    chinese_label: "選修體育",
    value: "elective_pe",
  },
  {
    chinese_label: "校隊體育",
    value: "school_team_pe",
  },
  {
    chinese_label: "國防教育",
    value: "army",
  },
] as const;
export type PeArmyCourseType = typeof peArmyCourseTypes[number]["value"];

export const courseProviders = [
  {
    value: "NTNU",
    chinese_label: "臺師大",
  },
  {
    value: "NTUST",
    chinese_label: "臺科大",
  },
] as const;
export type CourseProvider = typeof courseProviders[number]["value"];

// Program
export const programs = AllPrograms;
export type ProgramCode = typeof programs[number]["value"];

// All filters
export const filterComponentMap = {
  time: {
    id: "time",
    component: <TimeFilter />,
  },
  dept: {
    id: "dept",
    component: <DeptFilter />,
  },
  enroll_method: {
    id: "enroll_method",
    component: <EnrollMethodFilter />,
  },
  other_limit: {
    id: "other_limit",
    component: <OtherLimitFilter />,
  },
  general_course_type: {
    id: "general_course_type",
    component: <GeneralCourseTypeFilter />,
  },
  common_target_dept: {
    id: "common_target_dept",
    component: <CommonTargetDeptFilter />,
  },
  common_course_type: {
    id: "common_course_type",
    component: <CommonCourseTypeFilter />,
  },
  pearmy_course_type: {
    id: "pearmy_course_type",
    component: <PeArmyCourseTypeFilter />,
  },
  host_college: {
    id: "host_college",
    component: <CourseProviderFilter />,
  },
  program: {
    id: "program",
    component: <ProgramFilter />,
  },
  grouping_course_type: {
    id: "grouping_course_type",
    component: <GroupingCourseTypeFilter />,
  },
  single_dept: {
    id: "single_dept",
    component: <SingleDeptFilter />,
  },
} as const;
export type FilterComponentId = keyof typeof filterComponentMap;

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
