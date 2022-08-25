import instance from "@/queries/axiosInstance";
const api_version = "v1";

const sendLogs = async (
  type: "info" | "error",
  obj: Record<string, unknown>
) => {
  if (process.env.NEXT_PUBLIC_ENV === "prod") {
    const { data } = await instance.post(`${api_version}/logs/${type}`, obj);
    return data;
  } else {
    console.log("[INFO] Logs are not sent to server in development mode.");
  }
};

export default sendLogs;
