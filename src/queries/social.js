import instance from "queries/axiosInstance";

const getSocialPostByPostId = async (token, post_id) => {
  const {
    data: { post },
  } = await instance.get(`/social/posts/${post_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return post;
};

const reportSocialPost = async (token, post_id, report) => {
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
};

const voteSocialPost = async (token, post_id, type) => {
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
};

const deleteSocialPost = async (token, post_id) => {
  await instance.delete(`/social/posts/${post_id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const createSocialPost = async (token, course_id, post) => {
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
};

const getSocialPostByCourseId = async (token, course_id) => {
  const {
    data: { posts },
  } = await instance.get(`/social/courses/${course_id}/posts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return posts;
};

export {
  getSocialPostByPostId,
  reportSocialPost,
  voteSocialPost,
  deleteSocialPost,
  createSocialPost,
  getSocialPostByCourseId,
};
