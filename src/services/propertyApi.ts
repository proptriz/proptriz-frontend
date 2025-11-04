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
  // getPropertyById: async (id: string) => {
  //   return handleRequest(axiosClient.get(`${API_BASE_URL}/property/${id}`));
  // },

  // Fetch All Properties with Filters
  getAllProperties: async (filters: any = {}) => {
    return handleRequest(axiosClient.get(`${API_BASE_URL}/property/all?${filters}`));
  },

  // Fetch All Properties with Filters
  getNearestProperties: async (propertyId: string) => {
    return handleRequest(axiosClient.get(`${API_BASE_URL}/property/nearest-prop?${propertyId}`));
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
  // ✅ Log Property before sending
  console.log("📦 FormData contents:");
  for (const [key, value] of formData) {
    console.log(`${key}:`, value);
  }
  const response = await axiosClient.post("/property/add", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateProperty = async (
  id: string,
  data: Partial<PropertyType>,
  photos?: File[]
): Promise<any> => {
  try {
    const formData = new FormData();

    // 🧩 Append fields
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          // Convert arrays (e.g. features) to CSV
          formData.append(key, value.join(","));
        } else {
          formData.append(key, value as any);
        }
      }
    });

    // 🖼️ Append new photos
    if (photos && photos.length > 0) {
      photos.forEach((file) => formData.append("images", file));
    }

    const response = await axiosClient.put(
      `${API_BASE_URL}/property/update/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    logger.error("❌ Error updating property:", error.response?.data || error);
    throw new Error(error.response?.data?.message || "Failed to update property");
  }
}

// export const updateProperty = async (propertyId: string, formData: FormData): Promise<PropertyType> => {
//   // ✅ Log Property before sending
//   console.log("📦 FormData contents:");
//   for (const [key, value] of formData) {
//     console.log(`${key}:`, value);
//   }
//   const response = await axiosClient.put(`/property/update/${propertyId}`, formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
//   return response.data;
// };

export const getPropertyById = async (propertyId: string): Promise<PropertyType> => {
  const response = await axiosClient.get(`/property/${propertyId}`);
  logger.info(response.data);
  return {
    ...response.data,
    id: response.data._id,
    longitude: response.data.map_location?.coordinates[0] || 0.0,
    latitude: response.data.map_location?.coordinates[1] || 0.0,
  };
};

export const getNearestProperties = async (propertyId: string): Promise<PropertyType[]> => {
  const response = await axiosClient.get(`/property/nearest-prop/${propertyId}`);
  logger.info(response.data);
  return response.data.properties;
};

export const getUserListedProp = async (): Promise<PropertyType[]> => {
  const response = await axiosClient.get(`/property/user/listed`);
  logger.info(response.data);
  return response.data.properties;
};

export default propertyService;
