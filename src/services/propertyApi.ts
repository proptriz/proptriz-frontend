import axiosClient from "@/config/client";
import logger from "../../logger.config.mjs"
import { PropertyType } from "@/types";
import { handleApiError } from "@/utils/errorHandler";

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
  logger.info("📦 FormData contents:");
  for (const [key, value] of formData) {
    logger.info(`${key}:`, value);
  }
  const response = await axiosClient.post("/property/add", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateProperty = async (id: string, data: Partial<PropertyType>) => {
  try {
    logger.info("📦 FormData contents: ", {data});
    const response = await axiosClient.put(
      `${API_BASE_URL}/property/update/${id}`,
      data
    );

    return response.data;
  } catch (error: any) {
    logger.error("❌ Error updating property:", error.response?.data || error);
    handleApiError(error, "Failed to update settings");
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
  const property = response.data.property;
  const userDetails = response.data.userDetails;
  return {
    ...property,
    id: property._id,
    user: {
      username: property.user.username,
      image: userDetails.image,
      email: userDetails.email,
      phone: userDetails.phone,
      brand: userDetails.brand,
    },
    longitude: property.map_location?.coordinates[0] || 0.0,
    latitude: property.map_location?.coordinates[1] || 0.0,
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

export const deleteUserProperty = async (propertyId: string) => {
  const response = await axiosClient.delete(`/property/delete/${propertyId}`);
  logger.info(response.data);
  return response.data
};

export const deletePropertyImage = async (property_id: string, image_url: string) => {
  const response = await axiosClient.post(`/property/image/delete`, {
    property_id, image_url
  });
  logger.info(response.data);
  return response.data;
};

export const updatePropertyImage = async (propertyId: string, image: File, imageIndex?: string): Promise<{success: boolean, image: string}> => {
  const formData = new FormData();
  formData.append("image", image);
  formData.append("property_id", propertyId);
  formData.append("image_index", imageIndex? imageIndex : "");

  const response = await axiosClient.put(
    `/property/image/update`,
    formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }); 
  logger.info(`replace image response, ${response.data}`);
  return response.data;
};

export default propertyService;
