import type { Course, Interval } from "@/types/course";

export type Weekday = "1" | "2" | "3" | "4" | "5" | "6" | "7";
export type SingleDayTimeMap = Partial<Record<Interval, string[]>>;
export type TimeMap = Partial<Record<Weekday, SingleDayTimeMap>>;

// parse course object to timeMap object
const parseCourseTime = (course: Course, initTimeMap: TimeMap) => {
  const timeMap = Object.assign({}, initTimeMap);
  course.schedules.forEach((schedule) => {
    const weekday = schedule.weekday;
    const interval = schedule.interval;
    if (!timeMap?.[weekday]) {
      timeMap[weekday] = {};
    }
    if (!timeMap?.[weekday]?.[interval]) {
      (timeMap[weekday] as { [key: string]: string[] })[interval] = [];
    }
    (
      (timeMap[weekday] as { [key: string]: string[] })[interval] as string[]
    ).push(course.id);
  });
  return timeMap;
};

const parseCoursesToTimeMap = (courses: { [key: string]: Course }): TimeMap => {
  const parsed: string[] = [];
  let timeMap: TimeMap = {};
  Object.keys(courses).forEach((key) => {
    if (parsed.includes(courses[key].id)) {
      return;
    }
    timeMap = parseCourseTime(courses[key], timeMap);
    parsed.push(courses[key].id);
  });
  return timeMap;
};

export { parseCourseTime, parseCoursesToTimeMap };
