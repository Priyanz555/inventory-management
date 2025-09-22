"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  Eye, 
  X,
  Package,
  Download,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import Link from "next/link"

interface Shipment {
  shipmentId: string
  buyerName: string
  shipmentDate: string
  status: "Pending" | "Accepted" | "Rejected" | "Vehicle Booking Pending"
  grnStatus: "Not Started" | "In Progress" | "Completed"
}

interface Order {
  orderId: string
  shipments: Shipment[]
}


export default function PrimaryOrdersPage() {
  const [activeTab, setActiveTab] = useState("All")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)

  const orders: Order[] = [
    {
      orderId: "RC68D11ED00E4E6201FA",
      shipments: [
        {
          shipmentId: "RC11ED00E4E6201FAS02",
          buyerName: "Freshtown PVT LTD",
          shipmentDate: "22 Sept 2025, 03:32 pm",
          status: "Accepted",
          grnStatus: "Completed"
        },
        {
          shipmentId: "RC11ED00E4E6201FAS01",
          buyerName: "Freshtown PVT LTD",
          shipmentDate: "22 Sept 2025, 03:32 pm",
          status: "Accepted",
          grnStatus: "Completed"
        }
      ]
    },
    {
      orderId: "RC68D11A6A0E6BF22D9F",
      shipments: [
        {
          shipmentId: "RC11A6A0E6BF22D9FS01",
          buyerName: "Freshtown PVT LTD",
          shipmentDate: "22 Sept 2025, 03:14 pm",
          status: "Vehicle Booking Pending",
          grnStatus: "Not Started"
        }
      ]
    }
  ]

  const tabs = ["All", "Pending", "Accepted", "Rejected"]

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "All") return true
    return order.shipments.some(shipment => shipment.status === activeTab)
  })

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setShowOrderDetails(true)
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium"
    switch (status) {
      case "Pending":
        return `${baseClasses} bg-orange-100 text-orange-800`
      case "Accepted":
        return `${baseClasses} bg-green-100 text-green-800`
      case "Rejected":
        return `${baseClasses} bg-red-100 text-red-800`
      case "Vehicle Booking Pending":
        return `${baseClasses} bg-orange-100 text-orange-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  const getGRNStatusBadge = (grnStatus: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium"
    switch (grnStatus) {
      case "Not Started":
        return `${baseClasses} bg-gray-100 text-gray-600`
      case "In Progress":
        return `${baseClasses} bg-yellow-100 text-yellow-800`
      case "Completed":
        return `${baseClasses} bg-blue-100 text-blue-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order List</h1>
        </div>
        <Link href="/grn/rcpl">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Package className="h-4 w-4 mr-2" />
            + Manual GRN
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          {/* Filter Tabs */}
          <div className="flex space-x-8 mb-6 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 text-sm font-medium ${
                  activeTab === tab
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mb-6">
            <Button variant="outline" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Bulk Download</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <span>Today</span>
            </Button>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shipment ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shipment Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GRN Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order, orderIndex) => 
                  order.shipments.map((shipment, shipmentIndex) => (
                    <tr key={`${order.orderId}-${shipment.shipmentId}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {shipmentIndex === 0 ? orderIndex + 1 : ""}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {shipmentIndex === 0 ? order.orderId : ""}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {shipment.shipmentId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {shipment.buyerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {shipment.shipmentDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getStatusBadge(shipment.status)}>
                          {shipment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getGRNStatusBadge(shipment.grnStatus)}>
                          {shipment.grnStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm text-gray-700">1 - 2 of 2 Orders</span>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
              <Button
                onClick={() => setShowOrderDetails(false)}
                variant="outline"
                size="sm"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                <strong>Order ID:</strong> {selectedOrder.orderId}
              </p>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Shipment ID</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Buyer Name</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Shipment Date</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">GRN Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.shipments.map((shipment, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 text-sm">{shipment.shipmentId}</td>
                        <td className="border border-gray-300 px-4 py-2 text-sm">{shipment.buyerName}</td>
                        <td className="border border-gray-300 px-4 py-2 text-sm">{shipment.shipmentDate}</td>
                        <td className="border border-gray-300 px-4 py-2 text-sm">
                          <span className={getStatusBadge(shipment.status)}>
                            {shipment.status}
                          </span>
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-sm">
                          <span className={getGRNStatusBadge(shipment.grnStatus)}>
                            {shipment.grnStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  )
} 