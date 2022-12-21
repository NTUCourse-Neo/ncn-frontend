import { FilterComponentId, Filter } from "@/types/filter";
import type { PrecautionName } from "@/components/InstructionModals";

export type BaseQueryType = {
  keyword: string;
  semester: string;
  // time
  time: Filter["time"];
  isFullYear: Filter["isFullYear"];
  timeStrictMatch: Filter["timeStrictMatch"];
  // otherLimit
  isEnglishTaught: Filter["isEnglishTaught"];
  isDistanceLearning: Filter["isDistanceLearning"];
  hasChanged: Filter["hasChanged"];
  isAdditionalCourse: Filter["isAdditionalCourse"];
  noConflictOnly: Filter["noConflictOnly"];
  noPrerequisite: Filter["noPrerequisite"];
  notEnrolledOnly: Filter["notEnrolledOnly"];
  // enrollMethod
  enrollMethod: Filter["enroll_method"];
};
export type FastQueryType = BaseQueryType & {
  department: Filter["department"];
  isCompulsory: Filter["isCompulsory"];
};
export type DeptQueryType = BaseQueryType & {
  department: string | null;
  departmentCourseType: Filter["departmentCourseType"];
  isCompulsory: Filter["singleDeptIsCompulsory"];
  suggestedGrade: Filter["suggestedGrade"];
};
export type GeneralQueryType = BaseQueryType & {
  generalCourseTypes: Filter["generalCourseTypes"];
};
export type CommonQueryType = BaseQueryType & {
  commonTargetDepartments: Filter["commonTargetDepartments"];
  commonCourseTypes: Filter["commonCourseTypes"];
};
export type PeArmyQueryType = BaseQueryType & {
  peArmyCourseTypes: Filter["peArmyCourseTypes"];
};
export type ProgramQueryType = BaseQueryType & {
  programs: Filter["programs"];
};
export type ExpertiseQueryType = FastQueryType;
export type InterschoolQueryType = BaseQueryType & {
  courseProviders: Filter["courseProviders"];
};
export type GroupingQueryType = BaseQueryType & {
  groupingCourseTypes: Filter["groupingCourseTypes"];
};
export type IntensiveQueryType = FastQueryType;
export type EnglishQueryType = FastQueryType;

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
