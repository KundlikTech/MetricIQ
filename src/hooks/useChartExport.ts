import { useCallback } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useToast } from '@/hooks/use-toast';

export const useChartExport = () => {
  const { toast } = useToast();

  const exportToPNG = useCallback(async (elementRef: HTMLElement | null, filename: string = 'chart') => {
    if (!elementRef) {
      toast({
        title: 'Export failed',
        description: 'Chart element not found',
        variant: 'destructive',
      });
      return;
    }

    try {
      const canvas = await html2canvas(elementRef, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      });

      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      toast({
        title: 'Export successful',
        description: `Chart saved as ${filename}.png`,
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Failed to export chart as PNG',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const exportToPDF = useCallback(async (elementRef: HTMLElement | null, filename: string = 'chart') => {
    if (!elementRef) {
      toast({
        title: 'Export failed',
        description: 'Chart element not found',
        variant: 'destructive',
      });
      return;
    }

    try {
      const canvas = await html2canvas(elementRef, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${filename}.pdf`);

      toast({
        title: 'Export successful',
        description: `Chart saved as ${filename}.pdf`,
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Failed to export chart as PDF',
        variant: 'destructive',
      });
    }
  }, [toast]);

  return { exportToPNG, exportToPDF };
};
