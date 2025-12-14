

"use client"

import { Bar, BarChart, CartesianGrid, Legend, Pie, PieChart, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { performanceChartData, activityTypeChartData } from "@/lib/data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const chartConfig = {
  created: {
    label: "Created",
    color: "hsl(var(--primary))",
  },
  completed: {
    label: "Completed",
    color: "hsl(var(--accent))",
  },
}

export default function PerformanceCharts() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Performance Trends</CardTitle>
        <CardDescription>An overview of campaign creation and completion over time.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="types">By Type</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <BarChart accessibilityLayer data={performanceChartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Legend content={<ChartLegendContent />} />
                <Bar dataKey="created" fill="var(--color-created)" radius={4} barSize={20} />
                <Bar dataKey="completed" fill="var(--color-completed)" radius={4} barSize={20} />
              </BarChart>
            </ChartContainer>
          </TabsContent>
          <TabsContent value="types">
            <ChartContainer config={{}} className="h-[250px] w-full">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                  <Pie data={activityTypeChartData} dataKey="value" nameKey="name" />
                   <Legend content={<ChartLegendContent />} />
                </PieChart>
              </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
