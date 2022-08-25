import axios from "axios";

// used for hitting self-hosted API in Next.js
async function handleFetch<T>(route: string, payload: object): Promise<T> {
  const response = await axios.post(route, payload);
  return response.data;
}

export default handleFetch;
