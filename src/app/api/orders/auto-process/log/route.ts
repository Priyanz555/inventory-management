import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '50');

    // Mock data - in real implementation, this would fetch from database
    const runs = [
      {
        runDateTime: '2025-01-30 02:00:15',
        trigger: 'Nightly',
        ordersProcessed: 45,
        success: 42,
        failed: 3,
        notes: 'STOCK_SHORTAGE, SKU_BLOCKED',
      },
      {
        runDateTime: '2025-01-29 15:30:25',
        trigger: 'Manual',
        ordersProcessed: 12,
        success: 10,
        failed: 2,
        notes: 'INSUFFICIENT_STOCK',
      },
      {
        runDateTime: '2025-01-29 02:00:12',
        trigger: 'Nightly',
        ordersProcessed: 38,
        success: 38,
        failed: 0,
        notes: '',
      },
      {
        runDateTime: '2025-01-28 14:20:45',
        trigger: 'Manual',
        ordersProcessed: 8,
        success: 6,
        failed: 2,
        notes: 'SKU_NOT_FOUND',
      },
      {
        runDateTime: '2025-01-28 02:00:08',
        trigger: 'Nightly',
        ordersProcessed: 52,
        success: 49,
        failed: 3,
        notes: 'STOCK_SHORTAGE',
      },
    ];

    // Pagination
    const total = runs.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedRuns = runs.slice(startIndex, endIndex);

    return NextResponse.json(paginatedRuns);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch auto-process log' },
      { status: 500 }
    );
  }
} 