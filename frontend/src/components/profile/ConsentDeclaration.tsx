import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { ShieldAlert, Save } from 'lucide-react';

interface ConsentDeclarationProps {
  onSave: () => void;
  isSaving?: boolean;
}

export const ConsentDeclaration: React.FC<ConsentDeclarationProps> = ({ onSave, isSaving = false }) => {
  const [agreed, setAgreed] = useState(false);

  return (
    <Card className="bg-card border-border shadow-sm border-l-4 border-l-primary">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <ShieldAlert className="w-5 h-5 text-primary" />
              <span>Consent & Declaration</span>
            </div>
            
            <div className="flex items-start space-x-3 bg-muted/20 p-4 rounded-lg border border-border/50">
              <input 
                type="checkbox"
                id="consent" 
                checked={agreed} 
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 rounded border-input text-primary focus:ring-primary w-5 h-5 transition-all cursor-pointer shrink-0"
              />
              <div className="space-y-1 leading-none">
                <label
                  htmlFor="consent"
                  className="text-sm font-medium leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  I hereby declare that the details furnished above are true and correct to the best of my knowledge and belief. I undertake to inform the institution of any changes therein, immediately. I understand that any false information may lead to disciplinary action.
                </label>
              </div>
            </div>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <Button 
              size="lg" 
              className="w-full md:w-auto gap-2" 
              disabled={!agreed || isSaving}
              onClick={onSave}
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving Profile...' : 'Submit Profile Updates'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
