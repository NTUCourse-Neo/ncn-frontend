// parse course object to course_time object
const parseCourseTime = (course, course_time_tmp_input) => {
  const course_time_tmp = Object.assign({}, course_time_tmp_input);
  course.time_loc_pair.forEach((time_loc_pair) => {
    Object.keys(time_loc_pair.time).forEach((day) => {
      time_loc_pair.time[day].forEach((time) => {
        if (!(day in course_time_tmp.time_map)) {
          course_time_tmp.time_map[day] = {};
        }
        if (!(time in course_time_tmp.time_map[day])) {
          course_time_tmp.time_map[day][time] = [course._id];
        } else {
          course_time_tmp.time_map[day][time].push(course._id);
        }
      });
    });
  });
  return course_time_tmp;
};

export default parseCourseTime;
