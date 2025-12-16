import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'destructive';
  className?: string;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  changeLabel = 'vs last period',
  icon,
  variant = 'default',
  className
}) => {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;
  const isNeutral = change === 0 || change === undefined;

  const variantStyles = {
    default: 'bg-card',
    primary: 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20',
    success: 'bg-gradient-to-br from-success/10 to-success/5 border-success/20',
    warning: 'bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20',
    destructive: 'bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20',
  };

  const iconStyles = {
    default: 'bg-muted text-muted-foreground',
    primary: 'bg-primary/20 text-primary',
    success: 'bg-success/20 text-success',
    warning: 'bg-warning/20 text-warning',
    destructive: 'bg-destructive/20 text-destructive',
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border p-6 card-hover',
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          
          {change !== undefined && (
            <div className="flex items-center gap-1.5 text-sm">
              <span
                className={cn(
                  'flex items-center gap-0.5 font-medium',
                  isPositive && 'text-success',
                  isNegative && 'text-destructive',
                  isNeutral && 'text-muted-foreground'
                )}
              >
                {isPositive && <TrendingUp className="h-4 w-4" />}
                {isNegative && <TrendingDown className="h-4 w-4" />}
                {isNeutral && <Minus className="h-4 w-4" />}
                {isPositive && '+'}
                {change}%
              </span>
              <span className="text-muted-foreground">{changeLabel}</span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className={cn('rounded-lg p-3', iconStyles[variant])}>
            {icon}
          </div>
        )}
      </div>

      {/* Decorative gradient */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-primary/10 to-transparent blur-2xl" />
    </div>
  );
};

export default KPICard;
