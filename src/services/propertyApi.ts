import axios from "axios";
import useSWR from "swr";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8002/api/v1";

const handleRequest = async (request: Promise<any>) => {
  try {
    const response = await request;
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error("API Error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || "An error occurred. Please try again.",
      status: error.response?.status || 500,
    };
  }
};

export const propertyFetcher = (url: string) => axios.get(`${API_BASE_URL}/${url}`).then(res => res.data)

const propertyService = {
  // Create Property
  createProperty: async (propertyData: any) => {
    return handleRequest(axios.post(API_BASE_URL, propertyData));
  },

  // Fetch Single Property
  getPropertyById: async (id: string) => {
    return handleRequest(axios.get(`${API_BASE_URL}/${id}`));
  },

  // Fetch All Properties with Filters
  getAllProperties: async (filters: any = {}) => {
    return handleRequest(axios.get(`${API_BASE_URL}/property/all`, { params: filters }));
  },

  // Update Property
  updateProperty: async (id: string, updates: any) => {
    return handleRequest(axios.put(`${API_BASE_URL}/property/${id}`, updates));
  },

  // Delete Property
  deleteProperty: async (id: string) => {
    return handleRequest(axios.delete(`${API_BASE_URL}/property/${id}`));
  },
};

export const useAllProperties = (filters = {}) => {
  const { data, error, isLoading, mutate } = useSWR([`${API_BASE_URL}/property/all`, filters], ([url, filters]) =>
    axios.get(url, { params: filters }).then((res) => res.data)
  );

  return {
    properties: data,
    isLoading,
    isError: error,
    mutate,
  };
};


export default propertyService;
