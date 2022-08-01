import instance from "queries/axiosInstance";
const api_version = "v2";

export const createCourseTable = async (
  course_table_id,
  course_table_name,
  user_id,
  semester
) => {
  const { data } = await instance.post(`${api_version}/course_tables/`, {
    id: course_table_id,
    name: course_table_name,
    user_id: user_id,
    semester: semester,
  });
  return data;
};

export const fetchCourseTable = async (course_table_id) => {
  const { data } = await instance.get(
    `${api_version}/course_tables/${course_table_id}`
  );
  return data;
};

export const patchCourseTable = async (
  course_table_id,
  course_table_name,
  user_id,
  expire_ts,
  courses
) => {
  // filter out "" in courses
  const new_courses = courses.filter((course) => course !== "");
  const { data } = await instance.patch(
    `${api_version}/course_tables/${course_table_id}`,
    {
      name: course_table_name,
      user_id: user_id,
      expire_ts: expire_ts,
      courses: new_courses,
    }
  );
  return data;
};
