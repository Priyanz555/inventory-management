'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface AutoProcessRun {
  runDateTime: string;
  trigger: 'Nightly' | 'Manual';
  ordersProcessed: number;
  success: number;
  failed: number;
  notes: string;
}

export default function AutoProcessLogPage() {
  const [runs, setRuns] = useState<AutoProcessRun[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  useEffect(() => {
    fetchAutoProcessLog();
  }, [currentPage, pageSize]);

  const fetchAutoProcessLog = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
      });

      const response = await fetch(`/api/orders/auto-process/log?${params}`);
      if (response.ok) {
        const data = await response.json();
        setRuns(data);
      }
    } catch (error) {
      console.error('Error fetching auto-process log:', error);
    } finally {
      setLoading(false);
    }
  };

  const runManualProcess = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/orders/auto-process/run', {
        method: 'POST',
      });

      if (response.ok) {
        fetchAutoProcessLog(); // Refresh the log
      }
    } catch (error) {
      console.error('Error running manual process:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Auto-Process Job History</h1>
        <Button onClick={runManualProcess} disabled={loading}>
          Run Manual Process
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Auto-Process Job History</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p>Loading auto-process log...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border p-2 text-left">Run Date-Time</th>
                    <th className="border p-2 text-left">Trigger</th>
                    <th className="border p-2 text-left">Orders Processed</th>
                    <th className="border p-2 text-left">Success</th>
                    <th className="border p-2 text-left">Failed</th>
                    <th className="border p-2 text-left">Notes (Error Code)</th>
                  </tr>
                </thead>
                <tbody>
                  {runs.map((run, index) => (
                    <tr key={index}>
                      <td className="border p-2">{run.runDateTime}</td>
                      <td className="border p-2">
                        <span className={`px-2 py-1 rounded text-sm ${
                          run.trigger === 'Nightly' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {run.trigger}
                        </span>
                      </td>
                      <td className="border p-2">{run.ordersProcessed}</td>
                      <td className="border p-2 text-green-600 font-medium">{run.success}</td>
                      <td className="border p-2 text-red-600 font-medium">{run.failed}</td>
                      <td className="border p-2 text-sm">{run.notes || '-'}</td>
                    </tr>
                  ))}
                  {runs.length === 0 && (
                    <tr>
                      <td colSpan={6} className="border p-4 text-center text-gray-500">
                        No auto-process runs found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

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
      </div>
    </div>
  );
} 