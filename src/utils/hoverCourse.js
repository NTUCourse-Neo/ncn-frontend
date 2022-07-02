import { proxy } from "valtio";
import { parseCourseTime } from "utils/parseCourseTime";

const hoverCourseState = proxy({
  hoveredCourse: null,
  hoveredCourseTimeMap: null,
});

const setHoveredCourseData = (course) => {
  if (course === null) {
    hoverCourseState.hoveredCourse = null;
    hoverCourseState.hoveredCourseTimeMap = null;
  } else {
    const hoverCourseTime = parseCourseTime(course, {});
    hoverCourseState.hoveredCourse = course;
    hoverCourseState.hoveredCourseTimeMap = hoverCourseTime;
  }
};

export { setHoveredCourseData, hoverCourseState };
