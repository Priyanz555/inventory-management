'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface InventoryItem {
  skuId: string;
  description: string;
  dateAdded: string;
  mfgDate: string;
  baseUnit: 'CS' | 'EA';
  inventoryOnHand: number;
  sellableQty: number;
  allocatedQty: number;
  damagedQty: number;
  expiredQty: number;
  onRouteQty: number;
  sellableToExpired: number;
  expiredToSellable: number;
  sellableToDamaged: number;
  damagedToSellable: number;
  reasonCode?: string;
  newMfgDate?: string;
  hasError?: boolean;
  errorMessage?: string;
}

interface CycleCountSession {
  sessionId: string;
  initiatedAt: string;
  status: 'active' | 'cancelled' | 'completed';
  items: InventoryItem[];
}

const REASON_CODES = [
  { code: '1', description: 'WH Handling Damage' },
  { code: '2', description: 'Inbound Transit Loss' },
  { code: '3', description: 'Inbound Transit Shortage' },
  { code: '4', description: 'Market Return Damages' }
];

export default function CycleCountUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [session, setSession] = useState<CycleCountSession | null>(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [cycleCountActive, setCycleCountActive] = useState(false);

  useEffect(() => {
    checkCycleCountStatus();
  }, []);

  const checkCycleCountStatus = async () => {
    try {
      const response = await fetch('/api/cycle-count/status');
      if (response.ok) {
        const data = await response.json();
        setCycleCountActive(data.active);
      }
    } catch (error) {
      console.error('Error checking cycle count status:', error);
    }
  };

  const initiateCycleCount = async () => {
    try {
      const response = await fetch('/api/cycle-count/initiate', {
        method: 'POST'
      });
      
      if (response.ok) {
        const data = await response.json();
        setSession(data);
        setCycleCountActive(true);
        setMessage('Cycle count initiated successfully. Order processing is now blocked.');
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.message}`);
      }
    } catch (error) {
      setMessage('Error initiating cycle count');
    }
  };

  const cancelCycleCount = async () => {
    if (!confirm('Are you sure you want to cancel the cycle count? This will result in lost data and restore order processing.')) {
      return;
    }

    try {
      const response = await fetch('/api/cycle-count/cancel', {
        method: 'POST'
      });
      
      if (response.ok) {
        setSession(null);
        setCycleCountActive(false);
        setMessage('Cycle count cancelled. Order processing restored.');
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.message}`);
      }
    } catch (error) {
      setMessage('Error cancelling cycle count');
    }
  };

  const downloadInventorySnapshot = () => {
    const link = document.createElement('a');
    link.href = '/api/cycle-count/snapshot';
    link.download = `inventory_snapshot_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/api/cycle-count/template';
    link.download = 'cycle_count_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File input change event triggered');
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      console.log('File selected:', selectedFile.name, 'Size:', selectedFile.size);
      setFile(selectedFile);
      setMessage('');
    }
  };

  const handleUploadAreaClick = () => {
    console.log('Upload area clicked');
    document.getElementById('file-upload')?.click();
  };

  const uploadFile = async () => {
    if (!file) {
      setMessage('Please select a file to upload');
      return;
    }

    if (!cycleCountActive) {
      setMessage('Please initiate a cycle count first');
      return;
    }

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      setMessage('Please select a CSV file (.csv)');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log('Uploading file:', file.name, 'Size:', file.size);
      
      const response = await fetch('/api/cycle-count/parse', {
        method: 'POST',
        body: formData,
      });

      console.log('Upload response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('Upload successful, items parsed:', result.items?.length);
        setSession(result);
        setMessage(`File uploaded successfully. ${result.items?.length || 0} items parsed. Please review the data below.`);
      } else {
        const error = await response.json();
        console.error('Upload error:', error);
        setMessage(`Error: ${error.message || 'Failed to upload file'}`);
      }
    } catch (error) {
      console.error('Upload exception:', error);
      setMessage('Error uploading file. Please check your connection and try again.');
    } finally {
      setUploading(false);
    }
  };

  const validateAndSubmit = async () => {
    if (!session?.items) {
      setMessage('No data to submit');
      return;
    }

    // Check for validation errors
    const hasErrors = session.items.some(item => item.hasError);
    if (hasErrors) {
      setMessage('Please fix all validation errors before submitting');
      return;
    }

    // Check for required reason codes
    const itemsNeedingReasonCodes = session.items.filter(item => 
      (item.sellableToExpired > 0 || item.sellableToDamaged > 0 || item.damagedToSellable > 0) && !item.reasonCode
    );

    if (itemsNeedingReasonCodes.length > 0) {
      setMessage('Please provide reason codes for all inventory movements');
      return;
    }

    // Send OTP before showing modal
    try {
      const response = await fetch('/api/cycle-count/otp/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: session.sessionId,
          userEmail: 'current-user@company.com' // In real implementation, get from session
        }),
      });

      if (response.ok) {
        setMessage('OTP sent to your registered mobile number. Please check and enter the code.');
        setShowOtpModal(true);
      } else {
        const error = await response.json();
        setMessage(`Error sending OTP: ${error.message}`);
      }
    } catch (error) {
      setMessage('Error sending OTP. Please try again.');
    }
  };

  const submitWithOtp = async () => {
    if (!otp || otp.length !== 6) {
      setMessage('Please enter a valid 6-digit OTP');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/cycle-count/commit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: session?.sessionId,
          items: session?.items,
          otp: otp
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage('Cycle count submitted successfully!');
        setSession(null);
        setCycleCountActive(false);
        setShowOtpModal(false);
        setOtp('');
        
        // Download adjustment document
        const link = document.createElement('a');
        link.href = `/api/cycle-count/adjustment-document/${result.auditId}`;
        link.download = `inventory_adjustment_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.message}`);
      }
    } catch (error) {
      setMessage('Error submitting cycle count');
    } finally {
      setSubmitting(false);
    }
  };

  const updateItem = (index: number, field: keyof InventoryItem, value: any) => {
    if (!session) return;

    const updatedItems = [...session.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // Re-validate the item
    const item = updatedItems[index];
    const errors: string[] = [];

    // Basic quantity validations
    if (item.sellableQty < 0 || item.allocatedQty < 0 || item.damagedQty < 0 || 
        item.expiredQty < 0 || item.onRouteQty < 0) {
      errors.push('All quantities must be greater than or equal to 0');
    }

    // Movement validations
    if (item.sellableToExpired > 0) {
      if (!item.reasonCode) {
        errors.push('Reason code required for Sellable to Expired movement');
      }
      if (!item.newMfgDate) {
        errors.push('New MFG date required for Sellable to Expired movement');
      }
      if (item.sellableQty - item.sellableToExpired < 0) {
        errors.push('Sellable to Expired movement exceeds available sellable quantity');
      }
    }

    if (item.expiredToSellable > 0) {
      if (!item.newMfgDate) {
        errors.push('New MFG date required for Expired to Sellable movement');
      }
      if (item.expiredQty - item.expiredToSellable < 0) {
        errors.push('Expired to Sellable movement exceeds available expired quantity');
      }
    }

    if (item.sellableToDamaged > 0 || item.damagedToSellable > 0) {
      if (!item.reasonCode) {
        errors.push('Reason code required for damage-related movements');
      }
    }

    updatedItems[index] = {
      ...item,
      hasError: errors.length > 0,
      errorMessage: errors.join('; ')
    };

    setSession({ ...session, items: updatedItems });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Cycle Count / Inventory Reconciliation</h1>
      
      {message && (
        <div className={`p-4 mb-4 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      {/* Cycle Count Status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Cycle Count Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-4 h-4 rounded-full ${cycleCountActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className="font-medium">
                {cycleCountActive ? 'Cycle Count Active' : 'No Active Cycle Count'}
              </span>
            </div>
            <div className="space-x-2">
              {!cycleCountActive ? (
                <Button onClick={initiateCycleCount} className="bg-blue-600 hover:bg-blue-700">
                  Initiate Cycle Count
                </Button>
              ) : (
                <>
                  <Button onClick={downloadInventorySnapshot} variant="outline">
                    Download Inventory Snapshot
                  </Button>
                  <Button onClick={cancelCycleCount} variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                    Cancel Cycle Count
                  </Button>
                </>
              )}
            </div>
          </div>
          {cycleCountActive && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-yellow-800 text-sm">
                ⚠️ Order processing is currently blocked during cycle count. Complete or cancel the cycle count to restore normal operations.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Section */}
      {cycleCountActive && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Download Template</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Download the cycle count template with current inventory levels and movement tracking columns.
              </p>
              <Button onClick={downloadTemplate} className="w-full">
                Download Template
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Step 2: Upload File</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
                onClick={handleUploadAreaClick}
              >
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <div className="text-gray-600">
                  <p className="mb-2">Drag and drop your file here, or</p>
                  <div className="mb-2">
                    <span className="inline-block px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-colors">
                      Choose File
                    </span>
                  </div>
                  <p className="text-sm">Supports .csv files (Excel compatible)</p>
                </div>
                {file && (
                  <div className="mt-4 p-2 bg-green-50 rounded">
                    <p className="text-green-700 text-sm">Selected: {file.name}</p>
                  </div>
                )}
              </div>
              <div className="space-y-2 mt-4">
                <Button 
                  onClick={uploadFile}
                  disabled={!file || uploading}
                  className="w-full"
                >
                  {uploading ? 'Uploading...' : 'Upload and Validate'}
                </Button>
                
                {/* Debug button - remove in production */}
                <Button 
                  onClick={async () => {
                    if (!file) return;
                    const formData = new FormData();
                    formData.append('file', file);
                    try {
                      const response = await fetch('/api/cycle-count/test-upload', {
                        method: 'POST',
                        body: formData,
                      });
                      const result = await response.json();
                      console.log('Test upload result:', result);
                      setMessage(`Test: File ${result.fileDetails?.name} (${result.fileDetails?.size} bytes, ${result.totalLines} lines)`);
                    } catch (error) {
                      console.error('Test upload error:', error);
                    }
                  }}
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                >
                  Test Upload (Debug)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Inventory Grid */}
      {session?.items && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Inventory Reconciliation Grid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border p-2 text-left">SKU ID</th>
                    <th className="border p-2 text-left">Description</th>
                    <th className="border p-2 text-left">MFG Date</th>
                    <th className="border p-2 text-left">Base Unit</th>
                    <th className="border p-2 text-center">Inventory On Hand</th>
                    <th className="border p-2 text-center">Sellable</th>
                    <th className="border p-2 text-center">Allocated</th>
                    <th className="border p-2 text-center">Damaged</th>
                    <th className="border p-2 text-center">Expired</th>
                    <th className="border p-2 text-center">On-Route</th>
                    <th className="border p-2 text-center">Sellable→Expired</th>
                    <th className="border p-2 text-center">Expired→Sellable</th>
                    <th className="border p-2 text-center">Sellable→Damaged</th>
                    <th className="border p-2 text-center">Damaged→Sellable</th>
                    <th className="border p-2 text-center">Reason Code</th>
                    <th className="border p-2 text-center">New MFG Date</th>
                  </tr>
                </thead>
                <tbody>
                  {session.items.map((item, index) => (
                    <tr key={index} className={item.hasError ? 'bg-red-50' : ''}>
                      <td className="border p-2 font-medium">{item.skuId}</td>
                      <td className="border p-2">{item.description}</td>
                      <td className="border p-2">{item.mfgDate}</td>
                      <td className="border p-2">{item.baseUnit}</td>
                      <td className="border p-2 text-center">{item.inventoryOnHand}</td>
                      <td className="border p-2">
                        <Input
                          type="number"
                          value={item.sellableQty}
                          onChange={(e) => updateItem(index, 'sellableQty', Number(e.target.value))}
                          className="text-center"
                        />
                      </td>
                      <td className="border p-2">
                        <Input
                          type="number"
                          value={item.allocatedQty}
                          onChange={(e) => updateItem(index, 'allocatedQty', Number(e.target.value))}
                          className="text-center"
                        />
                      </td>
                      <td className="border p-2">
                        <Input
                          type="number"
                          value={item.damagedQty}
                          onChange={(e) => updateItem(index, 'damagedQty', Number(e.target.value))}
                          className="text-center"
                        />
                      </td>
                      <td className="border p-2">
                        <Input
                          type="number"
                          value={item.expiredQty}
                          onChange={(e) => updateItem(index, 'expiredQty', Number(e.target.value))}
                          className="text-center"
                        />
                      </td>
                      <td className="border p-2">
                        <Input
                          type="number"
                          value={item.onRouteQty}
                          onChange={(e) => updateItem(index, 'onRouteQty', Number(e.target.value))}
                          className="text-center"
                        />
                      </td>
                      <td className="border p-2">
                        <Input
                          type="number"
                          value={item.sellableToExpired}
                          onChange={(e) => updateItem(index, 'sellableToExpired', Number(e.target.value))}
                          className="text-center"
                        />
                      </td>
                      <td className="border p-2">
                        <Input
                          type="number"
                          value={item.expiredToSellable}
                          onChange={(e) => updateItem(index, 'expiredToSellable', Number(e.target.value))}
                          className="text-center"
                        />
                      </td>
                      <td className="border p-2">
                        <Input
                          type="number"
                          value={item.sellableToDamaged}
                          onChange={(e) => updateItem(index, 'sellableToDamaged', Number(e.target.value))}
                          className="text-center"
                        />
                      </td>
                      <td className="border p-2">
                        <Input
                          type="number"
                          value={item.damagedToSellable}
                          onChange={(e) => updateItem(index, 'damagedToSellable', Number(e.target.value))}
                          className="text-center"
                        />
                      </td>
                      <td className="border p-2">
                        <select
                          value={item.reasonCode || ''}
                          onChange={(e) => updateItem(index, 'reasonCode', e.target.value)}
                          className="w-full p-1 border rounded text-sm"
                        >
                          <option value="">Select...</option>
                          {REASON_CODES.map(code => (
                            <option key={code.code} value={code.code}>
                              {code.code} - {code.description}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="border p-2">
                        <Input
                          type="date"
                          value={item.newMfgDate || ''}
                          onChange={(e) => updateItem(index, 'newMfgDate', e.target.value)}
                          className="text-center"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {session.items.some(item => item.hasError) && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                <h4 className="font-semibold text-red-800 mb-2">Validation Errors:</h4>
                {session.items.filter(item => item.hasError).map((item, index) => (
                  <div key={index} className="text-red-700 text-sm">
                    <strong>{item.skuId}:</strong> {item.errorMessage}
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 text-center">
              <Button 
                onClick={validateAndSubmit}
                disabled={session.items.some(item => item.hasError)}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
              >
                Submit Cycle Count
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Template Structure:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li><strong>Non-editable fields:</strong> Article Code, Article Description, MFG Date, Date Added, Base Unit</li>
                <li><strong>Quantity fields:</strong> Sellable Qty, Allocated Qty, Damaged Qty, Expired Qty, On-route Qty</li>
                <li><strong>Movement fields:</strong> Sellable→Expired, Expired→Sellable, Sellable→Damaged, Damaged→Sellable</li>
                <li><strong>Required fields:</strong> Reason Code, New MFG Date (for specific movements)</li>
                <li><strong>File format:</strong> CSV files that can be opened in Excel</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Validation Rules:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>All quantity heads must be ≥ 0</li>
                <li>Inventory movements must result in quantities ≥ 0</li>
                <li>Sellable→Expired: Requires new MFG date and reason code</li>
                <li>Expired→Sellable: Requires new MFG date within expiry window</li>
                <li>Damage movements: Require reason code</li>
                <li>OTP verification required before submission</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">OTP Verification</h3>
            <p className="text-gray-600 mb-4">
              Please enter the 6-digit OTP sent to your registered mobile number to confirm the cycle count submission. The OTP is valid for 10 minutes.
            </p>
            <div className="mb-4">
              <Label htmlFor="otp">OTP</Label>
              <Input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit OTP"
                className="text-center text-lg tracking-widest"
                maxLength={6}
              />
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => setShowOtpModal(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={submitWithOtp}
                disabled={otp.length !== 6 || submitting}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 