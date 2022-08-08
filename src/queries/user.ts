import instance from "@/queries/axiosInstance";
import type { User } from "types/user";
const api_version = "v2";

export const deleteUserProfile = async (token: string) => {
  await instance.delete(`${api_version}/users/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const linkCoursetableToUser = async (
  token: string,
  course_table_id: string,
  user_id: string
) => {
  const { data } = await instance.post(
    `${api_version}/users/${user_id}/course_table`,
    { course_table_id: course_table_id },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data as {
    message: string;
    user: User;
  };
};

export const addFavoriteCourse = async (token: string, courseId: string) => {
  const { data } = await instance.put(
    `${api_version}/users/favorites/${courseId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data as {
    message: string;
    favorites: User["db"]["favorites"];
  };
};

export const removeFavoriteCourse = async (token: string, courseId: string) => {
  const { data } = await instance.delete(
    `${api_version}/users/favorites/${courseId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data as {
    message: string;
    favorites: User["db"]["favorites"];
  };
};

export type PatchUserObject = {
  name: string;
  major: string;
  d_major: string | null;
  minors: string[];
};
export const patchUserInfo = async (
  token: string,
  newUser: PatchUserObject
) => {
  const { data } = await instance.patch(
    `${api_version}/users/`,
    { user: newUser },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data as {
    message: string;
    user: User;
  };
};

export const deleteUserAccount = async (token: string) => {
  await instance.delete(`${api_version}/users/account`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const fetchUserById = async (token: string, user_id: string) => {
  const { data } = await instance.get(`${api_version}/users/${user_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data as {
    message: string;
    user: User | null; // null for initial sign up (not found in DB)
  };
};

export const registerNewUser = async (token: string, email: string) => {
  const { data } = await instance.post(
    `${api_version}/users/`,
    { user: { email: email } },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data as {
    message: string;
    user: User;
  };
};
