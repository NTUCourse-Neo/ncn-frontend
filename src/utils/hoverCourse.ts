import { proxy } from "valtio";
import type { Course } from "types/course";

interface HoverCourseState {
  hoveredCourse: Course | null;
}

const hoverCourseState = proxy<HoverCourseState>({
  hoveredCourse: null,
});

const setHoveredCourseState = (course: Course | null) => {
  if (course === null) {
    hoverCourseState.hoveredCourse = null;
  } else {
    hoverCourseState.hoveredCourse = course;
  }
};

export { setHoveredCourseState, hoverCourseState };
