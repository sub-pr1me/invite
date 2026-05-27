/* eslint-disable react-refresh/only-export-components */
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default axios.create({
  baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  withCredentials: true
});