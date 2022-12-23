import _ from "lodash";
import type { Course, Schedule } from "types/course";
import { weekdays_map as numberToDay } from "data/mapping_table";

export default function parseCourseSchedlue(course: Course): string {
  const schedules = course.schedules;
  const scheduleGroupByDayAndLocation = _.groupBy(schedules, (schedule) => {
    return `${numberToDay[schedule.weekday]}@${schedule.location}`;
  });

  return Object.entries(scheduleGroupByDayAndLocation)
    .map(([key, scheduleGroup]) => {
      if (key === "") {
        return null;
      }
      const [weekday, location] = key.split("@");
      return `${weekday} ${scheduleGroup
        .map((s) => s?.interval ?? null)
        .filter((x) => x !== null)
        .join(", ")} (${location})`;
    })
    .filter((x) => x !== null)
    .join(", ");
}

export interface TimeLocationPair {
  readonly time: string;
  readonly location: string;
}
export function parseCourseTimeLocation(
  schedules: readonly Schedule[]
): TimeLocationPair[] {
  const scheduleGroupByDayAndLocation = _.groupBy(schedules, (schedule) => {
    if (numberToDay[schedule.weekday] && schedule.location) {
      return `${numberToDay[schedule.weekday]}@${schedule.location}`;
    }
    return "";
  });

  const res = Object.entries(scheduleGroupByDayAndLocation)
    .map(([key, scheduleGroup]) => {
      if (key === "") {
        return null;
      }
      const [weekday, location] = key.split("@");
      return {
        time: `${weekday} ${scheduleGroup
          .map((s) => s?.interval ?? null)
          .filter((x) => x !== null)
          .join(", ")}`,
        location,
      };
    })
    .filter((x) => x !== null);

  return res as TimeLocationPair[];
}
