
import React from 'react';
import Hero from '@/components/home/Hero';
import MapSection from '@/components/home/MapSection';
import PropertyCard from '@/components/property/PropertyCard';
import AgentCard from '@/components/agent/AgentCard';
import { Button } from "@/components/ui/button";
import { Home, Building, MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getFeaturedProperties, getFeaturedAgents } from '@/data/mockData';
import { PropertyType } from '@/types/property';

const Index = () => {
  const featuredProperties = getFeaturedProperties();
  const featuredAgents = getFeaturedAgents();
  
  return (
    <div>
      <Hero />
      
      {/* Featured Properties */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold">Featured Properties</h2>
              <p className="text-gray-600 mt-2">Explore our handpicked selection of premium properties</p>
            </div>
            <Link href="/properties">
              <Button variant="outline" className="border-estate-primary text-estate-primary">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>
      
      <MapSection />
      
      {/* Property Categories */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Browse by Property Type</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find the perfect property that fits your needs. We have a wide range of options available.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { icon: <Home />, name: "Houses", count: 243 },
              { icon: <Building />, name: "Apartments", count: 157 },
              { icon: <MapPin />, name: "Land", count: 89 },
              { icon: <Building />, name: "Offices", count: 62 },
              { icon: <Building />, name: "Shops", count: 35 }
            ].map((category, index) => (
              <Link href={`/properties?type=${category.name.toLowerCase()}`} key={index}>
                <div className="bg-white rounded-lg p-6 text-center shadow hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px]">
                  <div className="h-12 w-12 bg-estate-primary bg-opacity-10 text-estate-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                  <p className="text-gray-500">{category.count} listings</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Top Agents */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold">Top Agents</h2>
              <p className="text-gray-600 mt-2">Work with the best real estate professionals in Nigeria</p>
            </div>
            <Link href="/agents">
              <Button variant="outline" className="border-estate-primary text-estate-primary">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredAgents.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-estate-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Find Your Perfect Property?</h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found their dream properties through PropertyHub Nigeria.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/property">
              <Button className="bg-white text-estate-primary hover:bg-gray-100">
                Browse Properties
              </Button>
            </Link>
            <Link href="/agents">
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                Find an Agent
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
