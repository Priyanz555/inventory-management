import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Mock data - in real implementation, this would fetch from database
    const auditDetails = {
      id,
      timestamp: '2025-01-30 15:30:25',
      user: 'manager@company.com',
      fileName: 'cycle_count_jan_2025.xlsx',
      varianceSKUs: 15,
      totalAdjQtyCS: 45,
      status: 'Completed',
      details: [
        {
          sku: 'SKU001',
          systemQtyCS: 100,
          systemQtyEA: 12,
          physicalQtyCS: 98,
          physicalQtyEA: 8,
          varianceCS: -2,
          varianceEA: -4,
          adjustmentType: 'Loss'
        },
        {
          sku: 'SKU002',
          systemQtyCS: 50,
          systemQtyEA: 0,
          physicalQtyCS: 52,
          physicalQtyEA: 0,
          varianceCS: 2,
          varianceEA: 0,
          adjustmentType: 'Gain'
        },
        {
          sku: 'SKU003',
          systemQtyCS: 75,
          systemQtyEA: 6,
          physicalQtyCS: 73,
          physicalQtyEA: 2,
          varianceCS: -2,
          varianceEA: -4,
          adjustmentType: 'Loss'
        }
      ]
    };

    return NextResponse.json(auditDetails);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch audit details' },
      { status: 500 }
    );
  }
} 