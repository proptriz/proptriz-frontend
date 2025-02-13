import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8002/api/v1/property";

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
    return handleRequest(axios.get(`${API_BASE_URL}/all`, { params: filters }));
  },

  // Update Property
  updateProperty: async (id: string, updates: any) => {
    return handleRequest(axios.put(`${API_BASE_URL}/${id}`, updates));
  },

  // Delete Property
  deleteProperty: async (id: string) => {
    return handleRequest(axios.delete(`${API_BASE_URL}/${id}`));
  },
};

export default propertyService;
