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
}

const searchModeList: SearchMode[] = [
  {
    id: "fast",
    chinese: "快速搜尋",
    english: "Quick Search",
  },
  {
    id: "dept",
    chinese: "系所課程",
    english: "Department Courses",
  },
  {
    id: "general",
    chinese: "通識",
    english: "General Education",
  },
  {
    id: "common",
    chinese: "共同",
    english: "Common",
  },
  {
    id: "pearmy",
    chinese: "體育軍訓",
    english: "PE/Army",
  },
  {
    id: "program",
    chinese: "學程",
    english: "Program",
  },
  {
    id: "expertise",
    chinese: "領域專長",
    english: "Domain Expertise",
  },
  {
    id: "interschool",
    chinese: "校際課程",
    english: "Inter-School Courses",
  },
  {
    id: "grouping",
    chinese: "分組編班",
    english: "Grouping",
  },
  {
    id: "intensive",
    chinese: "密集",
    english: "Intensive",
  },
  {
    id: "english",
    chinese: "進階英語",
    english: "Advanced English",
  },
];

export default searchModeList;