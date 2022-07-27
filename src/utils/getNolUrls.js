const getNolAddUrl = (course) => {
  const d_id = "T010"; // TODO: move to parameter?
  return `https://nol.ntu.edu.tw/nol/coursesearch/myschedule.php?add=${course.serial}&ddd=${d_id}`;
};
const getNolUrl = (course) => {
  const lang = "CH";
  const base_url = "https://nol.ntu.edu.tw/nol/coursesearch/print_table.php?";
  const course_id = course.identifier.replace("E", "");
  const dept_id = course.departments?.[0]?.id ?? "T010";
  const class_id = course?.class ?? "";
  const params = `course_id=${course_id.substr(0, 3)}%20${course_id.substr(
    3
  )}&class=${class_id}&ser_no=${
    course.serial
  }&semester=${course.semester.substr(0, 3)}-${course.semester.substr(
    3,
    1
  )}&dpt_code=${dept_id}&lang=${lang}`;
  return base_url + params;
};

export { getNolAddUrl, getNolUrl };
