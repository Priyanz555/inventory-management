import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.customerName) {
      return NextResponse.json(
        { error: 'Customer name is required' },
        { status: 400 }
      );
    }

    if (!body.lines || body.lines.length === 0) {
      return NextResponse.json(
        { error: 'At least one line item is required' },
        { status: 400 }
      );
    }

    // Validate line items
    for (const line of body.lines) {
      if (!line.sku || !line.batchNo || line.qtyCS < 0 || line.qtyEA < 0 || line.unitPrice <= 0) {
        return NextResponse.json(
          { error: 'Invalid line item data' },
          { status: 400 }
        );
      }
    }

    // In real implementation, save to database
    const orderId = Date.now().toString();
    
    return NextResponse.json({
      id: orderId,
      status: 'Draft',
      message: 'Order saved as draft successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save order' },
      { status: 500 }
    );
  }
} 