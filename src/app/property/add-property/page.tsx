'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { MapPin, Building, Home, Plus, Upload, Navigation, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import LocationPickerModal from '@/components/modals/LocationPickerModal';
import { PropertyFeature } from '@/types/property';
import { BackButton } from '@/components/shared/buttons';

// Define form schema using zod
const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters",
  }),
  type: z.enum(['house', 'apartment', 'land', 'office', 'shop', 'hotel']),
  price: z.coerce.number().positive({
    message: "Price must be a positive number",
  }),
  location: z.string().min(5, {
    message: "Location must be at least 5 characters",
  }),
  city: z.string().min(2, {
    message: "City is required",
  }),
  state: z.string().min(2, {
    message: "State is required",
  }),
  beds: z.coerce.number().optional(),
  baths: z.coerce.number().optional(),
  area: z.coerce.number().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  forSale: z.boolean().default(true),
  forRent: z.boolean().default(false),
  featured: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

const AddProperty = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [features, setFeatures] = useState<PropertyFeature[]>([]);
  const [featureName, setFeatureName] = useState('');
  const [featureQuantity, setFeatureQuantity] = useState(1);
  
  // Initialize the form
  const form = useForm<FormValues>({
    // resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'house',
      price: undefined,
      location: '',
      city: '',
      state: '',
      beds: undefined,
      baths: undefined,
      area: undefined,
      latitude: undefined,
      longitude: undefined,
      forSale: true,
      forRent: false,
      featured: false,
    },
  });

  const handleAddFeature = () => {
    if (featureName.trim() === '') {
      toast({
        title: "Feature name required",
        description: "Please enter a feature name",
        variant: "destructive",
      });
      return;
    }

    // Check if feature already exists
    if (features.some(f => f.name.toLowerCase() === featureName.toLowerCase())) {
      toast({
        title: "Feature already exists",
        description: "This feature has already been added",
        variant: "destructive",
      });
      return;
    }

    setFeatures([...features, { name: featureName, quantity: featureQuantity }]);
    setFeatureName('');
    setFeatureQuantity(1);
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const openMapModal = () => {
    setIsMapModalOpen(true);
  };

  const closeMapModal = () => {
    setIsMapModalOpen(false);
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    form.setValue('latitude', lat);
    form.setValue('longitude', lng);
    form.trigger(['latitude', 'longitude']); // Validate the fields
    toast({
      title: "Location selected",
      description: `Latitude: ${lat.toFixed(6)}, Longitude: ${lng.toFixed(6)}`,
    });
  };

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // const uploadImage = async (): Promise<string> => {
  //   if (!imageFile) {
  //     return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80';
  //   }

  //   const fileExt = imageFile.name.split('.').pop();
  //   const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
  //   try {
  //     const { data, error } = await supabase.storage
  //       .from('properties')
  //       .upload(`images/${fileName}`, imageFile);
        
  //     if (error) throw error;
      
  //     const { data: { publicUrl } } = supabase.storage
  //       .from('properties')
  //       .getPublicUrl(`images/${fileName}`);
        
  //     return publicUrl;
  //   } catch (error: any) {
  //     console.error('Error uploading image:', error);
  //     throw error;
  //   }
  // };

  // Form submission handler
  // const onSubmit = async (data: FormValues) => {
  //   if (!user) {
  //     toast({
  //       title: "Not authenticated",
  //       description: "You must be logged in as an agent to add a property.",
  //       variant: "destructive",
  //     });
  //     return;
  //   }
    
  //   try {
  //     setIsUploading(true);
      
  //     // Upload image if provided
  //     const imageUrl = await uploadImage();
      
  //     // Get agent ID from user profile
  //     const { data: agentData, error: agentError } = await supabase
  //       .from('agents')
  //       .select('id')
  //       .eq('user_id', user.id)
  //       .single();
        
  //     if (agentError || !agentData) {
  //       throw new Error("Could not find your agent profile");
  //     }
      
  //     // Create property listing
  //     const { error } = await supabase
  //       .from('properties')
  //       .insert({
  //         title: data.title,
  //         description: data.description,
  //         type: data.type,
  //         price: data.price,
  //         location: data.location,
  //         city: data.city,
  //         state: data.state,
  //         beds: data.beds || null,
  //         baths: data.baths || null,
  //         area: data.area || null,
  //         latitude: data.latitude || 9.0820,
  //         longitude: data.longitude || 8.6753,
  //         image_url: imageUrl,
  //         for_sale: data.forSale,
  //         for_rent: data.forRent,
  //         featured: data.featured,
  //         agent_id: agentData.id,
  //         features: features, // Add the features array
  //       });
      
  //     if (error) throw error;
      
  //     toast({
  //       title: "Property added",
  //       description: "Your property listing has been added successfully.",
  //     });
      
  //     navigate('/agent/properties');
  //   } catch (error: any) {
  //     console.error('Error adding property:', error);
  //     toast({
  //       title: "Error adding property",
  //       description: error.message || "An error occurred while adding the property.",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsUploading(false);
  //   }
  // };
  
  return (
    <div>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <BackButton />
          <h1 className="text-3xl font-bold mb-6">Add New Property</h1>
          
          <Form {...form}>
            <form 
            // onSubmit={form.handleSubmit(onSubmit)} 
            className="space-y-8"
            >
              
              {/* Property Image Upload Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Property Images</CardTitle>
                  <CardDescription>Upload high-quality images of your property</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid place-items-center p-6 border-2 border-dashed rounded-lg">
                    {imagePreview ? (
                      <div className="relative w-full">
                        <img 
                          src={imagePreview} 
                          alt="Property Preview" 
                          className="rounded-lg mx-auto max-h-[300px] object-cover"
                        />
                        <Button 
                          type="button"
                          size="sm" 
                          className="absolute top-2 right-2 bg-white text-red-500 hover:bg-red-50"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview('');
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto h-16 w-16 text-gray-300" />
                        <p className="mt-2 text-sm text-gray-500">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    )}
                    <Input
                      id="property-image"
                      type="file"
                      accept="image/*"
                      className={imagePreview ? "hidden" : "opacity-0 absolute inset-0 cursor-pointer"}
                      onChange={handleImageChange}
                    />
                  </div>
                </CardContent>
              </Card>
              
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Enter the basic details of your property</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    // control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Luxury 3 Bedroom Apartment in Lekki" {...field} />
                        </FormControl>
                        <FormDescription>
                          A descriptive title for your property listing.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    // control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your property in detail..." 
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Type</FormLabel>
                          <FormControl>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              {...field}
                            >
                              <option value="house">House</option>
                              <option value="apartment">Apartment</option>
                              <option value="land">Land</option>
                              <option value="office">Office Space</option>
                              <option value="shop">Shop/Commercial</option>
                              <option value="hotel">Hotel</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price (₦)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" step="1000" placeholder="25000000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="forSale"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="h-4 w-4"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>For Sale</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="forRent"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="h-4 w-4"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>For Rent</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="h-4 w-4"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Featured Property</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              
              {/* Location Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Location</CardTitle>
                  <CardDescription>Where is your property located?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Example Street" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Lagos" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input placeholder="Lagos State" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="latitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Latitude</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.0001" placeholder="9.0820" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="longitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Longitude</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.0001" placeholder="8.6753" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2"
                    onClick={openMapModal}
                  >
                    <Navigation className="h-4 w-4" /> 
                    Select Location on Map
                  </Button>
                </CardContent>
              </Card>
              
              {/* Property Features */}
              <Card>
                <CardHeader>
                  <CardTitle>Property Features</CardTitle>
                  <CardDescription>Enter the specifications of your property</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="beds"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bedrooms</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" placeholder="3" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="baths"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bathrooms</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" placeholder="2" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="area"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Area (m²)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" placeholder="240" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Property Features - NEW SECTION */}
                  <div className="mt-6">
                    <FormLabel>Additional Features</FormLabel>
                    <FormDescription className="mb-2">
                      Add custom features with quantities (e.g., Parking Spaces: 2, Swimming Pools: 1)
                    </FormDescription>
                    
                    {/* Feature input form */}
                    <div className="flex flex-wrap items-end gap-3 mb-3">
                      <div className="flex-1">
                        <FormLabel htmlFor="feature-name">Feature Name</FormLabel>
                        <Input
                          id="feature-name"
                          value={featureName}
                          onChange={(e) => setFeatureName(e.target.value)}
                          placeholder="e.g., Parking Space"
                        />
                      </div>
                      <div className="w-20">
                        <FormLabel htmlFor="feature-quantity">Qty</FormLabel>
                        <Input
                          id="feature-quantity"
                          type="number"
                          min="1"
                          value={featureQuantity}
                          onChange={(e) => setFeatureQuantity(parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={handleAddFeature}
                        className="flex items-center gap-1"
                      >
                        <Plus className="h-4 w-4" /> Add
                      </Button>
                    </div>

                    {/* Features list */}
                    {features.length > 0 ? (
                      <div className="space-y-2">
                        {features.map((feature, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-md">
                            <div className="flex-1">
                              <span className="font-medium">{feature.name}</span>
                              <span className="ml-2 text-muted-foreground">x {feature.quantity}</span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveFeature(index)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center py-6 text-muted-foreground border border-dashed rounded-md">
                        No features added yet. Add features to highlight your property's amenities.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-end space-x-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => router.push('/agent/dashboard')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-estate-primary text-white hover:bg-estate-primary/90"
                  disabled={isUploading}
                >
                  {isUploading ? 'Adding Property...' : 'Add Property'}
                </Button>
              </div>
            </form>
          </Form>

          <LocationPickerModal 
            isOpen={isMapModalOpen}
            onClose={closeMapModal}
            onLocationSelect={handleLocationSelect}
            initialLat={form.getValues('latitude')}
            initialLng={form.getValues('longitude')}
          />
        </div>
      </div>
    </div>
  );
};

export default AddProperty;