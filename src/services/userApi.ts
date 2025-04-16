import { OTPType, UserType } from "@/definitions";
import axios from "axios";
import axiosClient, { setAuthToken } from "@/config/client";
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
  provider: string
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

  verifyOtp: async (data: any):  Promise< OTPType  | null> => {
    const response = await axiosInstance.post(`/users/verify-otp?email=${data.email}`, data);
    if (response.data.success === false) {
      console.log("OTP verification error, ", response.data.message)
      return null
    }
    return response.data;
  },

  resendOtp: async (data: any):  Promise< OTPType  | null> => {
    const response = await axiosInstance.post(`/users/resend-otp?email=${data.email}`);
    if (response.data.success === false) {
      console.log("Resend OTP failed, ", response.data.message)
      return null
    }
    return response.data;
  },

  /**
   * User Login
   */
  login: async (data: LoginData) => {
    const response = await axiosClient.post("/users/login", data);
    if (response.status===401) {
      console.log("Login error, ", response.data.message);
      // toast.error("Login error, ", response.data.message);
      return null
    };
    if (response.status===200 && response.data.success){
      // localStorage.setItem('token', response.data.token);
      return response.data;
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
  const userFetcher = (url:string) => axiosClient.post(url, {withCredentials: true}).then((res) => {res.data;})
  const { data, error, isLoading, mutate } = useSWR(`${API_BASE_URL}/users/authenticate`, userFetcher);

  return {
    user: data,
    isAuthLoading: isLoading,
    isAuthError: error,
    mutate,
  };
};

// export const aditProfile = async (formData:FormData) => {
//   const userFetcher = (url:string, formData:FormData) => axiosClient.post(url, { body:formData }).then((res) => {res.data;})
//   const { data, error, isLoading, mutate } = useSWR(`${API_BASE_URL}/users/edit-profile`, userFetcher);

//   return {
//     data,
//     isLoading,
//     error,
//     mutate,
//   };
// };

export const aditProfile = async (data:FormData) => {
  try {
        const jsonData = Object.fromEntries(data.entries());
        const response = await axiosClient.post("/users/update-profile", jsonData, {
          headers: { "Content-Type": "application/json" },
        });
        return { success: true, data: response.data };
      } catch (error: any) {
        console.error("Profile update failed:", error);
        return { success: false, message: error.message };
      }
}


export default userAPI;
