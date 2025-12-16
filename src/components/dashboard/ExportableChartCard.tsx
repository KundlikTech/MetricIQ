import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Download, Maximize2, Image, FileText, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useChartExport } from '@/hooks/useChartExport';

interface ExportableChartCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  exportFilename?: string;
  actions?: React.ReactNode;
  expandedContent?: React.ReactNode;
}

const ExportableChartCard: React.FC<ExportableChartCardProps> = ({
  title,
  subtitle,
  children,
  className,
  exportFilename = 'chart',
  actions,
  expandedContent,
  ...props
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const { exportToPNG, exportToPDF } = useChartExport();

  return (
    <>
      <div
        className={cn('rounded-xl border bg-card p-6 card-hover', className)}
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Download className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => exportToPNG(chartRef.current, exportFilename)}>
                  <Image className="mr-2 h-4 w-4" />
                  Export as PNG
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportToPDF(chartRef.current, exportFilename)}>
                  <FileText className="mr-2 h-4 w-4" />
                  Export as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {expandedContent && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsExpanded(true)}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div ref={chartRef} className="h-[300px]">
          {children}
        </div>
      </div>

      {/* Expanded View Dialog */}
      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {expandedContent || children}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExportableChartCard;
