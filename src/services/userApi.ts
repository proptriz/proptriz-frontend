import { UserType } from "@/definitions";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8002/api/v1/users"; // Adjust for production

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
    const response = await axiosInstance.post("/signup", data);
    if (response.status===400) {
      console.log("Signup error, ", response.data.message)
      return null
    }
    return response.data.user;
  },

  /**
   * User Login
   */
  login: async (data: LoginData): Promise< UserType  | null> => {
    const response = await axiosInstance.post("/login", data);
    if (response.status===400) {
      console.log("Login error, ", response.data.message);
      toast.error("Login error, ", response.data.message);
      return null
    };
    return response.data;
  },

  /**
   * Get User Profile (Requires Token)
   */
  getProfile: async (token: string): Promise<UserType | null> => {
    return handleRequest(
      axiosInstance.get<UserType>("/profile", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.data)
    );
  },

  /**
   * Verify User token
   */
  authenticateUser: async (): Promise<UserType | null> => {
    return handleRequest(
      axiosInstance.post<UserType>("/authenticate").then((res) => res.data)
    );
  },
};



export default userAPI;
