import { Course, Schedule } from "@/types/course";
import { groupBy } from "lodash";
import { intervalToNumber } from "@/utils/intervalNumberConverter";

// TODO: after integration with new API, modified
// 國文 pick 1 --> 英文 pick 1 --> 微積分 pick 1 --> others

export interface CourseRLE {
  course: Course;
  duration: number;
  location: string;
}

export interface CoursesRLE {
  [key: `${number}-${number}`]: CourseRLE;
}

export function courses2courseTableRle(courses: Course[]): CoursesRLE {
  const res: CoursesRLE = {};
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
        };
      });
    }
  });
  return res;
}
