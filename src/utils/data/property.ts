import { PropertyType } from "@/types";
import propertyService from "@/services/propertyApi";

export async function fetchProperty(propertyId:string) {
  try {
    // We artificially delay a response for demo purposes.
    // Don't do this in production :)
    console.log('Fetching revenue data...');
    const property = await propertyService.getPropertyById(propertyId);
    if (!property){
      return null
    } 
    console.log('property fetch completed: ', property);
 
    return property;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}