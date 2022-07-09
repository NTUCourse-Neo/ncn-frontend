import React, { createContext, useContext, useState } from "react";

const CourseTableContext = createContext({
  courseTable: null,
  setCourseTable: () => {},
});

function CourseTableProvider(props) {
  const [courseTable, setCourseTable] = useState(null);

  return (
    <CourseTableContext.Provider
      value={{ courseTable, setCourseTable }}
      {...props}
    />
  );
}

function useCourseTable() {
  return useContext(CourseTableContext);
}

export { CourseTableProvider, useCourseTable };
