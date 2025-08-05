import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Mock data - replace with actual database queries
    const dashboardData = {
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
      lastRefresh: new Date().toISOString()
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
} 