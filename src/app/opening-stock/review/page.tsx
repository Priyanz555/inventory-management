"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  CheckCircle, 
  AlertTriangle,
  Edit,
  Save,
  X,
  ArrowLeft
} from "lucide-react"

export default function OpeningStockReviewPage() {
  const [activeTab, setActiveTab] = useState<'valid' | 'error'>('valid')
  const [editingRow, setEditingRow] = useState<number | null>(null)
  const [editedData, setEditedData] = useState<any>({})

  // Mock data - in real implementation this would come from the upload process
  const validRows = [
    { id: 1, sku: "SKU001", description: "Product A", mfgMonth: 7, mfgYear: 2025, qtyCS: 10, qtyEA: 5 },
    { id: 2, sku: "SKU002", description: "Product B", mfgMonth: 8, mfgYear: 2025, qtyCS: 15, qtyEA: 0 },
    { id: 3, sku: "SKU003", description: "Product C", mfgMonth: 6, mfgYear: 2025, qtyCS: 8, qtyEA: 12 },
  ]

  const errorRows = [
    { 
      id: 4, 
      sku: "SKU004", 
      description: "Product D", 
      mfgMonth: 13, 
      mfgYear: 2025, 
      qtyCS: -5, 
      qtyEA: 20, 
      errorMsg: "Invalid month and negative quantity" 
    },
    { 
      id: 5, 
      sku: "SKU005", 
      description: "Product E", 
      mfgMonth: 9, 
      mfgYear: 2025, 
      qtyCS: 12, 
      qtyEA: 25, 
      errorMsg: "EA quantity exceeds units per case" 
    },
  ]

  const startEditing = (row: any) => {
    setEditingRow(row.id)
    setEditedData({ ...row })
  }

  const saveEdit = () => {
    // In real implementation, this would update the data
    console.log('Saving edited data:', editedData)
    setEditingRow(null)
    setEditedData({})
  }

  const cancelEdit = () => {
    setEditingRow(null)
    setEditedData({})
  }

  const revalidateErrors = () => {
    // In real implementation, this would re-run validations
    console.log('Re-validating error rows...')
  }

  const submitAllValid = () => {
    // In real implementation, this would submit to the API
    console.log('Submitting all valid rows...')
  }

  const renderValidRows = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 font-medium">SKU</th>
            <th className="text-left py-3 px-4 font-medium">Description</th>
            <th className="text-left py-3 px-4 font-medium">MFG MM-YYYY</th>
            <th className="text-left py-3 px-4 font-medium">Qty CS</th>
            <th className="text-left py-3 px-4 font-medium">Qty EA</th>
            <th className="text-left py-3 px-4 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {validRows.map((row) => (
            <tr key={row.id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">{row.sku}</td>
              <td className="py-3 px-4">{row.description}</td>
              <td className="py-3 px-4">{row.mfgMonth}/{row.mfgYear}</td>
              <td className="py-3 px-4">{row.qtyCS}</td>
              <td className="py-3 px-4">{row.qtyEA}</td>
              <td className="py-3 px-4">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Valid
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderErrorRows = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 font-medium">SKU</th>
            <th className="text-left py-3 px-4 font-medium">MFG MM-YYYY</th>
            <th className="text-left py-3 px-4 font-medium">Qty CS</th>
            <th className="text-left py-3 px-4 font-medium">Qty EA</th>
            <th className="text-left py-3 px-4 font-medium">Error Msg</th>
            <th className="text-left py-3 px-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {errorRows.map((row) => (
            <tr key={row.id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">
                {editingRow === row.id ? (
                  <input
                    type="text"
                    value={editedData.sku || ''}
                    onChange={(e) => setEditedData({...editedData, sku: e.target.value})}
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  row.sku
                )}
              </td>
              <td className="py-3 px-4">
                {editingRow === row.id ? (
                  <div className="grid grid-cols-2 gap-1">
                    <input
                      type="number"
                      min="1"
                      max="12"
                      value={editedData.mfgMonth || ''}
                      onChange={(e) => setEditedData({...editedData, mfgMonth: parseInt(e.target.value)})}
                      className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      min="2020"
                      max="2030"
                      value={editedData.mfgYear || ''}
                      onChange={(e) => setEditedData({...editedData, mfgYear: parseInt(e.target.value)})}
                      className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ) : (
                  `${row.mfgMonth}/${row.mfgYear}`
                )}
              </td>
              <td className="py-3 px-4">
                {editingRow === row.id ? (
                  <input
                    type="number"
                    min="0"
                    value={editedData.qtyCS || ''}
                    onChange={(e) => setEditedData({...editedData, qtyCS: parseInt(e.target.value)})}
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  row.qtyCS
                )}
              </td>
              <td className="py-3 px-4">
                {editingRow === row.id ? (
                  <input
                    type="number"
                    min="0"
                    value={editedData.qtyEA || ''}
                    onChange={(e) => setEditedData({...editedData, qtyEA: parseInt(e.target.value)})}
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  row.qtyEA
                )}
              </td>
              <td className="py-3 px-4">
                <span className="text-sm text-red-600">{row.errorMsg}</span>
              </td>
              <td className="py-3 px-4">
                {editingRow === row.id ? (
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      onClick={saveEdit}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={cancelEdit}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEditing(row)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Review Inventory</h1>
            <p className="text-gray-600">Review and edit your inventory data before submission.</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('valid')}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'valid'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Valid Rows ({validRows.length})
          </button>
          <button
            onClick={() => setActiveTab('error')}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'error'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            Error Rows ({errorRows.length})
          </button>
        </nav>
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>
            {activeTab === 'valid' ? 'Valid Rows' : 'Error Rows'}
          </CardTitle>
          <CardDescription>
            {activeTab === 'valid' 
              ? 'These rows are ready for submission.' 
              : 'Edit these rows to fix validation errors.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeTab === 'valid' ? renderValidRows() : renderErrorRows()}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          {activeTab === 'error' && errorRows.length > 0 && (
            <Button
              variant="outline"
              onClick={revalidateErrors}
              className="border-yellow-500 text-yellow-700 hover:bg-yellow-50"
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Re-Validate Errors
            </Button>
          )}
        </div>
        
        <div className="flex space-x-4">
          <Button
            onClick={submitAllValid}
            disabled={errorRows.length > 0}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            size="lg"
          >
            Submit All Valid Rows
          </Button>
        </div>
      </div>

      {/* Success Modal (would be shown after successful submission) */}
      {/* This would be implemented as a modal component */}
    </div>
  )
} 