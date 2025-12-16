
'use client';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Map } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const activityHotspots = [
  { name: 'Lagos', activities: 342, position: 'top-[55%] left-[24%]' },
  { name: 'Kano', activities: 218, position: 'top-[35%] left-[34%]' },
  { name: 'Abuja FCT', activities: 98, position: 'top-[44%] left-[30%]' },
  { name: 'Port Harcourt', activities: 156, position: 'top-[60%] left-[30%]' },
  { name: 'Ibadan', activities: 87, position: 'top-[50%] left-[22%]' },
];

export default function MapCard() {
  const mapImage = PlaceHolderImages.find((p) => p.id === 'map');

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Live Activity Heatmap</CardTitle>
        <CardDescription>Real-time overview of activities from all organizations.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
          {mapImage && (
            <Image
              src={mapImage.imageUrl}
              alt={mapImage.description}
              fill
              className="object-cover"
              data-ai-hint={mapImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-accent/30 mix-blend-multiply" />
          
          {activityHotspots.map((spot) => (
            <Tooltip key={spot.name}>
              <TooltipTrigger asChild>
                <div className={cn("absolute w-3 h-3 rounded-full bg-white shadow-2xl", spot.position)}>
                  <div className="absolute inset-0 w-3 h-3 rounded-full bg-white animate-ping"></div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-bold">{spot.name}</p>
                <p>{spot.activities} activities</p>
              </TooltipContent>
            </Tooltip>
          ))}

          <div className="absolute top-4 right-4 flex items-center gap-2 rounded-full bg-background/80 px-3 py-1 text-xs font-semibold">
            <Map className="h-4 w-4 text-primary" />
            <span>National View</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
