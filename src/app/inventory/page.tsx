"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Package, 
  Plus,
  Search,
  Filter,
  Upload,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"


export default function InventoryPage() {
  const [showReportsPanel, setShowReportsPanel] = useState(false);
  const [reportType, setReportType] = useState("Inventory Report");
  const [category, setCategory] = useState("All Categories");
  const [status, setStatus] = useState("All Status");
  const [skuIds, setSkuIds] = useState("");


  const inventoryItems = [
    {
      id: 1,
      name: "Premium Instant Coffee 200g",
      ean: "8901030875200",
      sku: "SKU001",
      sellableQty: 150,
      damagedQty: 10,
      expiredQty: 0,
      blockedQty: 8,
      routeStock: 25,
      status: "in stock"
    },
    {
      id: 2,
      name: "Organic Tea Bags 50ct",
      ean: "8901030875201",
      sku: "SKU002",
      sellableQty: 25,
      damagedQty: 5,
      expiredQty: 0,
      blockedQty: 3,
      routeStock: 8,
      status: "low stock"
    },
    {
      id: 3,
      name: "Chocolate Cookies 250g",
      ean: "8901030875202",
      sku: "SKU003",
      sellableQty: 0,
      damagedQty: 0,
      expiredQty: 15,
      blockedQty: 0,
      routeStock: 0,
      status: "out-of-stock"
    },
    {
      id: 4,
      name: "Energy Drink 250ml",
      ean: "8901030875203",
      sku: "SKU004",
      sellableQty: 80,
      damagedQty: 7,
      expiredQty: 0,
      blockedQty: 12,
      routeStock: 15,
      status: "in stock"
    },
    {
      id: 5,
      name: "Protein Bar 60g",
      ean: "8901030875204",
      sku: "SKU005",
      sellableQty: 15,
      damagedQty: 2,
      expiredQty: 0,
      blockedQty: 5,
      routeStock: 3,
      status: "low stock"
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "in stock":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "low stock":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "out-of-stock":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <CheckCircle className="h-4 w-4 text-green-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "in stock":
        return "in stock"
      case "low stock":
        return "low stock"
      case "out-of-stock":
        return "out-of-stock"
      default:
        return "in stock"
    }
  }

  // Quick date filter logic (for demo, just logs the selected period)
  const setQuickDate = (type: string) => {
    console.log('Selected date period:', type);
    // Here you would typically set the date range for the report
  };



  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inventory Items</h1>
        <p className="text-gray-600">Manage and track all your inventory items.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-blue-600">5</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-600">2</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div>
                <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">1</p>
        </div>
              <XCircle className="h-8 w-8 text-red-600" />
        </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Items Section */}
      <div className="space-y-4">
        {/* Search and Actions */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                placeholder="Search by SKU, product name, batch ID, or supplier..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowReportsPanel(true)}>
              Reports
            </Button>
            <Button variant="jiomart" onClick={() => window.location.href = '/opening-stock/upload'}>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>
        </div>

        {/* Reports Panel */}
        {showReportsPanel && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 relative mb-4">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => setShowReportsPanel(false)}
              aria-label="Close"
            >
              <XCircle className="h-6 w-6" />
            </button>
            <div className="mb-2">
              <h2 className="text-lg font-semibold">Generate Reports</h2>
              <p className="text-gray-500 text-sm">Download inventory and movement reports with custom filters</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Report Type</label>
                <select className="w-full border rounded-md px-3 py-2" value={reportType} onChange={e => setReportType(e.target.value)}>
                  <option>Inventory Report</option>
                  <option>Inventory Movement Report</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
                <select className="w-full border rounded-md px-3 py-2" value={category} onChange={e => setCategory(e.target.value)}>
                  <option>All Categories</option>
                  <option>Beverages</option>
                  <option>Snacks</option>
                  <option>Health</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <select className="w-full border rounded-md px-3 py-2" value={status} onChange={e => setStatus(e.target.value)}>
                  <option>All Status</option>
                  <option>In Stock</option>
                  <option>Low Stock</option>
                  <option>Out of Stock</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">SKU IDs (comma-separated)</label>
                <input
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="e.g., SKU001, SKU002"
                  value={skuIds}
                  onChange={e => setSkuIds(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {['Today', 'This Week', 'This Month', 'Last Month', 'Last 3 Months', 'This Year'].map(label => (
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
                setReportType("Inventory Report");
                setCategory("All Categories");
                setStatus("All Status");
                setSkuIds("");
              }}>Reset Filters</Button>
              <Button variant="jiomart">
                <Download className="mr-2 h-4 w-4" />
                Download Excel Report
              </Button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-4">
          <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Status</option>
            <option>In Stock</option>
            <option>Low Stock</option>
            <option>Out of Stock</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Categories</option>
            <option>Beverages</option>
            <option>Snacks</option>
            <option>Health</option>
          </select>
        </div>

      {/* Inventory Table */}
      <Card>
          <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left py-3 px-4 font-medium text-gray-800">Product Name + EAN Code / SKU ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-800">Inventory in Hand</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-800">Sellable Stock</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-800">Allocated Stock</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-800">On Route Stock</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-800">Expired Stock</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-800">Damaged Stock</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-800">Status</th>
                </tr>
              </thead>
              <tbody>
                  {inventoryItems.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                        <div>
                          <Link href={`/inventory/${item.id}`} className="font-medium text-gray-900 hover:text-blue-600 hover:underline">
                        {item.name}
                          </Link>
                          <div className="text-sm text-gray-500">
                            EAN: {item.ean}, SKU: {item.sku}
                          </div>
                      </div>
                    </td>
                      <td className="py-3 px-4">
                        <span className="text-blue-600 font-medium">{item.sellableQty + item.routeStock + item.expiredQty + item.damagedQty + item.blockedQty}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-green-600 font-medium">{item.sellableQty}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-purple-600 font-medium">{item.blockedQty}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-blue-600 font-medium">{item.routeStock}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-gray-600 font-medium">{item.expiredQty}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-orange-600 font-medium">{item.damagedQty}</span>
                      </td>
                    <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(item.status)}
                          <span className="text-sm font-medium">{getStatusText(item.status)}</span>
                        </div>
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
          <div className="text-sm text-gray-700">Showing 1 to 5 of 5 results</div>
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