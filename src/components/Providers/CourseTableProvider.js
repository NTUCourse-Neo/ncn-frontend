import React, { createContext, useContext, useState } from "react";
import instance from "queries/axiosInstance";
import handleAPIError from "utils/handleAPIError";

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
    try {
      const {
        data: { course_table },
      } = await instance.post(`/course_tables/`, { id: course_table_id, name: course_table_name, user_id: user_id, semester: semester });
      setCourseTable(course_table);
      return course_table;
    } catch (error) {
      throw handleAPIError(error);
    }
  };

  const fetchCourseTable = async (course_table_id) => {
    try {
      const {
        data: { course_table },
      } = await instance.get(`/course_tables/${course_table_id}`);
      setCourseTable(course_table);
      return course_table;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 403 || error.response.status === 404) {
          // expired course_table
          setCourseTable(null);
          return null;
        }
      } else {
        throw handleAPIError(error);
      }
    }
  };

  const patchCourseTable = async (course_table_id, course_table_name, user_id, expire_ts, courses) => {
    // filter out "" in courses
    const new_courses = courses.filter((course) => course !== "");
    try {
      const {
        data: { course_table },
      } = await instance.patch(`/course_tables/${course_table_id}`, {
        name: course_table_name,
        user_id: user_id,
        expire_ts: expire_ts,
        courses: new_courses,
      });
      setCourseTable(course_table);
      return course_table;
    } catch (error) {
      // need to let frontend handle error, so change to return null
      if (error.response) {
        if (error.response.status === 403 && error.response.data.message === "Course table is expired") {
          // expired course_table
          setCourseTable(null);
          return null;
        }
      } else {
        throw handleAPIError(error);
      }
    }
  };

  return <CourseTableContext.Provider value={{ courseTable, setCourseTable, createCourseTable, fetchCourseTable, patchCourseTable }} {...props} />;
}

function useCourseTable() {
  return useContext(CourseTableContext);
}

export { CourseTableProvider, useCourseTable };
