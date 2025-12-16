import React, { useState, useMemo, useRef } from 'react';
import { subDays } from 'date-fns';
import {
  DollarSign,
  Users,
  TrendingUp,
  ShoppingCart,
  Activity,
  Download,
} from 'lucide-react';
import KPICard from '@/components/dashboard/KPICard';
import ExportableChartCard from '@/components/dashboard/ExportableChartCard';
import LineChartComponent from '@/components/dashboard/LineChartComponent';
import BarChartComponent from '@/components/dashboard/BarChartComponent';
import PieChartComponent from '@/components/dashboard/PieChartComponent';
import DateRangeFilter from '@/components/dashboard/DateRangeFilter';
import DrillDownModal from '@/components/dashboard/DrillDownModal';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { useChartExport } from '@/hooks/useChartExport';

// Mock data with more detail for drill-down
const revenueData = [
  { name: 'Jan', revenue: 4000, profit: 2400 },
  { name: 'Feb', revenue: 3000, profit: 1398 },
  { name: 'Mar', revenue: 2000, profit: 9800 },
  { name: 'Apr', revenue: 2780, profit: 3908 },
  { name: 'May', revenue: 1890, profit: 4800 },
  { name: 'Jun', revenue: 2390, profit: 3800 },
  { name: 'Jul', revenue: 3490, profit: 4300 },
  { name: 'Aug', revenue: 4200, profit: 5100 },
  { name: 'Sep', revenue: 5100, profit: 4900 },
  { name: 'Oct', revenue: 4800, profit: 5200 },
  { name: 'Nov', revenue: 5300, profit: 5800 },
  { name: 'Dec', revenue: 6100, profit: 6200 },
];

const salesByCategory = [
  { name: 'Electronics', sales: 4000, returns: 240 },
  { name: 'Clothing', sales: 3000, returns: 139 },
  { name: 'Food', sales: 2000, returns: 980 },
  { name: 'Books', sales: 2780, returns: 390 },
  { name: 'Home', sales: 1890, returns: 480 },
];

const trafficSources = [
  { name: 'Direct', value: 400, color: 'hsl(243, 75%, 59%)' },
  { name: 'Organic Search', value: 300, color: 'hsl(173, 80%, 40%)' },
  { name: 'Paid Ads', value: 200, color: 'hsl(38, 92%, 50%)' },
  { name: 'Social', value: 150, color: 'hsl(280, 65%, 60%)' },
  { name: 'Referral', value: 100, color: 'hsl(0, 84%, 60%)' },
];

interface DrillDownData {
  label: string;
  value: number;
  change?: number;
  details?: Record<string, any>[];
  breakdown?: { name: string; value: number }[];
}

const Dashboard: React.FC = () => {
  const { userRole } = useAuth();
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [drillDownData, setDrillDownData] = useState<DrillDownData | null>(null);
  const [isDrillDownOpen, setIsDrillDownOpen] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const { exportToPDF } = useChartExport();

  const roleLabel = useMemo(() => {
    switch (userRole) {
      case 'admin':
        return { label: 'Admin', variant: 'default' as const };
      case 'manager':
        return { label: 'Manager', variant: 'secondary' as const };
      default:
        return { label: 'Viewer', variant: 'outline' as const };
    }
  }, [userRole]);

  const handleChartClick = (data: any, chartType: string) => {
    if (!data || !data.activePayload?.[0]) return;

    const payload = data.activePayload[0].payload;
    
    let drillDown: DrillDownData;
    
    if (chartType === 'revenue') {
      drillDown = {
        label: payload.name,
        value: payload.revenue,
        change: Math.round((payload.revenue - 3500) / 35),
        breakdown: [
          { name: 'Revenue', value: payload.revenue },
          { name: 'Profit', value: payload.profit },
          { name: 'Expenses', value: payload.revenue - payload.profit },
        ],
        details: [
          { category: 'Product Sales', amount: payload.revenue * 0.7, growth: '+12%' },
          { category: 'Services', amount: payload.revenue * 0.2, growth: '+8%' },
          { category: 'Subscriptions', amount: payload.revenue * 0.1, growth: '+25%' },
        ],
      };
    } else {
      drillDown = {
        label: payload.name,
        value: payload.sales,
        change: Math.round((payload.sales - 2500) / 25),
        breakdown: [
          { name: 'Total Sales', value: payload.sales },
          { name: 'Returns', value: payload.returns },
          { name: 'Net Sales', value: payload.sales - payload.returns },
        ],
        details: [
          { product: 'Top Seller A', units: Math.round(payload.sales * 0.3), revenue: payload.sales * 0.35 },
          { product: 'Top Seller B', units: Math.round(payload.sales * 0.25), revenue: payload.sales * 0.28 },
          { product: 'Top Seller C', units: Math.round(payload.sales * 0.2), revenue: payload.sales * 0.22 },
        ],
      };
    }

    setDrillDownData(drillDown);
    setIsDrillDownOpen(true);
  };

  const handleExportDashboard = () => {
    if (dashboardRef.current) {
      exportToPDF(dashboardRef.current, 'dashboard-report');
    }
  };

  return (
    <div ref={dashboardRef} className="p-6 lg:p-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <Badge variant={roleLabel.variant}>{roleLabel.label}</Badge>
          </div>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your business.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangeFilter
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
          <Button variant="outline" size="sm" className="gap-2" onClick={handleExportDashboard}>
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Revenue"
          value="$45,231.89"
          change={20.1}
          icon={<DollarSign className="h-5 w-5" />}
          variant="primary"
        />
        <KPICard
          title="Active Users"
          value="2,350"
          change={15.2}
          icon={<Users className="h-5 w-5" />}
          variant="success"
        />
        <KPICard
          title="Conversion Rate"
          value="3.24%"
          change={-5.1}
          icon={<TrendingUp className="h-5 w-5" />}
          variant="warning"
        />
        <KPICard
          title="Total Orders"
          value="12,234"
          change={12.5}
          icon={<ShoppingCart className="h-5 w-5" />}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ExportableChartCard
          title="Revenue & Profit Trend"
          subtitle="Click on data points for detailed breakdown"
          exportFilename="revenue-trend"
          className="animate-slide-up"
        >
          <LineChartComponent
            data={revenueData}
            lines={[
              { dataKey: 'revenue', color: 'hsl(243, 75%, 59%)', name: 'Revenue' },
              { dataKey: 'profit', color: 'hsl(173, 80%, 40%)', name: 'Profit' },
            ]}
          />
        </ExportableChartCard>

        <ExportableChartCard
          title="Sales by Category"
          subtitle="Click on bars for category details"
          exportFilename="sales-by-category"
          className="animate-slide-up"
          style={{ animationDelay: '100ms' }}
        >
          <BarChartComponent
            data={salesByCategory}
            bars={[
              { dataKey: 'sales', color: 'hsl(243, 75%, 59%)', name: 'Sales' },
              { dataKey: 'returns', color: 'hsl(0, 84%, 60%)', name: 'Returns' },
            ]}
          />
        </ExportableChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-3">
        <ExportableChartCard
          title="Traffic Sources"
          subtitle="Where your visitors come from"
          exportFilename="traffic-sources"
          className="animate-slide-up lg:col-span-1"
          style={{ animationDelay: '200ms' }}
        >
          <PieChartComponent data={trafficSources} showLabels />
        </ExportableChartCard>

        <div className="lg:col-span-2 rounded-xl border bg-card p-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Live Activity</h3>
              <p className="text-sm text-muted-foreground">Real-time user activity</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm font-medium text-green-500">Live</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {[
              { action: 'New user signup', time: 'Just now', icon: Users },
              { action: 'Purchase completed - $299.00', time: '2 min ago', icon: ShoppingCart },
              { action: 'New review submitted', time: '5 min ago', icon: Activity },
              { action: 'Cart abandoned - $150.00', time: '8 min ago', icon: ShoppingCart },
              { action: 'New user signup', time: '12 min ago', icon: Users },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 rounded-lg bg-muted/50 p-3 transition-colors hover:bg-muted cursor-pointer"
                onClick={() => {
                  setDrillDownData({
                    label: item.action,
                    value: index === 1 ? 299 : index === 3 ? 150 : 1,
                    breakdown: [
                      { name: 'Event Type', value: 1 },
                      { name: 'User ID', value: Math.floor(Math.random() * 10000) },
                    ],
                  });
                  setIsDrillDownOpen(true);
                }}
              >
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <item.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.action}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Drill Down Modal */}
      <DrillDownModal
        isOpen={isDrillDownOpen}
        onClose={() => setIsDrillDownOpen(false)}
        data={drillDownData}
        title="Metric Details"
      />
    </div>
  );
};

export default Dashboard;
