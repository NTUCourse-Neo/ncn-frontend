import instance from "queries/axiosInstance";
const api_version = "v2";

export const fetchSearchResult = async (
  searchString,
  paths,
  filters_enable,
  filter_obj,
  batchSize,
  offset,
  strict_match_bool,
  options
) => {
  const { onSuccess = ({ courses, totalCount }) => {} } = options;
  // TODO: add paths feature
  const filter = {
    time: filters_enable.time ? filter_obj.time : null,
    department: filters_enable.department ? filter_obj.department : null,
    category: filters_enable.category ? filter_obj.category : null,
    enroll_method: filters_enable.enroll_method
      ? filter_obj.enroll_method
      : null,
    strict_match: strict_match_bool,
  };
  const {
    data: { courses, total_count },
  } = await instance.post(`${api_version}/courses/search`, {
    keyword: searchString,
    filter: filter,
    batch_size: batchSize,
    offset: offset,
  });
  onSuccess({ courses, totalCount: total_count });
  return { courses, total_count };
};

export const fetchCourse = async (id) => {
  const search_filter = {
    time: null,
    department: null,
    category: null,
    enroll_method: null,
    strict_match: false,
  };
  const batchSize = 1;
  const offset = 0;
  const {
    data: { courses },
  } = await instance.post(`${api_version}/courses/ids`, {
    ids: [id],
    filter: search_filter,
    batch_size: batchSize,
    offset: offset,
  });
  const [course] = courses;
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

// used in SideCourseTableContainer initialization, to fetch all course objects by ids
export const fetchCourseTableCoursesByIds = async (ids_arr) => {
  const search_filter = {
    strict_match: false,
    time: null,
    department: null,
    category: null,
    enroll_method: null,
  };
  const batchSize = 15000; // max batch size
  const offset = 0;
  const {
    data: { courses },
  } = await instance.post(`${api_version}/courses/ids`, {
    ids: ids_arr,
    filter: search_filter,
    batch_size: batchSize,
    offset: offset,
  });
  return courses;
};

// used in userMyPage initialization, to fetch all favorite courses object by user's favorite courses ids
export const fetchFavoriteCourses = async (ids_arr) => {
  const search_filter = {
    strict_match: false,
    time: null,
    department: null,
    category: null,
    enroll_method: null,
  };
  const batchSize = 15000;
  const offset = 0;
  const {
    data: { courses },
  } = await instance.post(`${api_version}/courses/ids`, {
    ids: ids_arr,
    filter: search_filter,
    batch_size: batchSize,
    offset: offset,
  });
  return courses;
};
