import axios from 'axios';

const backendURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8002/api/v1";
const axiosClient = axios.create({ 
  baseURL: backendURL, 
  timeout: 20000, 
  withCredentials: true,
  headers: { "Content-Type": "application/json" }
});

export const setAuthToken = (token: string) => {
  if (token) {
    return (axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`);
  } else {
    return delete axiosClient.defaults.headers.common['Authorization'];
  }
};

export default axiosClient;
