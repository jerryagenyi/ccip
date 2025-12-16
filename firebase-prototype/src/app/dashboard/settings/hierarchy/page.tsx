
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Trash2, PlusCircle, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Tier = {
  id: number;
  name: string;
  scope: string;
};

const HIERARCHY_TEMPLATES = {
    'national-ministry': [
        { id: 1, name: 'Federal', scope: 'National' },
        { id: 2, name: 'State', scope: 'State/Province' },
        { id: 3, name: 'LGA', scope: 'Local Government Area' },
        { id: 4, name: 'Ward', scope: 'District/Ward' },
        { id: 5, name: 'Facility', scope: 'Health Facility' },
        { id: 6, name: 'Community', scope: 'Community Level' },
    ],
    'international-ngo': [
        { id: 1, name: 'Global', scope: 'Worldwide' },
        { id: 2, name: 'Regional', scope: 'Continent/Region' },
        { id: 3, name: 'Country', scope: 'Country' },
        { id: 4, name: 'Program', scope: 'Specific Program Area' },
        { id: 5, name: 'Field Office', scope: 'Local Office' },
        { id: 6, name: 'Community', scope: 'Community Level' },
    ],
    'state-organization': [
        { id: 1, name: 'State Directorate', scope: 'State/Province' },
        { id: 2, name: 'Regional Manager', scope: 'Region/Zone' },
        { id: 3, name: 'District', scope: 'District' },
        { id: 4, name: 'Facility', scope: 'Health Facility' },
        { id: 5, name: 'Community', scope: 'Community' },
        { id: 6, name: 'Household', scope: 'Household' },
    ]
}

export default function HierarchySettingsPage() {
    const [tiers, setTiers] = useState<Tier[]>([
        { id: 1, name: 'Federal', scope: 'National' },
        { id: 2, name: 'State', scope: 'State/Province' },
        { id: 3, name: 'LGA', scope: 'Local Government Area' },
    ]);

    const handleTierNameChange = (id: number, newName: string) => {
        setTiers(tiers.map(tier => tier.id === id ? { ...tier, name: newName } : tier));
    };

    const addTier = () => {
        if (tiers.length < 6) {
            const newId = tiers.length > 0 ? Math.max(...tiers.map(t => t.id)) + 1 : 1;
            setTiers([...tiers, { id: newId, name: `Tier ${tiers.length + 1}`, scope: 'Custom' }]);
        }
    };

    const removeTier = (id: number) => {
        setTiers(tiers.filter(tier => tier.id !== id));
    };
    
    const handleTemplateChange = (templateKey: string) => {
        if (templateKey in HIERARCHY_TEMPLATES) {
            setTiers(HIERARCHY_TEMPLATES[templateKey as keyof typeof HIERARCHY_TEMPLATES]);
        }
    }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Hierarchy Configuration
        </h1>
        <p className="text-muted-foreground">
          Define your organisation's administrative structure for roles and data access.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hierarchy Templates</CardTitle>
          <CardDescription>
            Start with a preset template or build your own custom structure.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-2">
                    <Label>Load a Preset Template</Label>
                     <Select onValueChange={handleTemplateChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Choose a template..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="national-ministry">National Ministry</SelectItem>
                            <SelectItem value="international-ngo">International NGO</SelectItem>
                            <SelectItem value="state-organization">State Organization</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center">
                    <Separator orientation="vertical" className="h-full hidden sm:block mx-4" />
                    <Separator className="sm:hidden" />
                </div>
                <div className="flex items-center justify-center">
                    <Button variant="outline" onClick={() => setTiers([])}>
                        <Trash2 className="mr-2 h-4 w-4" /> Clear for Custom
                    </Button>
                </div>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Administrative Tiers</CardTitle>
          <CardDescription>
            Define the levels of your organisation, from top to bottom. Max 6 tiers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <AnimatePresence>
                {tiers.map((tier, index) => (
                    <motion.div 
                        key={tier.id}
                        layout
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center gap-4 rounded-lg border p-4"
                    >
                        <div className="font-bold text-primary text-lg">
                           {index + 1}
                        </div>
                        <div className="flex-1">
                            <Label htmlFor={`tier-name-${tier.id}`}>Tier Name</Label>
                            <Input
                                id={`tier-name-${tier.id}`}
                                value={tier.name}
                                onChange={(e) => handleTierNameChange(tier.id, e.target.value)}
                                placeholder={`e.g., ${tier.name}`}
                            />
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeTier(tier.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-5 w-5" />
                        </Button>
                    </motion.div>
                ))}
            </AnimatePresence>
            
            {tiers.length < 6 && (
                 <Button variant="outline" onClick={addTier} className="w-full border-dashed">
                    <PlusCircle className="mr-2" /> Add Tier
                </Button>
            )}
        </CardContent>
        <CardFooter className="border-t pt-6 flex justify-end">
            <Button variant="gradient" size="lg">
                <Save className="mr-2" /> Save Hierarchy
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
