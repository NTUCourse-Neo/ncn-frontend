import { FilterType } from "@/types/search";

export type SearchModeID =
  | "fast"
  | "dept"
  | "general"
  | "common"
  | "pearmy"
  | "program"
  | "expertise"
  | "interschool"
  | "grouping"
  | "intensive"
  | "english";

export interface SearchMode {
  id: SearchModeID; // used for letting backend know
  chinese: string;
  english: string;
  filters: FilterType[];
}

const searchModeList: SearchMode[] = [
  {
    id: "fast",
    chinese: "快速搜尋",
    english: "Quick Search",
    filters: ["time", "dept", "enroll_method", "target_grade", "other_limit"],
  },
  {
    id: "dept",
    chinese: "系所",
    english: "Department",
    filters: ["time", "dept", "enroll_method", "target_grade", "other_limit"],
  },
  {
    id: "general",
    chinese: "通識/新生",
    english: "General Education/Freshman",
    filters: ["time", "general_course_type", "enroll_method", "other_limit"],
  },
  {
    id: "common",
    chinese: "共同",
    english: "Common",
    filters: [
      "time",
      "common_target_dept",
      "common_course_type",
      "enroll_method",
      "other_limit",
    ],
  },
  {
    id: "pearmy",
    chinese: "體育/國防",
    english: "PE/Army",
    filters: ["time", "pearmy_course_type", "enroll_method", "other_limit"],
  },
  {
    id: "program",
    chinese: "學分學程",
    english: "Program",
    filters: ["time", "enroll_method", "other_limit"],
  },
  {
    id: "expertise",
    chinese: "領域專長",
    english: "Domain Expertise",
    filters: [],
  },
  {
    id: "interschool",
    chinese: "校際",
    english: "Inter-School Courses",
    filters: ["time", "host_college", "enroll_method", "other_limit"],
  },
  {
    id: "grouping",
    chinese: "分組編班",
    english: "Grouping",
    filters: ["time", "enroll_method", "other_limit"],
  },
  {
    id: "intensive",
    chinese: "密集",
    english: "Intensive",
    filters: ["time", "dept", "enroll_method", "target_grade", "other_limit"],
  },
  {
    id: "english",
    chinese: "進階英語",
    english: "Advanced English",
    filters: ["time", "dept", "enroll_method", "target_grade", "other_limit"],
  },
];

export default searchModeList;
