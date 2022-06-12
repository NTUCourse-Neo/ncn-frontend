// parse course object to timeMap object
const parseCourseTime = (course, initTimeMap) => {
  const timeMap = Object.assign({}, initTimeMap);
  course.time_loc_pair.forEach((time_loc_pair) => {
    Object.keys(time_loc_pair.time).forEach((day) => {
      time_loc_pair.time[day].forEach((time) => {
        if (!(day in timeMap)) {
          timeMap[day] = {};
        }
        if (!(time in timeMap[day])) {
          timeMap[day][time] = [course._id];
        } else {
          timeMap[day][time].push(course._id);
        }
      });
    });
  });
  return timeMap;
};

export default parseCourseTime;
