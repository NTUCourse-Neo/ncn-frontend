// Course[] to run-length encoding
import { Course } from "@/types/course";
import intervalToNumber from "@/utils/intervalToNumber";
import { groupBy } from "lodash";

export interface CourseRLE {
  course: Course;
  weekday: number;
  interval: number;
  duration: number;
}

export default function courses2rle(courses: Course[]): CourseRLE[] {
  const res: CourseRLE[] = [];
  courses.forEach((course) => {
    const { schedules } = course;
    const groupedSchedules = groupBy(
      schedules,
      (schedule) => `${schedule.weekday}`
    );
    console.log(groupedSchedules);
    Object.values(groupedSchedules).forEach((schedules) => {
      const { weekday, interval } = schedules[0];
      const duration = schedules.length;
      res.push({
        course,
        weekday,
        interval: intervalToNumber(interval),
        duration,
      });
    });
  });
  return res;
}
