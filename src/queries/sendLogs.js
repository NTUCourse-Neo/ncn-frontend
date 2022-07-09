import instance from "queries/axiosInstance";

const sendLogs = async (type, obj) => {
  if (process.env.NEXT_PUBLIC_ENV === "prod") {
    const resp = await instance.post(`/logs/${type}`, obj);
    return resp.data;
  } else {
    console.log("[INFO] Logs are not sent to server in development mode.");
  }
};

export default sendLogs;
