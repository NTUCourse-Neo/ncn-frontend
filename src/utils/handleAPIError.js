export default function handleAPIError(error) {
  if (error?.response) {
    // server did response, used for handle custom error msg
    const error_obj = {
      status_code: error?.response?.status,
      backend_msg: error?.response?.data?.message,
      error_info: error?.message,
      error_detail: Error(error)?.stack,
    };
    return error_obj;
  } else if (error?.request) {
    // The request was made but no response was received (server is downed)
    const status = 521; // Server is down
    const error_obj = {
      status_code: status,
      backend_msg: "no",
      error_info: error?.message,
      error_detail: Error(error)?.stack,
    };
    return error_obj;
  }
  // Something happened in setting up the request that triggered an Error
  const status = 400; // Bad request
  const error_obj = {
    status_code: status,
    backend_msg: "no",
    error_info: error?.message,
    error_detail: Error(error)?.stack,
  };
  return error_obj;
}
