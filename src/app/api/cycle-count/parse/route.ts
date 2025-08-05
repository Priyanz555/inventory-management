import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      return NextResponse.json(
        { error: 'Only Excel files (.xlsx, .xls) are supported' },
        { status: 400 }
      );
    }

    // In real implementation, parse the Excel file
    // For now, return mock data
    const sessionId = Date.now().toString();
    
    const mockData = {
      sessionId,
      validRows: [
        {
          sku: 'SKU001',
          systemQtyCS: 100,
          systemQtyEA: 12,
          physicalQtyCS: 98,
          physicalQtyEA: 8,
          varianceCS: -2,
          varianceEA: -4,
          variancePercent: -2.0,
          hasError: false
        },
        {
          sku: 'SKU002',
          systemQtyCS: 50,
          systemQtyEA: 0,
          physicalQtyCS: 52,
          physicalQtyEA: 0,
          varianceCS: 2,
          varianceEA: 0,
          variancePercent: 4.0,
          hasError: false
        }
      ],
      errorRows: [
        {
          sku: 'SKU003',
          systemQtyCS: 75,
          systemQtyEA: 6,
          physicalQtyCS: -5,
          physicalQtyEA: 25,
          varianceCS: 0,
          varianceEA: 0,
          variancePercent: 0,
          hasError: true,
          errorMessage: 'Physical quantity cannot be negative'
        }
      ],
      totalAdjustments: 4,
      totalSKUs: 3
    };

    return NextResponse.json(mockData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to parse file' },
      { status: 500 }
    );
  }
} 