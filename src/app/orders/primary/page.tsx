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

export default function PrimaryOrdersPage() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchOrderId, setSearchOrderId] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)

  const primaryOrders: Order[] = [
    {
      id: "PO-2024-001",
      itemCount: 15,
      orderValue: 45000,
      orderDate: "2024-01-15",
      status: "Delivered",
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
      status: "Pending",
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
  ]

  const categories = [
    { id: "all", name: "All Orders", count: primaryOrders.length },
    { id: "delivered", name: "Delivered Orders", count: primaryOrders.filter(o => o.status === "Delivered").length },
    { id: "pending", name: "Pending Delivery", count: primaryOrders.filter(o => o.status === "Pending").length },
  ]

  const filteredOrders = primaryOrders.filter((order) => {
    const matchesSearch = !searchOrderId || order.id.toLowerCase().includes(searchOrderId.toLowerCase())
    const matchesCategory = activeCategory === "all" || 
      (activeCategory === "delivered" && order.status === "Delivered") ||
      (activeCategory === "pending" && order.status === "Pending")
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

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium"
    switch (status) {
      case "Delivered":
        return `${baseClasses} bg-green-100 text-green-800`
      case "Pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800`
      case "GRN Created":
        return `${baseClasses} bg-blue-100 text-blue-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
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
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeCategory === category.id
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {category.name} ({category.count})
          </button>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Count</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order, index) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.itemCount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{order.orderValue.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.orderDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(order.status)}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {order.status === "Delivered" || order.status === "GRN Created" ? (
                          <button
                            onClick={() => handleCreateGRN(order)}
                            className={`font-medium hover:underline ${
                              order.status === "GRN Created" 
                                ? "text-green-600 hover:text-green-700" 
                                : "text-blue-600 hover:text-blue-700"
                            }`}
                          >
                            {order.status === "GRN Created" ? "GRN Created" : "Create GRN"}
                          </button>
                        ) : null}
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
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  <p>Invoice ID: {selectedOrder.invoiceId}</p>
                  <p>Order Date: {selectedOrder.orderDate}</p>
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

            {/* Create GRN Button */}
            <div className="mt-6 flex justify-end">
              <Button
                onClick={() => handleCreateGRN(selectedOrder)}
                className="bg-green-600 hover:bg-green-700"
                disabled={selectedOrder.status === "GRN Created"}
              >
                {selectedOrder.status === "GRN Created" ? "GRN Created" : "Create GRN"}
              </Button>
            </div>
          </div>
        </div>
      )}


    </div>
  )
} 