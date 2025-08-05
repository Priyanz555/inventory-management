'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface InventoryReportItem {
  sku: string;
  batch: string;
  openingQtyCS: number;
  openingQtyEA: number;
  inwardCS: number;
  inwardEA: number;
  outwardCS: number;
  outwardEA: number;
  adjustmentsCS: number;
  adjustmentsEA: number;
  closingQtyCS: number;
  closingQtyEA: number;
}

export default function InventoryReportPage() {
  const [filters, setFilters] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    sku: '',
    batch: '',
  });

  const [reportData, setReportData] = useState<InventoryReportItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchReportData();
  }, [filters, currentPage, pageSize]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        startDate: filters.startDate,
        endDate: filters.endDate,
        sku: filters.sku,
        batch: filters.batch,
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
      });

      const response = await fetch(`/api/reports/inventory?${params}`);
      if (response.ok) {
        const data = await response.json();
        setReportData(data.items);
        setTotalItems(data.total);
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    setCurrentPage(1);
    fetchReportData();
  };

  const resetFilters = () => {
    setFilters({
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      sku: '',
      batch: '',
    });
    setCurrentPage(1);
  };

  const exportCSV = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        startDate: filters.startDate,
        endDate: filters.endDate,
        sku: filters.sku,
        batch: filters.batch,
      });

      const response = await fetch(`/api/reports/inventory/export?${params}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `inventory_report_${filters.startDate}_${filters.endDate}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error exporting CSV:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Inventory Report</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="sku">SKU Code</Label>
              <Input
                id="sku"
                value={filters.sku}
                onChange={(e) => setFilters(prev => ({ ...prev, sku: e.target.value }))}
                placeholder="Optional"
              />
            </div>
            <div>
              <Label htmlFor="batch">Batch</Label>
              <Input
                id="batch"
                value={filters.batch}
                onChange={(e) => setFilters(prev => ({ ...prev, batch: e.target.value }))}
                placeholder="Optional"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={applyFilters} disabled={loading} variant="jiomart">
              Apply Filters
            </Button>
            <Button onClick={resetFilters} variant="outline">
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="text-sm text-gray-600">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalItems)} of {totalItems} items
          </span>
        </div>
        <Button onClick={exportCSV} disabled={loading} variant="jiomart">
          Export CSV (Full Result)
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Movement Report</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p>Loading report data...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border p-2 text-left">SKU</th>
                    <th className="border p-2 text-left">Batch</th>
                    <th className="border p-2 text-left">Opening Qty (CS/EA)</th>
                    <th className="border p-2 text-left">Inward (CS/EA)</th>
                    <th className="border p-2 text-left">Outward (CS/EA)</th>
                    <th className="border p-2 text-left">Adjustments (CS/EA)</th>
                    <th className="border p-2 text-left">Closing Qty (CS/EA)</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((item, index) => (
                    <tr key={index}>
                      <td className="border p-2">{item.sku}</td>
                      <td className="border p-2">{item.batch || '—'}</td>
                      <td className="border p-2">{item.openingQtyCS}/{item.openingQtyEA}</td>
                      <td className="border p-2">{item.inwardCS}/{item.inwardEA}</td>
                      <td className="border p-2">{item.outwardCS}/{item.outwardEA}</td>
                      <td className="border p-2">{item.adjustmentsCS}/{item.adjustmentsEA}</td>
                      <td className="border p-2">{item.closingQtyCS}/{item.closingQtyEA}</td>
                    </tr>
                  ))}
                  {reportData.length === 0 && (
                    <tr>
                      <td colSpan={7} className="border p-4 text-center text-gray-500">
                        No data found for the selected filters
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="pageSize">Page Size:</Label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={(e) => setPageSize(parseInt(e.target.value))}
              className="border rounded p-1"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
            >
              Previous
            </Button>
            <span className="px-3 py-1 text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 