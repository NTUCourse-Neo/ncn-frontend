import { Department, Course } from "@/types/course";

export interface User {
  db: {
    id: string;
    name: string;
    email: string;
    year: number;
    course_tables: string[];
    d_major: Department | null;
    major: Department | null;
    minors: Department[];
    favorites: Course[];
    history_courses: unknown; // TODO
    student_id: null | string; // TODO
  };
}
