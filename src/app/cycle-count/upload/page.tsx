'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function CycleCountUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const downloadTemplate = () => {
    // In real implementation, this would generate and download the template
    const link = document.createElement('a');
    link.href = '/api/cycle-count/template';
    link.download = 'cycle_count_template.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setMessage('');
    }
  };

  const uploadFile = async () => {
    if (!file) {
      setMessage('Please select a file to upload');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/cycle-count/parse', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        // Redirect to review page with the parsed data
        window.location.href = `/cycle-count/review?session=${result.sessionId}`;
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.message}`);
      }
    } catch (error) {
      setMessage('Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Monthly Cycle-Count / Audit Upload</h1>
      
      {message && (
        <div className={`p-4 mb-4 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800">
              Download template, record physical counts (you may upload a subset), then upload.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Download Template</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Download the cycle count template with all SKUs and locked columns.
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
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="text-gray-600">
                  <p className="mb-2">Drag and drop your file here, or</p>
                  <Button variant="outline" className="mb-2">
                    Choose File
                  </Button>
                  <p className="text-sm">Supports .xlsx and .xls files</p>
                </div>
              </label>
              {file && (
                <div className="mt-4 p-2 bg-green-50 rounded">
                  <p className="text-green-700 text-sm">Selected: {file.name}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 text-center">
        <Button 
          onClick={uploadFile}
          disabled={!file || uploading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
        >
          {uploading ? 'Uploading...' : 'Continue to Review'}
        </Button>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Template Structure:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>SKU / Article ID (locked, prefilled)</li>
                <li>System Qty CS (locked, prefilled)</li>
                <li>System Qty EA (locked, prefilled)</li>
                <li>Physical Qty CS (editable, enter ≥ 0)</li>
                <li>Physical Qty EA (editable, 0 ≤ EA &lt; Units/Case)</li>
                <li>MFG Month-Year (optional, informational)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Upload Guidelines:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>You may delete rows for partial uploads</li>
                <li>Missing SKUs are ignored (no adjustment)</li>
                <li>Physical quantities must be ≥ 0</li>
                <li>EA quantities must be less than units per case</li>
                <li>At least one row must contain physical count</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 