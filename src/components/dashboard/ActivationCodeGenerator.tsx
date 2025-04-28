
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/context/AppContext';

export const ActivationCodeGenerator = () => {
  const { generateActivationCode, schools } = useAppContext();
  const [activationCodes, setActivationCodes] = useState<string[]>([]);

  const handleGenerateCode = () => {
    const newCode = generateActivationCode();
    setActivationCodes((prev) => [...prev, newCode]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>School Activation</CardTitle>
        <CardDescription>Generate activation codes for new schools</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Button 
          onClick={handleGenerateCode}
          className="w-full bg-education-primary hover:bg-education-secondary"
        >
          Generate New Activation Code
        </Button>
        
        <div className="space-y-4">
          <h3 className="font-medium">Generated Codes</h3>
          
          {activationCodes.length > 0 ? (
            <div className="rounded-md border">
              <div className="p-2 bg-gray-50 border-b font-medium text-sm">
                Activation Codes
              </div>
              <ul>
                {activationCodes.map((code, index) => (
                  <li key={index} className="p-2 border-b last:border-b-0 flex justify-between">
                    <span className="font-mono">{code}</span>
                    <span className="text-sm text-green-600">Active</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No codes generated yet</p>
          )}
        </div>
        
        <div className="space-y-4 pt-4">
          <h3 className="font-medium">Registered Schools</h3>
          
          {schools.length > 0 ? (
            <div className="rounded-md border">
              <div className="p-2 bg-gray-50 border-b grid grid-cols-2 font-medium text-sm">
                <div>School Name</div>
                <div>Activation Code</div>
              </div>
              <ul>
                {schools.map((school, index) => (
                  <li key={index} className="p-2 border-b last:border-b-0 grid grid-cols-2">
                    <span>{school.name}</span>
                    <span className="font-mono">{school.activationCode}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No schools registered yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
