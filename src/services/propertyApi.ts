import axiosClient from "@/config/client";
import logger from "../../logger.config.mjs"
import { PropertyType } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8002/api/v1";

const handleRequest = async (request: Promise<any>) => {
  try {
    const response = await request;
    return { success: true, data: response.data.properties };
  } catch (error: any) {
    logger.error("API Error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || "An error occurred. Please try again.",
      status: error.response?.status || 500,
    };
  }
};

const propertyService = {
  // Create Property
  createProperty: async (propertyData: any) => {
    return handleRequest(axiosClient.post(API_BASE_URL, propertyData));
  },

  // Fetch Single Property
  getPropertyById: async (id: string) => {
    return handleRequest(axiosClient.get(`${API_BASE_URL}/property/${id}`));
  },

  // Fetch All Properties with Filters
  getAllProperties: async (filters: any = {}) => {
    return handleRequest(axiosClient.get(`${API_BASE_URL}/property/all?${filters}`));
  },

  // Update Property
  updateProperty: async (id: string, updates: any) => {
    return handleRequest(axiosClient.put(`${API_BASE_URL}/property/${id}`, updates));
  },

  // Delete Property
  deleteProperty: async (id: string) => {
    return handleRequest(axiosClient.delete(`${API_BASE_URL}/property/${id}`));
  },
};


export const createProperty = async (formData: FormData): Promise<PropertyType> => {
  // ✅ Log FormData before sending
  console.log("📦 FormData contents:");
  for (const [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }
  const response = await axiosClient.post("/property/add", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export default propertyService;
