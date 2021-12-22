import instance from '../api/axios'

const default_filter_obj = {
  "strict_match": false,
  "time": null,
  "department": null,
  "category": null,
  "enroll_method": null
};

const get_courses_by_ids = async(ids_arr, batch_size, offset) => {
    try {
      const {data: {courses}} = await instance.post(`/courses/ids`, {ids: ids_arr, filter: default_filter_obj, batch_size: batch_size, offset: offset});
      return courses
    } catch (error) {
      throw error;
    }
};

export { get_courses_by_ids };