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
  const {
    data: { user },
  } = await instance.post(
    `${api_version}/users/${user_id}/course_table`,
    { course_table_id: course_table_id },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return user;
};

export const addFavoriteCourse = async (token, new_favorite_list) => {
  const {
    data: { user },
  } = await instance.patch(
    `${api_version}/users/`,
    { user: { favorites: new_favorite_list } },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return user;
};

export const patchUserInfo = async (token, updateObject) => {
  const {
    data: { user },
  } = await instance.patch(
    `${api_version}/users/`,
    { user: updateObject },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return user;
};

export const deleteUserAccount = async (token) => {
  await instance.delete(`${api_version}/users/account`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const fetchUserById = async (token, user_id) => {
  const {
    data: { user },
  } = await instance.get(`${api_version}/users/${user_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  // user contains user in db & auth0, either null (not found) or an object.
  return user;
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
