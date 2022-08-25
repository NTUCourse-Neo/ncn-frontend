import _ from "lodash";
import type { Course } from "types/course";
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
