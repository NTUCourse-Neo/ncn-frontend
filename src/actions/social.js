import instance from "../api/axios";

const getSocialPostByCourseId = (token, course_id) => async (dispatch) => {
  try {
    const {
      data: { posts },
    } = await instance.get(`/social/courses/${course_id}/posts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return posts;
  } catch (error) {
    console.log(error.response.status);
    if (error.response && error.response.status === 404) {
      return [];
    } else if (error.response) {
      // server did response, used for handle custom error msg
      let error_obj = {
        status_code: error.response.status,
        backend_msg: error.response.data.message,
        error_info: error.message,
        error_detail: Error(error).stack,
      };
      throw error_obj;
    } else if (error.request) {
      // The request was made but no response was received (server is downed)
      let status = 521; // Server is down
      let error_obj = {
        status_code: status,
        backend_msg: "no",
        error_info: error.message,
        error_detail: Error(error).stack,
      };
      throw error_obj;
    } else {
      // Something happened in setting up the request that triggered an Error
      let status = 400; // Bad request
      let error_obj = {
        status_code: status,
        backend_msg: "no",
        error_info: error.message,
        error_detail: Error(error).stack,
      };
      throw error_obj;
    }
  }
};

const getSocialPostByPostId = (token, post_id) => async (dispatch) => {
  try {
    const {
      data: { post },
    } = await instance.get(`/social/posts/${post_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return post;
  } catch (error) {
    if (error.response) {
      // server did response, used for handle custom error msg
      let error_obj = {
        status_code: error.response.status,
        backend_msg: error.response.data.message,
        error_info: error.message,
        error_detail: Error(error).stack,
      };
      throw error_obj;
    } else if (error.request) {
      // The request was made but no response was received (server is downed)
      let status = 521; // Server is down
      let error_obj = {
        status_code: status,
        backend_msg: "no",
        error_info: error.message,
        error_detail: Error(error).stack,
      };
      throw error_obj;
    } else {
      // Something happened in setting up the request that triggered an Error
      let status = 400; // Bad request
      let error_obj = {
        status_code: status,
        backend_msg: "no",
        error_info: error.message,
        error_detail: Error(error).stack,
      };
      throw error_obj;
    }
  }
};

const createSocialPost = (token, course_id, post) => async (dispatch) => {
  try {
    await instance.post(
      `/social/courses/${course_id}/posts`,
      {
        post: post,
        // includes: content, post_type, user_type
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    if (error.response) {
      // server did response, used for handle custom error msg
      let error_obj = {
        status_code: error.response.status,
        backend_msg: error.response.data.message,
        error_info: error.message,
        error_detail: Error(error).stack,
      };
      throw error_obj;
    } else if (error.request) {
      // The request was made but no response was received (server is downed)
      let status = 521; // Server is down
      let error_obj = {
        status_code: status,
        backend_msg: "no",
        error_info: error.message,
        error_detail: Error(error).stack,
      };
      throw error_obj;
    } else {
      // Something happened in setting up the request that triggered an Error
      let status = 400; // Bad request
      let error_obj = {
        status_code: status,
        backend_msg: "no",
        error_info: error.message,
        error_detail: Error(error).stack,
      };
      throw error_obj;
    }
  }
};

const reportSocialPost = (token, post_id, report) => async (dispatch) => {
  try {
    await instance.post(
      `/social/posts/${post_id}/report`,
      {
        report: report,
        // includes: content, post_type, user_type
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    if (error.response) {
      // server did response, used for handle custom error msg
      let error_obj = {
        status_code: error.response.status,
        backend_msg: error.response.data.message,
        error_info: error.message,
        error_detail: Error(error).stack,
      };
      throw error_obj;
    } else if (error.request) {
      // The request was made but no response was received (server is downed)
      let status = 521; // Server is down
      let error_obj = {
        status_code: status,
        backend_msg: "no",
        error_info: error.message,
        error_detail: Error(error).stack,
      };
      throw error_obj;
    } else {
      // Something happened in setting up the request that triggered an Error
      let status = 400; // Bad request
      let error_obj = {
        status_code: status,
        backend_msg: "no",
        error_info: error.message,
        error_detail: Error(error).stack,
      };
      throw error_obj;
    }
  }
};

const voteSocialPost = (token, post_id, type) => async (dispatch) => {
  try {
    await instance.patch(
      `/social/posts/${post_id}/votes`,
      {
        type: type,
        // includes: content, post_type, user_type
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    if (error.response) {
      // server did response, used for handle custom error msg
      let error_obj = {
        status_code: error.response.status,
        backend_msg: error.response.data.message,
        error_info: error.message,
        error_detail: Error(error).stack,
      };
      throw error_obj;
    } else if (error.request) {
      // The request was made but no response was received (server is downed)
      let status = 521; // Server is down
      let error_obj = {
        status_code: status,
        backend_msg: "no",
        error_info: error.message,
        error_detail: Error(error).stack,
      };
      throw error_obj;
    } else {
      // Something happened in setting up the request that triggered an Error
      let status = 400; // Bad request
      let error_obj = {
        status_code: status,
        backend_msg: "no",
        error_info: error.message,
        error_detail: Error(error).stack,
      };
      throw error_obj;
    }
  }
};

const deleteSocialPost = (token, post_id) => async (dispatch) => {
  try {
    await instance.delete(`/social/posts/${post_id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    if (error.response) {
      // server did response, used for handle custom error msg
      let error_obj = {
        status_code: error.response.status,
        backend_msg: error.response.data.message,
        error_info: error.message,
        error_detail: Error(error).stack,
      };
      throw error_obj;
    } else if (error.request) {
      // The request was made but no response was received (server is downed)
      let status = 521; // Server is down
      let error_obj = {
        status_code: status,
        backend_msg: "no",
        error_info: error.message,
        error_detail: Error(error).stack,
      };
      throw error_obj;
    } else {
      // Something happened in setting up the request that triggered an Error
      let status = 400; // Bad request
      let error_obj = {
        status_code: status,
        backend_msg: "no",
        error_info: error.message,
        error_detail: Error(error).stack,
      };
      throw error_obj;
    }
  }
};

export { getSocialPostByCourseId, getSocialPostByPostId, createSocialPost, reportSocialPost, voteSocialPost, deleteSocialPost };
