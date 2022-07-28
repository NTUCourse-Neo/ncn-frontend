import instance from "queries/axiosInstance";
const api_version = "v1";

const getSocialPostByPostId = async (token, post_id) => {
  const {
    data: { post },
  } = await instance.get(`${api_version}/social/posts/${post_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return post;
};

const reportSocialPost = async (token, post_id, report) => {
  await instance.post(
    `${api_version}/social/posts/${post_id}/report`,
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
};

const voteSocialPost = async (token, post_id, type) => {
  await instance.patch(
    `${api_version}/social/posts/${post_id}/votes`,
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
};

const deleteSocialPost = async (token, post_id) => {
  await instance.delete(`${api_version}/social/posts/${post_id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const createSocialPost = async (token, course_id, post) => {
  await instance.post(
    `${api_version}/social/courses/${course_id}/posts`,
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
};

const getSocialPostByCourseId = async (token, course_id) => {
  const { data } = await instance.get(
    `${api_version}/social/courses/${course_id}/posts`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};

export {
  getSocialPostByPostId,
  reportSocialPost,
  voteSocialPost,
  deleteSocialPost,
  createSocialPost,
  getSocialPostByCourseId,
};
