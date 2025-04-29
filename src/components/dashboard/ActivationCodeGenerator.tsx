
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/context/AppContext';
import { Shield, Loader2 } from 'lucide-react';

export const ActivationCodeGenerator = () => {
  const { generateActivationCode, generatedCodes, schools } = useAppContext();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleGenerateCode = async () => {
    setIsGenerating(true);
    try {
      await generateActivationCode();
    } catch (error) {
      console.error('Error during code generation:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-education-primary" />
          <div>
            <CardTitle>School Activation</CardTitle>
            <CardDescription>Generate activation codes for new schools</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Button 
          onClick={handleGenerateCode}
          className="w-full bg-education-primary hover:bg-education-secondary"
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate New Activation Code'
          )}
        </Button>
        
        <div className="space-y-4">
          <h3 className="font-medium">Generated Codes</h3>
          
          {generatedCodes.length > 0 ? (
            <div className="rounded-md border">
              <div className="p-2 bg-gray-50 border-b grid grid-cols-2 font-medium text-sm">
                <div>Activation Code</div>
                <div>Status</div>
              </div>
              <ul>
                {generatedCodes.map((code, index) => (
                  <li key={index} className="p-2 border-b last:border-b-0 grid grid-cols-2">
                    <span className="font-mono">{code.code}</span>
                    <span className={`text-sm ${code.used ? 'text-red-600' : 'text-green-600'}`}>
                      {code.used ? 'Used' : 'Available'}
                    </span>
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
