import instance from "queries/axiosInstance";
import handleAPIError from "utils/handleAPIError";
import dotenv from "dotenv-defaults";
dotenv.config();

const sendLogs = async (type, obj) => {
  if (process.env.REACT_APP_ENV === "prod") {
    try {
      const resp = await instance.post(`/logs/${type}`, obj);
      return resp.data;
    } catch (e) {
      throw handleAPIError(e);
    }
  } else {
    console.log("[INFO] Logs are not sent to server in development mode.");
  }
};

export default sendLogs;
