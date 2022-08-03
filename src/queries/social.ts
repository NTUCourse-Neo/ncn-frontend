import instance from "@/queries/axiosInstance";
import { SignUpPost } from "@/types/course";
const api_version = "v1";

const getSocialPostByPostId = async (token: string, post_id: string) => {
  const { data } = await instance.get(
    `${api_version}/social/posts/${post_id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data as {
    post: SignUpPost;
  };
};

const reportSocialPost = async (
  token: string,
  post_id: string,
  report: {
    reason: string;
  }
) => {
  await instance.post(
    `${api_version}/social/posts/${post_id}/report`,
    {
      report: report,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const voteSocialPost = async (token: string, post_id: string, type: number) => {
  await instance.patch(
    `${api_version}/social/posts/${post_id}/votes`,
    {
      type: type,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const deleteSocialPost = async (token: string, post_id: string) => {
  await instance.delete(`${api_version}/social/posts/${post_id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export interface SignUpPostForm {
  type: string;
  content: {
    amount: string;
    when: string;
    rule: string;
    comment: string;
  };
  user_type: string;
}
const createSocialPost = async (
  token: string,
  course_id: string,
  post: SignUpPostForm
) => {
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

const getSocialPostByCourseId = async (token: string, course_id: string) => {
  const { data } = await instance.get(
    `${api_version}/social/courses/${course_id}/posts`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data as {
    posts: SignUpPost[];
  };
};

export {
  getSocialPostByPostId,
  reportSocialPost,
  voteSocialPost,
  deleteSocialPost,
  createSocialPost,
  getSocialPostByCourseId,
};
