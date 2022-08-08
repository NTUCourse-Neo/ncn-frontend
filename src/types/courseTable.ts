import { Course } from "types/course";

export interface CourseTable {
  courses: Course[];
  id: string;
  name: string;
  semester: string;
  expire_ts: null | string;
  user_id: string | null;
}
