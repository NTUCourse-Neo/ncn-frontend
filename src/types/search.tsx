import { Interval } from "types/course";
import {
  TimeFilter,
  DeptFilter,
  EnrollMethodFilter,
  OtherLimitFilter,
  TargetGradeFilter,
  GeneralCourseTypeFilter,
  CommonTargetDeptFilter,
  CommonCourseTypeFilter,
  PeArmyCourseTypeFilter,
  HostCollegeFilter,
  ProgramFilter,
} from "@/components/Filters/index";

export type Filter = {
  time: Interval[][];
  department: string[];
  enroll_method: EnrollMethod[];
  target_grade: Grade[];
  other_limit: OtherLimit[];
  general_course_type: GeneralCourseType[];
  common_target_department: CommonTargetDepartment[];
  common_course_type: CommonCourseType[];
  pearmy_course_type: PeArmyCourseType[];
  host_college: HostCollege[];
  program: ProgramCode[];
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
    label: "只顯示未加入課程",
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

export const hostColleges = [
  {
    value: "NTNU",
    chinese_label: "臺師大",
  },
  {
    value: "NTUST",
    chinese_label: "臺科大",
  },
];
export type HostCollege = typeof hostColleges[number]["value"];

// Program
export const programs = [
  {
    value: "P010",
    chinese_label: "中等學校教育學程",
    english_label: "CENTER FOR TEACHER EDUCATION",
  },
  {
    value: "P020",
    chinese_label: "地球系統科學學程",
    english_label: "EARTH SYSTEM SCIENCE",
  },
  {
    value: "P030",
    chinese_label: "婦女與性別研究學程",
    english_label: "WOMEN AND GENDER STUDIES CERTIFICATE PROGRAM",
  },
  {
    value: "P040",
    chinese_label: "永續資源學程",
    english_label: "SUSTAINABLE DEVEL0PMENT RESOURCE",
  },
  {
    value: "P050",
    chinese_label: "生物技術學程",
    english_label: "BIOTECHNOLOGY PROGRAM",
  },
  {
    value: "P060",
    chinese_label: "生物產業自動化學程",
    english_label: "EDUCATION PROGRAM FOR BIO-INDUSTRIAL AUTOMATION",
  },
  {
    value: "P070",
    chinese_label: "分子醫學學分學程",
    english_label: "Molecular Medical Sciences Program",
  },
  {
    value: "P080",
    chinese_label: "食品科技學程",
    english_label: "PROGRAM OF FOOD SCIENCE AND TECHNOLOGY",
  },
  {
    value: "P090",
    chinese_label: "休閒事業經營管理學程",
    english_label: "THE PROGRAM OF LEISURE MANAGEMENT",
  },
  {
    value: "P100",
    chinese_label: "農業環境污染與資源保育學程",
    english_label:
      "PROGRAM ON AGRICULTURAL ENVIRONMENT POLLUTION AND RESOURCES CONSERVATION",
  },
  {
    value: "P110",
    chinese_label: "醫學工程學程",
    english_label: "PROGRAM FOR BIOMEDICAL ENGINEERING",
  },
  {
    value: "P120",
    chinese_label: "知識管理學程",
    english_label: "PROGRAM FOR KNOWLEDGE MANAGEMENT",
  },
  {
    value: "P130",
    chinese_label: "海洋科學學程",
    english_label: "INTRODUCTORY COURSE OF MARINE SCIENCE",
  },
  {
    value: "P140",
    chinese_label: "傳播學程",
    english_label: "THE PROGRAM OF COMMUNICATION",
  },
  {
    value: "P150",
    chinese_label: "系統生物與生物資訊學程",
    english_label: "CURRICULUM PROGRAM OF SYSTEMS BIOLOGY AND BIOINFORMATICS",
  },
  {
    value: "P160",
    chinese_label: "奈米科技學程",
    english_label: "THE NANO-TECHNOLOGY CURRICULUM PROGRAM",
  },
  {
    value: "P170",
    chinese_label: "科技創業與管理學程",
    english_label: "TECHNOLOGY ENTREPRENEURSHIP AND MANAGE",
  },
  {
    value: "P180",
    chinese_label: "臺灣研究學程",
    english_label: "PROGRAM IN TAIWAN STUDIES",
  },
  {
    value: "P190",
    chinese_label: "積體電路設計第二專長學程",
    english_label: "PROGRAM OF IC DESIGN AS SECOND EXPERTISE",
  },
  {
    value: "P200",
    chinese_label: "生態工程學程",
    english_label: "ECOLOGICAL ENGINEERING",
  },
  {
    value: "P210",
    chinese_label: "光電科技學程",
    english_label: "PROGRAM OF PHOTONICS TECHNOLOGIES",
  },
  {
    value: "P220",
    chinese_label: "晶片系統商管學程",
    english_label: "SOC BUSINESS MANAGEMENT PROGRAM",
  },
  {
    value: "P230",
    chinese_label: "高分子科技學程",
    english_label: "PROGRAM OF POLYMER SCIENCE AND TECHNOLOGY",
  },
  {
    value: "P240",
    chinese_label: "生物統計學程",
    english_label: "BIOLOGICAL STATISTICS",
  },
  {
    value: "P250",
    chinese_label: "中國大陸研究學程",
    english_label: "MAINLAND CHINA STUDIES PROGRAM",
  },
  {
    value: "P260",
    chinese_label: "臨床研究護理師學程",
    english_label: "CLINICAL RESEARCH NURSES PROGRAM",
  },
  {
    value: "P270",
    chinese_label: "歐洲暨歐盟研究學程",
    english_label: "EUROPEAN STUDIES PROGRAM",
  },
  {
    value: "P280",
    chinese_label: "光機電系統學程",
    english_label: "OPTO-MECHATRONICS SYSTEM CURRICULUM",
  },
  {
    value: "P290",
    chinese_label: "分子醫藥學程",
    english_label: "MOLECULAR MEDICINE PROGRAM",
  },
  {
    value: "P300",
    chinese_label: "幹細胞與再生醫學學程",
    english_label:
      "TEACHING PROGRAMME OF STEM CELL AND REGENERATIVE BIO-MEDICINE",
  },
  {
    value: "P310",
    chinese_label: "神經生物與認知科學學程",
    english_label: "PROGRAM OF NEUROBIOLOGY AND COGNITIVE SCIENCE",
  },
  {
    value: "P320",
    chinese_label: "經典人文學程",
    english_label: "CLASSICAL WORKS IN HUMANITIES PROGRAM",
  },
  {
    value: "P330",
    chinese_label: "海洋事務學程",
    english_label: "PROGRAM OF MARINE AFFAIRS",
  },
  {
    value: "P340",
    chinese_label: "中草藥學程",
    english_label: "CHINESE HERBAL MEDICINE PROGRAM",
  },
  {
    value: "P350",
    chinese_label: "老人與長期照護學程",
    english_label: "NTU GERIATRICS AND LONG TERM CARE PROGRAM",
  },
  {
    value: "P360",
    chinese_label: "領導學程",
    english_label: "LEADERSHIP PROGRAM",
  },
  {
    value: "P370",
    chinese_label: "創意創業學程",
    english_label: "Creativity and Entrepreneurship Program",
  },
  {
    value: "P380",
    chinese_label: "亞洲藝術學程",
    english_label: "Asian Art Program",
  },
  {
    value: "P390",
    chinese_label: "藝術設計學分學程",
    english_label: "Art and Design Program",
  },
  {
    value: "P400",
    chinese_label: "傳染病學學程",
    english_label: "Infectious Diseases Program",
  },
  {
    value: "P410",
    chinese_label: "數量財務學程",
    english_label: "QUANTITATIVE FINANCE PROGRAM",
  },
  {
    value: "P420",
    chinese_label: "中英翻譯學程",
    english_label: "CHINESE-ENGLISH TRANSLATION PROGRAM",
  },
  {
    value: "P430",
    chinese_label: "能源科技學程",
    english_label: "Energy Technology Program",
  },
  {
    value: "P440",
    chinese_label: "雲端計算趨勢學程",
    english_label: "CLOUD COMPUTING PROGRAM",
  },
  {
    value: "P450",
    chinese_label: "保健營養學程",
    english_label: "Health and Nutrition Program",
  },
  {
    value: "P460",
    chinese_label: "人口學程",
    english_label: "Population Studies Program",
  },
  {
    value: "P470",
    chinese_label: "雲端運算與商業應用學程",
    english_label: "Cloud Computing and Business Application Program",
  },
  {
    value: "P480",
    chinese_label: "日本研究學程",
    english_label: "Japan Studies Program",
  },
  {
    value: "P490",
    chinese_label: "全電化都會運輸系統基礎技術學分學程",
    english_label: "Transprotation Electrification Technology Program",
  },
  {
    value: "P500",
    chinese_label: "東亞研究學分學程",
    english_label: "Program for East Asian Studies",
  },
  {
    value: "P510",
    chinese_label: "茶與茶業學分學程",
    english_label: "Tea and Tea Industry",
  },
  {
    value: "P520",
    chinese_label: "動物福祉學分學程",
    english_label: "Animal Welfare Program",
  },
  {
    value: "P530",
    chinese_label: "生物多樣性學分學程",
    english_label: "Biodiversity Prorgram",
  },
  {
    value: "P540",
    chinese_label: "離岸風力發電學分學程",
    english_label: "Offshore Wind  Energy Program",
  },
  {
    value: "P600",
    chinese_label: "健康政策與社會研究學分學程",
    english_label: "Health Policy and Social Studies?Program",
  },
  {
    value: "P610",
    chinese_label: "健康大數據學分學程",
    english_label: "Big Data in Health Program",
  },
  {
    value: "P620",
    chinese_label: "品牌與顧客經營學分學程",
    english_label: "Branding and Customer Management Program",
  },
] as const;
export type ProgramCode = typeof programs[number]["value"];

// All filters
export const filters = {
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
  target_grade: {
    id: "target_grade",
    component: <TargetGradeFilter />,
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
    component: <HostCollegeFilter />,
  },
  program: {
    id: "program",
    component: <ProgramFilter />,
  },
} as const;
export type FilterType = keyof typeof filters;

// for sorting
export const sortOptions = [
  {
    id: "serial",
    chinese: "流水號",
    english: "Serial Number",
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
