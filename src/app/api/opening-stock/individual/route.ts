import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const items = body

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Invalid request body - expected array' },
        { status: 400 }
      )
    }

    // Validate each item
    for (const item of items) {
      if (!item.sku || !item.mfgMonth || !item.mfgYear || 
          typeof item.qtyCS !== 'number' || typeof item.qtyEA !== 'number') {
        return NextResponse.json(
          { error: 'Invalid item data' },
          { status: 400 }
        )
      }

      // Validate quantities
      if (item.qtyCS < 0 || item.qtyEA < 0) {
        return NextResponse.json(
          { error: 'Quantities cannot be negative' },
          { status: 400 }
        )
      }

      // Validate manufacturing date
      const currentDate = new Date()
      const mfgDate = new Date(item.mfgYear, item.mfgMonth - 1)
      if (mfgDate > currentDate) {
        return NextResponse.json(
          { error: 'Manufacturing date cannot be in the future' },
          { status: 400 }
        )
      }
    }

    // In a real implementation, this would:
    // 1. Save items to database
    // 2. Create audit log entry
    // 3. Return success response

    // Mock response for demonstration
    const response = {
      skusLoaded: items.length,
      message: "Individual inventory items uploaded successfully"
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error processing individual items:', error)
    return NextResponse.json(
      { error: 'Failed to process individual items' },
      { status: 500 }
    )
  }
} 