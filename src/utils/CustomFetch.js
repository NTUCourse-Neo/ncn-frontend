import axios from "axios";

// used for hitting self-hosted API in Next.js
const handleFetch = async (route, payload) => {
  const response = await axios.post(route, payload);
  return response.data;
};

export default handleFetch;
