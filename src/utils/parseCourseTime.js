/**
 interface TimeMap {
  [day: "1"|"2"|"3"|"4"|"5"]?: {
    [interval: Interval]?: CourseID[];
  }
 }
 */

// parse course object to timeMap object
const parseCourseTime = (course, initTimeMap) => {
  const timeMap = Object.assign({}, initTimeMap);
  course.schedules.forEach((schedule) => {
    const weekday = schedule.weekday;
    const interval = schedule.interval;
    if (!timeMap?.[weekday]) {
      timeMap[weekday] = {};
    }
    if (!timeMap?.[weekday]?.[interval]) {
      timeMap[weekday][interval] = [];
    }
    timeMap[weekday][interval].push(course.id);
  });
  return timeMap;
};

const parseCoursesToTimeMap = (courses) => {
  const parsed = [];
  let timeMap = {};
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
