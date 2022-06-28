import instance from "api/axios";
import handleAPIError from "utils/handleAPIError";

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
    throw handleAPIError(error);
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
    throw handleAPIError(error);
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
    throw handleAPIError(error);
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
    throw handleAPIError(error);
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
    throw handleAPIError(error);
  }
};

export { getSocialPostByPostId, createSocialPost, reportSocialPost, voteSocialPost, deleteSocialPost };
