import type { Course } from "@/types/course";

const getNolAddUrl = (course: Course) => {
  const d_id = "T010"; // TODO: move to parameter?
  return `https://nol.ntu.edu.tw/nol/coursesearch/myschedule.php?add=${course.serial}&ddd=${d_id}`;
};
const getNolUrl = (course: Course) => {
  if (course.syllabus_url && course.syllabus_url.length > 0) {
    return `https://nol.ntu.edu.tw/nol/coursesearch/${course.syllabus_url}`;
  }
  const lang = "CH";
  const base_url = "https://nol.ntu.edu.tw/nol/coursesearch/print_table.php?";
  const course_id = course.identifier.replace("E", "");
  const dept_id = course.departments?.[0]?.id ?? "T010";
  const class_id = course?.class ?? "";
  const params = `course_id=${course_id.slice(0, 3)}%20${course_id.slice(
    3
  )}&class=${class_id}&ser_no=${course.serial}&semester=${course.semester.slice(
    0,
    3
  )}-${course.semester.slice(3, 1)}&dpt_code=${dept_id}&lang=${lang}`;
  return base_url + params;
};

export { getNolAddUrl, getNolUrl };
