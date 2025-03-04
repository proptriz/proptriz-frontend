import { UserType } from "@/definitions";
import axios from "axios";
import axiosClient from "@/config/client";
import { toast } from "react-toastify";
import useSWR from "swr";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8002/api/v1"; // Adjust for production

interface SignupData {
  username: string;
  password: string;
  fullname?: string;
}

interface LoginData {
  username: string;
  password: string;
}

interface User {
  _id: string;
  username: string;
  fullname?: string;
  email?: string;
  phone?: string;
  token?: string;
}

/**
 * Axios instance with default settings
 */
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Handles API errors
 */
const handleRequest = async <T>(request: Promise<T>): Promise<T | null> => {
  try {
    const response = await request;
    return response;
  } catch (error: any) {
    console.error("API Error:", error?.response?.data?.message || error.message);
    throw new Error(error?.response?.data?.message || "An error occurred");
  }
};

/**
 * User Authentication API
 */
const userAPI = {
  /**
   * User Signup
   */
  signup: async (data: SignupData):  Promise< UserType  | null> => {
    const response = await axiosInstance.post("/users/signup", data);
    if (response.status===400) {
      console.log("Signup error, ", response.data.message)
      return null
    }
    return response.data.user;
  },

  /**
   * User Login
   */
  login: async (data: LoginData): Promise< UserType | null> => {
    const response = await axiosClient.post("/users/login", data);
    if (response.status===401) {
      console.log("Login error, ", response.data.message);
      toast.error("Login error, ", response.data.message);
      return null
    };
    if (response.status===200 && response.data.success){
      return response.data.user;
    }
    // toast.info("Welcome: ", response.data.user.username);
    return null;
  },

  /**
   * Get User Profile (Requires Token)
   */
  getProfile: async (token: string): Promise<UserType | null> => {
    return handleRequest(
      axiosInstance.get<UserType>("/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.data)
    );
  },

  /**
   * Verify User token
   */
  authenticateUser: async (): Promise<UserType | null> => {
    return handleRequest(
      axiosInstance.post<UserType>("/users/authenticate").then((res) => res.data)
    );
  },
};

export const authenticateUser = () => {
  const userFetcher = (url:string) => axios.post(url, {withCredentials: true}).then((res) => {res.data;})
  const { data, error, isLoading, mutate } = useSWR(`${API_BASE_URL}/users/authenticate`, userFetcher);

  return {
    user: data,
    isAuthLoading: isLoading,
    isAuthError: error,
    mutate,
  };
};


export default userAPI;
