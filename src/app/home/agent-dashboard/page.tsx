'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Users, 
  MessageSquare, 
  Settings, 
  LogOut,
  Plus,
  Building,
  List,
  Grid3X3,
  ChevronRight,
  Bell
} from 'lucide-react';
import { mockProperties } from '@/data/mockData';
import { handleSignOut } from '@/utils/actions';
import { useAuth } from '@/context/AuthContext';

const AgentDashboard = () => {
  // Use first 4 properties as agent's properties
  const agentProperties = mockProperties.slice(0, 4);
   const { signIn, signOut, user, isLoading } = useAuth();
  
  return (
    <div>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="w-full md:w-64 shrink-0">
              <div className="bg-white shadow-sm rounded-lg p-4">
                <div className="flex items-center mb-6">
                  <img 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80" 
                    alt="Agent" 
                    className="h-12 w-12 rounded-full object-cover mr-3"
                  />
                  <div>
                    <p className="font-medium">Adebayo Johnson</p>
                    <p className="text-sm text-gray-500">Agent</p>
                  </div>
                </div>
                
                <nav className="space-y-1">
                  <Link 
                    href="/agent/dashboard" 
                    className="flex items-center space-x-3 px-3 py-2 rounded-md bg-estate-primary bg-opacity-10 text-estate-primary"
                  >
                    <Home className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                  <Link 
                    href="/agent/properties" 
                    className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    <Building className="h-5 w-5" />
                    <span>My Properties</span>
                  </Link>
                  <Link 
                    href="/property/add-property" 
                    className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Add Property</span>
                  </Link>
                  <Link 
                    href="/agent/inquiries" 
                    className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    <MessageSquare className="h-5 w-5" />
                    <span>Inquiries</span>
                  </Link>
                  <Link 
                    href="/agent/clients" 
                    className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    <Users className="h-5 w-5" />
                    <span>Clients</span>
                  </Link>
                  <Link 
                    href="/agent/settings" 
                    className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                  >
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                </nav>
                
                <div className="mt-6 pt-6 border-t">
                  <form action={signOut} >
                    <Button 
                      type='submit'
                      variant="outline" 
                      className="w-full border-red-500 text-red-500 hover:bg-red-50 flex items-center justify-center"
                    >
                      <LogOut className="h-4 w-4 mr-2" /> Logout
                    </Button>
                  </form>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-grow">
              {/* Header */}
              <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <p className="text-gray-600">Welcome back, Adebayo</p>
                  </div>
                  <div className="mt-4 md:mt-0 flex space-x-2">
                    <Button variant="outline" className="relative">
                      <Bell className="h-5 w-5" />
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
                    </Button>
                    <Button className="bg-estate-primary text-white hover:bg-estate-primary/90">
                      <Plus className="h-4 w-4 mr-2" /> Add Property
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {[
                  { title: "Active Listings", value: 12, icon: <Building className="h-8 w-8 text-blue-500" /> },
                  { title: "Pending Listings", value: 3, icon: <List className="h-8 w-8 text-orange-500" /> },
                  { title: "New Inquiries", value: 8, icon: <MessageSquare className="h-8 w-8 text-green-500" /> },
                  { title: "Total Clients", value: 24, icon: <Users className="h-8 w-8 text-purple-500" /> }
                ].map((stat, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500">{stat.title}</p>
                        <p className="text-3xl font-bold mt-1">{stat.value}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        {stat.icon}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Recent Listings */}
              <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Recent Listings</h2>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="ghost" className="bg-gray-100 hover:bg-gray-200">
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="bg-gray-100 hover:bg-gray-200">
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <th className="px-4 py-3">Property</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Price</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Date Added</th>
                        <th className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {agentProperties.map((property) => (
                        <tr key={property.id}>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <img 
                                src={property.imageUrl} 
                                alt={property.title} 
                                className="h-10 w-10 rounded object-cover mr-3"
                              />
                              <div>
                                <p className="font-medium text-gray-800">{property.title}</p>
                                <p className="text-gray-500 text-sm">{property.location}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 capitalize">{property.type}</td>
                          <td className="px-4 py-3">₦{property.price.toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              property.featured ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {property.featured ? 'Active' : 'Pending'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-500">April 23, 2023</td>
                          <td className="px-4 py-3">
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50">
                                Edit
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800 hover:bg-red-50">
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Recent Inquiries */}
              <div className="bg-white shadow-sm rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Recent Inquiries</h2>
                  <Link href="/agent/inquiries" className="text-estate-primary hover:underline text-sm flex items-center">
                    View All <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {[
                    {
                      name: "Chioma Okeke",
                      email: "chioma@example.com",
                      message: "I'm interested in the luxury apartment in Lekki. Is it still available?",
                      time: "2 hours ago",
                      property: "Luxury 3 Bedroom Apartment"
                    },
                    {
                      name: "Emeka Obi",
                      email: "emeka@example.com",
                      message: "What are the payment terms for the office space in Victoria Island?",
                      time: "5 hours ago",
                      property: "Modern Office Space"
                    },
                    {
                      name: "Fatima Ahmed",
                      email: "fatima@example.com",
                      message: "Can we schedule a viewing for the shop space this weekend?",
                      time: "Yesterday",
                      property: "Commercial Space in Mall"
                    }
                  ].map((inquiry, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <p className="font-medium">{inquiry.name}</p>
                        <p className="text-sm text-gray-500">{inquiry.time}</p>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{inquiry.email}</p>
                      <p className="text-sm">Property: <span className="text-estate-primary">{inquiry.property}</span></p>
                      <p className="text-gray-700 mt-2">{inquiry.message}</p>
                      <div className="flex justify-end mt-3 space-x-2">
                        <Button variant="outline" size="sm">
                          Ignore
                        </Button>
                        <Button size="sm" className="bg-estate-primary text-white hover:bg-estate-primary/90">
                          Reply
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
