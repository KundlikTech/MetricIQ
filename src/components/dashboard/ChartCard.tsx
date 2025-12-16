import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Download, Maximize2 } from 'lucide-react';

interface ChartCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onExport?: () => void;
  onExpand?: () => void;
  actions?: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  children,
  className,
  onExport,
  onExpand,
  actions,
  ...props
}) => {
  return (
    <div
      className={cn(
        'rounded-xl border bg-card p-6 card-hover',
        className
      )}
      {...props}
    >
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {actions}
          {onExport && (
            <Button variant="ghost" size="icon" onClick={onExport} className="h-8 w-8">
              <Download className="h-4 w-4" />
            </Button>
          )}
          {onExpand && (
            <Button variant="ghost" size="icon" onClick={onExpand} className="h-8 w-8">
              <Maximize2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <div className="h-[300px]">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
