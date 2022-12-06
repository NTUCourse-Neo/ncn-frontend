// Course[] to run-length encoding
import { Course } from "@/types/course";
import intervalToNumber from "@/utils/intervalToNumber";
import { groupBy } from "lodash";

export interface CourseRLE {
  course: Course;
  duration: number;
  location: string;
}

export interface CoursesRLE {
  [key: `${number}-${number}`]: CourseRLE;
}

export default function courses2rle(courses: Course[]): CoursesRLE {
  const res: CoursesRLE = {};
  courses.forEach((course) => {
    const { schedules } = course;
    const groupedSchedules = groupBy(
      schedules,
      (schedule) => `${schedule.weekday}-${schedule.location}`
    );
    // console.log(groupedSchedules);
    Object.values(groupedSchedules).forEach((schedules) => {
      const { weekday, interval, location } = schedules[0];
      const duration = schedules.length;
      res[`${weekday}-${intervalToNumber(interval)}`] = {
        course,
        duration,
        location,
      };
    });
  });
  return res;
}
