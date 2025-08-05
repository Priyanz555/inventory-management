'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface CycleCountAudit {
  id: string;
  timestamp: string;
  user: string;
  fileName: string;
  varianceSKUs: number;
  totalAdjQtyCS: number;
  status: 'Completed' | 'Failed';
  details?: CycleCountLine[];
}

interface CycleCountLine {
  sku: string;
  systemQtyCS: number;
  systemQtyEA: number;
  physicalQtyCS: number;
  physicalQtyEA: number;
  varianceCS: number;
  varianceEA: number;
  adjustmentType: 'Gain' | 'Loss';
}

export default function CycleCountAuditPage() {
  const [audits, setAudits] = useState<CycleCountAudit[]>([]);
  const [selectedAudit, setSelectedAudit] = useState<CycleCountAudit | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAuditList();
  }, []);

  const fetchAuditList = async () => {
    try {
      const response = await fetch('/api/cycle-count/audit');
      if (response.ok) {
        const data = await response.json();
        setAudits(data);
      }
    } catch (error) {
      console.error('Error fetching audit list:', error);
    }
  };

  const viewDetails = async (auditId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/cycle-count/audit/${auditId}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedAudit(data);
        setShowDetails(true);
      }
    } catch (error) {
      console.error('Error fetching audit details:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Cycle Count Audit Trail</h1>

      <Card>
        <CardHeader>
          <CardTitle>Cycle Count History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border p-2 text-left">Timestamp</th>
                  <th className="border p-2 text-left">User</th>
                  <th className="border p-2 text-left">File</th>
                  <th className="border p-2 text-left">Variance SKUs</th>
                  <th className="border p-2 text-left">Total Adj Qty CS</th>
                  <th className="border p-2 text-left">Status</th>
                  <th className="border p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {audits.map((audit) => (
                  <tr key={audit.id}>
                    <td className="border p-2">{audit.timestamp}</td>
                    <td className="border p-2">{audit.user}</td>
                    <td className="border p-2">{audit.fileName}</td>
                    <td className="border p-2">{audit.varianceSKUs}</td>
                    <td className="border p-2">{audit.totalAdjQtyCS}</td>
                    <td className="border p-2">
                      <span className={`px-2 py-1 rounded text-sm ${
                        audit.status === 'Completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {audit.status}
                      </span>
                    </td>
                    <td className="border p-2">
                      <Button
                        onClick={() => viewDetails(audit.id)}
                        variant="outline"
                        size="sm"
                        disabled={loading}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
                {audits.length === 0 && (
                  <tr>
                    <td colSpan={7} className="border p-4 text-center text-gray-500">
                      No cycle count audits found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Details Modal */}
      {showDetails && selectedAudit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Cycle Count Details</h3>
              <Button
                onClick={() => setShowDetails(false)}
                variant="outline"
                size="sm"
              >
                Close
              </Button>
            </div>
            
            <div className="mb-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label>Timestamp</Label>
                  <div className="font-medium">{selectedAudit.timestamp}</div>
                </div>
                <div>
                  <Label>User</Label>
                  <div className="font-medium">{selectedAudit.user}</div>
                </div>
                <div>
                  <Label>File</Label>
                  <div className="font-medium">{selectedAudit.fileName}</div>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="font-medium">{selectedAudit.status}</div>
                </div>
              </div>
            </div>

            {selectedAudit.details && (
              <div>
                <h4 className="font-semibold mb-2">Adjustment Details</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border p-2">SKU</th>
                        <th className="border p-2">System Qty CS</th>
                        <th className="border p-2">System Qty EA</th>
                        <th className="border p-2">Physical Qty CS</th>
                        <th className="border p-2">Physical Qty EA</th>
                        <th className="border p-2">Variance CS</th>
                        <th className="border p-2">Variance EA</th>
                        <th className="border p-2">Adjustment Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedAudit.details.map((line, index) => (
                        <tr key={index} className={line.adjustmentType === 'Gain' ? 'bg-green-50' : 'bg-red-50'}>
                          <td className="border p-2">{line.sku}</td>
                          <td className="border p-2">{line.systemQtyCS}</td>
                          <td className="border p-2">{line.systemQtyEA}</td>
                          <td className="border p-2">{line.physicalQtyCS}</td>
                          <td className="border p-2">{line.physicalQtyEA}</td>
                          <td className="border p-2">{line.varianceCS}</td>
                          <td className="border p-2">{line.varianceEA}</td>
                          <td className="border p-2">
                            <span className={`px-2 py-1 rounded text-sm ${
                              line.adjustmentType === 'Gain' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {line.adjustmentType}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 