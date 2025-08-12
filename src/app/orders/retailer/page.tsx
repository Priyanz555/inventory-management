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
  Ban
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
  loadOutNumber?: string
  manufacturingDate?: string
  processingLogs: ProcessingLog[]
}

export default function RetailerOrdersPage() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'pending' | 'allocated' | 'dispatched' | 'rejected' | 'cancelled' | 'offline'>('all')
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
  const [showModifyOrderModal, setShowModifyOrderModal] = useState(false)
  const [showDispatchModal, setShowDispatchModal] = useState(false)
  const [modifyOrderData, setModifyOrderData] = useState<{
    orderId: string
    skus: Array<{
      skuId: string
      skuName: string
      originalQuantity: number
      currentQuantity: number
      action: 'keep' | 'remove' | 'modify'
      reason?: string
    }>
  } | null>(null)

  // Handle URL parameters for tab switching
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const tabParam = urlParams.get('tab')
      
      if (tabParam && ['all', 'pending', 'allocated', 'dispatched', 'rejected', 'cancelled', 'offline'].includes(tabParam)) {
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
      status: "allocated",
      processingStatus: "fully_allocated",
      orderValue: "₹12,500",
      orderQuantity: 25,
      selected: false,
      manufacturingDate: "2024-01-10",
      processingLogs: [
        {
          id: "1",
          orderId: "RO-2024-001",
          action: "Order Received",
          status: "pending",
          timestamp: "2024-01-15 10:30:00",
          userId: "RETAILER001"
        },
        {
          id: "2",
          orderId: "RO-2024-001",
          action: "Order Allocated",
          status: "allocated",
          timestamp: "2024-01-15 14:20:00",
          userId: "SYSTEM"
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
      processingStatus: "pending_review",
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
      unprocessedReason: "Out of Stock",
      orderValue: "₹15,200",
      orderQuantity: 32,
      selected: false,
      processingLogs: [
        {
          id: "3",
          orderId: "RO-2024-003",
          action: "Order Rejected",
          status: "rejected",
          reason: "Out of Stock",
          timestamp: "2024-01-17 09:15:00",
          userId: "DISTRIBUTOR001"
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
      status: "dispatched",
      processingStatus: "dispatched",
      orderValue: "₹9,800",
      orderQuantity: 20,
      selected: false,
      loadOutNumber: "LO-2024-001",
      manufacturingDate: "2024-01-12",
      processingLogs: [
        {
          id: "4",
          orderId: "RO-2024-004",
          action: "Order Allocated",
          status: "allocated",
          timestamp: "2024-01-18 11:45:00",
          userId: "SYSTEM"
        },
        {
          id: "5",
          orderId: "RO-2024-004",
          action: "Order Dispatched",
          status: "dispatched",
          timestamp: "2024-01-18 15:30:00",
          userId: "DISTRIBUTOR001"
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
      processingStatus: "billed",
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
      status: "cancelled",
      processingStatus: "cancelled",
      unprocessedReason: "Undelivered",
      orderValue: "₹11,300",
      orderQuantity: 28,
      selected: false,
      processingLogs: [
        {
          id: "6",
          orderId: "RO-2024-006",
          action: "Order Dispatched",
          status: "dispatched",
          timestamp: "2024-01-20 10:00:00",
          userId: "DISTRIBUTOR001"
        },
        {
          id: "7",
          orderId: "RO-2024-006",
          action: "Order Cancelled",
          status: "cancelled",
          reason: "Undelivered",
          timestamp: "2024-01-20 16:00:00",
          userId: "DISTRIBUTOR001"
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
      status: "pending",
      processingStatus: "partial_inventory",
      orderValue: "₹14,200",
      orderQuantity: 35,
      selected: false,
      processingLogs: [
        {
          id: "8",
          orderId: "RO-2024-007",
          action: "Order Received",
          status: "pending",
          timestamp: "2024-01-21 09:30:00",
          userId: "RETAILER007"
        },
        {
          id: "9",
          orderId: "RO-2024-007",
          action: "Partial Inventory Detected",
          status: "partial_inventory",
          timestamp: "2024-01-21 10:15:00",
          userId: "SYSTEM"
        }
      ]
    }
  ]

  const filteredOrders = retailerOrders.filter(order => {
    let matchesCategory = false
    if (activeCategory === 'all') {
      matchesCategory = true
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
    { key: 'all', label: 'All Orders', count: retailerOrders.length, icon: ShoppingCart },
    { key: 'pending', label: 'Pending Orders', count: retailerOrders.filter(o => o.status === 'pending').length, icon: Clock },
    { key: 'allocated', label: 'Allocated Orders', count: retailerOrders.filter(o => o.status === 'allocated').length, icon: Package },
    { key: 'dispatched', label: 'Order Dispatched', count: retailerOrders.filter(o => o.status === 'dispatched').length, icon: Truck },
    { key: 'rejected', label: 'Rejected Orders', count: retailerOrders.filter(o => o.status === 'rejected').length, icon: XCircle },
    { key: 'cancelled', label: 'Orders Cancelled', count: retailerOrders.filter(o => o.status === 'cancelled').length, icon: Ban },
    { key: 'offline', label: 'Offline Orders', count: retailerOrders.filter(o => o.status === 'offline').length, icon: FileText }
  ]

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium"
    switch (status) {
      case "allocated":
        return `${baseClasses} bg-blue-100 text-blue-800`
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800`
      case "dispatched":
        return `${baseClasses} bg-green-100 text-green-800`
      case "rejected":
        return `${baseClasses} bg-red-100 text-red-800`
      case "cancelled":
        return `${baseClasses} bg-gray-100 text-gray-800`
      case "offline":
        return `${baseClasses} bg-purple-100 text-purple-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  const getProcessingStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium"
    switch (status) {
      case "fully_allocated":
        return `${baseClasses} bg-blue-100 text-blue-800`
      case "partial_allocated":
        return `${baseClasses} bg-orange-100 text-orange-800`
      case "pending_review":
        return `${baseClasses} bg-yellow-100 text-yellow-800`
      case "partial_inventory":
        return `${baseClasses} bg-orange-100 text-orange-800`
      case "dispatched":
        return `${baseClasses} bg-green-100 text-green-800`
      case "billed":
        return `${baseClasses} bg-purple-100 text-purple-800`
      case "rejected":
        return `${baseClasses} bg-red-100 text-red-800`
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
    const selectableOrderIds = filteredOrders
      .filter(order => {
        if (activeCategory === 'pending') {
          return order.status === 'pending'
        } else if (activeCategory === 'allocated') {
          return order.status === 'allocated'
        }
        return false
      })
      .map(order => order.id)
    setSelectedOrders(selectableOrderIds)
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

  const handleModifyOrder = () => {
    // Get the first selected order for modification (in real app, you might want to handle multiple)
    const orderToModify = retailerOrders.find(o => o.id === selectedOrders[0])
    if (!orderToModify) return

    // Initialize modification data with sample SKUs (in real app, this would come from the order)
    const sampleSkus = [
      { skuId: 'SKU001', skuName: 'Product A', originalQuantity: 10, currentQuantity: 10, action: 'keep' as const },
      { skuId: 'SKU002', skuName: 'Product B', originalQuantity: 5, currentQuantity: 5, action: 'keep' as const },
      { skuId: 'SKU003', skuName: 'Product C', originalQuantity: 8, currentQuantity: 8, action: 'keep' as const }
    ]

    setModifyOrderData({
      orderId: orderToModify.id,
      skus: sampleSkus
    })
  }

  const updateSkuAction = (skuId: string, action: 'keep' | 'remove' | 'modify', quantity?: number, reason?: string) => {
    if (!modifyOrderData) return

    setModifyOrderData(prev => {
      if (!prev) return prev
      return {
        ...prev,
        skus: prev.skus.map(sku => 
          sku.skuId === skuId 
            ? { 
                ...sku, 
                action, 
                currentQuantity: quantity || sku.currentQuantity,
                reason: reason || sku.reason
              }
            : sku
        )
      }
    })
  }

  const handleSaveModifications = () => {
    if (!modifyOrderData) return

    // In a real app, this would save the modifications to the backend
    console.log("Saving modifications:", modifyOrderData)
    
    // Add processing log entry
    const modifications = modifyOrderData.skus.filter(sku => sku.action !== 'keep')
    if (modifications.length > 0) {
      console.log("Modifications made:", modifications)
    }

    setModifyOrderData(null)
    setShowModifyOrderModal(false)
    setSelectedOrders([])
  }

  const handleDispatchOrders = () => {
    // In a real app, this would dispatch the selected orders and generate load out numbers
    console.log("Dispatching orders:", selectedOrders)
    setSelectedOrders([])
    setShowDispatchModal(false)
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

  const pendingOrdersCount = filteredOrders.filter(order => order.status === 'pending').length
  const allocatedOrdersCount = filteredOrders.filter(order => order.status === 'allocated').length

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

      {/* Pending Orders Actions */}
      {activeCategory === 'pending' && pendingOrdersCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              Pending Orders Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {pendingOrdersCount} pending orders ready for review
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
                  onClick={() => {
                    handleModifyOrder()
                    setShowModifyOrderModal(true)
                  }}
                  disabled={selectedOrders.length === 0}
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  <Package className="h-4 w-4 mr-2" />
                  Modify Orders ({selectedOrders.length})
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Allocated Orders Actions */}
      {activeCategory === 'allocated' && allocatedOrdersCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              Allocated Orders Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {allocatedOrdersCount} allocated orders ready for dispatch
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
                  onClick={() => setShowDispatchModal(true)}
                  disabled={selectedOrders.length === 0}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Truck className="h-4 w-4 mr-2" />
                  Dispatch Orders ({selectedOrders.length})
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Order Categories */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
        {categories.map((category) => {
          const IconComponent = category.icon
          return (
            <button
              key={category.key}
              onClick={() => setActiveCategory(category.key as any)}
              className={`py-2 px-4 rounded-md text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeCategory === category.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <IconComponent className="h-4 w-4" />
              {category.label} ({category.count})
            </button>
          )
        })}
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
            <option>Pending</option>
            <option>Allocated</option>
            <option>Dispatched</option>
            <option>Rejected</option>
            <option>Cancelled</option>
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
                    {(activeCategory === 'pending' || activeCategory === 'allocated') && (
                      <input
                        type="checkbox"
                        checked={selectedOrders.length === filteredOrders.filter(o => 
                          activeCategory === 'pending' ? o.status === 'pending' : o.status === 'allocated'
                        ).length}
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
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Load Out #</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Manufacturing Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Order Value</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Order Quantity</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      {(order.status === 'pending' || order.status === 'allocated') && (
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
                    <td className="py-3 px-4 text-gray-900">{order.loadOutNumber || '-'}</td>
                    <td className="py-3 px-4 text-gray-900">{order.manufacturingDate || '-'}</td>
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
              Are you sure you want to auto-process {selectedOrders.length} selected pending orders?
            </p>
            <p className="text-sm text-gray-500 mb-4">
              This will check inventory availability and process orders accordingly.
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

      {/* Modify Orders Modal */}
      {showModifyOrderModal && modifyOrderData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Modify Order - {modifyOrderData.orderId}</h2>
              <Button
                onClick={() => {
                  setShowModifyOrderModal(false)
                  setModifyOrderData(null)
                }}
                variant="outline"
                size="sm"
              >
                Close
              </Button>
            </div>

            <div className="space-y-6">
              {/* Instructions */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Modification Instructions</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• <strong>Keep:</strong> Maintain original quantity</li>
                  <li>• <strong>Modify:</strong> Change quantity (requires reason code)</li>
                  <li>• <strong>Remove:</strong> Remove SKU entirely (requires reason code)</li>
                  <li>• Reason codes: "Out of Stock", "Customer Declined", "Quality Issue", "Pricing Issue"</li>
                </ul>
              </div>

              {/* SKU Modification Table */}
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">SKU ID</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Product Name</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Original Qty</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Action</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">New Qty</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Reason Code</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modifyOrderData.skus.map((sku, index) => (
                      <tr key={sku.skuId} className="border-t">
                        <td className="py-3 px-4 text-gray-900">{sku.skuId}</td>
                        <td className="py-3 px-4 text-gray-900">{sku.skuName}</td>
                        <td className="py-3 px-4 text-gray-900">{sku.originalQuantity}</td>
                        <td className="py-3 px-4">
                          <select
                            value={sku.action}
                            onChange={(e) => updateSkuAction(sku.skuId, e.target.value as 'keep' | 'remove' | 'modify')}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value="keep">Keep</option>
                            <option value="modify">Modify</option>
                            <option value="remove">Remove</option>
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          {sku.action === 'modify' ? (
                            <input
                              type="number"
                              min="0"
                              max={sku.originalQuantity}
                              value={sku.currentQuantity}
                              onChange={(e) => updateSkuAction(sku.skuId, 'modify', parseInt(e.target.value) || 0)}
                              className="px-2 py-1 border border-gray-300 rounded text-sm w-20"
                            />
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {(sku.action === 'modify' || sku.action === 'remove') ? (
                            <select
                              value={sku.reason || ''}
                              onChange={(e) => updateSkuAction(sku.skuId, sku.action, sku.currentQuantity, e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded text-sm"
                            >
                              <option value="">Select Reason</option>
                              <option value="Out of Stock">Out of Stock</option>
                              <option value="Customer Declined">Customer Declined</option>
                              <option value="Quality Issue">Quality Issue</option>
                              <option value="Pricing Issue">Pricing Issue</option>
                            </select>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add Replacement SKU */}
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Add Replacement SKU</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <input
                    type="text"
                    placeholder="SKU ID"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Product Name"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Quantity"
                    min="1"
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button variant="outline" size="sm">
                    Add SKU
                  </Button>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Modification Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Total SKUs:</span>
                    <span className="ml-2 font-medium">{modifyOrderData.skus.length}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Modified:</span>
                    <span className="ml-2 font-medium text-blue-600">
                      {modifyOrderData.skus.filter(s => s.action === 'modify').length}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Removed:</span>
                    <span className="ml-2 font-medium text-red-600">
                      {modifyOrderData.skus.filter(s => s.action === 'remove').length}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Kept:</span>
                    <span className="ml-2 font-medium text-green-600">
                      {modifyOrderData.skus.filter(s => s.action === 'keep').length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  onClick={() => {
                    setShowModifyOrderModal(false)
                    setModifyOrderData(null)
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveModifications}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={modifyOrderData.skus.some(sku => 
                    (sku.action === 'modify' || sku.action === 'remove') && !sku.reason
                  )}
                >
                  Save Modifications
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dispatch Orders Modal */}
      {showDispatchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Dispatch Orders</h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to dispatch {selectedOrders.length} selected allocated orders?
            </p>
            <p className="text-sm text-gray-500 mb-4">
              This will generate load out numbers and change status to 'dispatched'.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => setShowDispatchModal(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDispatchOrders}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Dispatch Orders
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
                {selectedOrderForLog.loadOutNumber && (
                  <div>
                    <span className="font-medium">Load Out Number:</span> {selectedOrderForLog.loadOutNumber}
                  </div>
                )}
                {selectedOrderForLog.manufacturingDate && (
                  <div>
                    <span className="font-medium">Manufacturing Date:</span> {selectedOrderForLog.manufacturingDate}
                  </div>
                )}
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
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 