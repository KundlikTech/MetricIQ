import React, { useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CSVUploaderProps {
  onDataParsed: (data: Record<string, any>[], columns: string[]) => void;
  className?: string;
}

const CSVUploader: React.FC<CSVUploaderProps> = ({ onDataParsed, className }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const { toast } = useToast();

  const parseCSV = (text: string): { data: Record<string, any>[]; columns: string[] } => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV must have at least a header and one data row');
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data = lines.slice(1).map((line, index) => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      if (values.length !== headers.length) {
        throw new Error(`Row ${index + 2} has ${values.length} columns, expected ${headers.length}`);
      }
      const row: Record<string, any> = {};
      headers.forEach((header, i) => {
        const value = values[i];
        // Try to parse as number
        const num = parseFloat(value);
        row[header] = isNaN(num) ? value : num;
      });
      return row;
    });

    return { data, columns: headers };
  };

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a CSV file',
        variant: 'destructive',
      });
      return;
    }

    setFile(file);
    setIsProcessing(true);
    setParseError(null);

    try {
      const text = await file.text();
      const { data, columns } = parseCSV(text);
      onDataParsed(data, columns);
      toast({
        title: 'CSV uploaded successfully',
        description: `Parsed ${data.length} rows with ${columns.length} columns`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to parse CSV';
      setParseError(errorMessage);
      toast({
        title: 'Parse error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  }, [onDataParsed, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFile(droppedFile);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFile(selectedFile);
    }
  }, [handleFile]);

  const clearFile = () => {
    setFile(null);
    setParseError(null);
  };

  return (
    <div className={cn('rounded-xl border bg-card p-6', className)}>
      <h3 className="mb-4 text-lg font-semibold">Upload CSV Data</h3>
      
      {!file ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            'flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors',
            isDragOver
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50'
          )}
        >
          <Upload className={cn('mb-4 h-10 w-10', isDragOver ? 'text-primary' : 'text-muted-foreground')} />
          <p className="mb-2 text-sm text-muted-foreground">
            Drag & drop your CSV file here, or
          </p>
          <label>
            <input
              type="file"
              accept=".csv"
              onChange={handleInputChange}
              className="hidden"
            />
            <Button variant="outline" size="sm" asChild>
              <span className="cursor-pointer">Browse Files</span>
            </Button>
          </label>
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'rounded-lg p-2',
              parseError ? 'bg-destructive/20 text-destructive' : 'bg-success/20 text-success'
            )}>
              {parseError ? <AlertCircle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
            </div>
            <div>
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {parseError || (isProcessing ? 'Processing...' : 'Parsed successfully')}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={clearFile}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default CSVUploader;
