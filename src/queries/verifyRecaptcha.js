import instance from "queries/axiosInstance";

export const verifyRecaptcha = async (captcha_token) => {
  const resp = await instance.post(`/recaptcha`, { captcha_token: captcha_token });
  return resp.data;
};
