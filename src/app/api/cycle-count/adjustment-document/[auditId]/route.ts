import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { auditId: string } }
) {
  try {
    const { auditId } = params;

    // In real implementation:
    // 1. Get audit trail data for the given auditId
    // 2. Generate Excel document with all adjustments
    // 3. Include reason codes, MFG date changes, and movement details
    // 4. Return the file for download
    
    // For now, create a CSV adjustment document that Excel can open
    const adjustmentData = [
      ['Cycle Count Adjustment Document'],
      [`Audit ID: ${auditId}`],
      [`Generated: ${new Date().toISOString().split('T')[0]}`],
      [''],
      ['SKU ID', 'Description', 'Sellable→Expired', 'Expired→Sellable', 'Sellable→Damaged', 'Damaged→Sellable', 'Reason Code', 'Reason Description', 'New MFG Date', 'Movement Type'],
      ['SKU002', 'Organic Tea Bags 100ct', '2', '0', '1', '0', '1', 'WH Handling Damage', '2024-01-01', 'Movement'],
      ['SKU003', 'Chocolate Bars 50g', '0', '1', '0', '0', '', '', '2024-01-15', 'Gain'],
      ['SKU004', 'Energy Drinks 250ml', '0', '0', '2', '1', '3', 'Inbound Transit Shortage', '', 'Movement'],
      [''],
      ['Summary:'],
      ['Total Adjustments: 8'],
      ['Movements: 3'],
      ['Completed: Yes']
    ];

    // Convert to CSV format
    const csvContent = adjustmentData.map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');

    // Create response with proper headers for Excel download
    const response = new NextResponse(csvContent);
    response.headers.set('Content-Type', 'text/csv');
    response.headers.set('Content-Disposition', `attachment; filename="inventory_adjustment_${auditId}_${new Date().toISOString().split('T')[0]}.csv"`);
    
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate adjustment document' },
      { status: 500 }
    );
  }
} 