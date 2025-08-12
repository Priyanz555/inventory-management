import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // In real implementation:
    // 1. Get current inventory data from database
    // 2. Generate Excel template with all required columns
    // 3. Return the file for download
    
    // For now, create a CSV template that Excel can open
    const templateData = [
      ['SKU ID', 'Description', 'Date Added', 'MFG Date', 'Base Unit', 'Inventory On Hand', 'Sellable Qty', 'Allocated Qty', 'Damaged Qty', 'Expired Qty', 'On-Route Qty', 'Sellable→Expired', 'Expired→Sellable', 'Sellable→Damaged', 'Damaged→Sellable', 'Reason Code', 'New MFG Date'],
      ['SKU001', 'Premium Coffee Beans 500g', '2024-01-15', '2024-01-01', 'CS', '100', '85', '10', '3', '2', '0', '0', '0', '0', '0', '', ''],
      ['SKU002', 'Organic Tea Bags 100ct', '2024-01-20', '2024-01-05', 'CS', '75', '70', '5', '0', '0', '0', '0', '0', '0', '0', '', ''],
      ['SKU003', 'Chocolate Bars 50g', '2024-01-25', '2024-01-10', 'EA', '500', '480', '15', '3', '2', '0', '0', '0', '0', '0', '', ''],
      ['SKU004', 'Energy Drinks 250ml', '2024-01-30', '2024-01-15', 'CS', '200', '190', '8', '1', '1', '0', '0', '0', '0', '0', '', ''],
      ['SKU005', 'Bottled Water 500ml', '2024-02-01', '2024-01-20', 'CS', '300', '285', '12', '2', '1', '0', '0', '0', '0', '0', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
    ];

    // Convert to CSV format
    const csvContent = templateData.map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');

    // Create response with proper headers for Excel download
    const response = new NextResponse(csvContent);
    response.headers.set('Content-Type', 'text/csv');
    response.headers.set('Content-Disposition', 'attachment; filename="cycle_count_template.csv"');
    
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate cycle count template' },
      { status: 500 }
    );
  }
} 