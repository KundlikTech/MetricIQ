import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';

interface BarChartComponentProps {
  data: Record<string, any>[];
  bars: {
    dataKey: string;
    color: string;
    name?: string;
  }[];
  xAxisKey?: string;
  stacked?: boolean;
}

const BarChartComponent: React.FC<BarChartComponentProps> = ({
  data,
  bars,
  xAxisKey = 'name',
  stacked = false
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={isDark ? 'hsl(223 47% 15%)' : 'hsl(220 13% 91%)'}
          vertical={false}
        />
        <XAxis
          dataKey={xAxisKey}
          stroke={isDark ? 'hsl(215 20% 65%)' : 'hsl(220 9% 46%)'}
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke={isDark ? 'hsl(215 20% 65%)' : 'hsl(220 9% 46%)'}
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? 'hsl(224 71% 6%)' : 'hsl(0 0% 100%)',
            border: `1px solid ${isDark ? 'hsl(223 47% 15%)' : 'hsl(220 13% 91%)'}`,
            borderRadius: '8px',
            boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.2)',
          }}
          labelStyle={{
            color: isDark ? 'hsl(213 31% 91%)' : 'hsl(222 47% 11%)',
            fontWeight: 600,
          }}
          cursor={{ fill: isDark ? 'hsl(223 47% 11% / 0.5)' : 'hsl(220 14% 96% / 0.5)' }}
        />
        <Legend />
        {bars.map((bar, index) => (
          <Bar
            key={bar.dataKey}
            dataKey={bar.dataKey}
            name={bar.name || bar.dataKey}
            fill={bar.color}
            radius={[4, 4, 0, 0]}
            stackId={stacked ? 'stack' : undefined}
            animationDuration={1000}
            animationBegin={index * 200}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;
