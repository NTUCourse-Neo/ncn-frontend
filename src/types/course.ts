export interface Course {
  id: string;
  serial: string | null;
  code: string;
  identifier: string;
  name: string;
  semester: string;
  teacher: string | null;
  limitation: string | null;
  note: string | null;
  cool_url: string | null;
  credits: number | null;
  can_be_selective: boolean;
  is_half_year: boolean;
  slot: number;
  enroll_method: number;
  intensive_weeks: readonly number[];
  departments_raw: readonly string[];
  class: string | null;
  syllabus_url: string | null;
  requirement: "preassign" | "required" | "elective" | "other";
  language: "zh_TW" | "en_US";
  provider: "ntu" | "ntust" | "ntnu" | "other";
  areas: readonly Area[];
  departments: readonly Department[];
  schedules: readonly Schedule[];
  specialties: readonly CourseSpecialty[]; // TODO
  prerequisites: readonly string[]; // TODO
  prerequisite_of: readonly string[]; // TODO
}

export interface Area {
  area_id: string;
  area: {
    name: string;
  };
}

export interface Department {
  id: string;
  college_id: string | null;
  name_alt: string | null;
  name_full: string;
  name_short: string | null;
}

export interface CourseSpecialty {
  id: string;
  name: string;
}

export type Interval =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "A"
  | "B"
  | "C"
  | "D";

export interface Schedule {
  weekday: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  interval: Interval;
  location: string;
}

export type CourseEnrollStatus = {
  enrolled: string;
  enrolled_other: string;
  fetch_ts: number;
  registered: string;
  remain: string;
};
export const syllabusFieldSource = {
  intro: "概述",
  objective: "目標",
  requirement: "要求",
  office_hour: "Office Hour",
  material: "參考書目",
  specify: "指定閱讀",
};
export type SyllabusFieldName = keyof typeof syllabusFieldSource;
export const syllabusFields = Object.keys(
  syllabusFieldSource
) as SyllabusFieldName[];
export type CourseSyllabus = {
  grade:
    | null
    | {
        color: string | null;
        comment: string;
        title: string;
        value: number;
      }[];
  syllabus: Record<SyllabusFieldName, string>;
};
