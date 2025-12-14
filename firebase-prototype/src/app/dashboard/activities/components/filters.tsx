
'use client';

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockActivities } from "@/lib/data";
import { DateRangePicker } from "./date-range-picker";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ActivityFilters() {
    const organizations = [...new Set(mockActivities.map(a => a.organization))];
    const statuses = [...new Set(mockActivities.map(a => a.status))];
    const types = [...new Set(mockActivities.map(a => a.type))];

    return (
        <div className="flex h-full flex-col">
            <ScrollArea className="flex-1">
                <div className="space-y-6 p-6">
                    <div className="space-y-2">
                        <Label>Date Range</Label>
                        <DateRangePicker className="w-full" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select>
                            <SelectTrigger id="status" className="h-12">
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                {statuses.map(status => (
                                    <SelectItem key={status} value={status}>{status}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="type">Campaign Type</Label>
                        <Select>
                            <SelectTrigger id="type" className="h-12">
                                <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent>
                                {types.map(type => (
                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="organization">Organization</Label>
                        <Select>
                            <SelectTrigger id="organization" className="h-12">
                                <SelectValue placeholder="All Organizations" />
                            </SelectTrigger>
                            <SelectContent>
                                {organizations.map(org => (
                                    <SelectItem key={org} value={org}>{org}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </ScrollArea>
            <div className="flex gap-4 border-t p-4">
                <Button variant="outline" className="w-full">Reset</Button>
                <Button variant="gradient" className="w-full">Apply Filters</Button>
            </div>
        </div>
    );
}
