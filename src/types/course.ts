export interface Course {
  id: string;
  serial: string;
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
  intensive_weeks: number[];
  departments_raw: string[];
  class: string | null;
  syllabus_url: string | null;
  requirement: "preassign" | "required" | "elective" | "other";
  language: "zh_TW" | "en_US";
  provider: "ntu" | "ntust" | "ntnu" | "other";
  areas: Area[];
  departments: Department[];
  schedules: Schedule[];
  specialties: unknown[]; // TODO
  prerequisites: unknown[]; // TODO
  prerequisite_of: unknown[]; // TODO
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

export interface Schedule {
  weekday: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  interval:
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
  location: string;
}
