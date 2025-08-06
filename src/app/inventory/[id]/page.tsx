"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Package, 
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Search,
  ArrowLeft,
  Edit,
  Clock,
  XCircle,
  FileText,
  Download,
  X
} from "lucide-react"
import Link from "next/link"

export default function InventoryItemPage({ params }: { params: { id: string } }) {
  const [showBatchReportsPanel, setShowBatchReportsPanel] = useState(false);
  const [reportType, setReportType] = useState("Batch Inventory Report");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Mock data for Premium Instant Coffee 200g
  const productData = {
    name: "Premium Instant Coffee 200g",
    sku: "SKU001",
    ean: "8901030875200",
    category: "Beverages"
  }

  const batchData = [
    {
      id: "B2023010",
      manufacturingDate: "15/10/2023",
      daysAgo: 659,
      expiryDate: "15/10/2024",
      expiryStatus: "expired",
      daysToExpiry: -67,
      sellableQty: 0,
      lostQty: 0,
      damagedQty: 0,
      expiredQty: 18,
      blockedQty: 0,
      grnDate: "10/10/2023",
      status: "expired"
    },
    {
      id: "B2023015",
      manufacturingDate: "15/11/2023",
      daysAgo: 628,
      expiryDate: "01/12/2024",
      expiryStatus: "near expiry",
      daysToExpiry: 7,
      sellableQty: 25,
      lostQty: 2,
      damagedQty: 5,
      expiredQty: 0,
      blockedQty: 8,
      grnDate: "10/11/2023",
      status: "near expiry"
    },
    {
      id: "B2024001",
      manufacturingDate: "15/01/2024",
      daysAgo: 587,
      expiryDate: "15/01/2025",
      expiryStatus: "fresh",
      daysToExpiry: 365,
      sellableQty: 80,
      lostQty: 3,
      damagedQty: 7,
      expiredQty: 0,
      blockedQty: 12,
      grnDate: "10/01/2024",
      status: "fresh"
    },
    {
      id: "B2024002",
      manufacturingDate: "15/02/2024",
      daysAgo: 556,
      expiryDate: "15/02/2025",
      expiryStatus: "fresh",
      daysToExpiry: 396,
      sellableQty: 45,
      lostQty: 1,
      damagedQty: 2,
      expiredQty: 0,
      blockedQty: 5,
      grnDate: "10/02/2024",
      status: "fresh"
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "fresh":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "near expiry":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "expired":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <CheckCircle className="h-4 w-4 text-green-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "fresh":
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">fresh</span>
      case "near expiry":
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">near expiry</span>
      case "expired":
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">expired</span>
      default:
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">fresh</span>
    }
  }

  const getExpiryTextColor = (status: string, daysToExpiry: number) => {
    if (status === "expired") return "text-red-600"
    if (status === "near expiry") return "text-orange-600"
    return "text-gray-600"
  }

  const setQuickDate = (type: string) => {
    const today = new Date();
    let from = today;
    let to = today;
    if (type === "Today") {
      // today only
    } else if (type === "This Week") {
      from = new Date(today);
      from.setDate(today.getDate() - today.getDay());
    } else if (type === "This Month") {
      from = new Date(today.getFullYear(), today.getMonth(), 1);
    } else if (type === "Last Month") {
      from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      to = new Date(today.getFullYear(), today.getMonth(), 0);
    } else if (type === "Last 3 Months") {
      from = new Date(today.getFullYear(), today.getMonth() - 2, 1);
    }
    setDateFrom(from.toISOString().slice(0, 10));
    setDateTo(to.toISOString().slice(0, 10));
  };

  const totalBatches = batchData.length
  const totalSellable = batchData.reduce((sum, batch) => sum + batch.sellableQty, 0)
  const alerts = batchData.filter(batch => batch.status === "expired" || batch.status === "near expiry").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/inventory">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Inventory
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{productData.name}</h1>
            <p className="text-gray-600">
              SKU: {productData.sku} | EAN: {productData.ean} | Category: {productData.category}
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={() => setShowBatchReportsPanel(true)}>
          <FileText className="mr-2 h-4 w-4" />
          Batch Reports
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Batches</p>
                <p className="text-2xl font-bold text-blue-600">{totalBatches}</p>
                <p className="text-xs text-gray-500">Active inventory batches</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sellable</p>
                <p className="text-2xl font-bold text-green-600">{totalSellable}</p>
                <p className="text-xs text-gray-500">Units ready for sale</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Alerts</p>
                <p className="text-2xl font-bold text-orange-600">{alerts}</p>
                <p className="text-xs text-gray-500">Batches needing attention</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generate Batch Reports Panel */}
      {showBatchReportsPanel && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 relative mb-4">
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            onClick={() => setShowBatchReportsPanel(false)}
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="mb-2">
            <h2 className="text-lg font-semibold">Generate Batch Reports</h2>
            <p className="text-gray-500 text-sm">Download batch-specific inventory and movement reports for {productData.name}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Report Type</label>
              <select className="w-full border rounded-md px-3 py-2" value={reportType} onChange={e => setReportType(e.target.value)}>
                <option>Batch Inventory Report</option>
                <option>Batch Movement Report</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Status Filter</label>
              <select className="w-full border rounded-md px-3 py-2" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option>All Status</option>
                <option>Fresh</option>
                <option>Near Expiry</option>
                <option>Expired</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Date From</label>
              <input
                type="date"
                className="w-full border rounded-md px-3 py-2"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Date To</label>
              <input
                type="date"
                className="w-full border rounded-md px-3 py-2"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {['Today', 'This Week', 'This Month', 'Last Month', 'Last 3 Months'].map(label => (
              <Button
                key={label}
                variant="outline"
                className="px-3 py-1 text-xs"
                onClick={() => setQuickDate(label)}
              >
                {label}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button variant="outline" onClick={() => {
              setReportType("Batch Inventory Report");
              setStatusFilter("All Status");
              setDateFrom("");
              setDateTo("");
            }}>Reset Filters</Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download Excel
            </Button>
            <Button variant="jiomart">
              <BarChart3 className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </div>
      )}

      {/* Batch-wise Inventory Details */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Batch-wise Inventory Details</h2>
          <p className="text-gray-600">Detailed view of all batches for {productData.name}</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by batch ID or supplier..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Status</option>
              <option>Fresh</option>
              <option>Near Expiry</option>
              <option>Expired</option>
            </select>
          </div>
        </div>

        {/* Inventory Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Batch ID ↑</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Manufacturing Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Expiry Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Sellable Qty</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Lost/Damaged/Expired</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Blocked Qty</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">GRN Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {batchData.map((batch) => (
                    <tr key={batch.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{batch.id}</td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="text-gray-900">{batch.manufacturingDate}</div>
                          <div className="text-sm text-gray-500">{batch.daysAgo} days ago</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className={getExpiryTextColor(batch.expiryStatus, batch.daysToExpiry)}>
                          <div>{batch.expiryDate}</div>
                          <div className="text-sm">
                            {batch.expiryStatus === "expired" 
                              ? `Expired ${Math.abs(batch.daysToExpiry)} days ago`
                              : batch.expiryStatus === "near expiry"
                              ? `${batch.daysToExpiry} days to expiry`
                              : `${batch.daysToExpiry} days to expiry`
                            }
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-green-600 font-medium">{batch.sellableQty}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm space-y-1">
                          <div>Lost: <span className="text-red-600">{batch.lostQty}</span></div>
                          <div>Damaged: <span className="text-orange-600">{batch.damagedQty}</span></div>
                          <div>Expired: <span className="text-gray-600">{batch.expiredQty}</span></div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-purple-600 font-medium">{batch.blockedQty}</span>
                      </td>
                      <td className="py-3 px-4 text-gray-900">{batch.grnDate}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(batch.status)}
                          {getStatusBadge(batch.status)}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Dummy Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50 rounded-b-lg">
          <div className="text-sm text-gray-700">Showing 1 to 4 of 4 results</div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="default" size="sm" className="w-8 h-8 p-0">1</Button>
            <Button variant="outline" size="sm" className="w-8 h-8 p-0">2</Button>
            <Button variant="outline" size="sm" className="w-8 h-8 p-0">3</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </div>
    </div>
  )
} 