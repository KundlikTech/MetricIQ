import React, { useState } from 'react';
import { subDays } from 'date-fns';
import ExportableChartCard from '@/components/dashboard/ExportableChartCard';
import LineChartComponent from '@/components/dashboard/LineChartComponent';
import BarChartComponent from '@/components/dashboard/BarChartComponent';
import PieChartComponent from '@/components/dashboard/PieChartComponent';
import DateRangeFilter from '@/components/dashboard/DateRangeFilter';
import DrillDownModal from '@/components/dashboard/DrillDownModal';
import { Button } from '@/components/ui/button';
import { Download, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Extended mock data for analytics
const userActivityData = [
  { name: 'Mon', active: 2400, new: 400, returning: 2000 },
  { name: 'Tue', active: 1398, new: 300, returning: 1098 },
  { name: 'Wed', active: 9800, new: 800, returning: 9000 },
  { name: 'Thu', active: 3908, new: 500, returning: 3408 },
  { name: 'Fri', active: 4800, new: 600, returning: 4200 },
  { name: 'Sat', active: 3800, new: 350, returning: 3450 },
  { name: 'Sun', active: 4300, new: 450, returning: 3850 },
];

const conversionData = [
  { name: 'Week 1', rate: 2.4 },
  { name: 'Week 2', rate: 2.8 },
  { name: 'Week 3', rate: 3.1 },
  { name: 'Week 4', rate: 2.9 },
  { name: 'Week 5', rate: 3.5 },
  { name: 'Week 6', rate: 3.2 },
  { name: 'Week 7', rate: 3.8 },
  { name: 'Week 8', rate: 4.1 },
];

const deviceData = [
  { name: 'Desktop', value: 45, color: 'hsl(243, 75%, 59%)' },
  { name: 'Mobile', value: 38, color: 'hsl(173, 80%, 40%)' },
  { name: 'Tablet', value: 17, color: 'hsl(38, 92%, 50%)' },
];

const countryData = [
  { name: 'United States', value: 35, color: 'hsl(243, 75%, 59%)' },
  { name: 'United Kingdom', value: 20, color: 'hsl(173, 80%, 40%)' },
  { name: 'Germany', value: 15, color: 'hsl(38, 92%, 50%)' },
  { name: 'France', value: 12, color: 'hsl(280, 65%, 60%)' },
  { name: 'Others', value: 18, color: 'hsl(0, 84%, 60%)' },
];

const pageViewsData = [
  { name: '/home', views: 12500, bounceRate: 35 },
  { name: '/products', views: 8200, bounceRate: 42 },
  { name: '/pricing', views: 5600, bounceRate: 28 },
  { name: '/about', views: 3400, bounceRate: 45 },
  { name: '/contact', views: 2100, bounceRate: 32 },
];

interface DrillDownData {
  label: string;
  value: number;
  change?: number;
  details?: Record<string, any>[];
  breakdown?: { name: string; value: number }[];
}

const Analytics: React.FC = () => {
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [metricType, setMetricType] = useState('all');
  const [drillDownData, setDrillDownData] = useState<DrillDownData | null>(null);
  const [isDrillDownOpen, setIsDrillDownOpen] = useState(false);

  return (
    <div className="p-6 lg:p-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Detailed insights and performance metrics
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Select value={metricType} onValueChange={setMetricType}>
            <SelectTrigger className="w-40">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter metrics" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Metrics</SelectItem>
              <SelectItem value="traffic">Traffic</SelectItem>
              <SelectItem value="conversions">Conversions</SelectItem>
              <SelectItem value="engagement">Engagement</SelectItem>
            </SelectContent>
          </Select>
          <DateRangeFilter
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* User Activity */}
      <ExportableChartCard
        title="User Activity"
        subtitle="Daily active, new, and returning users"
        exportFilename="user-activity"
        className="animate-slide-up"
      >
        <BarChartComponent
          data={userActivityData}
          bars={[
            { dataKey: 'active', color: 'hsl(243, 75%, 59%)', name: 'Active Users' },
            { dataKey: 'new', color: 'hsl(173, 80%, 40%)', name: 'New Users' },
            { dataKey: 'returning', color: 'hsl(38, 92%, 50%)', name: 'Returning' },
          ]}
        />
      </ExportableChartCard>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ExportableChartCard
          title="Conversion Rate Trend"
          subtitle="Weekly conversion rate percentage"
          exportFilename="conversion-trend"
          className="animate-slide-up"
        >
          <LineChartComponent
            data={conversionData}
            lines={[
              { dataKey: 'rate', color: 'hsl(173, 80%, 40%)', name: 'Conversion Rate %' },
            ]}
          />
        </ExportableChartCard>

        <ExportableChartCard
          title="Page Views"
          subtitle="Most visited pages"
          exportFilename="page-views"
          className="animate-slide-up"
        >
          <BarChartComponent
            data={pageViewsData}
            bars={[
              { dataKey: 'views', color: 'hsl(243, 75%, 59%)', name: 'Views' },
            ]}
          />
        </ExportableChartCard>

        <ExportableChartCard
          title="Device Distribution"
          subtitle="User sessions by device type"
          exportFilename="device-distribution"
          className="animate-slide-up"
        >
          <PieChartComponent data={deviceData} showLabels />
        </ExportableChartCard>

        <ExportableChartCard
          title="Geographic Distribution"
          subtitle="Users by country"
          exportFilename="geo-distribution"
          className="animate-slide-up"
        >
          <PieChartComponent data={countryData} showLabels />
        </ExportableChartCard>
      </div>

      {/* Detailed Stats */}
      <div className="rounded-xl border bg-card p-6 animate-slide-up">
        <h3 className="text-lg font-semibold mb-4">Key Performance Indicators</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Avg. Session Duration', value: '4m 32s', change: '+12%', numValue: 272 },
            { label: 'Pages per Session', value: '3.8', change: '+5%', numValue: 3.8 },
            { label: 'Bounce Rate', value: '38.2%', change: '-8%', numValue: 38.2 },
            { label: 'Goal Completion Rate', value: '24.5%', change: '+15%', numValue: 24.5 },
          ].map((stat, index) => (
            <div
              key={index}
              className="rounded-lg bg-muted/50 p-4 transition-colors hover:bg-muted cursor-pointer"
              onClick={() => {
                setDrillDownData({
                  label: stat.label,
                  value: stat.numValue,
                  change: parseInt(stat.change),
                  breakdown: [
                    { name: 'Current Period', value: stat.numValue },
                    { name: 'Previous Period', value: stat.numValue * 0.9 },
                  ],
                });
                setIsDrillDownOpen(true);
              }}
            >
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
              <p className={`text-sm mt-1 ${
                stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change} vs last period
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Drill Down Modal */}
      <DrillDownModal
        isOpen={isDrillDownOpen}
        onClose={() => setIsDrillDownOpen(false)}
        data={drillDownData}
        title="KPI Details"
      />
    </div>
  );
};

export default Analytics;
