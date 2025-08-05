import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, items } = body

    // Mock response - replace with actual order creation logic
    const orderData = {
      orderId: `ORD-${Date.now()}`,
      type: type, // 'fast' or 'regular'
      items: items || [],
      status: 'pending',
      createdAt: new Date().toISOString(),
      message: `Reorder order created for ${type} movers`
    }

    // In a real implementation, you would:
    // 1. Validate the request data
    // 2. Create order in database
    // 3. Send notifications
    // 4. Update inventory levels
    // 5. Generate order documents

    return NextResponse.json({
      success: true,
      data: orderData,
      message: `Reorder order created successfully for ${type} movers`
    })
  } catch (error) {
    console.error('Error creating reorder:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create reorder order' 
      },
      { status: 500 }
    )
  }
} 