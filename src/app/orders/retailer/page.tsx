"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  ShoppingCart, 
  Download,
  Plus,
  Search,
  Eye,
  FileText,
  ArrowLeft,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Play,
  History,
  CheckSquare,
  Square,
  Truck,
  Package,
  Ban,
  MapPin,
  Menu,
  Building,
  CheckCircle2,
  FileDown
} from "lucide-react"
import Link from "next/link"

interface ProcessingLog {
  id: string
  orderId: string
  action: string
  status: string
  reason?: string
  timestamp: string
  userId: string
}

interface RetailerOrder {
  id: string
  orderNumber: string
  orderDate: string
  fosId: string
  fosName: string
  retailerId: string
  retailerName: string
  status: string
  processingStatus: string
  unprocessedReason?: string
  orderValue: string
  orderQuantity: number
  selected: boolean
  loadOutNumber?: string
  manufacturingDate?: string
  processingLogs: ProcessingLog[]
  products: Array<{
    name: string
    image: string
    quantity: number
  }>
}

export default function RetailerOrdersPage() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'pending' | 'accepted' | 'rejected' | 'returned' | 'partially_returned' | 'offline'>('all')
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])


  const retailerOrders: RetailerOrder[] = [
    {
      id: "RO-2024-001",
      orderNumber: "RC68C7FBB40EBEAD1B85",
      orderDate: "15 Sept 2025, 05:12 pm",
      fosId: "RP99000065",
      fosName: "Internal Demo Campa GST @1",
      retailerId: "RET001",
      retailerName: "Internal Demo Campa GST @1 (RP99000065)",
      status: "pending",
      processingStatus: "pending_review",
      orderValue: "₹450",
      orderQuantity: 30,
      selected: false,
      products: [
        { name: "Water Bottle", image: "/api/placeholder/60/60", quantity: 20 },
        { name: "Product B", image: "/api/placeholder/60/60", quantity: 10 }
      ],
      processingLogs: []
    },
    {
      id: "RO-2024-002",
      orderNumber: "RC68C40B220E41840687",
      orderDate: "12 Sept 2025, 05:29 pm",
      fosId: "RP42400065",
      fosName: "CDO APK @12",
      retailerId: "RET002",
      retailerName: "CDO APK @12 (RP42400065)",
      status: "accepted",
      processingStatus: "accepted",
      orderValue: "₹270",
      orderQuantity: 20,
      selected: false,
      products: [
        { name: "Soft Drink", image: "/api/placeholder/60/60", quantity: 20 }
      ],
      processingLogs: []
    },
    {
      id: "RO-2024-003",
      orderNumber: "RC68C407730E9B765B0F",
      orderDate: "12 Sept 2025, 05:13 pm",
      fosId: "RP02500085",
      fosName: "CDO NonGST REG @2",
      retailerId: "RET003",
      retailerName: "CDO NonGST REG @2 (RP02500085)",
      status: "rejected",
      processingStatus: "rejected",
      orderValue: "₹180",
      orderQuantity: 10,
      selected: false,
      products: [
        { name: "Soft Drink", image: "/api/placeholder/60/60", quantity: 10 }
      ],
      processingLogs: []
    },
    {
      id: "RO-2024-004",
      orderNumber: "RC68C407730E9B765B0F",
      orderDate: "10 Sept 2025, 02:15 pm",
      fosId: "RP12345678",
      fosName: "Premium Store @5",
      retailerId: "RET004",
      retailerName: "Premium Store @5 (RP12345678)",
      status: "dispatched",
      processingStatus: "dispatched",
      orderValue: "₹750",
      orderQuantity: 27,
      selected: false,
      products: [
        { name: "Campa Cola 500ml", image: "/api/placeholder/60/60", quantity: 15 },
        { name: "Energy Drink", image: "/api/placeholder/60/60", quantity: 12 }
      ],
      processingLogs: []
    },
    {
      id: "RO-2024-005",
      orderNumber: "RC68C9999999999999999",
      orderDate: "08 Sept 2025, 11:30 am",
      fosId: "RP87654321",
      fosName: "City Mart @8",
      retailerId: "RET005",
      retailerName: "City Mart @8 (RP87654321)",
      status: "returned",
      processingStatus: "returned",
      orderValue: "₹200",
      orderQuantity: 10,
      selected: false,
      products: [
        { name: "Campa Cola 200ml", image: "/api/placeholder/60/60", quantity: 10 }
      ],
      processingLogs: []
    },
    {
      id: "RO-2024-006",
      orderNumber: "RC68C8888888888888888",
      orderDate: "07 Sept 2025, 03:45 pm",
      fosId: "RP11111111",
      fosName: "Express Store @15",
      retailerId: "RET006",
      retailerName: "Express Store @15 (RP11111111)",
      status: "partially_returned",
      processingStatus: "partially_returned",
      orderValue: "₹240",
      orderQuantity: 13,
      selected: false,
      products: [
        { name: "Campa Cola 200ml", image: "/api/placeholder/60/60", quantity: 8 },
        { name: "Energy Drink", image: "/api/placeholder/60/60", quantity: 5 }
      ],
      processingLogs: []
    },
    {
      id: "RO-2024-007",
      orderNumber: "RC68C7777777777777777",
      orderDate: "06 Sept 2025, 02:30 pm",
      fosId: "RP33333333",
      fosName: "Walk-in Customer @30",
      retailerId: "RET007",
      retailerName: "Walk-in Customer @30 (RP33333333)",
      status: "offline",
      processingStatus: "billed",
      orderValue: "₹320",
      orderQuantity: 8,
      selected: false,
      products: [
        { name: "Campa Cola 500ml", image: "/api/placeholder/60/60", quantity: 5 },
        { name: "Energy Drink 250ml", image: "/api/placeholder/60/60", quantity: 3 }
      ],
      processingLogs: []
    },
    {
      id: "RO-2024-009",
      orderNumber: "RC68C9999999999999998",
      orderDate: "04 Sept 2025, 09:30 am",
      fosId: "RP55555555",
      fosName: "Delivery Test @40",
      retailerId: "RET009",
      retailerName: "Delivery Test Store (RP55555555)",
      status: "delivered",
      processingStatus: "delivered",
      orderValue: "₹380",
      orderQuantity: 15,
      selected: false,
      products: [
        { name: "Campa Cola 500ml PET", image: "/api/placeholder/60/60", quantity: 10 },
        { name: "Campa Energy Berry Kick 250ml PET", image: "/api/placeholder/60/60", quantity: 5 }
      ],
      processingLogs: []
    },
    {
      id: "RO-2024-008",
      orderNumber: "RC68C6666666666666666",
      orderDate: "05 Sept 2025, 11:15 am",
      fosId: "RP44444444",
      fosName: "Direct Sale @35",
      retailerId: "RET008",
      retailerName: "Direct Sale @35 (RP44444444)",
      status: "offline",
      processingStatus: "billed",
      orderValue: "₹180",
      orderQuantity: 6,
      selected: false,
      products: [
        { name: "Campa Cola 200ml", image: "/api/placeholder/60/60", quantity: 6 }
      ],
      processingLogs: []
    }
  ]

  const filteredOrders = retailerOrders.filter(order => {
    if (activeCategory === 'all') {
      return true
    }
    return order.status === activeCategory
  })

  const categories = [
    { key: 'all', label: 'All', count: retailerOrders.length, icon: ShoppingCart },
    { key: 'pending', label: 'Pending', count: retailerOrders.filter(o => o.status === 'pending').length, icon: Clock },
    { key: 'accepted', label: 'Accepted', count: retailerOrders.filter(o => o.status === 'accepted').length, icon: CheckCircle },
    { key: 'dispatched', label: 'Dispatched', count: retailerOrders.filter(o => o.status === 'dispatched').length, icon: Truck },
    { key: 'delivered', label: 'Delivered', count: retailerOrders.filter(o => o.status === 'delivered').length, icon: Package },
    { key: 'rejected', label: 'Rejected', count: retailerOrders.filter(o => o.status === 'rejected').length, icon: XCircle },
    { key: 'returned', label: 'Returned', count: retailerOrders.filter(o => o.status === 'returned').length, icon: ArrowLeft },
    { key: 'partially_returned', label: 'Partially Returned', count: retailerOrders.filter(o => o.status === 'partially_returned').length, icon: AlertTriangle },
    { key: 'offline', label: 'Offline', count: retailerOrders.filter(o => o.status === 'offline').length, icon: FileText }
  ]

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium"
    switch (status) {
      case "accepted":
        return `${baseClasses} bg-green-100 text-green-800`
      case "pending":
        return `${baseClasses} bg-orange-100 text-orange-800`
      case "dispatched":
        return `${baseClasses} bg-blue-100 text-blue-800`
      case "delivered":
        return `${baseClasses} bg-emerald-100 text-emerald-800`
      case "rejected":
        return `${baseClasses} bg-red-100 text-red-800`
      case "returned":
        return `${baseClasses} bg-yellow-100 text-yellow-800`
      case "partially_returned":
        return `${baseClasses} bg-orange-100 text-orange-800`
      case "offline":
        return `${baseClasses} bg-purple-100 text-purple-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="flex">
        {/* Left Sidebar - Filters */}
        <div className="w-80 bg-white p-6 border-r">
          <h3 className="text-lg font-semibold mb-4">Filters</h3>
          
          {/* Sort by */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Sort by</h4>
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category.key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value={category.key}
                    checked={activeCategory === category.key}
                    onChange={() => setActiveCategory(category.key as any)}
                    className="text-blue-600"
                  />
                  <span className="text-sm">{category.label}</span>
                </label>
              ))}
                </div>
              </div>

          {/* Date */}
        <div>
            <h4 className="font-medium mb-3">Date</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="date" className="text-blue-600" />
                <span className="text-sm">Day</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="date" className="text-blue-600" />
                <span className="text-sm">Week</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="date" className="text-blue-600" />
                <span className="text-sm">Month</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="date" className="text-blue-600" />
                <span className="text-sm">Select Date Range</span>
              </label>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Retailer Orders</h1>
            <Link href="/orders/offline/new">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create Offline Orders
              </Button>
            </Link>
      </div>

          {/* Bulk Actions */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <input type="checkbox" className="rounded" />
              <Button variant="outline" size="sm" className="bg-gray-100">
                Bulk Reject
              </Button>
              <Button variant="outline" size="sm" className="bg-gray-100">
                Bulk Approve
              </Button>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Bulk Order Processing
            </Button>
          </div>
            
          {/* Order Cards */}
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.location.href = `/orders/retailer/${order.id}`}>
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <input 
                    type="checkbox" 
                    checked={selectedOrders.includes(order.id)}
                    onChange={(e) => {
                      e.stopPropagation()
                      toggleOrderSelection(order.id)
                    }}
                    className="mt-1 rounded"
                  />
                  
                  {/* Store Icon and Name */}
                  <div className="flex items-center gap-3">
                    <Building className="h-6 w-6 text-gray-600" />
                  <div>
                      <h3 className="font-medium text-gray-900">{order.retailerName}</h3>
                      <div className="flex items-center gap-4 mt-2">
                        <span className={getStatusBadge(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                        <div className="text-sm text-gray-600">
                          <div>Order#{order.orderNumber}</div>
                          <div>Order placed on {order.orderDate}</div>
                  </div>
                        <div className="text-lg font-semibold text-gray-900">
                          {order.orderValue}
              </div>
            </div>
          </div>
        </div>

                  {/* Action Buttons for Accepted Orders */}
                  {order.status === 'accepted' && (
                    <div className="flex gap-2 ml-auto">
                <Button
                  variant="outline"
                  size="sm"
                        className="flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                >
                        <CheckCircle2 className="h-4 w-4" />
                        Download Picklist
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                        className="flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                >
                        <FileDown className="h-4 w-4" />
                        Download Invoice
                </Button>
                  </div>
                )}

                  {/* Product Images */}
                  <div className="flex gap-2 ml-auto">
                    {order.products.map((product, index) => (
                      <div key={index} className="relative">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <div className="w-12 h-12 bg-gray-300 rounded"></div>
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-gray-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {product.quantity}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
} 