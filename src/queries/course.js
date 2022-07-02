import instance from "queries/axiosInstance";

export const fetchSearchIDs = async (searchString, paths) => {
  const {
    data: { ids },
  } = await instance.post(`/courses/search`, { query: searchString, paths: paths });
  return ids;
};

export const fetchSearchResults = async (ids_arr, filters_enable, filter_obj, batchSize, offset, strict_match_bool, options) => {
  const { onSuccess = ({ courses, totalCount }) => {} } = options;
  const search_filter = { ...filter_obj, strict_match: strict_match_bool };
  if (filters_enable.time === false) {
    search_filter.time = null;
  }
  if (filters_enable.department === false) {
    search_filter.department = null;
  }
  if (filters_enable.category === false) {
    search_filter.category = null;
  }
  if (filters_enable.enroll_method === false) {
    search_filter.enroll_method = null;
  }
  const {
    data: { courses, total_count },
  } = await instance.post(`/courses/ids`, { ids: ids_arr, filter: search_filter, batch_size: batchSize, offset: offset });
  // console.log(courses); // checking receive array of courses
  onSuccess({ courses, totalCount: total_count });
  return courses;
};

export const fetchCourse = async (id) => {
  const search_filter = { time: null, department: null, category: null, enroll_method: null, strict_match: false };
  const batchSize = 1;
  const offset = 0;
  const {
    data: { courses },
  } = await instance.post(`/courses/ids`, { ids: [id], filter: search_filter, batch_size: batchSize, offset: offset });
  const [course] = courses;
  return course;
};

export const getCourseEnrollInfo = async (token, course_id) => {
  const {
    data: { course_status },
  } = await instance.get(`/courses/${course_id}/enrollinfo`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return course_status;
};

export const getNTURatingData = async (token, course_id) => {
  const {
    data: { course_rating },
  } = await instance.get(`/courses/${course_id}/rating`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return course_rating;
};

export const getPTTData = async (token, course_id, type) => {
  const {
    data: { course_rating },
  } = await instance.get(`/courses/${course_id}/ptt/${type}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return course_rating;
};

export const getCourseSyllabusData = async (course_id) => {
  const {
    data: { course_syllabus },
  } = await instance.get(`/courses/${course_id}/syllabus`);
  return course_syllabus;
};

// used in SideCourseTableContainer initialization, to fetch all course objects by ids
export const fetchCourseTableCoursesByIds = async (ids_arr) => {
  const search_filter = { strict_match: false, time: null, department: null, category: null, enroll_method: null };
  const batchSize = 15000; // max batch size
  const offset = 0;
  const {
    data: { courses },
  } = await instance.post(`/courses/ids`, { ids: ids_arr, filter: search_filter, batch_size: batchSize, offset: offset });
  return courses;
};

// used in userMyPage initialization, to fetch all favorite courses object by user's favorite courses ids
export const fetchFavoriteCourses = async (ids_arr) => {
  const search_filter = { strict_match: false, time: null, department: null, category: null, enroll_method: null };
  const batchSize = 15000;
  const offset = 0;
  const {
    data: { courses },
  } = await instance.post(`/courses/ids`, { ids: ids_arr, filter: search_filter, batch_size: batchSize, offset: offset });
  return courses;
};
