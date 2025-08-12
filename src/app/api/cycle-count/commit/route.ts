import { NextRequest, NextResponse } from 'next/server';

interface InventoryItem {
  skuId: string;
  description: string;
  dateAdded: string;
  mfgDate: string;
  baseUnit: 'CS' | 'EA';
  inventoryOnHand: number;
  sellableQty: number;
  allocatedQty: number;
  damagedQty: number;
  expiredQty: number;
  onRouteQty: number;
  sellableToExpired: number;
  expiredToSellable: number;
  sellableToDamaged: number;
  damagedToSellable: number;
  reasonCode?: string;
  newMfgDate?: string;
  hasError?: boolean;
  errorMessage?: string;
}

interface CommitRequest {
  sessionId: string;
  items: InventoryItem[];
  otp: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CommitRequest = await request.json();
    
    // Validate required fields
    if (!body.sessionId || !body.items || !body.otp) {
      return NextResponse.json(
        { error: 'Missing required fields: sessionId, items, or OTP' },
        { status: 400 }
      );
    }

    // Validate OTP (in real implementation, verify against sent OTP)
    if (body.otp.length !== 6 || !/^\d{6}$/.test(body.otp)) {
      return NextResponse.json(
        { error: 'Invalid OTP format. Please enter a 6-digit number.' },
        { status: 400 }
      );
    }

    // Mock OTP validation (in real implementation, verify against database)
    if (body.otp !== '123456') {
      return NextResponse.json(
        { error: 'Invalid OTP. Please check your mobile and try again.' },
        { status: 400 }
      );
    }

    // Validate all items have no errors
    const itemsWithErrors = body.items.filter(item => item.hasError);
    if (itemsWithErrors.length > 0) {
      return NextResponse.json(
        { error: 'Cannot commit cycle count with validation errors' },
        { status: 400 }
      );
    }

    // Validate reason codes for movements
    const itemsNeedingReasonCodes = body.items.filter(item => 
      (item.sellableToExpired > 0 || item.sellableToDamaged > 0 || item.damagedToSellable > 0) && !item.reasonCode
    );

    if (itemsNeedingReasonCodes.length > 0) {
      return NextResponse.json(
        { error: 'Reason codes required for inventory movements' },
        { status: 400 }
      );
    }

    // Validate MFG dates for expired movements
    const itemsNeedingMfgDates = body.items.filter(item => 
      (item.sellableToExpired > 0 || item.expiredToSellable > 0) && !item.newMfgDate
    );

    if (itemsNeedingMfgDates.length > 0) {
      return NextResponse.json(
        { error: 'New MFG dates required for expired-related movements' },
        { status: 400 }
      );
    }

    // Calculate total adjustments
    const totalAdjustments = body.items.reduce((total, item) => {
      return total + 
        Math.abs(item.sellableToExpired) + 
        Math.abs(item.expiredToSellable) + 
        Math.abs(item.sellableToDamaged) + 
        Math.abs(item.damagedToSellable);
    }, 0);

    // In real implementation:
    // 1. Validate session is still active
    // 2. Calculate inventory adjustments for each SKU
    // 3. Post inventory adjustments to database
    // 4. Create audit trail with all movements
    // 5. Update inventory balances
    // 6. Generate adjustment document
    // 7. Send notifications
    // 8. Restore order processing
    
    const auditId = Date.now().toString();
    
    // Mock audit trail entry
    const auditEntry = {
      id: auditId,
      sessionId: body.sessionId,
      timestamp: new Date().toISOString(),
      user: 'current-user', // In real implementation, get from session
      totalItems: body.items.length,
      totalAdjustments,
      movements: body.items.filter(item => 
        item.sellableToExpired > 0 || 
        item.expiredToSellable > 0 || 
        item.sellableToDamaged > 0 || 
        item.damagedToSellable > 0
      ).map(item => ({
        skuId: item.skuId,
        description: item.description,
        sellableToExpired: item.sellableToExpired,
        expiredToSellable: item.expiredToSellable,
        sellableToDamaged: item.sellableToDamaged,
        damagedToSellable: item.damagedToSellable,
        reasonCode: item.reasonCode,
        newMfgDate: item.newMfgDate
      }))
    };

    return NextResponse.json({
      auditId,
      status: 'Completed',
      message: 'Cycle count committed successfully',
      totalItems: body.items.length,
      totalAdjustments,
      movementsCount: auditEntry.movements.length,
      adjustmentDocumentUrl: `/api/cycle-count/adjustment-document/${auditId}`
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to commit cycle count' },
      { status: 500 }
    );
  }
} 