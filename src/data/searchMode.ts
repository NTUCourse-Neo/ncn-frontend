import { FilterComponentId } from "@/types/search";
import type { PrecautionName } from "@/components/InstructionModals";

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
  filters: FilterComponentId[];
  precautions: PrecautionName[];
}

const searchModeList: SearchMode[] = [
  {
    id: "fast",
    chinese: "快速搜尋",
    english: "Quick Search",
    filters: ["time", "dept", "enrollMethod", "otherLimit"],
    precautions: ["courseSelectionRule"],
  },
  {
    id: "dept",
    chinese: "系所",
    english: "Department",
    filters: ["time", "singleDept", "enrollMethod", "otherLimit"],
    precautions: ["courseSelectionRule"],
  },
  {
    id: "general",
    chinese: "通識/新生",
    english: "General Education/Freshman",
    filters: ["time", "generalCourseType", "enrollMethod", "otherLimit"],
    precautions: ["courseSelectionRule", "generalCommonCoursePrecaution"],
  },
  {
    id: "common",
    chinese: "共同",
    english: "Common",
    filters: [
      "time",
      "commonTargetDept",
      "commonCourseType",
      "enrollMethod",
      "otherLimit",
    ],
    precautions: [
      "courseSelectionRule",
      "generalCommonCoursePrecaution",
      "chineseCoursePrecaution",
      "foreignLanguageCoursePrecaution",
    ],
  },
  {
    id: "pearmy",
    chinese: "體育/國防",
    english: "PE/Army",
    filters: ["time", "peArmyCourseType", "enrollMethod", "otherLimit"],
    precautions: [
      "courseSelectionRule",
      "peCoursePrecaution",
      "armyCoursePrecaution",
    ],
  },
  {
    id: "program",
    chinese: "學分學程",
    english: "Program",
    filters: ["time", "program", "enrollMethod", "otherLimit"],
    precautions: ["courseSelectionRule", "programApplicationInfo"],
  },
  {
    id: "expertise",
    chinese: "領域專長",
    english: "Domain Expertise",
    filters: ["time", "dept", "enrollMethod", "otherLimit"],
    precautions: ["domainExpertisePrecaution"],
  },
  {
    id: "interschool",
    chinese: "校際",
    english: "Inter-School Courses",
    filters: ["time", "courseProvider", "enrollMethod", "otherLimit"],
    precautions: [
      "courseSelectionRule",
      "ntuSystemCourseUpdateSchedule",
      "ntuSystemCourseSelectionPlatform",
    ],
  },
  {
    id: "grouping",
    chinese: "分組編班",
    english: "Grouping",
    filters: ["time", "groupingCourseType", "enrollMethod", "otherLimit"],
    precautions: [
      "courseSelectionRule",
      "chemistryCoursePrecaution",
      "calculasCoursePrecaution",
    ],
  },
  {
    id: "intensive",
    chinese: "密集",
    english: "Intensive",
    filters: ["time", "dept", "enrollMethod", "otherLimit"],
    precautions: ["courseSelectionRule"],
  },
  {
    id: "english",
    chinese: "進階英語",
    english: "Advanced English",
    filters: ["time", "dept", "enrollMethod", "otherLimit"],
    precautions: ["courseSelectionRule", "advancedEnglishCoursePrecaution"],
  },
];

export default searchModeList;
