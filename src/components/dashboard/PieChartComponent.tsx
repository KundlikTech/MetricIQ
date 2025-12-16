import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';

interface DataPoint {
  name: string;
  value: number;
  color: string;
}

interface PieChartComponentProps {
  data: DataPoint[];
  innerRadius?: number;
  outerRadius?: number;
  showLabels?: boolean;
}

const PieChartComponent: React.FC<PieChartComponentProps> = ({
  data,
  innerRadius = 60,
  outerRadius = 100,
  showLabels = false
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
        fontWeight={600}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={showLabels ? renderCustomizedLabel : undefined}
          outerRadius={outerRadius}
          innerRadius={innerRadius}
          fill="#8884d8"
          dataKey="value"
          animationDuration={1000}
          animationBegin={0}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
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
        <Legend
          verticalAlign="bottom"
          height={36}
          formatter={(value) => (
            <span style={{ color: isDark ? 'hsl(213 31% 91%)' : 'hsl(222 47% 11%)' }}>
              {value}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartComponent;
