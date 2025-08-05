"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Download, 
  Upload, 
  FileText,
  Plus,
  AlertCircle,
  CheckCircle,
  X,
  History,
  Search,
  Edit,
  Trash2
} from "lucide-react"

export default function OpeningStockUploadPage() {
  const [activeTab, setActiveTab] = useState<'bulk' | 'individual'>('bulk')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [parseResult, setParseResult] = useState<any>(null)
  const [individualItems, setIndividualItems] = useState<any[]>([])
  const [editingItem, setEditingItem] = useState<number | null>(null)
  const [skuSearch, setSkuSearch] = useState('')
  
  // Form state for individual product entry
  const [formData, setFormData] = useState({
    sku: '',
    description: '',
    mfgMonth: '',
    mfgYear: '',
    qtyCS: 0,
    qtyEA: 0
  })

  const handleFileSelect = (file: File) => {
    if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
        file.name.endsWith('.xlsx')) {
      setSelectedFile(file)
      // In a real implementation, this would parse the file
      setParseResult({
        validRows: [],
        errorRows: []
      })
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const downloadTemplate = () => {
    // In a real implementation, this would download the template
    console.log('Downloading template...')
  }

  const continueToReview = () => {
    // Navigate to review page
    window.location.href = '/opening-stock/review'
  }

  const addIndividualItem = () => {
    // Validate required fields
    if (!formData.sku.trim()) {
      alert('Please enter a SKU')
      return
    }
    
    // Add new item to the list
    setIndividualItems([...individualItems, {
      id: Date.now(),
      sku: formData.sku,
      description: formData.description,
      mfgMonth: formData.mfgMonth,
      mfgYear: formData.mfgYear,
      qtyCS: formData.qtyCS,
      qtyEA: formData.qtyEA
    }])
    
    // Reset form
    setFormData({
      sku: '',
      description: '',
      mfgMonth: '',
      mfgYear: '',
      qtyCS: 0,
      qtyEA: 0
    })
  }

  const removeIndividualItem = (id: number) => {
    setIndividualItems(individualItems.filter(item => item.id !== id))
  }

  const editIndividualItem = (id: number) => {
    setEditingItem(id)
  }

  const saveIndividualItem = (id: number, updatedData: any) => {
    setIndividualItems(individualItems.map(item => 
      item.id === id ? { ...item, ...updatedData } : item
    ))
    setEditingItem(null)
  }

  const submitIndividual = () => {
    // Submit individual items
    console.log('Submitting individual items:', individualItems)
  }

  const handleSkuSearch = (value: string) => {
    setSkuSearch(value)
    setFormData(prev => ({ ...prev, sku: value }))
    // In a real implementation, this would search for SKU suggestions
    console.log('Searching for SKU:', value)
  }

  const handleFormChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add Inventory</h1>
          <p className="text-gray-600">Create or update your inventory status</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => window.location.href = '/opening-stock/audit'}
          className="flex items-center gap-2"
        >
          <History className="h-4 w-4" />
          View Audit Trail
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('bulk')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'bulk'
                ? 'border-[hsl(var(--button-blue))] text-[hsl(var(--button-blue))]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Bulk Upload
          </button>
          <button
            onClick={() => setActiveTab('individual')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'individual'
                ? 'border-[hsl(var(--button-blue))] text-[hsl(var(--button-blue))]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Individual Product Entry
          </button>
        </nav>
      </div>

      {activeTab === 'bulk' && (
        <Card className="shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-[hsl(var(--button-blue))]" />
              Bulk Upload
            </CardTitle>
            <CardDescription>
              Upload an excel file with your stock data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Step 1: Download template → Step 2: Fill quantities → Step 3: Upload file.</p>
                </div>
              </div>
            </div>

            {/* Download Template */}
            <div className="flex items-center justify-center">
              <Button onClick={downloadTemplate} variant="jiomart" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download Template
              </Button>
            </div>

            {/* File Upload */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging ? 'border-[hsl(var(--button-blue))] bg-blue-50' : 'border-gray-300'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-[hsl(var(--button-blue))] hover:text-[hsl(var(--button-blue)/0.8)] font-medium">
                    Choose a file
                  </span>
                  <span className="text-gray-500"> or drag and drop</span>
                </label>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  accept=".xlsx"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileSelect(file)
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">XLSX files only, up to 5MB</p>
            </div>

            {/* Selected File */}
            {selectedFile && (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-sm font-medium text-gray-900">{selectedFile.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Continue Button */}
            {parseResult && (
              <div className="flex justify-center">
                <Button 
                  onClick={continueToReview}
                  variant="jiomart"
                  size="lg"
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Continue to Review
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'individual' && (
        <Card className="shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-[hsl(var(--button-blue))]" />
              Individual Product Entry
            </CardTitle>
            <CardDescription>
              Add product one by one to your stock
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Entry Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU / Article ID</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--button-blue))] focus:border-[hsl(var(--button-blue))]"
                    placeholder="Search SKU..."
                    value={formData.sku}
                    onChange={(e) => handleFormChange('sku', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--button-blue))] focus:border-[hsl(var(--button-blue))]"
                  placeholder="Enter description"
                  value={formData.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">MFG Month-Year</label>
                <div className="grid grid-cols-2 gap-2">
                  <select 
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--button-blue))] focus:border-[hsl(var(--button-blue))]"
                    value={formData.mfgMonth}
                    onChange={(e) => handleFormChange('mfgMonth', e.target.value)}
                  >
                    <option value="">Month</option>
                    {Array.from({length: 12}, (_, i) => (
                      <option key={i+1} value={i+1}>{i+1}</option>
                    ))}
                  </select>
                  <select 
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--button-blue))] focus:border-[hsl(var(--button-blue))]"
                    value={formData.mfgYear}
                    onChange={(e) => handleFormChange('mfgYear', e.target.value)}
                  >
                    <option value="">Year</option>
                    {Array.from({length: 5}, (_, i) => {
                      const year = new Date().getFullYear() - 2 + i
                      return <option key={year} value={year}>{year}</option>
                    })}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Qty CS</label>
                <input
                  type="number"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--button-blue))] focus:border-[hsl(var(--button-blue))]"
                  placeholder="0"
                  value={formData.qtyCS}
                  onChange={(e) => handleFormChange('qtyCS', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Qty EA</label>
                <input
                  type="number"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--button-blue))] focus:border-[hsl(var(--button-blue))]"
                  placeholder="0"
                  value={formData.qtyEA}
                  onChange={(e) => handleFormChange('qtyEA', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            <Button onClick={addIndividualItem} variant="jiomart" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add to List
            </Button>

            {/* Items Grid */}
            {individualItems.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-lg">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">SKU</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Description</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">MFG MM-YYYY</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Qty CS</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Qty EA</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {individualItems.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">
                          {editingItem === item.id ? (
                            <input
                              type="text"
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[hsl(var(--button-blue))]"
                              defaultValue={item.sku}
                              onBlur={(e) => saveIndividualItem(item.id, { sku: e.target.value })}
                            />
                          ) : (
                            item.sku
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {editingItem === item.id ? (
                            <input
                              type="text"
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[hsl(var(--button-blue))]"
                              defaultValue={item.description}
                              onBlur={(e) => saveIndividualItem(item.id, { description: e.target.value })}
                            />
                          ) : (
                            item.description
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {editingItem === item.id ? (
                            <div className="grid grid-cols-2 gap-1">
                              <input
                                type="number"
                                min="1"
                                max="12"
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[hsl(var(--button-blue))]"
                                defaultValue={item.mfgMonth}
                                onBlur={(e) => saveIndividualItem(item.id, { mfgMonth: e.target.value })}
                              />
                              <input
                                type="number"
                                className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[hsl(var(--button-blue))]"
                                defaultValue={item.mfgYear}
                                onBlur={(e) => saveIndividualItem(item.id, { mfgYear: e.target.value })}
                              />
                            </div>
                          ) : (
                            `${item.mfgMonth}/${item.mfgYear}`
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {editingItem === item.id ? (
                            <input
                              type="number"
                              min="0"
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[hsl(var(--button-blue))]"
                              defaultValue={item.qtyCS}
                              onBlur={(e) => saveIndividualItem(item.id, { qtyCS: parseInt(e.target.value) || 0 })}
                            />
                          ) : (
                            item.qtyCS
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {editingItem === item.id ? (
                            <input
                              type="number"
                              min="0"
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[hsl(var(--button-blue))]"
                              defaultValue={item.qtyEA}
                              onBlur={(e) => saveIndividualItem(item.id, { qtyEA: parseInt(e.target.value) || 0 })}
                            />
                          ) : (
                            item.qtyEA
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            {editingItem === item.id ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingItem(null)}
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => editIndividualItem(item.id)}
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeIndividualItem(item.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Submit Button */}
            {individualItems.length > 0 && (
              <div className="flex justify-center">
                <Button 
                  onClick={submitIndividual}
                  variant="jiomart"
                  size="lg"
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Submit
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
} 