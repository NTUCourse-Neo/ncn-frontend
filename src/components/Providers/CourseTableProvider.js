import React, { createContext, useContext, useState } from "react";
import instance from "queries/axiosInstance";

const CourseTableContext = createContext({
  courseTable: null,
  setCourseTable: () => {},
  createCourseTable: async () => {},
  fetchCourseTable: async () => {},
  patchCourseTable: async () => {},
});

function CourseTableProvider(props) {
  const [courseTable, setCourseTable] = useState(null);

  const createCourseTable = async (course_table_id, course_table_name, user_id, semester) => {
    const {
      data: { course_table },
    } = await instance.post(`/course_tables/`, { id: course_table_id, name: course_table_name, user_id: user_id, semester: semester });
    return course_table;
  };

  const fetchCourseTable = async (course_table_id) => {
    const {
      data: { course_table },
    } = await instance.get(`/course_tables/${course_table_id}`);
    return course_table;
  };

  const patchCourseTable = async (course_table_id, course_table_name, user_id, expire_ts, courses) => {
    // filter out "" in courses
    const new_courses = courses.filter((course) => course !== "");
    const {
      data: { course_table },
    } = await instance.patch(`/course_tables/${course_table_id}`, {
      name: course_table_name,
      user_id: user_id,
      expire_ts: expire_ts,
      courses: new_courses,
    });
    return course_table;
  };

  return <CourseTableContext.Provider value={{ courseTable, setCourseTable, createCourseTable, fetchCourseTable, patchCourseTable }} {...props} />;
}

function useCourseTable() {
  return useContext(CourseTableContext);
}

export { CourseTableProvider, useCourseTable };
