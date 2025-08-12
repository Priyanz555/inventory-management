import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.invoiceNo || !body.invoiceDate) {
      return NextResponse.json(
        { error: 'Invoice number and date are required' },
        { status: 400 }
      )
    }

    if (!body.lines || body.lines.length === 0) {
      return NextResponse.json(
        { error: 'At least one line item is required' },
        { status: 400 }
      )
    }

    // Validate line items
    for (let i = 0; i < body.lines.length; i++) {
      const line = body.lines[i]
      if (!line.sku || line.purchaseRate <= 0 || !line.baseUnit) {
        return NextResponse.json(
          { error: `Line ${i + 1}: SKU, purchase rate, and base unit are required` },
          { status: 400 }
        )
      }
    }

    // Validate invoice date is not in future
    const invoiceDate = new Date(body.invoiceDate)
    const today = new Date()
    if (invoiceDate > today) {
      return NextResponse.json(
        { error: 'Invoice date cannot be in the future' },
        { status: 400 }
      )
    }

    // In a real application, you would:
    // 1. Save to database
    // 2. Update inventory receipts
    // 3. Lock the record
    const grnId = `GRN-${Date.now()}`
    
    return NextResponse.json({
      success: true,
      grnId,
      message: 'GRN posted successfully',
      data: {
        ...body,
        id: grnId,
        status: 'posted',
        postedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Error posting GRN:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 