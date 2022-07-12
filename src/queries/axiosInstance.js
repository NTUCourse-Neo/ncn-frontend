import axios from "axios";
console.log(
  "ENDPOINT: ",
  process.env.NEXT_PUBLIC_API_ENDPOINT + process.env.NEXT_PUBLIC_API_VERSION
);

const instance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_ENDPOINT + process.env.NEXT_PUBLIC_API_VERSION,
});

export default instance;
