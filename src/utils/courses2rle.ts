// Course[] to run-length encoding
import { Course } from "@/types/course";
import intervalToNumber from "@/utils/intervalToNumber";
import { groupBy } from "lodash";

export interface CoursesRLE {
  [key: `${number}-${number}`]: {
    course: Course;
    duration: number;
  };
}

export default function courses2rle(courses: Course[]): CoursesRLE {
  const res: CoursesRLE = {};
  courses.forEach((course) => {
    const { schedules } = course;
    const groupedSchedules = groupBy(
      schedules,
      (schedule) => `${schedule.weekday}`
    );
    // console.log(groupedSchedules);
    Object.values(groupedSchedules).forEach((schedules) => {
      const { weekday, interval } = schedules[0];
      const duration = schedules.length;
      res[`${weekday}-${intervalToNumber(interval)}`] = {
        course,
        duration,
      };
    });
  });
  return res;
}
