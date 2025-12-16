import React, { useState, useMemo } from 'react';
import CSVUploader from '@/components/dashboard/CSVUploader';
import DataTable from '@/components/dashboard/DataTable';
import ExportableChartCard from '@/components/dashboard/ExportableChartCard';
import BarChartComponent from '@/components/dashboard/BarChartComponent';
import LineChartComponent from '@/components/dashboard/LineChartComponent';
import { Button } from '@/components/ui/button';
import { Download, Trash2, Table, BarChart3 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const DataPage: React.FC = () => {
  const [uploadedData, setUploadedData] = useState<Record<string, any>[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedXAxis, setSelectedXAxis] = useState<string>('');
  const [selectedYAxis, setSelectedYAxis] = useState<string[]>([]);
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

  const handleDataParsed = (data: Record<string, any>[], cols: string[]) => {
    setUploadedData(data);
    setColumns(cols);
    if (cols.length > 0) {
      setSelectedXAxis(cols[0]);
    }
    if (cols.length > 1) {
      const numericCols = cols.filter((col) => 
        data.length > 0 && typeof data[0][col] === 'number'
      );
      if (numericCols.length > 0) {
        setSelectedYAxis([numericCols[0]]);
      }
    }
  };

  const handleClearData = () => {
    setUploadedData([]);
    setColumns([]);
    setSelectedXAxis('');
    setSelectedYAxis([]);
  };

  const tableColumns = useMemo(() => {
    return columns.map((col) => ({
      key: col,
      label: col,
    }));
  }, [columns]);

  const numericColumns = useMemo(() => {
    if (uploadedData.length === 0) return [];
    return columns.filter((col) => typeof uploadedData[0][col] === 'number');
  }, [columns, uploadedData]);

  const chartData = useMemo(() => {
    if (!selectedXAxis || selectedYAxis.length === 0) return [];
    return uploadedData.map((row) => {
      const item: Record<string, any> = { name: String(row[selectedXAxis]) };
      selectedYAxis.forEach((col) => {
        item[col] = row[col];
      });
      return item;
    });
  }, [uploadedData, selectedXAxis, selectedYAxis]);

  const chartColors = [
    'hsl(243, 75%, 59%)',
    'hsl(173, 80%, 40%)',
    'hsl(38, 92%, 50%)',
    'hsl(280, 65%, 60%)',
    'hsl(0, 84%, 60%)',
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Data Management</h1>
          <p className="text-muted-foreground">
            Upload, view, and visualize your CSV data
          </p>
        </div>
        {uploadedData.length > 0 && (
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="gap-2"
              onClick={handleClearData}
            >
              <Trash2 className="h-4 w-4" />
              Clear Data
            </Button>
          </div>
        )}
      </div>

      {/* CSV Uploader */}
      <CSVUploader onDataParsed={handleDataParsed} />

      {/* Data Display */}
      {uploadedData.length > 0 && (
        <Tabs defaultValue="table" className="animate-slide-up">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
            <TabsList>
              <TabsTrigger value="table" className="gap-2">
                <Table className="h-4 w-4" />
                Table View
              </TabsTrigger>
              <TabsTrigger value="chart" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Chart View
              </TabsTrigger>
            </TabsList>

            <div className="text-sm text-muted-foreground">
              {uploadedData.length} rows × {columns.length} columns
            </div>
          </div>

          <TabsContent value="table">
            <DataTable columns={tableColumns} data={uploadedData} />
          </TabsContent>

          <TabsContent value="chart" className="space-y-4">
            {/* Chart Configuration */}
            <div className="flex flex-wrap items-center gap-4 rounded-lg border bg-card p-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">X-Axis:</span>
                <Select value={selectedXAxis} onValueChange={setSelectedXAxis}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {columns.map((col) => (
                      <SelectItem key={col} value={col}>
                        {col}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Y-Axis:</span>
                <Select
                  value={selectedYAxis[0] || ''}
                  onValueChange={(value) => setSelectedYAxis([value])}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent>
                    {numericColumns.map((col) => (
                      <SelectItem key={col} value={col}>
                        {col}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Chart Type:</span>
                <Select
                  value={chartType}
                  onValueChange={(value: 'bar' | 'line') => setChartType(value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bar">Bar Chart</SelectItem>
                    <SelectItem value="line">Line Chart</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Chart Display */}
            {selectedXAxis && selectedYAxis.length > 0 && (
              <ExportableChartCard
                title="Data Visualization"
                subtitle={`${selectedYAxis.join(', ')} by ${selectedXAxis}`}
                exportFilename="csv-data-chart"
              >
                {chartType === 'bar' ? (
                  <BarChartComponent
                    data={chartData}
                    bars={selectedYAxis.map((col, index) => ({
                      dataKey: col,
                      color: chartColors[index % chartColors.length],
                      name: col,
                    }))}
                  />
                ) : (
                  <LineChartComponent
                    data={chartData}
                    lines={selectedYAxis.map((col, index) => ({
                      dataKey: col,
                      color: chartColors[index % chartColors.length],
                      name: col,
                    }))}
                  />
                )}
              </ExportableChartCard>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Empty State */}
      {uploadedData.length === 0 && (
        <div className="rounded-xl border border-dashed bg-muted/50 p-12 text-center animate-slide-up">
          <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No data uploaded</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
            Upload a CSV file to view your data in a table format and create beautiful visualizations.
          </p>
        </div>
      )}
    </div>
  );
};

export default DataPage;
