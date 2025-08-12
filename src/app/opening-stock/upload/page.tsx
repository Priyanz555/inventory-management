"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Plus,
  AlertCircle,
  CheckCircle,
  Search,
  Edit,
  Trash2
} from "lucide-react"

export default function OpeningStockUploadPage() {
  const [individualItems, setIndividualItems] = useState<any[]>([])
  const [editingItem, setEditingItem] = useState<number | null>(null)
  const [skuSearch, setSkuSearch] = useState('')
  
  // Form state for individual product entry
  const [formData, setFormData] = useState({
    sku: '',
    description: '',
    mfgDate: '',
    qtyCS: 0,
    qtyEA: 0
  })

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
      mfgDate: formData.mfgDate,
      qtyCS: formData.qtyCS,
      qtyEA: formData.qtyEA
    }])
    
    // Reset form
    setFormData({
      sku: '',
      description: '',
      mfgDate: '',
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
      </div>

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
              <label className="block text-sm font-medium text-gray-700 mb-1">MFG Date (MM-DD-YYYY)</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--button-blue))] focus:border-[hsl(var(--button-blue))]"
                value={formData.mfgDate}
                onChange={(e) => handleFormChange('mfgDate', e.target.value)}
              />
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
                    <th className="text-left py-3 px-4 font-medium text-gray-700">MFG Date</th>
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
                          <input
                            type="date"
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[hsl(var(--button-blue))]"
                            defaultValue={item.mfgDate}
                            onBlur={(e) => saveIndividualItem(item.id, { mfgDate: e.target.value })}
                          />
                        ) : (
                          item.mfgDate
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
    </div>
  )
} 