import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.closingStockDate) {
      return NextResponse.json(
        { error: 'Closing stock date is required' },
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
      if (!line.sku || line.physicalQtyCS < 0 || line.physicalQtyEA < 0) {
        return NextResponse.json(
          { error: 'Invalid line item data' },
          { status: 400 }
        );
      }
    }

    // In real implementation, save to database
    const draftId = Date.now().toString();
    
    return NextResponse.json({
      id: draftId,
      status: 'Draft',
      message: 'Draft saved successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save draft' },
      { status: 500 }
    );
  }
} 