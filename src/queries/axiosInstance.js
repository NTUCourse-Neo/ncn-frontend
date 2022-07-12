import axios from "axios";

const instance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_ENDPOINT + process.env.NEXT_PUBLIC_API_VERSION,
});

export default instance;
