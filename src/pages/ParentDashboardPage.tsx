
import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { School } from '@/types';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const ParentDashboardPage = () => {
  const navigate = useNavigate();
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);

  useEffect(() => {
    const fetchSchools = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('schools')
          .select('name, address, email, phone, password, activationCode');
          
        if (error) throw error;
        
        if (data) {
          // Convert the data to match our School type
          const formattedSchools: School[] = data.map(school => ({
            name: school.name,
            address: school.address,
            email: school.email,
            phone: school.phone,
            password: school.password,
            activationCode: school.activationCode,
            paystackPublicKey: school.paystackPublicKey
          }));
          
          setSchools(formattedSchools);
          setFilteredSchools(formattedSchools);
        }
      } catch (error) {
        console.error('Error fetching schools:', error);
        toast.error('Failed to load schools');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSchools();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSchools(schools);
    } else {
      const filtered = schools.filter(school => 
        school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSchools(filtered);
    }
  }, [searchQuery, schools]);

  const handleSelectSchool = (school: School) => {
    navigate(`/payment/${school.name}`);
    // For now, just show a toast as we haven't implemented the payment page yet
    toast.info(`Selected school: ${school.name}. Payment functionality coming soon.`);
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold dark:text-white">Parent Dashboard</h1>
        <p className="text-muted-foreground mt-1 dark:text-gray-400">
          Find a school to make a payment
        </p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground dark:text-gray-400" />
        <Input
          type="search"
          placeholder="Search schools by name or location..."
          className="pl-8 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <p className="col-span-full text-center py-8 dark:text-white">Loading schools...</p>
        ) : filteredSchools.length > 0 ? (
          filteredSchools.map((school) => (
            <Card key={school.name} className="cursor-pointer hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700" onClick={() => handleSelectSchool(school)}>
              <CardHeader className="pb-2">
                <CardTitle className="dark:text-white">{school.name}</CardTitle>
                <CardDescription className="dark:text-gray-400">{school.address}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1 dark:text-gray-300">
                  <p>Email: {school.email}</p>
                  <p>Phone: {school.phone}</p>
                </div>
                <Button className="w-full mt-4 bg-education-primary hover:bg-education-secondary dark:bg-blue-600 dark:hover:bg-blue-700">
                  Make Payment
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="col-span-full text-center py-8 dark:text-white">No schools found</p>
        )}
      </div>
    </Layout>
  );
};

export default ParentDashboardPage;
