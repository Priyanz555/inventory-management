import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // In real implementation:
    // 1. Get current inventory levels from database
    // 2. Generate Excel file with current inventory snapshot
    // 3. Return the file for download
    
    // For now, create a simple CSV file that Excel can open
    const mockInventoryData = [
      ['SKU ID', 'Description', 'Date Added', 'MFG Date', 'Base Unit', 'Inventory On Hand', 'Sellable Qty', 'Allocated Qty', 'Damaged Qty', 'Expired Qty', 'On-Route Qty'],
      ['SKU001', 'Premium Coffee Beans 500g', '2024-01-15', '2024-01-01', 'CS', '100', '85', '10', '3', '2', '0'],
      ['SKU002', 'Organic Tea Bags 100ct', '2024-01-20', '2024-01-05', 'CS', '75', '70', '5', '0', '0', '0'],
      ['SKU003', 'Chocolate Bars 50g', '2024-01-25', '2024-01-10', 'EA', '500', '480', '15', '3', '2', '0'],
      ['SKU004', 'Energy Drinks 250ml', '2024-01-30', '2024-01-15', 'CS', '200', '190', '8', '1', '1', '0'],
      ['SKU005', 'Bottled Water 500ml', '2024-02-01', '2024-01-20', 'CS', '300', '285', '12', '2', '1', '0'],
      ['SKU006', 'Snack Chips 150g', '2024-02-05', '2024-01-25', 'CS', '150', '140', '8', '1', '1', '0'],
      ['SKU007', 'Canned Beans 400g', '2024-02-10', '2024-01-30', 'CS', '80', '75', '4', '1', '0', '0'],
      ['SKU008', 'Pasta 500g', '2024-02-15', '2024-02-05', 'CS', '120', '110', '8', '1', '1', '0'],
      ['SKU009', 'Rice 1kg', '2024-02-20', '2024-02-10', 'CS', '90', '85', '4', '1', '0', '0'],
      ['SKU010', 'Cooking Oil 1L', '2024-02-25', '2024-02-15', 'CS', '60', '55', '4', '1', '0', '0']
    ];

    // Convert to CSV format
    const csvContent = mockInventoryData.map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');

    // Create response with proper headers for Excel download
    const response = new NextResponse(csvContent);
    response.headers.set('Content-Type', 'text/csv');
    response.headers.set('Content-Disposition', `attachment; filename="inventory_snapshot_${new Date().toISOString().split('T')[0]}.csv"`);
    
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate inventory snapshot' },
      { status: 500 }
    );
  }
} 