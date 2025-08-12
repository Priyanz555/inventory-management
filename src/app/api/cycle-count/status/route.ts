import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // In real implementation, check database for active cycle count session
    // For now, return mock data
    const mockStatus = {
      active: false,
      sessionId: null,
      initiatedAt: null,
      initiatedBy: null,
      orderProcessingBlocked: false
    };

    return NextResponse.json(mockStatus);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get cycle count status' },
      { status: 500 }
    );
  }
} 