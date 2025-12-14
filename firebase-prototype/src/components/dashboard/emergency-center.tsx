
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmergencyCenter() {
  return (
    <Card className="bg-red-600 text-white">
      <CardHeader>
        <div className="flex items-center gap-4">
            <AlertTriangle className="h-12 w-12" />
            <div>
                <CardTitle>Active Emergency Alert</CardTitle>
                <CardDescription className="text-red-200">Immediate response required.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>Cholera outbreak reported in Kano State. Immediate response required.</p>
        <div className="flex flex-wrap gap-4">
            <Button variant="outline" className="bg-white text-red-600 border-white hover:bg-white/90 hover:text-red-600">Create Response Activity</Button>
            <Button variant="outline" className="text-white border-white/50 hover:bg-white/10 hover:text-white">View Details</Button>
        </div>
      </CardContent>
    </Card>
  );
}
