import { NextRequest, NextResponse } from 'next/server';

interface CycleCountMovement {
  skuId: string;
  description: string;
  sellableToExpired: number;
  expiredToSellable: number;
  sellableToDamaged: number;
  damagedToSellable: number;
  reasonCode?: string;
  newMfgDate?: string;
  adjustmentType: 'Gain' | 'Loss' | 'Movement';
}

interface CycleCountAuditDetails {
  id: string;
  sessionId: string;
  timestamp: string;
  user: string;
  fileName: string;
  totalItems: number;
  totalAdjustments: number;
  movementsCount: number;
  status: 'Completed' | 'Failed' | 'Cancelled';
  details: CycleCountMovement[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // In real implementation, fetch from database based on audit ID
    // For now, return mock data with the new structure
    const mockAuditDetails: CycleCountAuditDetails = {
      id,
      sessionId: '1703123456789',
      timestamp: '2024-01-15T10:30:00Z',
      user: 'john.doe@company.com',
      fileName: 'cycle_count_2024_01_15.xlsx',
      totalItems: 150,
      totalAdjustments: 8,
      movementsCount: 3,
      status: 'Completed',
      details: [
        {
          skuId: 'SKU002',
          description: 'Organic Tea Bags 100ct',
          sellableToExpired: 2,
          expiredToSellable: 0,
          sellableToDamaged: 1,
          damagedToSellable: 0,
          reasonCode: '1',
          newMfgDate: '2024-01-01',
          adjustmentType: 'Movement'
        },
        {
          skuId: 'SKU003',
          description: 'Chocolate Bars 50g',
          sellableToExpired: 0,
          expiredToSellable: 1,
          sellableToDamaged: 0,
          damagedToSellable: 0,
          reasonCode: undefined,
          newMfgDate: '2024-01-15',
          adjustmentType: 'Gain'
        },
        {
          skuId: 'SKU004',
          description: 'Energy Drinks 250ml',
          sellableToExpired: 0,
          expiredToSellable: 0,
          sellableToDamaged: 2,
          damagedToSellable: 1,
          reasonCode: '3',
          newMfgDate: undefined,
          adjustmentType: 'Movement'
        }
      ]
    };

    return NextResponse.json(mockAuditDetails);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch audit details' },
      { status: 500 }
    );
  }
} 