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
  Square
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
  processingLogs: ProcessingLog[]
}

export default function RetailerOrdersPage() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'pending' | 'accepted' | 'accepted_processed' | 'accepted_unprocessed' | 'rejected' | 'offline'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [showProcessingModal, setShowProcessingModal] = useState(false)
  const [showProcessingLog, setShowProcessingLog] = useState(false)
  const [selectedOrderForLog, setSelectedOrderForLog] = useState<RetailerOrder | null>(null)
  const [showCloseOrderModal, setShowCloseOrderModal] = useState(false)
  const [closeReason, setCloseReason] = useState('')
  const [selectedCloseReason, setSelectedCloseReason] = useState('')

  // Handle URL parameters for tab switching
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const tabParam = urlParams.get('tab')
      
      if (tabParam && ['all', 'pending', 'accepted', 'accepted_processed', 'accepted_unprocessed', 'rejected', 'offline'].includes(tabParam)) {
        setActiveCategory(tabParam as any)
      }
    }
  }, [])

  const retailerOrders: RetailerOrder[] = [
    {
      id: "RO-2024-001",
      orderDate: "2024-01-15",
      fosId: "FOS001",
      fosName: "John Smith",
      retailerId: "RET001",
      retailerName: "ABC Store",
      status: "accepted",
      processingStatus: "confirmed_not_dispatched",
      orderValue: "₹12,500",
      orderQuantity: 25,
      selected: false,
      processingLogs: [
        {
          id: "1",
          orderId: "RO-2024-001",
          action: "Order Accepted",
          status: "accepted",
          timestamp: "2024-01-15 10:30:00",
          userId: "RETAILER001"
        },
        {
          id: "2",
          orderId: "RO-2024-001",
          action: "Order Confirmed",
          status: "confirmed",
          timestamp: "2024-01-15 14:20:00",
          userId: "RETAILER001"
        }
      ]
    },
    {
      id: "RO-2024-002",
      orderDate: "2024-01-16",
      fosId: "FOS002",
      fosName: "Sarah Johnson",
      retailerId: "RET002",
      retailerName: "XYZ Mart",
      status: "pending",
      processingStatus: "pending",
      orderValue: "₹8,900",
      orderQuantity: 18,
      selected: false,
      processingLogs: []
    },
    {
      id: "RO-2024-003",
      orderDate: "2024-01-17",
      fosId: "FOS003",
      fosName: "Mike Wilson",
      retailerId: "RET003",
      retailerName: "Premium Shop",
      status: "rejected",
      processingStatus: "rejected",
      unprocessedReason: "Stock Out",
      orderValue: "₹15,200",
      orderQuantity: 32,
      selected: false,
      processingLogs: [
        {
          id: "3",
          orderId: "RO-2024-003",
          action: "Order Rejected",
          status: "rejected",
          reason: "Stock Out",
          timestamp: "2024-01-17 09:15:00",
          userId: "RETAILER003"
        }
      ]
    },
    {
      id: "RO-2024-004",
      orderDate: "2024-01-18",
      fosId: "FOS001",
      fosName: "John Smith",
      retailerId: "RET004",
      retailerName: "City Store",
      status: "accepted",
      processingStatus: "confirmed_not_dispatched",
      orderValue: "₹9,800",
      orderQuantity: 20,
      selected: false,
      processingLogs: [
        {
          id: "4",
          orderId: "RO-2024-004",
          action: "Order Accepted",
          status: "accepted",
          timestamp: "2024-01-18 11:45:00",
          userId: "RETAILER004"
        }
      ]
    },
    {
      id: "RO-2024-007",
      orderDate: "2024-01-21",
      fosId: "FOS003",
      fosName: "Mike Wilson",
      retailerId: "RET007",
      retailerName: "Express Mart",
      status: "accepted",
      processingStatus: "auto_processed",
      orderValue: "₹14,200",
      orderQuantity: 35,
      selected: false,
      processingLogs: [
        {
          id: "5",
          orderId: "RO-2024-007",
          action: "Order Accepted",
          status: "accepted",
          timestamp: "2024-01-21 09:30:00",
          userId: "RETAILER007"
        },
        {
          id: "6",
          orderId: "RO-2024-007",
          action: "Order Confirmed",
          status: "confirmed",
          timestamp: "2024-01-21 10:15:00",
          userId: "RETAILER007"
        },
        {
          id: "7",
          orderId: "RO-2024-007",
          action: "Auto Processed",
          status: "auto_processed",
          timestamp: "2024-01-21 14:20:00",
          userId: "SYSTEM"
        }
      ]
    },
    {
      id: "RO-2024-008",
      orderDate: "2024-01-22",
      fosId: "FOS002",
      fosName: "Sarah Johnson",
      retailerId: "RET008",
      retailerName: "Quick Shop",
      status: "accepted",
      processingStatus: "auto_processed",
      orderValue: "₹7,600",
      orderQuantity: 12,
      selected: false,
      processingLogs: [
        {
          id: "8",
          orderId: "RO-2024-008",
          action: "Order Accepted",
          status: "accepted",
          timestamp: "2024-01-22 08:45:00",
          userId: "RETAILER008"
        },
        {
          id: "9",
          orderId: "RO-2024-008",
          action: "Order Confirmed",
          status: "confirmed",
          timestamp: "2024-01-22 09:30:00",
          userId: "RETAILER008"
        },
        {
          id: "10",
          orderId: "RO-2024-008",
          action: "Auto Processed",
          status: "auto_processed",
          timestamp: "2024-01-22 11:15:00",
          userId: "SYSTEM"
        }
      ]
    },
    {
      id: "RO-2024-005",
      orderDate: "2024-01-19",
      fosId: "FOS004",
      fosName: "Lisa Brown",
      retailerId: "RET005",
      retailerName: "Corner Shop",
      status: "offline",
      processingStatus: "offline",
      orderValue: "₹6,500",
      orderQuantity: 15,
      selected: false,
      processingLogs: []
    },
    {
      id: "RO-2024-006",
      orderDate: "2024-01-20",
      fosId: "FOS002",
      fosName: "Sarah Johnson",
      retailerId: "RET006",
      retailerName: "Super Market",
      status: "pending",
      processingStatus: "pending",
      orderValue: "₹11,300",
      orderQuantity: 28,
      selected: false,
      processingLogs: []
    }
  ]

  const filteredOrders = retailerOrders.filter(order => {
    let matchesCategory = false
    if (activeCategory === 'all') {
      matchesCategory = true
    } else if (activeCategory === 'accepted') {
      matchesCategory = order.status === 'accepted'
    } else if (activeCategory === 'accepted_processed') {
      matchesCategory = order.status === 'accepted' && order.processingStatus === 'auto_processed'
    } else if (activeCategory === 'accepted_unprocessed') {
      matchesCategory = order.status === 'accepted' && order.processingStatus === 'confirmed_not_dispatched'
    } else {
      matchesCategory = order.status === activeCategory
    }
    
    const matchesSearch = searchQuery === '' || 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.retailerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.fosName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.fosId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDateFrom = dateFrom === '' || order.orderDate >= dateFrom
    const matchesDateTo = dateTo === '' || order.orderDate <= dateTo
    const matchesStatus = statusFilter === 'All Status' || order.status === statusFilter.toLowerCase()
    
    return matchesCategory && matchesSearch && matchesDateFrom && matchesDateTo && matchesStatus
  })

  const categories = [
    { key: 'all', label: 'All Orders', count: retailerOrders.length },
    { key: 'pending', label: 'Pending Orders', count: retailerOrders.filter(o => o.status === 'pending').length },
    { key: 'accepted', label: 'Accepted Orders', count: retailerOrders.filter(o => o.status === 'accepted').length },
    { key: 'accepted_processed', label: 'Processed Orders', count: retailerOrders.filter(o => o.status === 'accepted' && o.processingStatus === 'auto_processed').length },
    { key: 'accepted_unprocessed', label: 'Unprocessed Orders', count: retailerOrders.filter(o => o.status === 'accepted' && o.processingStatus === 'confirmed_not_dispatched').length },
    { key: 'rejected', label: 'Rejected Orders', count: retailerOrders.filter(o => o.status === 'rejected').length },
    { key: 'offline', label: 'Offline Orders', count: retailerOrders.filter(o => o.status === 'offline').length }
  ]

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium"
    switch (status) {
      case "accepted":
        return `${baseClasses} bg-green-100 text-green-800`
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800`
      case "rejected":
        return `${baseClasses} bg-red-100 text-red-800`
      case "offline":
        return `${baseClasses} bg-blue-100 text-blue-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  const getProcessingStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium"
    switch (status) {
      case "confirmed_not_dispatched":
        return `${baseClasses} bg-orange-100 text-orange-800`
      case "auto_processed":
        return `${baseClasses} bg-green-100 text-green-800`
      case "stock_out":
        return `${baseClasses} bg-red-100 text-red-800`
      case "partial_dispatch":
        return `${baseClasses} bg-yellow-100 text-yellow-800`
      case "cancelled":
        return `${baseClasses} bg-gray-100 text-gray-800`
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

  const selectAllOrders = () => {
    const unprocessedOrderIds = filteredOrders
      .filter(order => order.status === 'accepted' && order.processingStatus === 'confirmed_not_dispatched')
      .map(order => order.id)
    setSelectedOrders(unprocessedOrderIds)
  }

  const clearSelection = () => {
    setSelectedOrders([])
  }

  const handleAutoProcess = () => {
    // In a real app, this would process the selected orders
    console.log("Auto processing orders:", selectedOrders)
    setSelectedOrders([])
    setShowProcessingModal(false)
  }

  const handleCloseOrder = (orderId: string, reason: string) => {
    // In a real app, this would close the order with the specified reason
    console.log("Closing order:", orderId, "with reason:", reason)
    setShowCloseOrderModal(false)
    setCloseReason('')
  }

  const handleCloseMultipleOrders = () => {
    // In a real app, this would close multiple orders with the specified reason
    console.log("Closing orders:", selectedOrders, "with reason:", closeReason)
    setSelectedOrders([])
    setShowCloseOrderModal(false)
    setCloseReason('')
  }

  const downloadProcessingLog = (orderId: string) => {
    const order = retailerOrders.find(o => o.id === orderId)
    if (!order) return

    const logData = order.processingLogs.map(log => ({
      OrderID: log.orderId,
      Action: log.action,
      Status: log.status,
      Reason: log.reason || '',
      Timestamp: log.timestamp,
      UserID: log.userId
    }))

    const csvContent = [
      Object.keys(logData[0]).join(','),
      ...logData.map(row => Object.values(row).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `processing_log_${orderId}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const acceptedOrdersCount = filteredOrders.filter(order => 
    order.status === 'accepted' && order.processingStatus === 'confirmed_not_dispatched'
  ).length

  const processedOrdersCount = retailerOrders.filter(order => 
    order.status === 'accepted' && order.processingStatus === 'auto_processed'
  ).length

  const unprocessedOrdersCount = retailerOrders.filter(order => 
    order.status === 'accepted' && order.processingStatus === 'confirmed_not_dispatched'
  ).length

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-4">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Retailer Orders</h1>
          <p className="text-gray-600">Manage retail and field operations orders</p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div>
            <Link href="/orders">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Orders
              </Button>
            </Link>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Bulk Download
            </Button>
            <Link href="/orders/offline/new">
              <Button variant="jiomart" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Offline Orders
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Processing Actions for Unprocessed Orders */}
      {acceptedOrdersCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Unprocessed Orders Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {acceptedOrdersCount} unprocessed orders ready for action
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={selectAllOrders}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <CheckSquare className="h-4 w-4" />
                  Select All
                </Button>
                <Button
                  onClick={clearSelection}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Square className="h-4 w-4" />
                  Clear Selection
                </Button>
                <Button
                  onClick={() => setShowProcessingModal(true)}
                  disabled={selectedOrders.length === 0}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Auto Process ({selectedOrders.length})
                </Button>
                <Button
                  onClick={() => setShowCloseOrderModal(true)}
                  disabled={selectedOrders.length === 0}
                  variant="outline"
                  className="border-red-600 text-red-600 hover:bg-red-50"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Close Orders ({selectedOrders.length})
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Accepted Orders Summary */}
      {(processedOrdersCount > 0 || unprocessedOrdersCount > 0) && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <h3 className="font-medium text-gray-900">Accepted Orders Summary</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={() => setActiveCategory('accepted_processed')}
                className="bg-green-50 p-3 rounded-lg hover:bg-green-100 transition-colors cursor-pointer border border-green-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800 text-sm">Processed</span>
                  </div>
                  <span className="text-xl font-bold text-green-600">{processedOrdersCount}</span>
                </div>
                <p className="text-xs text-green-600 text-left">Successfully processed and dispatched</p>
              </button>
              <button
                onClick={() => setActiveCategory('accepted_unprocessed')}
                className="bg-orange-50 p-3 rounded-lg hover:bg-orange-100 transition-colors cursor-pointer border border-orange-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <span className="font-medium text-orange-800 text-sm">Unprocessed</span>
                  </div>
                  <span className="text-xl font-bold text-orange-600">{unprocessedOrdersCount}</span>
                </div>
                <p className="text-xs text-orange-600 text-left">Confirmed but not yet dispatched</p>
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Order Categories */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
        {categories.map((category) => (
          <button
            key={category.key}
            onClick={() => setActiveCategory(category.key as any)}
            className={`py-2 px-4 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              activeCategory === category.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {category.label} ({category.count})
          </button>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Order ID, Retailer Name, FOS Name, FOS ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>All Status</option>
            <option>Accepted</option>
            <option>Pending</option>
            <option>Rejected</option>
            <option>Offline</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    {acceptedOrdersCount > 0 && (
                      <input
                        type="checkbox"
                        checked={selectedOrders.length === acceptedOrdersCount}
                        onChange={(e) => e.target.checked ? selectAllOrders() : clearSelection()}
                        className="rounded border-gray-300"
                      />
                    )}
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Sr. #</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Order ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Order Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">FOS ID and Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Retailer ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Retailer Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Processing Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Order Value</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Order Quantity</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      {order.status === 'accepted' && order.processingStatus === 'confirmed_not_dispatched' && (
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => toggleOrderSelection(order.id)}
                          className="rounded border-gray-300"
                        />
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-900">{index + 1}</td>
                    <td className="py-3 px-4 font-medium text-gray-900">{order.id}</td>
                    <td className="py-3 px-4 text-gray-900">{order.orderDate}</td>
                    <td className="py-3 px-4 text-gray-900">{order.fosId} {order.fosName}</td>
                    <td className="py-3 px-4 text-gray-900">{order.retailerId}</td>
                    <td className="py-3 px-4 text-gray-900">{order.retailerName}</td>
                    <td className="py-3 px-4">
                      <span className={getStatusBadge(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={getProcessingStatusBadge(order.processingStatus)}>
                        {order.processingStatus.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">{order.orderValue}</td>
                    <td className="py-3 px-4 text-gray-900">{order.orderQuantity}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedOrderForLog(order)
                            setShowProcessingLog(true)
                          }}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <History className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <FileText className="h-4 w-4" />
                        </button>
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

      {/* Auto Process Modal */}
      {showProcessingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Auto Process Orders</h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to auto-process {selectedOrders.length} selected orders?
            </p>
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => setShowProcessingModal(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAutoProcess}
                className="bg-green-600 hover:bg-green-700"
              >
                Auto Process
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Close Orders Modal */}
      {showCloseOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Close Orders</h2>
            <p className="text-gray-600 mb-4">
              You are about to close {selectedOrders.length} selected orders. Please select a reason:
            </p>
            <div className="space-y-3 mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="closeReason"
                  value="Stock Out"
                  checked={closeReason === 'Stock Out'}
                  onChange={(e) => setCloseReason(e.target.value)}
                  className="text-red-600"
                />
                <span className="text-red-600 font-medium">Stock Out</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="closeReason"
                  value="Partial Dispatch"
                  checked={closeReason === 'Partial Dispatch'}
                  onChange={(e) => setCloseReason(e.target.value)}
                  className="text-yellow-600"
                />
                <span className="text-yellow-600 font-medium">Partial Dispatch</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="closeReason"
                  value="Cancelled - Retailer Refused"
                  checked={closeReason === 'Cancelled - Retailer Refused'}
                  onChange={(e) => setCloseReason(e.target.value)}
                  className="text-gray-600"
                />
                <span className="text-gray-600 font-medium">Cancelled - Retailer Refused</span>
              </label>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => {
                  setShowCloseOrderModal(false)
                  setCloseReason('')
                }}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCloseMultipleOrders}
                disabled={!closeReason}
                className="bg-red-600 hover:bg-red-700"
              >
                Close Orders
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Processing Log Modal */}
      {showProcessingLog && selectedOrderForLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Processing Log - {selectedOrderForLog.id}</h2>
              <div className="flex gap-2">
                <Button
                  onClick={() => downloadProcessingLog(selectedOrderForLog.id)}
                  variant="outline"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
                <Button
                  onClick={() => setShowProcessingLog(false)}
                  variant="outline"
                  size="sm"
                >
                  Close
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Order ID:</span> {selectedOrderForLog.id}
                </div>
                <div>
                  <span className="font-medium">Retailer:</span> {selectedOrderForLog.retailerName}
                </div>
                <div>
                  <span className="font-medium">Current Status:</span> 
                  <span className={getStatusBadge(selectedOrderForLog.status)}>
                    {selectedOrderForLog.status.charAt(0).toUpperCase() + selectedOrderForLog.status.slice(1)}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Processing Status:</span>
                  <span className={getProcessingStatusBadge(selectedOrderForLog.processingStatus)}>
                    {selectedOrderForLog.processingStatus.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Processing History</h3>
                <div className="space-y-2">
                  {selectedOrderForLog.processingLogs.length > 0 ? (
                    selectedOrderForLog.processingLogs.map((log) => (
                      <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div>
                          <div className="font-medium">{log.action}</div>
                          <div className="text-sm text-gray-600">
                            {log.reason && `Reason: ${log.reason}`}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">{log.timestamp}</div>
                          <div className="text-xs text-gray-500">by {log.userId}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No processing logs available</p>
                  )}
                </div>
              </div>

              {selectedOrderForLog.status === 'accepted' && selectedOrderForLog.processingStatus === 'confirmed_not_dispatched' && (
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Close Order</h3>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="closeReason"
                          value="Stock Out"
                          checked={selectedCloseReason === 'Stock Out'}
                          onChange={(e) => setSelectedCloseReason(e.target.value)}
                          className="text-red-600"
                        />
                        <span className="text-red-600 font-medium">Stock Out</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="closeReason"
                          value="Partial Dispatch"
                          checked={selectedCloseReason === 'Partial Dispatch'}
                          onChange={(e) => setSelectedCloseReason(e.target.value)}
                          className="text-yellow-600"
                        />
                        <span className="text-yellow-600 font-medium">Partial Dispatch</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="closeReason"
                          value="Cancelled - Retailer Refused"
                          checked={selectedCloseReason === 'Cancelled - Retailer Refused'}
                          onChange={(e) => setSelectedCloseReason(e.target.value)}
                          className="text-gray-600"
                        />
                        <span className="text-gray-600 font-medium">Cancelled - Retailer Refused</span>
                      </label>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        onClick={() => {
                          setShowProcessingLog(false)
                          setSelectedCloseReason('')
                        }}
                        variant="outline"
                        size="sm"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          if (selectedCloseReason) {
                            handleCloseOrder(selectedOrderForLog.id, selectedCloseReason)
                            setSelectedCloseReason('')
                          }
                        }}
                        disabled={!selectedCloseReason}
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400"
                      >
                        Submit Status
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 