import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      );
    }

    // Mock data - in real implementation, this would fetch current inventory balances
    const inventoryData = [
      {
        sku: 'SKU001',
        qtyCS: 100,
        qtyEA: 12,
      },
      {
        sku: 'SKU002',
        qtyCS: 75,
        qtyEA: 8,
      },
      {
        sku: 'SKU003',
        qtyCS: 200,
        qtyEA: 0,
      },
      {
        sku: 'SKU004',
        qtyCS: 50,
        qtyEA: 6,
      },
      {
        sku: 'SKU005',
        qtyCS: 150,
        qtyEA: 18,
      },
    ];

    return NextResponse.json(inventoryData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch inventory data' },
      { status: 500 }
    );
  }
} 