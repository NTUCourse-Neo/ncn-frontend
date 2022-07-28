import instance from "queries/axiosInstance";
const api_version = "v2";

export const fetchSearchResult = async (
  searchString,
  fields,
  filters_enable,
  filter_obj,
  batchSize,
  offset,
  strict_match_bool,
  options
) => {
  const { onSuccess = ({ courses, totalCount }) => {} } = options;
  const filter = {
    time: filters_enable.time ? filter_obj.time : null,
    department:
      filters_enable.department && filters_enable.department.length > 0
        ? filter_obj.department
        : null,
    category:
      filters_enable.category && filters_enable.category.length > 0
        ? filter_obj.category
        : null,
    enroll_method:
      filters_enable.enroll_method && filters_enable.enroll_method.length > 0
        ? filter_obj.enroll_method
        : null,
    strict_match: strict_match_bool,
  };
  const { data } = await instance.post(`${api_version}/courses/search`, {
    keyword: searchString,
    fields: fields,
    filter: filter,
    batch_size: batchSize,
    offset: offset,
  });
  onSuccess({ courses: data?.courses, totalCount: data?.total_count });
  return data;
};

export const fetchCourse = async (id) => {
  const {
    data: { course },
  } = await instance.get(`${api_version}/courses/${id}`);
  return course;
};

export const getCourseEnrollInfo = async (token, course_id) => {
  const {
    data: { course_status },
  } = await instance.get(`${api_version}/courses/${course_id}/enrollinfo`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return course_status;
};

export const getNTURatingData = async (token, course_id) => {
  const {
    data: { course_rating },
  } = await instance.get(`${api_version}/courses/${course_id}/rating`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return course_rating;
};

export const getPTTData = async (token, course_id, type) => {
  const {
    data: { course_rating },
  } = await instance.get(`${api_version}/courses/${course_id}/ptt/${type}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return course_rating;
};

export const getCourseSyllabusData = async (course_id) => {
  const {
    data: { course_syllabus },
  } = await instance.get(`${api_version}/courses/${course_id}/syllabus`);
  return course_syllabus;
};
