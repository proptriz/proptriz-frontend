'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import PropertyReview from '@/components/reviews/PropertyReview';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Home, 
  Building,
  Bed, 
  Bath, 
  Square,
  Calendar,
  Share2,
  Heart,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { PropertyType, AgentType } from '@/types/property';
import { getPropertyById, getAgentById, mockProperties } from '@/data/mockData';

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<PropertyType | null>(null);
  const [agent, setAgent] = useState<AgentType | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  
  // Mock images for the gallery
  const mockImages = [
    "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2053&q=80",
    "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
  ];
  
  // Similar properties
  const similarProperties = mockProperties.slice(0, 3);
  
  useEffect(() => {
    if (id) {
      const foundProperty = getPropertyById(id);
      if (foundProperty) {
        setProperty(foundProperty);
        const propertyAgent = getAgentById(foundProperty.agentId);
        if (propertyAgent) {
          setAgent(propertyAgent);
        }
      }
    }
  }, [id]);
  
  if (!property || !agent) {
    return (
      <div>
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-xl">Loading property details...</p>
        </div>
      </div>
    );
  }
  
  // Get property type icon
  const getPropertyIcon = (type: string) => {
    switch (type) {
      case 'house':
        return <Home className="h-4 w-4" />;
      case 'hotel':
      case 'office':
        return <Building className="h-4 w-4" />;
      default:
        return <Home className="h-4 w-4" />;
    }
  };
  
  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <div className="text-sm text-gray-600">
            <Link href="/" className="hover:text-estate-primary">Home</Link> {' > '} 
            <Link href="/property" className="hover:text-estate-primary">Properties</Link> {' > '} 
            <span className="text-estate-primary">{property.title}</span>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
            <div className="flex items-center text-estate-secondary mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{property.location}</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className={`${property.priceType === 'sale' ? 'bg-estate-primary' : 'bg-estate-secondary'}`}>
                {property.priceType === 'sale' ? 'For Sale' : 'For Rent'}
              </Badge>
              <Badge variant="outline" className="flex items-center space-x-1">
                {getPropertyIcon(property.type)}
                <span>{property.type.charAt(0).toUpperCase() + property.type.slice(1)}</span>
              </Badge>
              <Badge variant="outline" className="flex items-center space-x-1">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Posted 2 weeks ago</span>
              </Badge>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-3 mt-4 lg:mt-0">
            <div className="text-right">
              <p className="text-sm text-gray-600">Price</p>
              <p className="text-2xl font-bold text-estate-dark">
                ₦{property.price.toLocaleString()}
                {property.priceType === 'rent' && <span className="text-sm text-gray-500">/month</span>}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" className="flex items-center">
                <Heart className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" className="flex items-center">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
        
        {/* Property Images */}
        <div className="mb-8">
          <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden mb-3">
            <img 
              src={mockImages[selectedImage]} 
              alt={property.title} 
              className="w-full h-full object-cover"
            />
            <button 
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
              onClick={() => setSelectedImage(prev => (prev === 0 ? mockImages.length - 1 : prev - 1))}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button 
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
              onClick={() => setSelectedImage(prev => (prev === mockImages.length - 1 ? 0 : prev + 1))}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {mockImages.map((img, index) => (
              <div 
                key={index}
                className={`h-20 md:h-24 rounded-md overflow-hidden cursor-pointer ${selectedImage === index ? 'ring-2 ring-estate-primary' : ''}`}
                onClick={() => setSelectedImage(index)}
              >
                <img src={img} alt={`Property view ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Tabs Navigation */}
        <div className="mb-6 border-b">
          <div className="flex space-x-6">
            <button
              className={`py-3 px-1 font-medium ${activeTab === 'details' ? 'text-estate-primary border-b-2 border-estate-primary' : 'text-gray-600'}`}
              onClick={() => setActiveTab('details')}
            >
              Property Details
            </button>
            <button
              className={`py-3 px-1 font-medium ${activeTab === 'reviews' ? 'text-estate-primary border-b-2 border-estate-primary' : 'text-gray-600'}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Details or Reviews */}
          <div className="lg:col-span-2">
            {activeTab === 'details' ? (
              <>
                <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                  <h2 className="text-xl font-semibold mb-4 border-b pb-2">Property Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                    <div>
                      <p className="text-gray-600">Property ID</p>
                      <p className="font-medium">PH-{property.id.toString().padStart(4, '0')}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Property Type</p>
                      <p className="font-medium capitalize">{property.type}</p>
                    </div>
                    {property.bedrooms && (
                      <div>
                        <p className="text-gray-600">Bedrooms</p>
                        <p className="font-medium">{property.bedrooms}</p>
                      </div>
                    )}
                    {property.bathrooms && (
                      <div>
                        <p className="text-gray-600">Bathrooms</p>
                        <p className="font-medium">{property.bathrooms}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-600">Area</p>
                      <p className="font-medium">{property.area} m²</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                  <h2 className="text-xl font-semibold mb-4 border-b pb-2">Description</h2>
                  <p className="text-gray-700 mb-4">
                    This beautiful {property.type} is located in the heart of {property.location}. 
                    It offers modern amenities and a convenient location close to all major facilities.
                  </p>
                  <p className="text-gray-700">
                    The property features {property.bedrooms} bedrooms, {property.bathrooms} bathrooms, and a total area of {property.area} m². 
                    Perfect for {property.priceType === 'sale' ? 'buyers looking for a great investment' : 'tenants looking for a comfortable home'}.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                  <h2 className="text-xl font-semibold mb-4 border-b pb-2">Features & Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3">
                    {[
                      "Air Conditioning", "Balcony", "Security", "Parking",
                      "Swimming Pool", "Garden", "Gym", "Close to Schools",
                      "Backup Power"
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center text-gray-700">
                        <div className="w-2 h-2 bg-estate-primary rounded-full mr-2"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold mb-4 border-b pb-2">Location</h2>
                  <div className="h-64 bg-gray-100 rounded-lg overflow-hidden mb-4">
                    {/* Placeholder for map */}
                    <div className="w-full h-full bg-[url('https://plus.unsplash.com/premium_photo-1661963079200-b57a9c264a9e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80')] bg-no-repeat bg-cover opacity-60 flex items-center justify-center">
                      <div className="bg-white/90 p-4 rounded text-center">
                        <p>Interactive map will be displayed here</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    {property.location}, Nigeria. This property is conveniently located close to major amenities
                    including shopping centers, schools, hospitals, and public transportation.
                  </p>
                </div>
              </>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <PropertyReview propertyId={property.id} />
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Agent Info */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">Agent Information</h2>
              <div className="flex items-center mb-4">
                <img 
                  src={agent.imageUrl} 
                  alt={agent.name} 
                  className="h-16 w-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-semibold">{agent.name}</h3>
                  <p className="text-gray-600 text-sm">{agent.title}</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-gray-700">
                  <Phone className="h-4 w-4 mr-2 text-estate-secondary" />
                  <span>{agent.phone}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Mail className="h-4 w-4 mr-2 text-estate-secondary" />
                  <span>{agent.email}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <MapPin className="h-4 w-4 mr-2 text-estate-secondary" />
                  <span>{agent.location}</span>
                </div>
              </div>
              
              <Button className="w-full bg-estate-primary text-white hover:bg-estate-primary/90 mb-3">
                Contact Agent
              </Button>
              <Link href={`/agents/${agent.id}`}>
                <Button variant="outline" className="w-full border-estate-primary text-estate-primary">
                  View Profile
                </Button>
              </Link>
            </div>
            
            {/* Contact Form */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-semibold mb-4">Inquire About This Property</h2>
              <form>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-estate-primary focus:border-estate-primary"
                    placeholder="Your full name"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-estate-primary focus:border-estate-primary"
                    placeholder="Your email address"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input 
                    type="tel" 
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-estate-primary focus:border-estate-primary"
                    placeholder="Your phone number"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea 
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-estate-primary focus:border-estate-primary"
                    placeholder="I'm interested in this property..."
                  />
                </div>
                <Button className="w-full bg-estate-secondary text-white hover:bg-estate-secondary/90">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
        
        {/* Similar Properties */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-6">Similar Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarProperties.map(property => (
              <div key={property.id} className="property-card">
                <Link href={`/properties/${property.id}`}>
                  <div className="relative">
                    <img 
                      src={property.imageUrl} 
                      alt={property.title} 
                      className="h-48 w-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className={`${property.priceType === 'sale' ? 'bg-estate-primary' : 'bg-estate-secondary'}`}>
                        {property.priceType === 'sale' ? 'For Sale' : 'For Rent'}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center text-estate-secondary mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{property.location}</span>
                    </div>
                    <h3 className="font-semibold hover:text-estate-primary">{property.title}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-bold text-estate-dark">₦{property.price.toLocaleString()}</span>
                      <span className="text-sm text-estate-primary">View Details</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
