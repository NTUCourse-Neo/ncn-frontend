import { Course, Schedule } from "@/types/course";

function filterConflictedCourse(courses: Course[]): Course[] {
  const res: Course[] = [];
  const scheduledInterval: Schedule[] = [];
  courses.forEach((course) => {
    const { schedules } = course;
    const isConflicted = schedules.some((schedule) => {
      const { weekday, interval } = schedule;
      return scheduledInterval.some(
        (scheduled) =>
          scheduled.weekday === weekday && scheduled.interval === interval
      );
    });
    if (!isConflicted) {
      res.push(course);
      scheduledInterval.push(...schedules);
    }
  });
  return res;
}

export default filterConflictedCourse;
