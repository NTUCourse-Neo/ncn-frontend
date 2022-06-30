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
