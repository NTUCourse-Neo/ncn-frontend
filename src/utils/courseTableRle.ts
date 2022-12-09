import { Course, Schedule } from "@/types/course";
import { groupBy } from "lodash";
import { intervalToNumber } from "@/utils/intervalNumberConverter";

// TODO: after integration with new API, modified
// 國文 pick 1 --> 英文 pick 1 --> 微積分 pick 1 --> others

export interface CourseRLE {
  course: Course;
  duration: number;
  location: string;
  conflictedCourses: Record<string, Course>;
}

export interface CoursesRLE {
  [key: `${number}-${number}`]: CourseRLE;
}

export function courses2courseTableRle(courses: Course[]): CoursesRLE {
  const res: CoursesRLE = {};
  const scheduledInterval: Schedule[] = [];
  const conflictedCourses: Course[] = [];
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
      scheduledInterval.push(...schedules);
      // rle encoding and push to res
      const groupedSchedules = groupBy(
        schedules,
        (schedule) => `${schedule.weekday}-${schedule.location}`
      );
      Object.values(groupedSchedules).forEach((dailySchedules) => {
        const { weekday, interval, location } = dailySchedules[0];
        const duration = dailySchedules.length;
        res[`${weekday}-${intervalToNumber(interval)}`] = {
          course,
          duration,
          location,
          conflictedCourses: {},
        };
      });
    } else {
      conflictedCourses.push(course);
    }
  });

  // push conflictedCourses
  conflictedCourses.forEach((course) => {
    const { schedules } = course;
    schedules.forEach((schedule) => {
      const { weekday, interval } = schedule;
      Object.values(res).forEach((courseRle) => {
        const { course: scheduledCourse, conflictedCourses } =
          courseRle as CourseRLE;
        const alreadyConflicted = conflictedCourses?.[course.id] !== undefined;
        if (!alreadyConflicted) {
          const isOverlapped = scheduledCourse.schedules.some(
            (scheduledCourseSchedule) =>
              scheduledCourseSchedule.weekday === weekday &&
              scheduledCourseSchedule.interval === interval
          );
          if (isOverlapped) {
            courseRle.conflictedCourses[course.id] = course;
          }
        }
      });
    });
  });

  return res;
}
