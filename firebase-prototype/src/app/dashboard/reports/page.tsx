
'use client';

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import ReportFilters from "./components/report-filters";
import ActivityTrends from "./components/activity-trends";
import ActivityTypeDistribution from "./components/activity-type-distribution";
import StatusBreakdown from "./components/status-breakdown";
import GeographicDistribution from "./components/geographic-distribution";
import QuickReportTemplates from "./components/quick-report-templates";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { reportActivityTrendsMonth, reportActivityTypes, reportStatusBreakdown, reportGeographicDistribution } from "@/lib/data";

declare module 'jspdf' {
    interface jsPDF {
      autoTable: (options: any) => jsPDF;
    }
}

export default function ReportsPage() {

    const handleExport = () => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(22);
        doc.text("CCIP Analytics Report", 14, 20);
        doc.setFontSize(12);
        doc.setTextColor(150);
        doc.text(`Report generated on: ${new Date().toLocaleDateString()}`, 14, 28);
        doc.setTextColor(0);

        // Status Breakdown
        doc.setFontSize(18);
        doc.text("Status Breakdown", 14, 45);
        let statusText = reportStatusBreakdown.map(s => `${s.name}: ${s.count} (${s.description})`).join('  |  ');
        doc.setFontSize(10);
        doc.text(statusText, 14, 52);

        // Activity Trends
        doc.autoTable({
            startY: 62,
            head: [['Period', 'Campaigns']],
            body: reportActivityTrendsMonth.map(item => [item.period, item.activities]),
            didDrawPage: (data: any) => {
              doc.setFontSize(18);
              doc.text("Monthly Campaign Trends", 14, data.cursor.y - 10);
            }
        });

        // Activity Type Distribution
        doc.autoTable({
            head: [['Type', 'Count']],
            body: reportActivityTypes.map(item => [item.name, item.count]),
            didDrawPage: (data: any) => {
              doc.setFontSize(18);
              doc.text("Campaign Type Distribution", 14, data.cursor.y - 10);
            }
        });

        // Geographic Distribution
        doc.autoTable({
            head: [['Location', 'Campaign Count']],
            body: reportGeographicDistribution.map(item => [item.name, item.count]),
            didDrawPage: (data: any) => {
              doc.setFontSize(18);
              doc.text("Geographic Distribution", 14, data.cursor.y - 10);
            }
        });

        doc.save("CCIP-Report.pdf");
    }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground">
            Data-driven insights for your campaigns.
          </p>
        </div>
        <Button variant="gradient" onClick={handleExport}>
            <Download className="mr-2" />
            Export
        </Button>
      </div>

      <ReportFilters />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <ActivityTrends />
        </div>
        <div className="lg:col-span-2">
            <div className="flex flex-col gap-8">
                <ActivityTypeDistribution />
                <StatusBreakdown />
            </div>
        </div>
      </div>
      
      <GeographicDistribution />
      <QuickReportTemplates />

    </div>
  );
}
