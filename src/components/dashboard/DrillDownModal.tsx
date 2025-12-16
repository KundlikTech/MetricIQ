import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import DataTable from './DataTable';

interface DrillDownData {
  label: string;
  value: number;
  change?: number;
  details?: Record<string, any>[];
  breakdown?: { name: string; value: number }[];
}

interface DrillDownModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: DrillDownData | null;
  title?: string;
}

const DrillDownModal: React.FC<DrillDownModalProps> = ({
  isOpen,
  onClose,
  data,
  title = 'Detailed View',
}) => {
  if (!data) return null;

  const isPositive = data.change !== undefined && data.change > 0;
  const isNegative = data.change !== undefined && data.change < 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {title}
            <Badge variant="secondary">{data.label}</Badge>
          </DialogTitle>
          <DialogDescription>
            Detailed breakdown and analysis
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {/* Summary Card */}
          <div className="rounded-lg bg-muted/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{data.label}</p>
                <p className="text-4xl font-bold mt-1">
                  {typeof data.value === 'number' 
                    ? data.value.toLocaleString() 
                    : data.value}
                </p>
              </div>
              {data.change !== undefined && (
                <div
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 ${
                    isPositive
                      ? 'bg-green-500/10 text-green-600'
                      : isNegative
                      ? 'bg-red-500/10 text-red-600'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isPositive && <TrendingUp className="h-5 w-5" />}
                  {isNegative && <TrendingDown className="h-5 w-5" />}
                  {!isPositive && !isNegative && <Minus className="h-5 w-5" />}
                  <span className="text-lg font-semibold">
                    {isPositive && '+'}
                    {data.change}%
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Breakdown */}
          {data.breakdown && data.breakdown.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Breakdown</h4>
              <div className="space-y-2">
                {data.breakdown.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg bg-muted/30 p-3"
                  >
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="font-semibold">
                      {item.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Data Table */}
          {data.details && data.details.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Detailed Data</h4>
              <DataTable
                columns={Object.keys(data.details[0]).map((key) => ({
                  key,
                  label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
                }))}
                data={data.details}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DrillDownModal;
