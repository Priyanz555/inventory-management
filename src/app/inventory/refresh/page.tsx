'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface RefreshRun {
  timestamp: string;
  user: string;
  status: 'Success' | 'Error';
  message: string;
}

export default function RefreshInventoryPage() {
  const [runs, setRuns] = useState<RefreshRun[]>([]);
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchRefreshLog();
  }, []);

  const fetchRefreshLog = async () => {
    try {
      const response = await fetch('/api/inventory/refresh/log');
      if (response.ok) {
        const data = await response.json();
        setRuns(data);
      }
    } catch (error) {
      console.error('Error fetching refresh log:', error);
    }
  };

  const runRefresh = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/inventory/refresh/run', {
        method: 'POST',
      });

      if (response.ok) {
        const result = await response.json();
        setMessage(result.status === 'Success' ? 'Inventory refresh completed successfully' : `Error: ${result.message}`);
        fetchRefreshLog(); // Refresh the log
      } else {
        setMessage('Error running inventory refresh');
      }
    } catch (error) {
      setMessage('Error running inventory refresh');
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Refresh Inventory Tool</h1>
      
      {message && (
        <div className={`p-4 mb-4 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-blue-800">
              Recalculate inventory balances to sync all movements.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Formula</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-lg font-mono bg-gray-50 p-4 rounded">
            Opening Stock + Receipts – Issues = Closing Stock
          </div>
        </CardContent>
      </Card>

      <div className="text-center mb-8">
        <Button 
          onClick={() => setShowConfirmModal(true)}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
        >
          {loading ? 'Refreshing...' : 'Refresh Inventory'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Last 10 Refresh Runs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border p-2 text-left">Timestamp</th>
                  <th className="border p-2 text-left">User</th>
                  <th className="border p-2 text-left">Status</th>
                  <th className="border p-2 text-left">Error Message</th>
                </tr>
              </thead>
              <tbody>
                {runs.map((run, index) => (
                  <tr key={index}>
                    <td className="border p-2">{run.timestamp}</td>
                    <td className="border p-2">{run.user}</td>
                    <td className="border p-2">
                      <span className={`px-2 py-1 rounded text-sm ${
                        run.status === 'Success' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {run.status}
                      </span>
                    </td>
                    <td className="border p-2 text-sm">{run.message || '-'}</td>
                  </tr>
                ))}
                {runs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="border p-4 text-center text-gray-500">
                      No refresh runs found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Refresh</h3>
            <p className="text-gray-600 mb-6">
              This will recalculate all inventory balances. Proceed?
            </p>
            <div className="flex justify-end gap-3">
              <Button 
                onClick={() => setShowConfirmModal(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button 
                onClick={runRefresh}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 