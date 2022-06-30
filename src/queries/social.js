import instance from "queries/axiosInstance";
import handleAPIError from "utils/handleAPIError";

const getSocialPostByPostId = async (token, post_id) => {
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
    throw handleAPIError(error);
  }
};

const reportSocialPost = async (token, post_id, report) => {
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
    throw handleAPIError(error);
  }
};

const voteSocialPost = async (token, post_id, type) => {
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
    throw handleAPIError(error);
  }
};

const deleteSocialPost = async (token, post_id) => {
  try {
    await instance.delete(`/social/posts/${post_id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    throw handleAPIError(error);
  }
};

const createSocialPost = async (token, course_id, post) => {
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
    throw handleAPIError(error);
  }
};

const getSocialPostByCourseId = async (token, course_id) => {
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
    if (error.response && error.response.status === 404) {
      return [];
    } else {
      throw handleAPIError(error);
    }
  }
};

export { getSocialPostByPostId, reportSocialPost, voteSocialPost, deleteSocialPost, createSocialPost, getSocialPostByCourseId };
