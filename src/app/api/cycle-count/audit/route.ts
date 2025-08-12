import { NextRequest, NextResponse } from 'next/server';

interface CycleCountAudit {
  id: string;
  sessionId: string;
  timestamp: string;
  user: string;
  fileName: string;
  totalItems: number;
  totalAdjustments: number;
  movementsCount: number;
  status: 'Completed' | 'Failed' | 'Cancelled';
}

export async function GET(request: NextRequest) {
  try {
    // In real implementation, fetch from database
    // For now, return mock data with the new structure
    const mockAudits: CycleCountAudit[] = [
      {
        id: '1',
        sessionId: '1703123456789',
        timestamp: '2024-01-15T10:30:00Z',
        user: 'john.doe@company.com',
        fileName: 'cycle_count_2024_01_15.xlsx',
        totalItems: 150,
        totalAdjustments: 8,
        movementsCount: 3,
        status: 'Completed'
      },
      {
        id: '2',
        sessionId: '1703123456790',
        timestamp: '2024-01-10T14:20:00Z',
        user: 'jane.smith@company.com',
        fileName: 'cycle_count_2024_01_10.xlsx',
        totalItems: 145,
        totalAdjustments: 12,
        movementsCount: 5,
        status: 'Completed'
      },
      {
        id: '3',
        sessionId: '1703123456791',
        timestamp: '2024-01-05T09:15:00Z',
        user: 'mike.wilson@company.com',
        fileName: 'cycle_count_2024_01_05.xlsx',
        totalItems: 0,
        totalAdjustments: 0,
        movementsCount: 0,
        status: 'Cancelled'
      }
    ];

    return NextResponse.json(mockAudits);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch audit list' },
      { status: 500 }
    );
  }
} 