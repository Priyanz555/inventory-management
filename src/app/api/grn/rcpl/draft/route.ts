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
      if (!line.sku || line.ptd <= 0) {
        return NextResponse.json(
          { error: `Line ${i + 1}: SKU and PTD are required` },
          { status: 400 }
        )
      }
    }

    // In a real application, you would save to database here
    // For now, we'll just return success
    const grnId = `GRN-${Date.now()}`
    
    return NextResponse.json({
      success: true,
      grnId,
      message: 'Draft saved successfully',
      data: {
        ...body,
        id: grnId,
        status: 'draft',
        createdAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Error saving GRN draft:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 