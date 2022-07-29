import instance from "queries/axiosInstance";
const api_version = "v1";

const sendLogs = async (type, obj) => {
  if (process.env.NEXT_PUBLIC_ENV === "prod") {
    const { data } = await instance.post(`${api_version}/logs/${type}`, obj);
    return data;
  } else {
    console.log("[INFO] Logs are not sent to server in development mode.");
  }
};

export default sendLogs;
