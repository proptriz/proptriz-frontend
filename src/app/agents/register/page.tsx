'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

const AgentRegister = () => {
  const [companyName, setCompanyName] = useState('');
  const [description, setDescription] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [experienceYears, setExperienceYears] = useState(0);
  const [specializations, setSpecializations] = useState('');
  const [areasServed, setAreasServed] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // const handleAgentRegistration = async (e: React.FormEvent) => {
  //   e.preventDefault();
    
  //   if (!user) {
  //     toast({
  //       title: "Authentication required",
  //       description: "Please login before registering as an agent",
  //       variant: "destructive",
  //     });
  //     router.push('/login');
  //     return;
  //   }
    
  //   setIsSubmitting(true);
    
  //   try {
  //     // Check if "agents" table exists in the database
  //     const { error: tableCheckError } = await supabase
  //       .from('agents')
  //       .select('id')
  //       .limit(1)
  //       .maybeSingle();
      
  //     if (tableCheckError && tableCheckError.message.includes('relation "public.agents" does not exist')) {
  //       // Table doesn't exist yet
  //       toast({
  //         title: "Feature not available",
  //         description: "Agent registration functionality will be available soon.",
  //         variant: "default",
  //       });
  //       return;
  //     }
      
  //     // If table exists, attempt to register the agent
  //     const { error } = await supabase.from('agents').insert({
  //       user_id: user.id,
  //       company_name: companyName,
  //       description,
  //       license_number: licenseNumber,
  //       experience_years: experienceYears,
  //       specializations,
  //       areas_served: areasServed
  //     });
      
  //     if (error) {
  //       throw error;
  //     }
      
  //     // Update profile to mark user as agent
  //     await supabase
  //       .from('profiles')
  //       .update({ is_agent: true })
  //       .eq('id', user.id);
      
  //     toast({
  //       title: "Registration successful",
  //       description: "You are now registered as an agent",
  //     });
      
  //     navigate('/agent/dashboard');
      
  //   } catch (error: any) {
  //     console.error('Agent registration error:', error);
  //     toast({
  //       title: "Registration failed",
  //       description: error.message || "An unexpected error occurred",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };
  
  return (
    <div>
      <div className="container mx-auto py-8">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Agent Registration</CardTitle>
          </CardHeader>
          <CardContent>
            <form 
            // onSubmit={handleAgentRegistration} 
            className="space-y-4"
            >
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  type="text"
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  type="text"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description"
                />
              </div>
              <div>
                <Label htmlFor="licenseNumber">License Number</Label>
                <Input
                  type="text"
                  id="licenseNumber"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  placeholder="Enter license number"
                />
              </div>
              <div>
                <Label htmlFor="experienceYears">Years of Experience</Label>
                <Input
                  type="number"
                  id="experienceYears"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  placeholder="Enter years of experience"
                />
              </div>
              <div>
                <Label htmlFor="specializations">Specializations</Label>
                <Input
                  type="text"
                  id="specializations"
                  value={specializations}
                  onChange={(e) => setSpecializations(e.target.value)}
                  placeholder="Enter specializations"
                />
              </div>
              <div>
                <Label htmlFor="areasServed">Areas Served</Label>
                <Input
                  type="text"
                  id="areasServed"
                  value={areasServed}
                  onChange={(e) => setAreasServed(e.target.value)}
                  placeholder="Enter areas served"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : "Register"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgentRegister;
