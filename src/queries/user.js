import instance from "queries/axiosInstance";
import handleAPIError from "utils/handleAPIError";

export const deleteUserProfile = async (token) => {
  try {
    await instance.delete(`/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    throw handleAPIError(error);
  }
};

export const use_otp_link_student_id = async (token, student_id, otp_code) => {
  const resp = await instance.post(
    `/users/student_id/link`,
    { student_id: student_id, otp_code: otp_code },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return resp.data;
};

export const request_otp_code = async (token, student_id) => {
  const resp = await instance.post(
    `/users/student_id/link`,
    { student_id: student_id },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return resp.data;
};

export const linkCoursetableToUser = async (token, course_table_id, user_id) => {
  const {
    data: { user },
  } = await instance.post(
    `/users/${user_id}/course_table`,
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
    `/users/`,
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
    `/users/`,
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
  await instance.delete(`/users/account`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const fetchUserById = async (token, user_id) => {
  const {
    data: { user },
  } = await instance.get(`/users/${user_id}`, {
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
    `/users/`,
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
