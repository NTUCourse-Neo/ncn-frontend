import axios from "axios";

// used for hitting self-hosted API in Next.js
const handleFetch = async (route: string, payload: object) => {
  const response = await axios.post(route, payload);
  return response.data as unknown;
};

export default handleFetch;
