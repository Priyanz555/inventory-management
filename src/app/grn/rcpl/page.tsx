"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Plus,
  Trash2,
  Save,
  CheckCircle,
  AlertCircle,
  FileText,
  Calendar,
  Package,
  Search,
  Truck,
  Building,
  User
} from "lucide-react"

interface GRNLine {
  id: string
  sku: string
  articleName: string
  purchaseRate: number
  purchaseValue: number
  discountAmount: number
  cgstAmount: number
  sgstAmount: number
  igstAmount: number
  totalAmount: number
  mfgMonth: number
  mfgYear: number
  qtyCS: number
  qtyEA: number
  ptd: number
  cgstPct: number
  sgstPct: number
  igstPct: number
  lineTotal: number
  selected: boolean
}

interface GRNData {
  invoiceNo: string
  invoiceDate: string
  supplier: 'RCPL' | 'Non RCPL'
  sellerCode: 'Anchor Distributor' | 'Sub Distributor' | ''
  lrNumber: string
  lrName: string
  transporter: string
  lines: GRNLine[]
  attachmentUrl?: string
  status: 'draft' | 'posted'
  totalQtyCS: number
  totalQtyEA: number
  totalValue: number
}

interface ArticleData {
  sku: string
  articleName: string
  purchaseRate: number
  cgstPct: number
  sgstPct: number
  igstPct: number
}

export default function GRNRCPLPage() {
  const [grnData, setGrnData] = useState<GRNData>({
    invoiceNo: "",
    invoiceDate: "",
    supplier: "RCPL",
    sellerCode: "",
    lrNumber: "",
    lrName: "",
    transporter: "",
    lines: [],
    status: 'draft',
    totalQtyCS: 0,
    totalQtyEA: 0,
    totalValue: 0
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [skuSearchTerm, setSkuSearchTerm] = useState("")
  const [filteredSkus, setFilteredSkus] = useState<string[]>([])

  // Mock SKU data for autocomplete
  const mockSkus = [
    "SKU001", "SKU002", "SKU003", "SKU004", "SKU005",
    "COCA-COLA-500ML", "PEPSI-1L", "SPRITE-330ML", "FANTA-500ML"
  ]

  // Mock article data for auto-population
  const mockArticleData: Record<string, ArticleData> = {
    "SKU001": {
      sku: "SKU001",
      articleName: "Coca-Cola 500ml",
      purchaseRate: 120.00,
      cgstPct: 2.5,
      sgstPct: 2.5,
      igstPct: 0
    },
    "SKU002": {
      sku: "SKU002", 
      articleName: "Pepsi 1L",
      purchaseRate: 180.00,
      cgstPct: 2.5,
      sgstPct: 2.5,
      igstPct: 0
    },
    "COCA-COLA-500ML": {
      sku: "COCA-COLA-500ML",
      articleName: "Coca-Cola 500ml Bottle",
      purchaseRate: 125.00,
      cgstPct: 2.5,
      sgstPct: 2.5,
      igstPct: 0
    },
    "PEPSI-1L": {
      sku: "PEPSI-1L",
      articleName: "Pepsi 1L Bottle",
      purchaseRate: 185.00,
      cgstPct: 2.5,
      sgstPct: 2.5,
      igstPct: 0
    }
  }

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" }
  ]

  const years = [2024, 2025, 2026]

  // Filter SKUs based on search term
  useEffect(() => {
    if (skuSearchTerm) {
      const filtered = mockSkus.filter(sku => 
        sku.toLowerCase().includes(skuSearchTerm.toLowerCase())
      )
      setFilteredSkus(filtered)
    } else {
      setFilteredSkus([])
    }
  }, [skuSearchTerm])

  const calculateLineTotal = (line: GRNLine): number => {
    const totalQty = line.qtyCS + (line.qtyEA / 24) // Assuming 24 units per case
    const baseValue = totalQty * line.ptd
    const cgst = (baseValue * line.cgstPct) / 100
    const sgst = (baseValue * line.sgstPct) / 100
    const igst = (baseValue * line.igstPct) / 100
    return Math.round(baseValue + cgst + sgst + igst)
  }

  const updateTotals = (lines: GRNLine[]) => {
    const totalQtyCS = lines.reduce((sum, line) => sum + line.qtyCS, 0)
    const totalQtyEA = lines.reduce((sum, line) => sum + line.qtyEA, 0)
    const totalValue = lines.reduce((sum, line) => sum + line.lineTotal, 0)

    setGrnData(prev => ({
      ...prev,
      totalQtyCS,
      totalQtyEA,
      totalValue
    }))
  }

  const addLine = () => {
    const newLine: GRNLine = {
      id: Date.now().toString(),
      sku: "",
      articleName: "",
      purchaseRate: 0,
      purchaseValue: 0,
      discountAmount: 0,
      cgstAmount: 0,
      sgstAmount: 0,
      igstAmount: 0,
      totalAmount: 0,
      mfgMonth: 1,
      mfgYear: 2024,
      qtyCS: 0,
      qtyEA: 0,
      ptd: 0,
      cgstPct: 0,
      sgstPct: 0,
      igstPct: 0,
      lineTotal: 0,
      selected: false
    }

    setGrnData(prev => ({
      ...prev,
      lines: [...prev.lines, newLine]
    }))
  }

  const updateLine = (id: string, field: keyof GRNLine, value: any) => {
    setGrnData(prev => {
      const updatedLines = prev.lines.map(line => {
        if (line.id === id) {
          const updatedLine = { ...line, [field]: value }
          
          // Auto-populate article data when SKU is selected
          if (field === 'sku' && value) {
            const articleData = mockArticleData[value]
            if (articleData) {
              updatedLine.articleName = articleData.articleName
              updatedLine.purchaseRate = articleData.purchaseRate
              updatedLine.cgstPct = articleData.cgstPct
              updatedLine.sgstPct = articleData.sgstPct
              updatedLine.igstPct = articleData.igstPct
            }
          }

          // Calculate purchase value
          if (field === 'qtyCS' || field === 'qtyEA' || field === 'purchaseRate') {
            const totalQty = updatedLine.qtyCS + (updatedLine.qtyEA / 24)
            updatedLine.purchaseValue = totalQty * updatedLine.purchaseRate
          }

          // Calculate tax amounts
          if (field === 'purchaseValue' || field === 'cgstPct') {
            updatedLine.cgstAmount = (updatedLine.purchaseValue * updatedLine.cgstPct) / 100
          }
          if (field === 'purchaseValue' || field === 'sgstPct') {
            updatedLine.sgstAmount = (updatedLine.purchaseValue * updatedLine.sgstPct) / 100
          }
          if (field === 'purchaseValue' || field === 'igstPct') {
            updatedLine.igstAmount = (updatedLine.purchaseValue * updatedLine.igstPct) / 100
          }

          // Calculate total amount
          updatedLine.totalAmount = updatedLine.purchaseValue - updatedLine.discountAmount + 
                                   updatedLine.cgstAmount + updatedLine.sgstAmount + updatedLine.igstAmount

          // Calculate line total for GRN
          updatedLine.lineTotal = calculateLineTotal(updatedLine)
          
          return updatedLine
        }
        return line
      })

      updateTotals(updatedLines)
      return { ...prev, lines: updatedLines }
    })
  }

  const deleteSelectedLines = () => {
    setGrnData(prev => {
      const filteredLines = prev.lines.filter(line => !line.selected)
      updateTotals(filteredLines)
      return { ...prev, lines: filteredLines }
    })
  }

  const toggleLineSelection = (id: string) => {
    setGrnData(prev => ({
      ...prev,
      lines: prev.lines.map(line => 
        line.id === id ? { ...line, selected: !line.selected } : line
      )
    }))
  }

  const validateForm = (): string[] => {
    const errors: string[] = []

    if (!grnData.invoiceNo.trim()) {
      errors.push("Invoice number is required")
    }

    if (!grnData.invoiceDate) {
      errors.push("Invoice date is required")
    }

    if (grnData.supplier === 'Non RCPL' && !grnData.sellerCode) {
      errors.push("Seller code is required for Non RCPL suppliers")
    }

    if (!grnData.lrNumber.trim()) {
      errors.push("LR Number is required")
    }

    if (!grnData.lrName.trim()) {
      errors.push("LR Name is required")
    }

    if (!grnData.transporter.trim()) {
      errors.push("Transporter is required")
    }

    if (grnData.lines.length === 0) {
      errors.push("At least one line item is required")
    }

    grnData.lines.forEach((line, index) => {
      if (!line.sku.trim()) {
        errors.push(`Line ${index + 1}: SKU is required`)
      }
      if (line.qtyCS === 0 && line.qtyEA === 0) {
        errors.push(`Line ${index + 1}: Quantity is required`)
      }
      if (line.purchaseRate <= 0) {
        errors.push(`Line ${index + 1}: Purchase rate must be greater than 0`)
      }
    })

    return errors
  }

  const saveDraft = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/grn/rcpl/draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(grnData)
      })

      if (response.ok) {
        alert('Draft saved successfully!')
        setGrnData(prev => ({ ...prev, status: 'draft' }))
      } else {
        throw new Error('Failed to save draft')
      }
    } catch (error) {
      console.error('Error saving draft:', error)
      alert('Failed to save draft')
    } finally {
      setLoading(false)
    }
  }

  const postGRN = async () => {
    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      alert(`Validation errors:\n${validationErrors.slice(0, 3).join('\n')}`)
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/grn/rcpl/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(grnData)
      })

      if (response.ok) {
        alert('GRN posted successfully!')
        setGrnData(prev => ({ ...prev, status: 'posted' }))
      } else {
        throw new Error('Failed to post GRN')
      }
    } catch (error) {
      console.error('Error posting GRN:', error)
      alert('Failed to post GRN')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">GRN (RCPL)</h1>
          <p className="text-gray-600">Generate goods receipt note manually</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            grnData.status === 'draft' 
              ? 'bg-yellow-100 text-yellow-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {grnData.status === 'draft' ? 'Draft' : 'Posted'}
          </span>
        </div>
      </div>

      {/* Invoice Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Invoice Header
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="invoiceNo">Invoice Number *</Label>
              <Input
                id="invoiceNo"
                value={grnData.invoiceNo}
                onChange={(e) => setGrnData(prev => ({ ...prev, invoiceNo: e.target.value }))}
                placeholder="Enter invoice number"
                maxLength={30}
              />
            </div>
            <div>
              <Label htmlFor="invoiceDate">Invoice Date *</Label>
              <Input
                id="invoiceDate"
                type="date"
                value={grnData.invoiceDate}
                onChange={(e) => setGrnData(prev => ({ ...prev, invoiceDate: e.target.value }))}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <Label htmlFor="supplier">Supplier *</Label>
              <select
                id="supplier"
                value={grnData.supplier}
                onChange={(e) => setGrnData(prev => ({ 
                  ...prev, 
                  supplier: e.target.value as 'RCPL' | 'Non RCPL',
                  sellerCode: e.target.value === 'RCPL' ? '' : prev.sellerCode
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--button-blue))] focus:border-[hsl(var(--button-blue))]"
              >
                <option value="RCPL">RCPL</option>
                <option value="Non RCPL">Non RCPL</option>
              </select>
            </div>
          </div>

          {grnData.supplier === 'Non RCPL' && (
            <div className="mt-4">
              <Label htmlFor="sellerCode">Seller Code *</Label>
              <select
                id="sellerCode"
                value={grnData.sellerCode}
                onChange={(e) => setGrnData(prev => ({ 
                  ...prev, 
                  sellerCode: e.target.value as 'Anchor Distributor' | 'Sub Distributor' 
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--button-blue))] focus:border-[hsl(var(--button-blue))]"
              >
                <option value="">Select Seller Code</option>
                <option value="Anchor Distributor">Anchor Distributor</option>
                <option value="Sub Distributor">Sub Distributor</option>
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <Label htmlFor="lrNumber">LR Number *</Label>
              <Input
                id="lrNumber"
                value={grnData.lrNumber}
                onChange={(e) => setGrnData(prev => ({ ...prev, lrNumber: e.target.value }))}
                placeholder="Enter LR number"
              />
            </div>
            <div>
              <Label htmlFor="lrName">LR Name *</Label>
              <Input
                id="lrName"
                value={grnData.lrName}
                onChange={(e) => setGrnData(prev => ({ ...prev, lrName: e.target.value }))}
                placeholder="Enter LR name"
              />
            </div>
            <div>
              <Label htmlFor="transporter">Transporter *</Label>
              <Input
                id="transporter"
                value={grnData.transporter}
                onChange={(e) => setGrnData(prev => ({ ...prev, transporter: e.target.value }))}
                placeholder="Enter transporter name"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Line Items Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Line Items
            </span>
            <Button onClick={addLine} variant="jiomart" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Line
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {grnData.lines.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No line items added. Click "Add Line" to start.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-[1200px]">
                {/* Table Container */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  {/* Header Row */}
                  <div className="bg-gray-50 border-b-2 border-gray-200">
                    <div className="grid grid-cols-11 gap-0 text-sm font-semibold text-gray-700">
                      <div className="p-3 text-center w-10">✓</div>
                      <div className="p-3 text-left w-32">Article ID</div>
                      <div className="p-3 text-left w-24">Mfg Month-Year</div>
                      <div className="p-3 text-right w-20">Purchase QTY</div>
                      <div className="p-3 text-right w-24">Purchase Rate</div>
                      <div className="p-3 text-right w-28">Purchase Value</div>
                      <div className="p-3 text-right w-24">Discount (Rs)</div>
                      <div className="p-3 text-right w-20">CGST (Rs)</div>
                      <div className="p-3 text-right w-20">SGST (Rs)</div>
                      <div className="p-3 text-right w-20">IGST (Rs)</div>
                      <div className="p-3 text-right w-24">Total (Rs)</div>
                    </div>
                  </div>

                  {/* Table Body */}
                  <div className="divide-y divide-gray-100">
                    {grnData.lines.map((line, index) => (
                      <div 
                        key={line.id} 
                        className={`grid grid-cols-11 gap-0 min-h-12 hover:bg-gray-50 transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        } ${line.selected ? 'bg-blue-50' : ''}`}
                      >
                        {/* Checkbox */}
                        <div className="p-3 flex items-center justify-center w-10">
                          <input
                            type="checkbox"
                            checked={line.selected}
                            onChange={() => toggleLineSelection(line.id)}
                            className="w-4 h-4 border-2 border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        {/* Article ID */}
                        <div className="p-3 text-left w-32">
                          <div className="relative">
                            <Input
                              value={line.sku}
                              onChange={(e) => {
                                updateLine(line.id, 'sku', e.target.value)
                                setSkuSearchTerm(e.target.value)
                              }}
                              placeholder="Search SKU"
                              className="pr-8 text-sm border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                              maxLength={20}
                            />
                            <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          </div>
                          {line.articleName && (
                            <p className="text-xs text-gray-500 mt-1 truncate">{line.articleName}</p>
                          )}
                          {skuSearchTerm && filteredSkus.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                              {filteredSkus.map(sku => (
                                <div
                                  key={sku}
                                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                  onClick={() => {
                                    updateLine(line.id, 'sku', sku)
                                    setSkuSearchTerm("")
                                  }}
                                >
                                  {sku}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Mfg Month-Year */}
                        <div className="p-3 text-left w-24">
                          <div className="flex gap-1">
                            <select
                              value={line.mfgMonth}
                              onChange={(e) => updateLine(line.id, 'mfgMonth', parseInt(e.target.value))}
                              className="w-1/2 px-2 py-1 border border-gray-300 rounded text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            >
                              {months.map(month => (
                                <option key={month.value} value={month.value}>
                                  {month.label}
                                </option>
                              ))}
                            </select>
                            <select
                              value={line.mfgYear}
                              onChange={(e) => updateLine(line.id, 'mfgYear', parseInt(e.target.value))}
                              className="w-1/2 px-2 py-1 border border-gray-300 rounded text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            >
                              {years.map(year => (
                                <option key={year} value={year}>
                                  {year}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Purchase QTY */}
                        <div className="p-3 text-right w-20">
                          <Input
                            type="number"
                            value={line.qtyCS}
                            onChange={(e) => updateLine(line.id, 'qtyCS', parseInt(e.target.value) || 0)}
                            min="0"
                            placeholder="Qty"
                            className="text-sm text-right font-mono border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        </div>

                        {/* Purchase Rate */}
                        <div className="p-3 text-right w-24">
                          <Input
                            type="number"
                            step="0.01"
                            value={line.purchaseRate}
                            onChange={(e) => updateLine(line.id, 'purchaseRate', parseFloat(e.target.value) || 0)}
                            min="0"
                            placeholder="Rate"
                            className="text-sm text-right font-mono border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        </div>

                        {/* Purchase Value */}
                        <div className="p-3 text-right w-28">
                          <Input
                            type="number"
                            step="0.01"
                            value={line.purchaseValue}
                            onChange={(e) => updateLine(line.id, 'purchaseValue', parseFloat(e.target.value) || 0)}
                            min="0"
                            placeholder="Value"
                            className="text-sm text-right font-mono border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        </div>

                        {/* Discount */}
                        <div className="p-3 text-right w-24">
                          <Input
                            type="number"
                            step="0.01"
                            value={line.discountAmount}
                            onChange={(e) => updateLine(line.id, 'discountAmount', parseFloat(e.target.value) || 0)}
                            min="0"
                            placeholder="Discount"
                            className="text-sm text-right font-mono border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        </div>

                        {/* CGST */}
                        <div className="p-3 text-right w-20">
                          <Input
                            type="number"
                            step="0.01"
                            value={line.cgstAmount}
                            onChange={(e) => updateLine(line.id, 'cgstAmount', parseFloat(e.target.value) || 0)}
                            min="0"
                            placeholder="CGST"
                            className="text-sm text-right font-mono border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        </div>

                        {/* SGST */}
                        <div className="p-3 text-right w-20">
                          <Input
                            type="number"
                            step="0.01"
                            value={line.sgstAmount}
                            onChange={(e) => updateLine(line.id, 'sgstAmount', parseFloat(e.target.value) || 0)}
                            min="0"
                            placeholder="SGST"
                            className="text-sm text-right font-mono border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        </div>

                        {/* IGST */}
                        <div className="p-3 text-right w-20">
                          <Input
                            type="number"
                            step="0.01"
                            value={line.igstAmount}
                            onChange={(e) => updateLine(line.id, 'igstAmount', parseFloat(e.target.value) || 0)}
                            min="0"
                            placeholder="IGST"
                            className="text-sm text-right font-mono border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        </div>

                        {/* Total */}
                        <div className="p-3 text-right w-24">
                          <Input
                            type="number"
                            step="0.01"
                            value={line.totalAmount}
                            onChange={(e) => updateLine(line.id, 'totalAmount', parseFloat(e.target.value) || 0)}
                            min="0"
                            placeholder="Total"
                            className="text-sm text-right font-mono font-bold bg-blue-50 border-blue-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary Row */}
                  <div className="bg-gray-100 border-t-2 border-gray-300">
                    <div className="grid grid-cols-11 gap-0 text-sm font-semibold">
                      <div className="p-3 text-center w-10">Total</div>
                      <div className="p-3 text-left w-32"></div>
                      <div className="p-3 text-left w-24"></div>
                      <div className="p-3 text-right w-20 font-mono">₹{grnData.totalQtyCS.toLocaleString()}</div>
                      <div className="p-3 text-right w-24"></div>
                      <div className="p-3 text-right w-28 font-mono">₹{grnData.lines.reduce((sum, line) => sum + line.purchaseValue, 0).toLocaleString()}</div>
                      <div className="p-3 text-right w-24 font-mono">₹{grnData.lines.reduce((sum, line) => sum + line.discountAmount, 0).toLocaleString()}</div>
                      <div className="p-3 text-right w-20 font-mono">₹{grnData.lines.reduce((sum, line) => sum + line.cgstAmount, 0).toLocaleString()}</div>
                      <div className="p-3 text-right w-20 font-mono">₹{grnData.lines.reduce((sum, line) => sum + line.sgstAmount, 0).toLocaleString()}</div>
                      <div className="p-3 text-right w-20 font-mono">₹{grnData.lines.reduce((sum, line) => sum + line.igstAmount, 0).toLocaleString()}</div>
                      <div className="p-3 text-right w-24 font-mono font-bold text-green-600">₹{grnData.totalValue.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Footer Totals */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Quantity (CS)</p>
              <p className="text-2xl font-bold">{grnData.totalQtyCS.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Quantity (EA)</p>
              <p className="text-2xl font-bold">{grnData.totalQtyEA.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Value (₹)</p>
              <p className="text-2xl font-bold">₹{grnData.totalValue.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Taxation Data Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Taxation Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          {grnData.lines.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No line items to calculate taxes.
            </div>
          ) : (
            <div className="space-y-4">
              {grnData.lines.map((line, index) => (
                <div key={line.id} className="border border-gray-200 rounded-lg p-4 mb-4 hover:bg-gray-50 transition-colors">
                  {/* Master Row - Item ID and Basic Info */}
                  <div className="grid grid-cols-12 gap-3 items-center mb-3">
                    <div className="col-span-1 w-12 flex justify-center">
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <div className="col-span-11">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{line.sku || 'SKU Not Set'}</p>
                          {line.articleName && (
                            <p className="text-xs text-gray-500">{line.articleName}</p>
                          )}
                        </div>
                        <div className="ml-auto text-right">
                          <p className="text-sm font-medium text-gray-900">Purchase Value: ₹{line.purchaseValue.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">Qty: {line.qtyCS} CS</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sub Row - Tax Breakdown */}
                  <div className="grid grid-cols-6 gap-4 items-center">
                    <div className="col-span-1">
                      <div className="text-center">
                        <p className="text-xs text-gray-600 mb-1">Discount</p>
                        <p className="text-sm font-medium text-red-600">₹{line.discountAmount.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="col-span-1">
                      <div className="text-center">
                        <p className="text-xs text-gray-600 mb-1">CGST</p>
                        <p className="text-sm font-medium text-orange-600">₹{line.cgstAmount.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="col-span-1">
                      <div className="text-center">
                        <p className="text-xs text-gray-600 mb-1">SGST</p>
                        <p className="text-sm font-medium text-orange-600">₹{line.sgstAmount.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="col-span-1">
                      <div className="text-center">
                        <p className="text-xs text-gray-600 mb-1">IGST</p>
                        <p className="text-sm font-medium text-orange-600">₹{line.igstAmount.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="col-span-1">
                      <div className="text-center">
                        <p className="text-xs text-gray-600 mb-1">Total Tax</p>
                        <p className="text-sm font-medium text-blue-600">₹{(line.cgstAmount + line.sgstAmount + line.igstAmount).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="col-span-1">
                      <div className="text-center">
                        <p className="text-xs text-gray-600 mb-1">Net Total</p>
                        <p className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded">₹{line.totalAmount.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Summary Row */}
              <div className="border-t-2 border-gray-300 pt-4 mt-6">
                <div className="grid grid-cols-6 gap-4 items-center">
                  <div className="col-span-1">
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">Total Discount</p>
                      <p className="text-sm font-bold text-red-600">₹{grnData.lines.reduce((sum, line) => sum + line.discountAmount, 0).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">Total CGST</p>
                      <p className="text-sm font-bold text-orange-600">₹{grnData.lines.reduce((sum, line) => sum + line.cgstAmount, 0).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">Total SGST</p>
                      <p className="text-sm font-bold text-orange-600">₹{grnData.lines.reduce((sum, line) => sum + line.sgstAmount, 0).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">Total IGST</p>
                      <p className="text-sm font-bold text-orange-600">₹{grnData.lines.reduce((sum, line) => sum + line.igstAmount, 0).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">Total Tax</p>
                      <p className="text-sm font-bold text-blue-600">₹{grnData.lines.reduce((sum, line) => sum + line.cgstAmount + line.sgstAmount + line.igstAmount, 0).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">Grand Total</p>
                      <p className="text-lg font-bold text-green-600 bg-green-50 px-3 py-2 rounded">₹{grnData.lines.reduce((sum, line) => sum + line.totalAmount, 0).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Footer Actions */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button onClick={addLine} variant="jiomart" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Line
          </Button>
          <Button 
            onClick={deleteSelectedLines}
            variant="outline" 
            className="flex items-center gap-2"
            disabled={!grnData.lines.some(line => line.selected)}
          >
            <Trash2 className="h-4 w-4" />
            Delete Selected
          </Button>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={saveDraft}
            variant="outline"
            className="flex items-center gap-2"
            disabled={loading}
          >
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
          <Button 
            onClick={postGRN}
            variant="jiomart"
            className="flex items-center gap-2"
            disabled={loading || grnData.status === 'posted'}
          >
            <CheckCircle className="h-4 w-4" />
            Post GRN
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {errors.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <h3 className="font-medium text-red-800">Validation Errors</h3>
            </div>
            <ul className="text-sm text-red-700 space-y-1">
              {errors.slice(0, 3).map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
              {errors.length > 3 && (
                <li>• ... and {errors.length - 3} more errors</li>
              )}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 