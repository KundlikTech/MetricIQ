import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';

interface LineChartComponentProps {
  data: Record<string, any>[];
  lines: {
    dataKey: string;
    color: string;
    name?: string;
  }[];
  xAxisKey?: string;
}

const LineChartComponent: React.FC<LineChartComponentProps> = ({
  data,
  lines,
  xAxisKey = 'name'
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={isDark ? 'hsl(223 47% 15%)' : 'hsl(220 13% 91%)'}
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
        />
        <Legend />
        {lines.map((line, index) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            name={line.name || line.dataKey}
            stroke={line.color}
            strokeWidth={2}
            dot={{ fill: line.color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
            animationDuration={1000}
            animationBegin={index * 200}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;
