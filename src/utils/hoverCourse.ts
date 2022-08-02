import { proxy } from "valtio";
import { parseCourseTime, TimeMap } from "utils/parseCourseTime";
import type { Course } from "@/types/course";

interface HoverCourseState {
  hoveredCourse: Course | null;
  hoveredCourseTimeMap: TimeMap | null;
}

const hoverCourseState = proxy<HoverCourseState>({
  hoveredCourse: null,
  hoveredCourseTimeMap: null,
});

const setHoveredCourseData = (course: Course | null) => {
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
