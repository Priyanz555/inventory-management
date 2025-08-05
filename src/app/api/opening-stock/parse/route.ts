import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.name.endsWith('.xlsx')) {
      return NextResponse.json(
        { error: 'Only XLSX files are allowed' },
        { status: 400 }
      )
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      )
    }

    // In a real implementation, this would:
    // 1. Parse the Excel file
    // 2. Validate column headers
    // 3. Validate each row
    // 4. Return valid and error rows

    // Mock response for demonstration
    const mockResponse = {
      validRows: [
        {
          sku: "SKU001",
          description: "Product A",
          mfgMonth: 7,
          mfgYear: 2025,
          qtyCS: 10,
          qtyEA: 5
        },
        {
          sku: "SKU002", 
          description: "Product B",
          mfgMonth: 8,
          mfgYear: 2025,
          qtyCS: 15,
          qtyEA: 0
        }
      ],
      errorRows: [
        {
          sku: "SKU003",
          description: "Product C",
          mfgMonth: 13, // Invalid month
          mfgYear: 2025,
          qtyCS: -5, // Negative quantity
          qtyEA: 20,
          errorMsg: "Invalid month and negative quantity"
        }
      ]
    }

    return NextResponse.json(mockResponse)
  } catch (error) {
    console.error('Error parsing inventory file:', error)
    return NextResponse.json(
      { error: 'Failed to parse inventory file' },
      { status: 500 }
    )
  }
} 