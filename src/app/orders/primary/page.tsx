"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  ArrowLeft, 
  Eye, 
  FileText, 
  Search,
  Calendar,
  X,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  AlertCircle
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
  status: "in-transit" | "received" | "rejected" | "returned"
  invoiceId: string
  supplier: "RCPL" | "Non RCPL"
  grnStatus: "not-started" | "in-progress" | "completed"
  rejectionReason?: string
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

const rejectionReasonCodes = [
  "Damaged Goods",
  "Wrong Items",
  "Expired Products",
  "Quantity Mismatch",
  "Quality Issues",
  "Late Delivery",
  "Packaging Issues",
  "Other"
]

export default function PrimaryOrdersPage() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchOrderId, setSearchOrderId] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)
  const [showRejectionModal, setShowRejectionModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [orderToReject, setOrderToReject] = useState<Order | null>(null)

  const primaryOrders: Order[] = [
    {
      id: "PO-2024-001",
      itemCount: 15,
      orderValue: 45000,
      orderDate: "2024-01-15",
      status: "received",
      grnStatus: "completed",
      supplier: "RCPL",
      invoiceId: "INV-2024-001",
      items: [
        {
          articleId: "ART-001",
          articleName: "Premium Rice 5kg",
          quantityEA: 50,
          quantityCA: 10,
          rate: 120,
          price: 6000,
          value: 6000,
          discount: 300,
          cgstAmount: 513,
          igstAmount: 0,
          sgstAmount: 513,
          totalAmount: 6226
        },
        {
          articleId: "ART-002",
          articleName: "Organic Wheat Flour 2kg",
          quantityEA: 100,
          quantityCA: 20,
          rate: 85,
          price: 8500,
          value: 8500,
          discount: 425,
          cgstAmount: 726,
          igstAmount: 0,
          sgstAmount: 726,
          totalAmount: 8801
        }
      ]
    },
    {
      id: "PO-2024-002",
      itemCount: 8,
      orderValue: 28500,
      orderDate: "2024-01-18",
      status: "in-transit",
      grnStatus: "not-started",
      supplier: "Non RCPL",
      invoiceId: "INV-2024-002",
      items: [
        {
          articleId: "ART-003",
          articleName: "Pure Honey 500g",
          quantityEA: 60,
          quantityCA: 12,
          rate: 150,
          price: 9000,
          value: 9000,
          discount: 450,
          cgstAmount: 769,
          igstAmount: 0,
          sgstAmount: 769,
          totalAmount: 9319
        }
      ]
    },
    {
      id: "PO-2024-003",
      itemCount: 12,
      orderValue: 32000,
      orderDate: "2024-01-20",
      status: "received",
      grnStatus: "completed",
      supplier: "RCPL",
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
    },
    {
      id: "PO-2024-004",
      itemCount: 6,
      orderValue: 18000,
      orderDate: "2024-01-22",
      status: "in-transit",
      grnStatus: "not-started",
      supplier: "Non RCPL",
      invoiceId: "INV-2024-004",
      items: [
        {
          articleId: "ART-007",
          articleName: "Organic Tea Bags 100pcs",
          quantityEA: 200,
          quantityCA: 20,
          rate: 90,
          price: 18000,
          value: 18000,
          discount: 900,
          cgstAmount: 1539,
          igstAmount: 0,
          sgstAmount: 1539,
          totalAmount: 18639
        }
      ]
    },
    {
      id: "PO-2024-005",
      itemCount: 10,
      orderValue: 25000,
      orderDate: "2024-01-25",
      status: "rejected",
      grnStatus: "not-started",
      supplier: "RCPL",
      invoiceId: "INV-2024-005",
      rejectionReason: "Damaged Goods",
      items: [
        {
          articleId: "ART-008",
          articleName: "Premium Olive Oil 500ml",
          quantityEA: 100,
          quantityCA: 10,
          rate: 250,
          price: 25000,
          value: 25000,
          discount: 1250,
          cgstAmount: 2137,
          igstAmount: 0,
          sgstAmount: 2137,
          totalAmount: 25887
        }
      ]
    }
  ]

  const categories = [
    { 
      id: "all", 
      name: "All Orders", 
      count: primaryOrders.length,
      description: "View all orders from RCPL and Non RCPL Suppliers"
    },
    { 
      id: "in-transit", 
      name: "Orders In-Transit", 
      count: primaryOrders.filter(o => o.status === "in-transit").length,
      description: "Orders placed but no GRN done yet"
    },
    { 
      id: "received", 
      name: "Orders Received", 
      count: primaryOrders.filter(o => o.status === "received").length,
      description: "Orders with GRN complete"
    },
    { 
      id: "rejected", 
      name: "Orders Rejected / Returned", 
      count: primaryOrders.filter(o => o.status === "rejected" || o.status === "returned").length,
      description: "Rejected/returned orders with reason codes"
    },
  ]

  const filteredOrders = primaryOrders.filter((order) => {
    const matchesSearch = !searchOrderId || order.id.toLowerCase().includes(searchOrderId.toLowerCase())
    const matchesCategory = activeCategory === "all" || order.status === activeCategory
    const matchesDateFrom = !dateFrom || order.orderDate >= dateFrom
    const matchesDateTo = !dateTo || order.orderDate <= dateTo
    
    return matchesSearch && matchesCategory && matchesDateFrom && matchesDateTo
  })

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setShowOrderDetails(true)
  }

  const handleCreateGRN = (order: Order) => {
    // Navigate to GRN page
    window.location.href = `/orders/primary/${order.id}/grn`
  }

  const handleRejectOrder = (order: Order) => {
    setOrderToReject(order)
    setShowRejectionModal(true)
  }

  const confirmRejection = () => {
    if (orderToReject && rejectionReason) {
      // In a real app, this would update the order status via API
      console.log(`Rejecting order ${orderToReject.id} with reason: ${rejectionReason}`)
      setShowRejectionModal(false)
      setRejectionReason("")
      setOrderToReject(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"
    switch (status) {
      case "received":
        return `${baseClasses} bg-green-100 text-green-800`
      case "in-transit":
        return `${baseClasses} bg-blue-100 text-blue-800`
      case "rejected":
        return `${baseClasses} bg-red-100 text-red-800`
      case "returned":
        return `${baseClasses} bg-orange-100 text-orange-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "received":
        return <CheckCircle className="h-3 w-3" />
      case "in-transit":
        return <Truck className="h-3 w-3" />
      case "rejected":
        return <XCircle className="h-3 w-3" />
      case "returned":
        return <AlertCircle className="h-3 w-3" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "received":
        return "Received"
      case "in-transit":
        return "In-Transit"
      case "rejected":
        return "Rejected"
      case "returned":
        return "Returned"
      default:
        return status
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/orders">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Primary Orders</h1>
            <p className="text-gray-600">Manage incoming orders from RCPL / Non RCPL Suppliers</p>
          </div>
        </div>
        <Link href="/grn/rcpl">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Package className="h-4 w-4 mr-2" />
            + Manual GRN
          </Button>
        </Link>
      </div>

      {/* Order Categories */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Card 
            key={category.id}
            className={`cursor-pointer transition-all ${
              activeCategory === category.id 
                ? "ring-2 ring-blue-500 bg-blue-50" 
                : "hover:shadow-md"
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                </div>
                <div className="text-2xl font-bold text-blue-600">{category.count}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by Order ID..."
              value={searchOrderId}
              onChange={(e) => setSearchOrderId(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="date"
              placeholder="Start Date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="date"
              placeholder="End Date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr. #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Count</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GRN Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order, index) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.supplier === "RCPL" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-purple-100 text-purple-800"
                      }`}>
                        {order.supplier}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.itemCount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{order.orderValue.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.orderDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(order.status)}>
                        {getStatusIcon(order.status)}
                        {getStatusText(order.status)}
                      </span>
                      {order.rejectionReason && (
                        <div className="text-xs text-red-600 mt-1">
                          Reason: {order.rejectionReason}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.grnStatus === "completed" 
                          ? "bg-green-100 text-green-800"
                          : order.grnStatus === "in-progress"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {order.grnStatus === "completed" ? "Completed" : 
                         order.grnStatus === "in-progress" ? "In Progress" : "Not Started"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Order Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {order.status === "in-transit" && (
                          <>
                            <button
                              onClick={() => handleCreateGRN(order)}
                              className="text-green-600 hover:text-green-700 font-medium hover:underline"
                              title="Create GRN"
                            >
                              Create GRN
                            </button>
                            <button
                              onClick={() => handleRejectOrder(order)}
                              className="text-red-600 hover:text-red-700 font-medium hover:underline"
                              title="Reject/Return Order"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {order.status === "received" && (
                          <button
                            onClick={() => handleCreateGRN(order)}
                            className="text-green-600 hover:text-green-700 font-medium hover:underline"
                            title="View GRN"
                          >
                            View GRN
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-700">
          Showing 1 to {filteredOrders.length} of {filteredOrders.length} results
        </p>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm" className="bg-blue-600 text-white">1</Button>
          <Button variant="outline" size="sm">2</Button>
          <Button variant="outline" size="sm">3</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                <p className="text-gray-600">Order ID: {selectedOrder.id}</p>
                <p className="text-gray-600">Supplier: {selectedOrder.supplier}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  <p>Invoice ID: {selectedOrder.invoiceId}</p>
                  <p>Order Date: {selectedOrder.orderDate}</p>
                  <p>Status: {getStatusText(selectedOrder.status)}</p>
                  {selectedOrder.rejectionReason && (
                    <p className="text-red-600">Rejection Reason: {selectedOrder.rejectionReason}</p>
                  )}
                </div>
                <Button
                  onClick={() => setShowOrderDetails(false)}
                  variant="outline"
                  size="sm"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Order Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Article ID</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Article Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity (EA)</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity (CA)</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Discount</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">CGST (Amount)</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">IGST (Amount)</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">SGST (Amount)</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total (Amount)</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm">{item.articleId}</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">{item.articleName}</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">{item.quantityEA}</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">{item.quantityCA}</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">₹{item.rate}</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">₹{item.price.toLocaleString()}</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">₹{item.value.toLocaleString()}</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">₹{item.discount.toLocaleString()}</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">₹{item.cgstAmount.toLocaleString()}</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">₹{item.igstAmount.toLocaleString()}</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">₹{item.sgstAmount.toLocaleString()}</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-medium">₹{item.totalAmount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end gap-2">
              {selectedOrder.status === "in-transit" && (
                <>
                  <Button
                    onClick={() => handleCreateGRN(selectedOrder)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Create GRN
                  </Button>
                  <Button
                    onClick={() => handleRejectOrder(selectedOrder)}
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Reject Order
                  </Button>
                </>
              )}
              {selectedOrder.status === "received" && (
                <Button
                  onClick={() => handleCreateGRN(selectedOrder)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  View GRN
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && orderToReject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Reject/Return Order</h3>
              <Button
                onClick={() => setShowRejectionModal(false)}
                variant="outline"
                size="sm"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Order ID: <span className="font-medium">{orderToReject.id}</span>
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Please select a reason for rejection/return:
              </p>
              <select
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a reason...</option>
                {rejectionReasonCodes.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => setShowRejectionModal(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmRejection}
                className="bg-red-600 hover:bg-red-700"
                disabled={!rejectionReason}
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 