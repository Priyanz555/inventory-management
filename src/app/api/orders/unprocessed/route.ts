import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNo = searchParams.get('orderNo') || '';
    const retailer = searchParams.get('retailer') || '';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Mock data - in real implementation, this would fetch from database
    const orders = [
      {
        id: '1',
        orderNo: 'ORD001',
        retailer: 'ABC Store',
        date: '2025-01-30',
        totalSKUs: 5,
        cases: 25,
        status: 'Pending Allocation',
      },
      {
        id: '2',
        orderNo: 'ORD002',
        retailer: 'XYZ Mart',
        date: '2025-01-29',
        totalSKUs: 3,
        cases: 15,
        status: 'Partial Dispatched',
      },
      {
        id: '3',
        orderNo: 'ORD003',
        retailer: 'DEF Supermarket',
        date: '2025-01-28',
        totalSKUs: 8,
        cases: 40,
        status: 'Stock Shortage',
      },
      {
        id: '4',
        orderNo: 'ORD004',
        retailer: 'GHI Retail',
        date: '2025-01-27',
        totalSKUs: 2,
        cases: 10,
        status: 'Pending Allocation',
      },
      {
        id: '5',
        orderNo: 'ORD005',
        retailer: 'JKL Store',
        date: '2025-01-26',
        totalSKUs: 6,
        cases: 30,
        status: 'SKU Blocked',
      },
    ];

    // Filter data based on parameters
    let filteredOrders = orders;
    
    if (orderNo) {
      filteredOrders = filteredOrders.filter(order => 
        order.orderNo.toLowerCase().includes(orderNo.toLowerCase())
      );
    }
    
    if (retailer) {
      filteredOrders = filteredOrders.filter(order => 
        order.retailer.toLowerCase().includes(retailer.toLowerCase())
      );
    }
    
    if (startDate && endDate) {
      filteredOrders = filteredOrders.filter(order => 
        order.date >= startDate && order.date <= endDate
      );
    }

    return NextResponse.json(filteredOrders);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch unprocessed orders' },
      { status: 500 }
    );
  }
} 