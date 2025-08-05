'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CycleCountLine {
  sku: string;
  systemQtyCS: number;
  systemQtyEA: number;
  physicalQtyCS: number;
  physicalQtyEA: number;
  varianceCS: number;
  varianceEA: number;
  variancePercent: number;
  hasError: boolean;
  errorMessage?: string;
}

interface CycleCountData {
  validRows: CycleCountLine[];
  errorRows: CycleCountLine[];
  totalAdjustments: number;
  totalSKUs: number;
}

export default function CycleCountReviewPage() {
  const [data, setData] = useState<CycleCountData | null>(null);
  const [activeTab, setActiveTab] = useState<'valid' | 'error'>('valid');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session');
    
    if (sessionId) {
      fetchCycleCountData(sessionId);
    }
  }, []);

  const fetchCycleCountData = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/cycle-count/parse?session=${sessionId}`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Error fetching cycle count data:', error);
    }
  };

  const updateErrorRow = (index: number, field: keyof CycleCountLine, value: any) => {
    if (!data) return;

    setData(prev => {
      if (!prev) return prev;
      
      const updatedErrorRows = [...prev.errorRows];
      updatedErrorRows[index] = { ...updatedErrorRows[index], [field]: value };
      
      // Recalculate variance
      const line = updatedErrorRows[index];
      line.varianceCS = line.physicalQtyCS - line.systemQtyCS;
      line.varianceEA = line.physicalQtyEA - line.systemQtyEA;
      line.variancePercent = line.systemQtyCS > 0 ? 
        ((line.varianceCS / line.systemQtyCS) * 100) : 0;
      
      return { ...prev, errorRows: updatedErrorRows };
    });
  };

  const revalidateErrors = async () => {
    if (!data) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/cycle-count/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ errorRows: data.errorRows }),
      });

      if (response.ok) {
        const result = await response.json();
        setData(prev => prev ? { ...prev, errorRows: result.errorRows } : null);
        setMessage('Errors revalidated successfully');
      } else {
        setMessage('Error revalidating errors');
      }
    } catch (error) {
      setMessage('Error revalidating errors');
    } finally {
      setLoading(false);
    }
  };

  const submitValidRows = async () => {
    if (!data || data.errorRows.length > 0) {
      setMessage('Please fix all errors before submitting');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/cycle-count/commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          validRows: data.validRows,
          totalAdjustments: data.totalAdjustments,
          totalSKUs: data.totalSKUs
        }),
      });

      if (response.ok) {
        setMessage('Cycle count committed successfully');
        // Redirect to audit page after a delay
        setTimeout(() => {
          window.location.href = '/cycle-count/audit';
        }, 2000);
      } else {
        setMessage('Error committing cycle count');
      }
    } catch (error) {
      setMessage('Error committing cycle count');
    } finally {
      setLoading(false);
    }
  };

  if (!data) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <p>Loading cycle count data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Review & Edit Cycle Count</h1>
      
      {message && (
        <div className={`p-4 mb-4 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      <div className="flex gap-2 mb-6">
        <Button
          onClick={() => setActiveTab('valid')}
          variant={activeTab === 'valid' ? 'default' : 'outline'}
        >
          ✓ Valid Rows ({data.validRows.length})
        </Button>
        <Button
          onClick={() => setActiveTab('error')}
          variant={activeTab === 'error' ? 'default' : 'outline'}
        >
          ⚠️ Error Rows ({data.errorRows.length})
        </Button>
      </div>

      {activeTab === 'valid' && (
        <Card>
          <CardHeader>
            <CardTitle>Valid Rows (Read-only)</CardTitle>
          </CardHeader>
          <CardContent>
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
                    <th className="border p-2">Variance %</th>
                  </tr>
                </thead>
                <tbody>
                  {data.validRows.map((row, index) => (
                    <tr key={index} className={row.varianceCS > 0 ? 'bg-green-50' : row.varianceCS < 0 ? 'bg-red-50' : ''}>
                      <td className="border p-2">{row.sku}</td>
                      <td className="border p-2">{row.systemQtyCS}</td>
                      <td className="border p-2">{row.systemQtyEA}</td>
                      <td className="border p-2">{row.physicalQtyCS}</td>
                      <td className="border p-2">{row.physicalQtyEA}</td>
                      <td className="border p-2">{row.varianceCS}</td>
                      <td className="border p-2">{row.varianceEA}</td>
                      <td className="border p-2">{row.variancePercent.toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'error' && (
        <Card>
          <CardHeader>
            <CardTitle>Error Rows (Editable)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border p-2">SKU</th>
                    <th className="border p-2">System Qty CS</th>
                    <th className="border p-2">System Qty EA</th>
                    <th className="border p-2">Physical Qty CS</th>
                    <th className="border p-2">Physical Qty EA</th>
                    <th className="border p-2">Error</th>
                  </tr>
                </thead>
                <tbody>
                  {data.errorRows.map((row, index) => (
                    <tr key={index} className="bg-red-50">
                      <td className="border p-2">{row.sku}</td>
                      <td className="border p-2">{row.systemQtyCS}</td>
                      <td className="border p-2">{row.systemQtyEA}</td>
                      <td className="border p-2">
                        <Input
                          type="number"
                          min="0"
                          value={row.physicalQtyCS}
                          onChange={(e) => updateErrorRow(index, 'physicalQtyCS', parseInt(e.target.value) || 0)}
                        />
                      </td>
                      <td className="border p-2">
                        <Input
                          type="number"
                          min="0"
                          max="23"
                          value={row.physicalQtyEA}
                          onChange={(e) => updateErrorRow(index, 'physicalQtyEA', parseInt(e.target.value) || 0)}
                        />
                      </td>
                      <td className="border p-2 text-red-600 text-sm">{row.errorMessage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between mt-6">
        <Button 
          onClick={revalidateErrors}
          disabled={loading || data.errorRows.length === 0}
          variant="outline"
        >
          Re-Validate Errors
        </Button>
        <Button 
          onClick={submitValidRows}
          disabled={loading || data.errorRows.length > 0}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Submit All Valid Rows
        </Button>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Total SKUs</Label>
              <div className="text-xl font-bold">{data.totalSKUs}</div>
            </div>
            <div>
              <Label>Valid Rows</Label>
              <div className="text-xl font-bold text-green-600">{data.validRows.length}</div>
            </div>
            <div>
              <Label>Error Rows</Label>
              <div className="text-xl font-bold text-red-600">{data.errorRows.length}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 