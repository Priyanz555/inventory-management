import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const sku = searchParams.get('sku') || '';
    const batch = searchParams.get('batch') || '';

    // Validate required parameters
    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Start date and end date are required' },
        { status: 400 }
      );
    }

    // Mock data - same as the main endpoint but without pagination
    const mockData = [
      {
        sku: 'SKU001',
        batch: 'BATCH001',
        openingQtyCS: 100,
        openingQtyEA: 12,
        inwardCS: 50,
        inwardEA: 6,
        outwardCS: 30,
        outwardEA: 4,
        adjustmentsCS: 5,
        adjustmentsEA: 2,
        closingQtyCS: 125,
        closingQtyEA: 16,
      },
      {
        sku: 'SKU002',
        batch: 'BATCH002',
        openingQtyCS: 75,
        openingQtyEA: 8,
        inwardCS: 25,
        inwardEA: 3,
        outwardCS: 20,
        outwardEA: 2,
        adjustmentsCS: -2,
        adjustmentsEA: 1,
        closingQtyCS: 78,
        closingQtyEA: 10,
      },
      {
        sku: 'SKU003',
        batch: '',
        openingQtyCS: 200,
        openingQtyEA: 0,
        inwardCS: 100,
        inwardEA: 0,
        outwardCS: 80,
        outwardEA: 0,
        adjustmentsCS: 10,
        adjustmentsEA: 0,
        closingQtyCS: 230,
        closingQtyEA: 0,
      },
    ];

    // Filter data based on parameters
    let filteredData = mockData;
    if (sku) {
      filteredData = filteredData.filter(item => item.sku.toLowerCase().includes(sku.toLowerCase()));
    }
    if (batch) {
      filteredData = filteredData.filter(item => item.batch.toLowerCase().includes(batch.toLowerCase()));
    }

    // Generate CSV content
    const csvHeaders = [
      'SKU',
      'Batch',
      'Opening Qty CS',
      'Opening Qty EA',
      'Inward CS',
      'Inward EA',
      'Outward CS',
      'Outward EA',
      'Adjustments CS',
      'Adjustments EA',
      'Closing Qty CS',
      'Closing Qty EA',
    ];

    const csvRows = filteredData.map(item => [
      item.sku,
      item.batch || '',
      item.openingQtyCS,
      item.openingQtyEA,
      item.inwardCS,
      item.inwardEA,
      item.outwardCS,
      item.outwardEA,
      item.adjustmentsCS,
      item.adjustmentsEA,
      item.closingQtyCS,
      item.closingQtyEA,
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n');

    // Return CSV file
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="inventory_report_${startDate}_${endDate}.csv"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to export inventory report' },
      { status: 500 }
    );
  }
} 