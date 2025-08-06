"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Package, 
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Upload,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Input } from "@/components/ui/input"

export default function InventoryPage() {
  const [showReportsPanel, setShowReportsPanel] = useState(false);
  const [reportType, setReportType] = useState("Inventory Report");
  const [category, setCategory] = useState("All Categories");
  const [status, setStatus] = useState("All Status");
  const [skuIds, setSkuIds] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<any>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{type: 'save' | 'cancel', itemId: number} | null>(null);

  const inventoryItems = [
    {
      id: 1,
      name: "Premium Instant Coffee 200g",
      ean: "8901030875200",
      sku: "SKU001",
      sellableQty: 150,
      lostQty: 5,
      damagedQty: 10,
      expiredQty: 0,
      blockedQty: 8,
      status: "in stock"
    },
    {
      id: 2,
      name: "Organic Tea Bags 50ct",
      ean: "8901030875201",
      sku: "SKU002",
      sellableQty: 25,
      lostQty: 2,
      damagedQty: 5,
      expiredQty: 0,
      blockedQty: 3,
      status: "low stock"
    },
    {
      id: 3,
      name: "Chocolate Cookies 250g",
      ean: "8901030875202",
      sku: "SKU003",
      sellableQty: 0,
      lostQty: 0,
      damagedQty: 0,
      expiredQty: 15,
      blockedQty: 0,
      status: "out-of-stock"
    },
    {
      id: 4,
      name: "Energy Drink 250ml",
      ean: "8901030875203",
      sku: "SKU004",
      sellableQty: 80,
      lostQty: 3,
      damagedQty: 7,
      expiredQty: 0,
      blockedQty: 12,
      status: "in stock"
    },
    {
      id: 5,
      name: "Protein Bar 60g",
      ean: "8901030875204",
      sku: "SKU005",
      sellableQty: 15,
      lostQty: 1,
      damagedQty: 2,
      expiredQty: 0,
      blockedQty: 5,
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

  // Quick date filter logic (for demo, just sets dateFrom/dateTo to today)
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

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setEditingData({
      sellableQty: item.sellableQty,
      lostQty: item.lostQty,
      damagedQty: item.damagedQty,
      expiredQty: item.expiredQty
    });
  }

  const handleSave = () => {
    setConfirmAction({ type: 'save', itemId: editingId! });
    setShowConfirmModal(true);
  }

  const handleCancel = () => {
    setConfirmAction({ type: 'cancel', itemId: editingId! });
    setShowConfirmModal(true);
  }

  const confirmActionHandler = () => {
    if (confirmAction?.type === 'save') {
      // Simulate saving the data
      console.log('Saving changes for item:', confirmAction.itemId, editingData);
      // Here you would typically make an API call to save the data
    }
    
    setEditingId(null);
    setEditingData({});
    setShowConfirmModal(false);
    setConfirmAction(null);
  }

  const handleEditChange = (field: string, value: string) => {
    setEditingData((prev: any) => ({
      ...prev,
      [field]: parseInt(value) || 0
    }));
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inventory Items</h1>
        <p className="text-gray-600">Manage and track all your inventory items.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-green-600">₹28K</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
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
                setReportType("Inventory Report");
                setCategory("All Categories");
                setStatus("All Status");
                setSkuIds("");
                setDateFrom("");
                setDateTo("");
              }}>Reset Filters</Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download Excel
              </Button>
              <Button variant="jiomart">
                Generate Report
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
                    <th className="text-left py-3 px-4 font-medium text-gray-800">Sellable Quantity</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-800">Lost Quantity</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-800">Damaged Quantity</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-800">Expired Quantity</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-800">Blocked Quantity</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-800">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-800">Actions</th>
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
                        {editingId === item.id ? (
                          <Input
                            type="number"
                            value={editingData.sellableQty || 0}
                            onChange={(e) => handleEditChange('sellableQty', e.target.value)}
                            className="w-20 text-green-600 font-medium"
                          />
                        ) : (
                          <span className="text-green-600 font-medium">{item.sellableQty}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {editingId === item.id ? (
                          <Input
                            type="number"
                            value={editingData.lostQty || 0}
                            onChange={(e) => handleEditChange('lostQty', e.target.value)}
                            className="w-20 text-red-600 font-medium"
                          />
                        ) : (
                          <span className="text-red-600 font-medium">{item.lostQty}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {editingId === item.id ? (
                          <Input
                            type="number"
                            value={editingData.damagedQty || 0}
                            onChange={(e) => handleEditChange('damagedQty', e.target.value)}
                            className="w-20 text-orange-600 font-medium"
                          />
                        ) : (
                          <span className="text-orange-600 font-medium">{item.damagedQty}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {editingId === item.id ? (
                          <Input
                            type="number"
                            value={editingData.expiredQty || 0}
                            onChange={(e) => handleEditChange('expiredQty', e.target.value)}
                            className="w-20 text-gray-600 font-medium"
                          />
                        ) : (
                          <span className="text-gray-600 font-medium">{item.expiredQty}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {editingId === item.id ? (
                          <Input
                            type="number"
                            value={editingData.blockedQty || 0}
                            onChange={(e) => handleEditChange('blockedQty', e.target.value)}
                            className="w-20 text-purple-600 font-medium"
                          />
                        ) : (
                          <span className="text-purple-600 font-medium">{item.blockedQty}</span>
                        )}
                      </td>
                    <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(item.status)}
                          <span className="text-sm font-medium">{getStatusText(item.status)}</span>
                        </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        {editingId === item.id ? (
                          <>
                            <Button size="sm" variant="jiomart" onClick={handleSave}>
                              Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={handleCancel}>
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
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

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {confirmAction?.type === 'save' ? 'Confirm Save Changes' : 'Confirm Cancel'}
            </h3>
            <p className="text-gray-600 mb-6">
              {confirmAction?.type === 'save' 
                ? 'Are you sure you want to save these changes? This action cannot be undone.'
                : 'Are you sure you want to cancel? All unsaved changes will be lost.'
              }
            </p>
            <div className="flex gap-3 justify-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowConfirmModal(false);
                  setConfirmAction(null);
                }}
              >
                No, Keep Editing
              </Button>
              <Button 
                variant="jiomart" 
                onClick={confirmActionHandler}
              >
                {confirmAction?.type === 'save' ? 'Yes, Save Changes' : 'Yes, Cancel'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 