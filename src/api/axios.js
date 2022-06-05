import axios from "axios";
import dotenv from "dotenv-defaults";
dotenv.config();
// console.log('ENDPOINT: ', process.env.REACT_APP_API_ENDPOINT+process.env.REACT_APP_API_VERSION);

const instance = axios.create({ baseURL: process.env.REACT_APP_API_ENDPOINT + process.env.REACT_APP_API_VERSION });

export default instance;
