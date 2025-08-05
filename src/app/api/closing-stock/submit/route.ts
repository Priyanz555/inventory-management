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

    // In real implementation:
    // 1. Save submission to database
    // 2. Set status to "Pending ASE Approval"
    // 3. Send notification to ASE
    
    const submissionId = Date.now().toString();
    
    return NextResponse.json({
      id: submissionId,
      status: 'Pending ASE Approval',
      message: 'Submitted for ASE approval successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to submit for approval' },
      { status: 500 }
    );
  }
} 