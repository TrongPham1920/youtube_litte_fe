import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000", // Địa chỉ backend của bạn
});

export default API;
