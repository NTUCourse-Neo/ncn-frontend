import { UPDATE_USER, LOG_OUT_SUCCESS } from "constants/action-types";
import instance from "api/axios";
import handleAPIError from "utils/handleAPIError";

const linkCoursetableToUser = (token, course_table_id, user_id) => async (dispatch) => {
  try {
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
    dispatch({ type: UPDATE_USER, payload: user });
  } catch (error) {
    throw handleAPIError(error);
  }
};

const fetchUserById = (token, user_id) => async (dispatch) => {
  try {
    const {
      data: { user },
    } = await instance.get(`/users/${user_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // user contains user in db & auth0, either null (not found) or an object.
    return user;
  } catch (error) {
    throw handleAPIError(error);
  }
};

const registerNewUser = (token, email) => async (dispatch) => {
  try {
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
  } catch (error) {
    throw handleAPIError(error);
  }
};

const addFavoriteCourse = (token, new_favorite_list) => async (dispatch) => {
  try {
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
    dispatch({ type: UPDATE_USER, payload: user });
  } catch (error) {
    throw handleAPIError(error);
  }
};

const patchUserInfo = (token, updateObject) => async (dispatch) => {
  try {
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
    dispatch({ type: UPDATE_USER, payload: user });
  } catch (error) {
    throw handleAPIError(error);
  }
};

const deleteUserProfile = (token) => async (dispatch) => {
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

const deleteUserAccount = (token) => async (dispatch) => {
  try {
    await instance.delete(`/users/account`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch({ type: LOG_OUT_SUCCESS });
  } catch (error) {
    throw handleAPIError(error);
  }
};

const request_otp_code = (token, student_id) => async (dispatch) => {
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

const use_otp_link_student_id = (token, student_id, otp_code) => async (dispatch) => {
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

export {
  linkCoursetableToUser,
  fetchUserById,
  registerNewUser,
  addFavoriteCourse,
  patchUserInfo,
  deleteUserProfile,
  deleteUserAccount,
  request_otp_code,
  use_otp_link_student_id,
};
