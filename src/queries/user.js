import instance from "queries/axiosInstance";
const api_version = "v2";

export const deleteUserProfile = async (token) => {
  await instance.delete(`${api_version}/users/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const linkCoursetableToUser = async (
  token,
  course_table_id,
  user_id
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
  return data;
};

export const addFavoriteCourse = async (token, courseId) => {
  const { data } = await instance.put(
    `${api_version}/users/favorites/${courseId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};

export const removeFavoriteCourse = async (token, courseId) => {
  const { data } = await instance.delete(
    `${api_version}/users/favorites/${courseId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};

export const patchUserInfo = async (token, newUser) => {
  const { data } = await instance.patch(
    `${api_version}/users/`,
    { user: newUser },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};

export const deleteUserAccount = async (token) => {
  await instance.delete(`${api_version}/users/account`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const fetchUserById = async (token, user_id) => {
  const { data } = await instance.get(`${api_version}/users/${user_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  // user contains user in db & auth0, either null (not found) or an object.
  return data;
};

export const registerNewUser = async (token, email) => {
  const {
    data: { user },
  } = await instance.post(
    `${api_version}/users/`,
    { user: { email: email } },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  // either null (not found) or an object.
  return user;
};
