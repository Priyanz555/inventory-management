"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  ArrowLeft, 
  Upload,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Package
} from "lucide-react"
import Link from "next/link"

interface OrderItem {
  articleId: string
  articleName: string
  quantityEA: number
  quantityCA: number
  rate: number
  price: number
  value: number
  discount: number
  cgstAmount: number
  igstAmount: number
  sgstAmount: number
  totalAmount: number
}

interface Order {
  id: string
  itemCount: number
  orderValue: number
  orderDate: string
  status: string
  invoiceId: string
  items: OrderItem[]
}

interface GRNItem {
  articleId: string
  articleName: string
  batchId: string
  expiryDate: string
  mrp: number
  ptr: number
  plannedQty: number
  damagedQty: number
  lostQty: number
  discountPercent: number
  marginPercent: number
}

interface GRNPageProps {
  params: {
    orderId: string
  }
}

export default function GRNPage({ params }: GRNPageProps) {
  const [order, setOrder] = useState<Order | null>(null)
  const [grnStep, setGrnStep] = useState(1)
  const [grnItems, setGrnItems] = useState<GRNItem[]>([])
  const [itemCondition, setItemCondition] = useState("good")
  const [lorryReceiptFile, setLorryReceiptFile] = useState<File | null>(null)

  // Mock order data - in real app, this would be fetched from API
  const mockOrder: Order = {
    id: params.orderId,
    itemCount: 3,
    orderValue: 234000,
    orderDate: "2024-01-20",
    status: "Delivered",
    invoiceId: "INV-2024-003",
    items: [
      {
        articleId: "ART-004",
        articleName: "Amul Bitter Chocolate- 75% Rich In Cocoa, 150 g",
        quantityEA: 18000,
        quantityCA: 600,
        rate: 196,
        price: 80000,
        value: 80000,
        discount: 4000,
        cgstAmount: 6840,
        igstAmount: 0,
        sgstAmount: 6840,
        totalAmount: 82880
      },
      {
        articleId: "ART-005",
        articleName: "Amul Tropical Orange- Dark Chocolate Infused",
        quantityEA: 18000,
        quantityCA: 600,
        rate: 100.5,
        price: 100000,
        value: 100000,
        discount: 5000,
        cgstAmount: 8550,
        igstAmount: 0,
        sgstAmount: 8550,
        totalAmount: 103550
      },
      {
        articleId: "ART-006",
        articleName: "Mango Mango Drink 600 ml",
        quantityEA: 12000,
        quantityCA: 400,
        rate: 45,
        price: 54000,
        value: 54000,
        discount: 2700,
        cgstAmount: 4615,
        igstAmount: 0,
        sgstAmount: 4615,
        totalAmount: 55915
      }
    ]
  }

  useEffect(() => {
    setOrder(mockOrder)
    
    // Initialize GRN items from order items
    const initialGrnItems: GRNItem[] = mockOrder.items.map(item => ({
      articleId: item.articleId,
      articleName: item.articleName,
      batchId: `BATCH-${item.articleId}`,
      expiryDate: "2024-12-31",
      mrp: item.rate * 1.2, // 20% markup for MRP
      ptr: item.rate,
      plannedQty: item.quantityEA,
      damagedQty: 0,
      lostQty: 0,
      discountPercent: (item.discount / item.value) * 100,
      marginPercent: 15
    }))
    setGrnItems(initialGrnItems)
  }, [params.orderId])

  const handleGRNComplete = () => {
    // Update order status to "GRN Created"
    if (order) {
      console.log("GRN Created for order:", order.id)
      // In a real app, this would update the database
    }
    // Redirect back to orders page
    window.location.href = "/orders/primary"
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setLorryReceiptFile(file)
    }
  }

  const updateGrnItem = (index: number, field: keyof GRNItem, value: string | number) => {
    const updatedItems = [...grnItems]
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    setGrnItems(updatedItems)
  }

  if (!order) {
    return <div>Loading...</div>
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
            <h1 className="text-2xl font-bold text-gray-900">Create GRN</h1>
            <p className="text-gray-600">Generate goods receipt note for Order ID: {order.id}</p>
          </div>
        </div>
      </div>

      {/* Order Information */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-900">Order ID</p>
              <p className="text-gray-600">{order.id}</p>
            </div>
            <div>
              <p className="font-medium text-gray-900">Invoice ID</p>
              <p className="text-gray-600">{order.invoiceId}</p>
            </div>
            <div>
              <p className="font-medium text-gray-900">Order Date</p>
              <p className="text-gray-600">{order.orderDate}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center ${grnStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              grnStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}>
              {grnStep > 1 ? <CheckCircle className="h-4 w-4" /> : '1'}
            </div>
            <span className="ml-2 font-medium">Select Items</span>
          </div>
          <div className={`w-16 h-0.5 ${grnStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
          <div className={`flex items-center ${grnStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              grnStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}>
              {grnStep > 2 ? <CheckCircle className="h-4 w-4" /> : '2'}
            </div>
            <span className="ml-2 font-medium">Review Details</span>
          </div>
          <div className={`w-16 h-0.5 ${grnStep >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
          <div className={`flex items-center ${grnStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              grnStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}>
              {grnStep > 3 ? <CheckCircle className="h-4 w-4" /> : '3'}
            </div>
            <span className="ml-2 font-medium">Confirm</span>
          </div>
        </div>
      </div>

      {/* Step Content */}
      {grnStep === 1 && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Item Details</h3>
                <p className="text-sm text-gray-600 mb-4">{grnItems.length} Items • {grnItems.reduce((sum, item) => sum + item.plannedQty, 0)} Qty</p>
                
                <div className="space-y-4">
                  {grnItems.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{item.articleName}</h4>
                          <p className="text-sm text-gray-600">₹{item.ptr}/pc</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">₹{(item.ptr * item.plannedQty).toLocaleString()}</p>
                          <p className="text-sm text-gray-600">Outer case (30 pc/case) : {Math.ceil(item.plannedQty / 30)} Case</p>
                          <p className="text-sm text-gray-600">Qty: {item.plannedQty}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  onClick={() => setGrnStep(2)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {grnStep === 2 && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Item Condition</h3>
                <div className="space-y-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      value="good"
                      checked={itemCondition === "good"}
                      onChange={(e) => setItemCondition(e.target.value)}
                      className="text-blue-600"
                    />
                    <span className="text-gray-900">Received all items in good condition</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      value="damaged"
                      checked={itemCondition === "damaged"}
                      onChange={(e) => setItemCondition(e.target.value)}
                      className="text-blue-600"
                    />
                    <span className="text-gray-900">Some items were damaged or lost</span>
                  </label>
                </div>
              </div>

              {itemCondition === "damaged" && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Item Details</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="border border-gray-300 px-4 py-2 text-left">Item ID</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Item Name</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Batch ID</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Exp-date</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">MRP</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">PTR</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Planned Qty</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Damaged Qty</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Lost Qty</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Dsc%</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Margin%</th>
                        </tr>
                      </thead>
                      <tbody>
                        {grnItems.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 text-sm">{item.articleId}</td>
                            <td className="border border-gray-300 px-4 py-2 text-sm">{item.articleName}</td>
                            <td className="border border-gray-300 px-4 py-2 text-sm">{item.batchId}</td>
                            <td className="border border-gray-300 px-4 py-2 text-sm">{item.expiryDate}</td>
                            <td className="border border-gray-300 px-4 py-2 text-sm">₹{item.mrp}</td>
                            <td className="border border-gray-300 px-4 py-2 text-sm">₹{item.ptr}</td>
                            <td className="border border-gray-300 px-4 py-2 text-sm">
                              <Input
                                type="number"
                                value={item.plannedQty}
                                onChange={(e) => updateGrnItem(index, 'plannedQty', parseInt(e.target.value) || 0)}
                                className="w-20"
                              />
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-sm">
                              <Input
                                type="number"
                                value={item.damagedQty}
                                onChange={(e) => updateGrnItem(index, 'damagedQty', parseInt(e.target.value) || 0)}
                                className="w-20"
                              />
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-sm">
                              <Input
                                type="number"
                                value={item.lostQty}
                                onChange={(e) => updateGrnItem(index, 'lostQty', parseInt(e.target.value) || 0)}
                                className="w-20"
                              />
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-sm">{item.discountPercent}%</td>
                            <td className="border border-gray-300 px-4 py-2 text-sm">{item.marginPercent}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Lorry Receipt</h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Upload lorry receipt document</p>
                  <div className="flex items-center space-x-4">
                    <Input
                      type="file"
                      accept=".pdf,.jpeg,.jpg,.png"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="lorry-receipt"
                    />
                    <Button
                      onClick={() => document.getElementById('lorry-receipt')?.click()}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Upload
                    </Button>
                    {lorryReceiptFile && (
                      <span className="text-sm text-gray-600">{lorryReceiptFile.name}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">pdf/jpeg/png under 2 MB</p>
                </div>
              </div>

              <div className="flex justify-between space-x-4">
                <Button
                  onClick={() => setGrnStep(1)}
                  variant="outline"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <Button
                  onClick={() => setGrnStep(3)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {grnStep === 3 && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Review Details</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Order Summary</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><span className="font-medium">Order ID:</span> {order.id}</p>
                      <p><span className="font-medium">Invoice ID:</span> {order.invoiceId}</p>
                      <p><span className="font-medium">Total Items:</span> {grnItems.length}</p>
                      <p><span className="font-medium">Total Quantity:</span> {grnItems.reduce((sum, item) => sum + item.plannedQty, 0)}</p>
                    </div>
                    <div>
                      <p><span className="font-medium">Item Condition:</span> {itemCondition === "good" ? "Good" : "Damaged/Lost"}</p>
                      <p><span className="font-medium">Lorry Receipt:</span> {lorryReceiptFile ? "Uploaded" : "Not uploaded"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between space-x-4">
                <Button
                  onClick={() => setGrnStep(2)}
                  variant="outline"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <Button
                  onClick={handleGRNComplete}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Create GRN
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 