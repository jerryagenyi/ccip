
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
import { Card, CardContent } from "@/components/ui/card";

export default function ReportFilters() {
    return (
        <Card>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="report-type">Report Type</Label>
                        <Select defaultValue="overview">
                            <SelectTrigger id="report-type" className="h-12">
                                <SelectValue placeholder="Select Report Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="overview">Overview Report</SelectItem>
                                <SelectItem value="performance">Performance Analysis</SelectItem>
                                <SelectItem value="financial">Financial Summary</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="date-range">Date Range</Label>
                        <Select defaultValue="this-month">
                            <SelectTrigger id="date-range" className="h-12">
                                <SelectValue placeholder="Select Date Range" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="this-week">This Week</SelectItem>
                                <SelectItem value="this-month">This Month</SelectItem>
                                <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                                <SelectItem value="this-year">This Year</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Select defaultValue="all">
                            <SelectTrigger id="location" className="h-12">
                                <SelectValue placeholder="Select Location" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Locations</SelectItem>
                                <SelectItem value="lagos">Lagos</SelectItem>
                                <SelectItem value="kano">Kano</SelectItem>
                                <SelectItem value="abuja">FCT Abuja</SelectItem>
                                <SelectItem value="rivers">Rivers</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
