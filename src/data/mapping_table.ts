import {
  FaUserGraduate,
  FaCheckSquare,
  FaPuzzlePiece,
  FaLanguage,
  FaFileImport,
} from "react-icons/fa";
import { IconType } from "react-icons/lib";

interface CourseInfoBaseType {
  name: string;
  logo: IconType;
  color: string;
}

interface CourseInfoType<T> extends CourseInfoBaseType {
  map: Record<string, T>;
}

export interface CourseInfoTranslateMap {
  requirement: CourseInfoType<string>;
  slot: CourseInfoBaseType;
  areas: CourseInfoType<{
    id: string;
    code: string;
    full_name: string;
  }>;
  enroll_method: CourseInfoType<string>;
  language: CourseInfoType<string>;
}

// TODO: get rid of this? because the information already in v2 API
// TODO: logo is not used anymore in new design
const info_view_map: CourseInfoTranslateMap = {
  requirement: {
    name: "課程必選修",
    logo: FaCheckSquare,
    color: "blue",
    map: {
      preassign: "必帶",
      required: "必修",
      elective: "選修",
      other: "其他",
    },
  },
  slot: {
    name: "修課人數上限",
    logo: FaUserGraduate,
    color: "blue",
  },
  areas: {
    name: "課程領域",
    logo: FaPuzzlePiece,
    color: "blue",
    map: {
      chinese: {
        id: "chinese",
        code: "共",
        full_name: "國文領域",
      },
      english: {
        id: "english",
        code: "共",
        full_name: "英文領域",
      },
      english_adv: {
        id: "english_adv",
        code: "共",
        full_name: "進階英文",
      },
      foreign: {
        id: "foreign",
        code: "共",
        full_name: "外文領域",
      },
      foreign_like: {
        id: "foreign_like",
        code: "共",
        full_name: "可充當外文領域",
      },
      shared_selective: {
        id: "shared_selective",
        code: "共",
        full_name: "共同選修課程",
      },
      g_ax: {
        id: "g_ax",
        code: "AX",
        full_name: "不分領域通識課程",
      },
      g_a1: {
        id: "g_a1",
        code: "A1",
        full_name: "通識 A1",
      },
      g_a2: {
        id: "g_a2",
        code: "A2",
        full_name: "通識 A2",
      },
      g_a3: {
        id: "g_a3",
        code: "A3",
        full_name: "通識 A3",
      },
      g_a4: {
        id: "g_a4",
        code: "A4",
        full_name: "通識 A4",
      },
      g_a5: {
        id: "g_a5",
        code: "A5",
        full_name: "通識 A5",
      },
      g_a6: {
        id: "g_a6",
        code: "A6",
        full_name: "通識 A6",
      },
      g_a7: {
        id: "g_a7",
        code: "A7",
        full_name: "通識 A7",
      },
      g_a8: {
        id: "g_a8",
        code: "A8",
        full_name: "通識 A8",
      },
      freshman: {
        id: "freshman",
        code: "新",
        full_name: "新生專題/新生講座課程",
      },
      basic: {
        id: "basic",
        code: "基",
        full_name: "基本能力課程",
      },
      military: {
        id: "millitary",
        code: "軍",
        full_name: "軍訓課程",
      },
      pe_1: {
        id: "pe_1",
        code: "體",
        full_name: "健康體適能",
      },
      pe_2: {
        id: "pe_2",
        code: "體",
        full_name: "專項運動學群",
      },
      pe_3: {
        id: "pe_3",
        code: "體",
        full_name: "選修體育",
      },
      pe_4: {
        id: "pe_4",
        code: "體",
        full_name: "校隊班",
      },
      pe_5: {
        id: "pe_5",
        code: "體",
        full_name: "進修學士班",
      },
      frequent: {
        id: "frequent",
        code: "密",
        full_name: "密集課程",
      },
    },
  },
  enroll_method: {
    name: "加簽方式",
    logo: FaFileImport,
    color: "blue",
    map: {
      1: "無限制",
      2: "授權碼",
      3: "登記分發",
    },
  },
  language: {
    name: "授課語言",
    logo: FaLanguage,
    color: "blue",
    map: {
      zh_TW: "中文",
      en_US: "英文",
    },
  },
};

export type Weekday = "1" | "2" | "3" | "4" | "5" | "6" | "7";
const weekdays_map: Record<Weekday, string> = {
  1: "一",
  2: "二",
  3: "三",
  4: "四",
  5: "五",
  6: "六",
  7: "日",
};

const social_user_type_map = {
  student: "學生",
  teacher: "教師",
  course_teacher: "此課程講師",
  course_assistant: "此課程助教",
  others: "其他",
};

export type SocialUser = keyof typeof social_user_type_map;
const socialUserTypes = Object.keys(social_user_type_map) as SocialUser[];

export { info_view_map, weekdays_map, social_user_type_map, socialUserTypes };
