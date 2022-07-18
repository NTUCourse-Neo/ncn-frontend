import _ from "lodash";

const numberToDay = {
  1: "一",
  2: "二",
  3: "三",
  4: "四",
  5: "五",
};

export default function parseCourseSchedlue(course) {
  // course: course object
  // return : string | null
  const schedules = course.schedules;
  const scheduleGroupByDayAndLocation = _.groupBy(schedules, (schedule) => {
    if (!schedule.weekday || !schedule.location) {
      return "";
    }
    return `${numberToDay[schedule.weekday]}@${schedule.location}`;
  });

  return Object.entries(scheduleGroupByDayAndLocation)
    .map(([key, scheduleGroup]) => {
      if (key === "") {
        return null;
      }
      const [weekday, location] = key.split("@");
      return `${weekday} (${scheduleGroup
        .map((s) => s?.interval ?? null)
        .filter((x) => x !== null)
        .join(", ")}) ${location}`;
    })
    .filter((x) => x !== null)
    .join(", ");
}
