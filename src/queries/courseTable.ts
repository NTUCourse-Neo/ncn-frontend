import instance from "@/queries/axiosInstance";
import type { CourseTable } from "@/types/courseTable";
const api_version = "v2";

export const createCourseTable = async (
  course_table_id: string,
  course_table_name: string,
  user_id: string | null,
  semester: string
) => {
  const { data } = await instance.post(`${api_version}/course_tables/`, {
    id: course_table_id,
    name: course_table_name,
    user_id: user_id,
    semester: semester,
  });
  return data as {
    course_table: CourseTable;
    message: string;
  };
};

export const fetchCourseTable = async (course_table_id: string) => {
  const { data } = await instance.get(
    `${api_version}/course_tables/${course_table_id}`
  );
  return data as {
    course_table: CourseTable;
    message: string;
  };
};

export const patchCourseTable = async (
  course_table_id: string,
  course_table_name: string,
  user_id: string | null,
  expire_ts: null | string,
  courses: string[]
) => {
  // filter out "" in courses
  const new_courses = courses.filter((course) => course !== "");
  const { data } = await instance.patch(
    `${api_version}/course_tables/${course_table_id}`,
    {
      name: course_table_name,
      user_id: user_id,
      expire_ts: expire_ts, // not used
      courses: new_courses,
    }
  );
  return data as {
    course_table: CourseTable | null; // TODO: why return 200 & null when no course table found
    message: string;
  };
};
