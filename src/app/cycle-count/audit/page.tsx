'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface CycleCountAudit {
  id: string;
  sessionId: string;
  timestamp: string;
  user: string;
  fileName: string;
  totalItems: number;
  totalAdjustments: number;
  movementsCount: number;
  status: 'Completed' | 'Failed' | 'Cancelled';
  details?: CycleCountMovement[];
}

interface CycleCountMovement {
  skuId: string;
  description: string;
  sellableToExpired: number;
  expiredToSellable: number;
  sellableToDamaged: number;
  damagedToSellable: number;
  reasonCode?: string;
  newMfgDate?: string;
  adjustmentType: 'Gain' | 'Loss' | 'Movement';
}

const REASON_CODES = {
  '1': 'WH Handling Damage',
  '2': 'Inbound Transit Loss',
  '3': 'Inbound Transit Shortage',
  '4': 'Market Return Damages'
};

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

  const downloadAdjustmentDocument = (auditId: string) => {
    const link = document.createElement('a');
    link.href = `/api/cycle-count/adjustment-document/${auditId}`;
    link.download = `inventory_adjustment_${auditId}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                  <th className="border p-2 text-left">Session ID</th>
                  <th className="border p-2 text-left">Total Items</th>
                  <th className="border p-2 text-left">Total Adjustments</th>
                  <th className="border p-2 text-left">Movements</th>
                  <th className="border p-2 text-left">Status</th>
                  <th className="border p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {audits.map((audit) => (
                  <tr key={audit.id}>
                    <td className="border p-2">{new Date(audit.timestamp).toLocaleString()}</td>
                    <td className="border p-2">{audit.user}</td>
                    <td className="border p-2 font-mono text-sm">{audit.sessionId}</td>
                    <td className="border p-2 text-center">{audit.totalItems}</td>
                    <td className="border p-2 text-center">{audit.totalAdjustments}</td>
                    <td className="border p-2 text-center">{audit.movementsCount}</td>
                    <td className="border p-2">
                      <span className={`px-2 py-1 rounded text-sm ${
                        audit.status === 'Completed' 
                          ? 'bg-green-100 text-green-800' 
                          : audit.status === 'Cancelled'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {audit.status}
                      </span>
                    </td>
                    <td className="border p-2">
                      <div className="flex space-x-1">
                        <Button
                          onClick={() => viewDetails(audit.id)}
                          variant="outline"
                          size="sm"
                          disabled={loading}
                        >
                          View Details
                        </Button>
                        {audit.status === 'Completed' && (
                          <Button
                            onClick={() => downloadAdjustmentDocument(audit.id)}
                            variant="outline"
                            size="sm"
                          >
                            Download
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {audits.length === 0 && (
                  <tr>
                    <td colSpan={8} className="border p-4 text-center text-gray-500">
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
          <div className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[80vh] overflow-y-auto">
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
                  <div className="font-medium">{new Date(selectedAudit.timestamp).toLocaleString()}</div>
                </div>
                <div>
                  <Label>User</Label>
                  <div className="font-medium">{selectedAudit.user}</div>
                </div>
                <div>
                  <Label>Session ID</Label>
                  <div className="font-medium font-mono text-sm">{selectedAudit.sessionId}</div>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="font-medium">{selectedAudit.status}</div>
                </div>
                <div>
                  <Label>Total Items</Label>
                  <div className="font-medium">{selectedAudit.totalItems}</div>
                </div>
                <div>
                  <Label>Total Adjustments</Label>
                  <div className="font-medium">{selectedAudit.totalAdjustments}</div>
                </div>
                <div>
                  <Label>Movements</Label>
                  <div className="font-medium">{selectedAudit.movementsCount}</div>
                </div>
                <div>
                  <Label>File</Label>
                  <div className="font-medium">{selectedAudit.fileName}</div>
                </div>
              </div>
            </div>

            {selectedAudit.details && selectedAudit.details.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Inventory Movements</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border p-2">SKU ID</th>
                        <th className="border p-2">Description</th>
                        <th className="border p-2 text-center">Sellable→Expired</th>
                        <th className="border p-2 text-center">Expired→Sellable</th>
                        <th className="border p-2 text-center">Sellable→Damaged</th>
                        <th className="border p-2 text-center">Damaged→Sellable</th>
                        <th className="border p-2 text-center">Reason Code</th>
                        <th className="border p-2 text-center">New MFG Date</th>
                        <th className="border p-2 text-center">Movement Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedAudit.details.map((movement, index) => {
                        const hasMovement = movement.sellableToExpired > 0 || 
                                          movement.expiredToSellable > 0 || 
                                          movement.sellableToDamaged > 0 || 
                                          movement.damagedToSellable > 0;
                        
                        return (
                          <tr key={index} className={hasMovement ? 'bg-blue-50' : ''}>
                            <td className="border p-2 font-medium">{movement.skuId}</td>
                            <td className="border p-2">{movement.description}</td>
                            <td className="border p-2 text-center">
                              {movement.sellableToExpired > 0 ? movement.sellableToExpired : '-'}
                            </td>
                            <td className="border p-2 text-center">
                              {movement.expiredToSellable > 0 ? movement.expiredToSellable : '-'}
                            </td>
                            <td className="border p-2 text-center">
                              {movement.sellableToDamaged > 0 ? movement.sellableToDamaged : '-'}
                            </td>
                            <td className="border p-2 text-center">
                              {movement.damagedToSellable > 0 ? movement.damagedToSellable : '-'}
                            </td>
                            <td className="border p-2 text-center">
                              {movement.reasonCode ? (
                                <span className="text-xs">
                                  {movement.reasonCode} - {REASON_CODES[movement.reasonCode as keyof typeof REASON_CODES]}
                                </span>
                              ) : '-'}
                            </td>
                            <td className="border p-2 text-center">
                              {movement.newMfgDate ? new Date(movement.newMfgDate).toLocaleDateString() : '-'}
                            </td>
                            <td className="border p-2 text-center">
                              <span className={`px-2 py-1 rounded text-xs ${
                                movement.adjustmentType === 'Gain' 
                                  ? 'bg-green-100 text-green-800' 
                                  : movement.adjustmentType === 'Loss'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {movement.adjustmentType}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {selectedAudit.status === 'Completed' && (
              <div className="mt-4 text-center">
                <Button
                  onClick={() => downloadAdjustmentDocument(selectedAudit.id)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Download Adjustment Document
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 