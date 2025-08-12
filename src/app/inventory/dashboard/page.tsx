"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Package,
  TrendingUp,
  AlertTriangle,
  Truck,
  ShoppingCart,
  FileText
} from "lucide-react"

interface DashboardData {
  kpi: {
    closingStock: number
    openingStock: number
    sellableStock: number
  }
  lowStock: {
    fastMoving: {
      totalSkus: number
      topPriority: string
      reorderQty: number
    }
    regularMoving: {
      totalSkus: number
      topPriority: string
      reorderQty: number
    }
  }
  orders: {
    incomingPrimary: {
      totalOrders: number
      orderValue: number
      totalSkus: number
      cases: number
    }
    secondaryPreSales: {
      totalOrders: number
      orderValue: number
      totalSkus: number
      cases: number
    }
    vanSalesLoadouts: {
      totalOrders: number
      orderValue: number
      totalSkus: number
      cases: number
    }
  }
  lastRefresh: string
}

export default function InventoryDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<string>("")

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      // Simulate API call - replace with actual endpoint
      const response = await fetch('/api/inventory/dashboard')
      const dashboardData = await response.json()
      setData(dashboardData)
      setLastRefresh(new Date().toLocaleTimeString())
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Fallback mock data
      setData({
        kpi: {
          closingStock: 15420,
          openingStock: 16200,
          sellableStock: 14850
        },
        lowStock: {
          fastMoving: {
            totalSkus: 12,
            topPriority: "Coca-Cola 500ml",
            reorderQty: 150
          },
          regularMoving: {
            totalSkus: 8,
            topPriority: "Pepsi 1L",
            reorderQty: 75
          }
        },
        orders: {
          incomingPrimary: {
            totalOrders: 5,
            orderValue: 125000,
            totalSkus: 45,
            cases: 250
          },
          secondaryPreSales: {
            totalOrders: 3,
            orderValue: 85000,
            totalSkus: 28,
            cases: 180
          },
          vanSalesLoadouts: {
            totalOrders: 2,
            orderValue: 45000,
            totalSkus: 15,
            cases: 95
          }
        },
        lastRefresh: new Date().toLocaleTimeString()
      })
      setLastRefresh(new Date().toLocaleTimeString())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
    
    // Auto-refresh every 10 minutes
    const interval = setInterval(fetchDashboardData, 10 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  const handleReorder = async (type: 'fast' | 'regular') => {
    try {
      const response = await fetch('/api/orders/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          items: type === 'fast' ? data?.lowStock.fastMoving : data?.lowStock.regularMoving
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        alert(`Reorder order created successfully for ${type} movers!`)
        // Optionally refresh dashboard data
        fetchDashboardData()
      } else {
        alert('Failed to create reorder order')
      }
    } catch (error) {
      console.error('Error creating reorder:', error)
      alert('Failed to create reorder order')
    }
  }

  const handleOrderAction = (action: string, type: string) => {
    console.log(`${action} for ${type}`)
    // Handle order actions (GRN, Process Orders, View Details)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Inventory Dashboard</h1>
        <p className="text-gray-600">Real-time view of stock health and order workload</p>
      </div>



      {/* KPI Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              Stock in Hand
              <div className="relative group">
                <span className="text-xs text-gray-400 cursor-help">ⓘ</span>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                  Opening Stock excluding orders booked and orders loaded out for market.
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                </div>
              </div>
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-gray-900">1,180</div>
                  <div className="text-sm text-gray-600 mt-1"># SKUs</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-gray-900">14,850</div>
                  <div className="text-sm text-gray-600 mt-1"># Cases</div>
                </div>
              </div>
              <Button 
                onClick={() => window.location.href = '/inventory'}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Package className="h-4 w-4 mr-2" />
                View Inventory
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">20</div>
                <div className="text-sm text-gray-600 mt-1"># SKUs at low stock levels</div>
              </div>
              <Button 
                onClick={() => handleReorder('fast')}
                variant="jiomart"
                size="sm"
                className="w-full"
              >
                Order Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Management Hub */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Order Management Hub</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Truck className="h-5 w-5 text-blue-600" />
                Incoming Primary Orders
                <div className="relative group">
                  <span className="text-xs text-gray-400 cursor-help">ⓘ</span>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                    Orders from the company that are in transit to your site.
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold">{data?.orders.incomingPrimary.totalOrders}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total SKUs</p>
                  <p className="text-2xl font-bold">{data?.orders.incomingPrimary.totalSkus}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cases</p>
                  <p className="text-2xl font-bold">{data?.orders.incomingPrimary.cases}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => window.location.href = '/orders/primary'}
                  variant="jiomart"
                  className="flex-1"
                >
                  GRN
                </Button>
                <Button 
                  onClick={() => window.location.href = '/orders/primary'}
                  variant="outline"
                  className="flex-1"
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <ShoppingCart className="h-5 w-5 text-green-600" />
                Secondary Orders (Unprocessed)
                <div className="relative group">
                  <span className="text-xs text-gray-400 cursor-help">ⓘ</span>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                    Orders booked but not yet dispatched to the retailers.
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold">{data?.orders.secondaryPreSales.totalOrders}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total SKUs</p>
                  <p className="text-2xl font-bold">{data?.orders.secondaryPreSales.totalSkus}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cases</p>
                  <p className="text-2xl font-bold">{data?.orders.secondaryPreSales.cases}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => window.location.href = '/orders/retailer?tab=accepted_unprocessed'}
                  variant="jiomart"
                  className="flex-1"
                >
                  Process Orders
                </Button>
                <Button 
                  onClick={() => window.location.href = '/orders/retailer?tab=accepted_unprocessed'}
                  variant="outline"
                  className="flex-1"
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <FileText className="h-5 w-5 text-purple-600" />
                Secondary Orders (Dispatched)
                <div className="relative group">
                  <span className="text-xs text-gray-400 cursor-help">ⓘ</span>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                    Orders processed and loaded out for the market.
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold">{data?.orders.vanSalesLoadouts.totalOrders}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total SKUs</p>
                  <p className="text-2xl font-bold">{data?.orders.vanSalesLoadouts.totalSkus}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cases</p>
                  <p className="text-2xl font-bold">{data?.orders.vanSalesLoadouts.cases}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => window.location.href = '/orders/retailer?tab=accepted_processed'}
                  variant="outline"
                  className="flex-1"
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Last Refresh Info */}
      {lastRefresh && (
        <div className="text-center text-sm text-gray-500">
          Last updated: {lastRefresh} (Auto-refreshes every 10 minutes)
        </div>
      )}
    </div>
  )
} 