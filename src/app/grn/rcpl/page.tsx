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
  User,
  ChevronDown,
  ChevronRight,
  Calculator,
  Receipt,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"

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
  cessAmount: number
  keralaFloodCessAmount: number
  totalAmount: number
  mfgMonth: number
  mfgYear: number
  qtyCS: number
  qtyEA: number
  baseUnit: 'CS' | 'EA'
  ptd: number
  cgstPct: number
  sgstPct: number
  igstPct: number
  cessPct: number
  keralaFloodCessPct: number
  lineTotal: number
  selected: boolean
}

interface GRNData {
  orderId: string
  invoiceNo: string
  invoiceDate: string
  supplier: string
  supplierName: string
  supplierAddress: string
  supplierGst: string
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
    orderId: "",
    invoiceNo: "",
    invoiceDate: "",
    supplier: "RCPL",
    supplierName: "Reliance Consumer Products Limited",
    supplierAddress: "Reliance Corporate Park, Thane Belapur Road, Ghansoli, Navi Mumbai - 400701",
    supplierGst: "27AAACR5055K1Z5",
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
  const [supplierSearchTerm, setSupplierSearchTerm] = useState("")
  const [filteredSuppliers, setFilteredSuppliers] = useState<any[]>([])
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false)
  const [expandedLines, setExpandedLines] = useState<Set<string>>(new Set())

  // Mock SKU data for autocomplete
  const mockSkus = [
    "SKU001", "SKU002", "SKU003", "SKU004", "SKU005",
    "COCA-COLA-500ML", "PEPSI-1L", "SPRITE-330ML", "FANTA-500ML"
  ]

  // Mock supplier data
  const mockSuppliers = [
    {
      code: "RCPL",
      name: "Reliance Consumer Products Limited",
      address: "Reliance Corporate Park, Thane Belapur Road, Ghansoli, Navi Mumbai - 400701",
      gst: "27AAACR5055K1Z5"
    },
    {
      code: "DIST001",
      name: "Mumbai Central Distributors",
      address: "123, Andheri West, Mumbai - 400058",
      gst: "27AABCM1234A1Z1"
    },
    {
      code: "DIST002", 
      name: "Delhi North Distributors",
      address: "456, Connaught Place, New Delhi - 110001",
      gst: "07AABCD5678B2Z2"
    },
    {
      code: "DIST003",
      name: "Bangalore South Distributors", 
      address: "789, MG Road, Bangalore - 560001",
      gst: "29AABCE9012C3Z3"
    }
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

  // Filter suppliers based on search term
  useEffect(() => {
    if (supplierSearchTerm) {
      const filtered = mockSuppliers.filter(supplier => 
        supplier.name.toLowerCase().includes(supplierSearchTerm.toLowerCase()) ||
        supplier.code.toLowerCase().includes(supplierSearchTerm.toLowerCase())
      )
      setFilteredSuppliers(filtered)
      setShowSupplierDropdown(true)
    } else {
      setFilteredSuppliers([])
      setShowSupplierDropdown(false)
    }
  }, [supplierSearchTerm])

  const calculateLineTotal = (line: GRNLine): number => {
    const totalQty = line.qtyCS + (line.qtyEA / 24) // Assuming 24 units per case
    const baseValue = totalQty * line.ptd
    const cgst = (baseValue * line.cgstPct) / 100
    const sgst = (baseValue * line.sgstPct) / 100
    const igst = (baseValue * line.igstPct) / 100
    const cess = (baseValue * line.cessPct) / 100
    const keralaFloodCess = (baseValue * line.keralaFloodCessPct) / 100
    return Math.round(baseValue + cgst + sgst + igst + cess + keralaFloodCess)
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
      cessAmount: 0,
      keralaFloodCessAmount: 0,
      totalAmount: 0,
      mfgMonth: 1,
      mfgYear: 2024,
      qtyCS: 0,
      qtyEA: 0,
      baseUnit: 'CS',
      ptd: 0,
      cgstPct: 0,
      sgstPct: 0,
      igstPct: 0,
      cessPct: 0,
      keralaFloodCessPct: 0,
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
          if (field === 'purchaseValue' || field === 'cessPct') {
            updatedLine.cessAmount = (updatedLine.purchaseValue * updatedLine.cessPct) / 100
          }
          if (field === 'purchaseValue' || field === 'keralaFloodCessPct') {
            updatedLine.keralaFloodCessAmount = (updatedLine.purchaseValue * updatedLine.keralaFloodCessPct) / 100
          }

          // Calculate total amount
          updatedLine.totalAmount = updatedLine.purchaseValue - updatedLine.discountAmount + 
                                   updatedLine.cgstAmount + updatedLine.sgstAmount + updatedLine.igstAmount +
                                   updatedLine.cessAmount + updatedLine.keralaFloodCessAmount

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

  const toggleLineExpansion = (lineId: string) => {
    setExpandedLines(prev => {
      const newSet = new Set(prev)
      if (newSet.has(lineId)) {
        newSet.delete(lineId)
      } else {
        newSet.add(lineId)
      }
      return newSet
    })
  }

  const expandAllLines = () => {
    setExpandedLines(new Set(grnData.lines.map(line => line.id)))
  }

  const collapseAllLines = () => {
    setExpandedLines(new Set())
  }

  const validateForm = (): string[] => {
    const errors: string[] = []

    if (!grnData.orderId.trim()) {
      errors.push("Order ID is required")
    }

    if (!grnData.invoiceNo.trim()) {
      errors.push("Invoice number is required")
    }

    if (!grnData.invoiceDate) {
      errors.push("Invoice date is required")
    }

    if (!grnData.supplier.trim()) {
      errors.push("Supply source is required")
    }

    if (grnData.supplier !== 'RCPL' && !grnData.sellerCode) {
      errors.push("Seller code is required for non-RCPL suppliers")
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
      if (!line.baseUnit) {
        errors.push(`Line ${index + 1}: Base unit is required`)
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

  const generatePurchaseRegister = () => {
    // Create CSV content for purchase register
    const headers = [
      'Invoice No', 'Invoice Date', 'Supplier', 'Supplier Name', 'Supplier GST',
      'SKU', 'Article Name', 'Base Unit', 'Quantity CS', 'Quantity EA',
      'Purchase Rate', 'Purchase Value', 'Discount', 'CGST', 'SGST', 'IGST', 'CESS', 'Kerala Flood Cess', 'Total'
    ]
    
    const rows = grnData.lines.map(line => [
      grnData.invoiceNo,
      grnData.invoiceDate,
      grnData.supplier,
      grnData.supplierName,
      grnData.supplierGst,
      line.sku,
      line.articleName,
      line.baseUnit,
      line.qtyCS,
      line.qtyEA,
      line.purchaseRate,
      line.purchaseValue,
      line.discountAmount,
      line.cgstAmount,
      line.sgstAmount,
      line.igstAmount,
      line.cessAmount,
      line.keralaFloodCessAmount,
      line.totalAmount
    ])
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `purchase_register_${grnData.invoiceNo}_${grnData.invoiceDate}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/orders/primary">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">GRN (RCPL)</h1>
            <p className="text-gray-600">Generate goods receipt note manually</p>
          </div>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="orderId">Order ID *</Label>
              <Input
                id="orderId"
                value={grnData.orderId}
                onChange={(e) => setGrnData(prev => ({ ...prev, orderId: e.target.value }))}
                placeholder="Enter order ID"
                maxLength={30}
              />
            </div>
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
              <Label htmlFor="supplier">Supply Source *</Label>
              <div className="relative">
                <Input
                  id="supplier"
                  value={supplierSearchTerm}
                  onChange={(e) => setSupplierSearchTerm(e.target.value)}
                  placeholder="Search for RCPL or other distributors..."
                  className="pr-8"
                />
                <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              {showSupplierDropdown && filteredSuppliers.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                  {filteredSuppliers.map(supplier => (
                    <div
                      key={supplier.code}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b border-gray-100"
                      onClick={() => {
                        setGrnData(prev => ({
                          ...prev,
                          supplier: supplier.code,
                          supplierName: supplier.name,
                          supplierAddress: supplier.address,
                          supplierGst: supplier.gst,
                          sellerCode: supplier.code === 'RCPL' ? '' : prev.sellerCode
                        }))
                        setSupplierSearchTerm(supplier.name)
                        setShowSupplierDropdown(false)
                      }}
                    >
                      <div className="font-medium">{supplier.name}</div>
                      <div className="text-xs text-gray-500">{supplier.code}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Supplier Details Display */}
          {grnData.supplierName && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                <Building className="h-4 w-4" />
                Supplier Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-blue-700 font-medium">Name:</p>
                  <p className="text-blue-900">{grnData.supplierName}</p>
                </div>
                <div>
                  <p className="text-blue-700 font-medium">Address:</p>
                  <p className="text-blue-900">{grnData.supplierAddress}</p>
                </div>
                <div>
                  <p className="text-blue-700 font-medium">GST Number:</p>
                  <p className="text-blue-900 font-mono">{grnData.supplierGst}</p>
                </div>
              </div>
            </div>
          )}

          {grnData.supplier !== 'RCPL' && grnData.supplier && (
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

      {/* Line Items Grid - New Card-Based Design */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Line Items ({grnData.lines.length})
            </span>
            <div className="flex items-center gap-2">
              <Button 
                onClick={expandAllLines} 
                variant="outline" 
                size="sm"
                className="text-xs"
              >
                Expand All
              </Button>
              <Button 
                onClick={collapseAllLines} 
                variant="outline" 
                size="sm"
                className="text-xs"
              >
                Collapse All
              </Button>
              <Button onClick={addLine} variant="jiomart" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Line
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {grnData.lines.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No line items added</p>
              <p className="text-sm">Click "Add Line" to start adding items to your GRN</p>
            </div>
          ) : (
            <div className="space-y-4">
              {grnData.lines.map((line, index) => {
                const isExpanded = expandedLines.has(line.id)
                return (
                  <div key={line.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    {/* Main Line Item Card */}
                    <div className={`p-4 ${line.selected ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'bg-white'}`}>
                      <div className="flex items-center gap-4">
                        {/* Selection Checkbox */}
                        <div className="flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={line.selected}
                            onChange={() => toggleLineSelection(line.id)}
                            className="w-4 h-4 border-2 border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        {/* Line Number */}
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                            {index + 1}
                          </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                          {/* SKU and Article Name */}
                          <div className="col-span-2">
                            <div className="relative">
                              <Label className="text-xs text-gray-600 mb-1 block">Article ID</Label>
                              <Input
                                value={line.sku}
                                onChange={(e) => {
                                  updateLine(line.id, 'sku', e.target.value)
                                  setSkuSearchTerm(e.target.value)
                                }}
                                placeholder="Search SKU"
                                className="pr-8 text-sm"
                                maxLength={20}
                              />
                              <Search className="absolute right-2 top-6 h-4 w-4 text-gray-400" />
                              {line.articleName && (
                                <p className="text-xs text-gray-500 mt-1 truncate">{line.articleName}</p>
                              )}
                            </div>
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

                          {/* Quantity and Base Unit */}
                          <div>
                            <Label className="text-xs text-gray-600 mb-1 block">Quantity</Label>
                            <div className="flex gap-1">
                              <Input
                                type="number"
                                value={line.qtyCS}
                                onChange={(e) => updateLine(line.id, 'qtyCS', parseInt(e.target.value) || 0)}
                                min="0"
                                placeholder="CS"
                                className="text-sm text-center"
                              />
                              <select
                                value={line.baseUnit}
                                onChange={(e) => updateLine(line.id, 'baseUnit', e.target.value as 'CS' | 'EA')}
                                className="px-2 py-1 border border-gray-300 rounded text-xs"
                              >
                                <option value="CS">CS</option>
                                <option value="EA">EA</option>
                              </select>
                            </div>
                          </div>

                          {/* Purchase Rate */}
                          <div>
                            <Label className="text-xs text-gray-600 mb-1 block">Rate (₹)</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={line.purchaseRate}
                              onChange={(e) => updateLine(line.id, 'purchaseRate', parseFloat(e.target.value) || 0)}
                              min="0"
                              placeholder="0.00"
                              className="text-sm font-mono"
                            />
                          </div>

                          {/* Purchase Value */}
                          <div>
                            <Label className="text-xs text-gray-600 mb-1 block">Value (₹)</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={line.purchaseValue}
                              onChange={(e) => updateLine(line.id, 'purchaseValue', parseFloat(e.target.value) || 0)}
                              min="0"
                              placeholder="0.00"
                              className="text-sm font-mono bg-gray-50"
                            />
                          </div>

                          {/* Total Amount */}
                          <div>
                            <Label className="text-xs text-gray-600 mb-1 block">Total (₹)</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={line.totalAmount}
                              onChange={(e) => updateLine(line.id, 'totalAmount', parseFloat(e.target.value) || 0)}
                              min="0"
                              placeholder="0.00"
                              className="text-sm font-mono font-bold bg-green-50 border-green-200"
                            />
                          </div>
                        </div>

                        {/* Expand/Collapse Button */}
                        <div className="flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleLineExpansion(line.id)}
                            className="p-1"
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="border-t border-gray-200 bg-gray-50 p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {/* Manufacturing Details */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Manufacturing Details
                            </h4>
                            <div className="space-y-3">
                              <div>
                                <Label className="text-xs text-gray-600 mb-1 block">Manufacturing Month-Year</Label>
                                <div className="flex gap-2">
                                  <select
                                    value={line.mfgMonth}
                                    onChange={(e) => updateLine(line.id, 'mfgMonth', parseInt(e.target.value))}
                                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
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
                                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs"
                                  >
                                    {years.map(year => (
                                      <option key={year} value={year}>
                                        {year}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Tax Breakdown */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                              <Calculator className="h-4 w-4" />
                              Tax Breakdown
                            </h4>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-600">Discount:</span>
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={line.discountAmount}
                                  onChange={(e) => updateLine(line.id, 'discountAmount', parseFloat(e.target.value) || 0)}
                                  min="0"
                                  placeholder="0.00"
                                  className="w-20 text-xs font-mono"
                                />
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-600">CGST:</span>
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={line.cgstAmount}
                                  onChange={(e) => updateLine(line.id, 'cgstAmount', parseFloat(e.target.value) || 0)}
                                  min="0"
                                  placeholder="0.00"
                                  className="w-20 text-xs font-mono"
                                />
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-600">SGST:</span>
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={line.sgstAmount}
                                  onChange={(e) => updateLine(line.id, 'sgstAmount', parseFloat(e.target.value) || 0)}
                                  min="0"
                                  placeholder="0.00"
                                  className="w-20 text-xs font-mono"
                                />
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-600">IGST:</span>
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={line.igstAmount}
                                  onChange={(e) => updateLine(line.id, 'igstAmount', parseFloat(e.target.value) || 0)}
                                  min="0"
                                  placeholder="0.00"
                                  className="w-20 text-xs font-mono"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Additional Taxes */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                              <Receipt className="h-4 w-4" />
                              Additional Taxes
                            </h4>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-600">CESS:</span>
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={line.cessAmount}
                                  onChange={(e) => updateLine(line.id, 'cessAmount', parseFloat(e.target.value) || 0)}
                                  min="0"
                                  placeholder="0.00"
                                  className="w-20 text-xs font-mono"
                                />
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-600">Kerala Flood Cess:</span>
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={line.keralaFloodCessAmount}
                                  onChange={(e) => updateLine(line.id, 'keralaFloodCessAmount', parseFloat(e.target.value) || 0)}
                                  min="0"
                                  placeholder="0.00"
                                  className="w-20 text-xs font-mono"
                                />
                              </div>
                              <div className="pt-2 border-t border-gray-200">
                                <div className="flex justify-between items-center">
                                  <span className="text-xs font-medium text-gray-700">Total Tax:</span>
                                  <span className="text-sm font-bold text-blue-600">
                                    ₹{(line.cgstAmount + line.sgstAmount + line.igstAmount + line.cessAmount + line.keralaFloodCessAmount).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Summary Card */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Summary
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-blue-700">Total Quantity (CS)</p>
                    <p className="text-xl font-bold text-blue-900">{grnData.totalQtyCS.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-blue-700">Total Quantity (EA)</p>
                    <p className="text-xl font-bold text-blue-900">{grnData.totalQtyEA.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-blue-700">Total Purchase Value</p>
                    <p className="text-xl font-bold text-blue-900">₹{grnData.lines.reduce((sum, line) => sum + line.purchaseValue, 0).toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-blue-700">Grand Total</p>
                    <p className="text-xl font-bold text-green-600">₹{grnData.totalValue.toLocaleString()}</p>
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
          <Button 
            onClick={generatePurchaseRegister}
            variant="outline"
            className="flex items-center gap-2"
            disabled={grnData.lines.length === 0}
          >
            <FileText className="h-4 w-4" />
            Generate Purchase Register
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