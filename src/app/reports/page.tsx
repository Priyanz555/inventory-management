"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Download, 
  BarChart3,
  AlertTriangle,
  Building,
  Package,
  TrendingDown,
  Calendar,
  Users
} from "lucide-react"

interface LowStockItem {
  id: string
  distributorId: string
  distributorName: string
  articleId: string
  articleName: string
  baseUnit: 'CS' | 'EA'
  avgDailySales: number
  inventoryOnHand: number
  lowStockQuantity: number
  daysToStockout: number
}

interface DistributorSummary {
  distributorId: string
  distributorName: string
  totalSkusAtLowStock: number
}

export default function ReportsPage() {
  const [lowStockData, setLowStockData] = useState<LowStockItem[]>([])
  const [distributorSummaries, setDistributorSummaries] = useState<DistributorSummary[]>([])
  const [loading, setLoading] = useState(true)

  // Mock data
  const mockLowStockData: LowStockItem[] = [
    {
      id: '1',
      distributorId: 'DIST001',
      distributorName: 'Mumbai Central',
      articleId: 'ART001',
      articleName: 'Campa Cola 1L',
      baseUnit: 'CS',
      avgDailySales: 5.2,
      inventoryOnHand: 12,
      lowStockQuantity: 50,
      daysToStockout: 2.3
    },
    {
      id: '2',
      distributorId: 'DIST001',
      distributorName: 'Mumbai Central',
      articleId: 'ART002',
      articleName: 'Campa Lemon 1L',
      baseUnit: 'CS',
      avgDailySales: 3.8,
      inventoryOnHand: 8,
      lowStockQuantity: 30,
      daysToStockout: 2.1
    },
    {
      id: '3',
      distributorId: 'DIST002',
      distributorName: 'Delhi North',
      articleId: 'ART003',
      articleName: 'Raskik Mixed Fruit Juice 500 ML',
      baseUnit: 'CS',
      avgDailySales: 15.5,
      inventoryOnHand: 45,
      lowStockQuantity: 100,
      daysToStockout: 2.9
    },
    {
      id: '4',
      distributorId: 'DIST002',
      distributorName: 'Delhi North',
      articleId: 'ART004',
      articleName: 'Independence Namkeen 200g',
      baseUnit: 'EA',
      avgDailySales: 12.3,
      inventoryOnHand: 28,
      lowStockQuantity: 80,
      daysToStockout: 2.3
    },
    {
      id: '5',
      distributorId: 'DIST003',
      distributorName: 'Bangalore South',
      articleId: 'ART005',
      articleName: 'Good Life Besan 500g',
      baseUnit: 'EA',
      avgDailySales: 8.7,
      inventoryOnHand: 15,
      lowStockQuantity: 60,
      daysToStockout: 1.7
    },
    {
      id: '6',
      distributorId: 'DIST003',
      distributorName: 'Bangalore South',
      articleId: 'ART006',
      articleName: 'Toffeeman',
      baseUnit: 'EA',
      avgDailySales: 22.1,
      inventoryOnHand: 35,
      lowStockQuantity: 120,
      daysToStockout: 1.6
    },
    {
      id: '7',
      distributorId: 'DIST001',
      distributorName: 'Mumbai Central',
      articleId: 'ART007',
      articleName: 'Independence Whole Wheat Ata 5Kg',
      baseUnit: 'EA',
      avgDailySales: 4.3,
      inventoryOnHand: 6,
      lowStockQuantity: 40,
      daysToStockout: 1.4
    },
    {
      id: '8',
      distributorId: 'DIST002',
      distributorName: 'Delhi North',
      articleId: 'ART008',
      articleName: 'Snac Tac Bikaneri Bhujia 750g',
      baseUnit: 'EA',
      avgDailySales: 9.8,
      inventoryOnHand: 12,
      lowStockQuantity: 70,
      daysToStockout: 1.2
    }
  ]

  const mockDistributorSummaries: DistributorSummary[] = [
    {
      distributorId: 'DIST001',
      distributorName: 'Mumbai Central',
      totalSkusAtLowStock: 3
    },
    {
      distributorId: 'DIST002',
      distributorName: 'Delhi North',
      totalSkusAtLowStock: 3
    },
    {
      distributorId: 'DIST003',
      distributorName: 'Bangalore South',
      totalSkusAtLowStock: 2
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLowStockData(mockLowStockData)
      setDistributorSummaries(mockDistributorSummaries)
      setLoading(false)
    }, 1000)
  }, [])

  const downloadIndividualReport = (distributorId: string) => {
    const distributorData = lowStockData.filter(item => item.distributorId === distributorId)
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Distributor ID,Distributor Name,Article ID,Article Name,Base Unit,Average Daily Sales,Inventory on Hand,Low Stock Quantity,Days to Stock-out\n" +
      distributorData.map(item => 
        `${item.distributorId},${item.distributorName},${item.articleId},${item.articleName},${item.baseUnit},${item.avgDailySales},${item.inventoryOnHand},${item.lowStockQuantity},${item.daysToStockout}`
      ).join("\n")
    
    const link = document.createElement("a")
    link.setAttribute("href", encodeURI(csvContent))
    link.setAttribute("download", `low_stock_report_${distributorId}.csv`)
    link.click()
  }

  const downloadAllReports = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Distributor ID,Distributor Name,Article ID,Article Name,Base Unit,Average Daily Sales,Inventory on Hand,Low Stock Quantity,Days to Stock-out\n" +
      lowStockData.map(item => 
        `${item.distributorId},${item.distributorName},${item.articleId},${item.articleName},${item.baseUnit},${item.avgDailySales},${item.inventoryOnHand},${item.lowStockQuantity},${item.daysToStockout}`
      ).join("\n")
    
    const link = document.createElement("a")
    link.setAttribute("href", encodeURI(csvContent))
    link.setAttribute("download", "all_distributors_low_stock_report.csv")
    link.click()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <BarChart3 className="h-8 w-8 animate-spin mx-auto mb-4 text-[hsl(var(--button-blue))]" />
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">View and download inventory reports</p>
        </div>
        <Button onClick={downloadAllReports} variant="jiomart" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download All Reports
        </Button>
      </div>

      {/* Low Stock Report */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Low Stock Report
          </CardTitle>
          <CardDescription>
            Monitor items at low stock levels across all distributors
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Distributor Summary Table */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Building className="h-5 w-5 text-[hsl(var(--button-blue))]" />
              Distributor Summary
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Distributor ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Total SKUs at Low Stock</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {distributorSummaries.map((distributor) => (
                    <tr key={distributor.distributorId} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 font-medium underline">{distributor.distributorId}</td>
                      <td className="py-3 px-4">{distributor.distributorName}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                          {distributor.totalSkusAtLowStock}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadIndividualReport(distributor.distributorId)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download Report
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detailed Low Stock Table */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-[hsl(var(--button-blue))]" />
              Detailed Low Stock Items
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Distributor ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Distributor Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Article ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Article Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Base Unit</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Avg Daily Sales</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Inventory on Hand</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Low Stock Qty</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Days to Stock-out</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockData.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 font-medium underline">{item.distributorId}</td>
                      <td className="py-3 px-4">{item.distributorName}</td>
                      <td className="py-3 px-4">{item.articleId}</td>
                      <td className="py-3 px-4">{item.articleName}</td>
                      <td className="py-3 px-4">{item.baseUnit}</td>
                      <td className="py-3 px-4">{item.avgDailySales}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.inventoryOnHand < item.lowStockQuantity 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.inventoryOnHand}
                        </span>
                      </td>
                      <td className="py-3 px-4">{item.lowStockQuantity}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.daysToStockout <= 3 
                            ? 'bg-red-100 text-red-800' 
                            : item.daysToStockout <= 7 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {item.daysToStockout} days
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 