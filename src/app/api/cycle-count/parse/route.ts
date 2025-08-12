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

interface CycleCountSession {
  sessionId: string;
  initiatedAt: string;
  status: 'active' | 'cancelled' | 'completed';
  items: InventoryItem[];
}

function parseCSV(csvText: string): string[][] {
  const lines = csvText.split('\n').filter(line => line.trim() !== '');
  return lines.map(line => {
    // Simple CSV parsing - split by comma and remove quotes
    const matches = line.match(/(".*?"|[^,]+)/g) || [];
    return matches.map(cell => cell.replace(/^"|"$/g, '').trim());
  });
}

function validateInventoryItem(row: string[], rowIndex: number): InventoryItem {
  const errors: string[] = [];
  
  // Parse the row data
  const [
    skuId, description, dateAdded, mfgDate, baseUnit,
    inventoryOnHand, sellableQty, allocatedQty, damagedQty, expiredQty, onRouteQty,
    sellableToExpired, expiredToSellable, sellableToDamaged, damagedToSellable,
    reasonCode, newMfgDate
  ] = row;

  // Basic validations
  if (!skuId || skuId === 'SKU ID') {
    return {
      skuId: '',
      description: '',
      dateAdded: '',
      mfgDate: '',
      baseUnit: 'CS',
      inventoryOnHand: 0,
      sellableQty: 0,
      allocatedQty: 0,
      damagedQty: 0,
      expiredQty: 0,
      onRouteQty: 0,
      sellableToExpired: 0,
      expiredToSellable: 0,
      sellableToDamaged: 0,
      damagedToSellable: 0,
      hasError: true,
      errorMessage: 'Invalid SKU ID or header row'
    };
  }

  // Convert string values to numbers
  const numInventoryOnHand = parseFloat(inventoryOnHand) || 0;
  const numSellableQty = parseFloat(sellableQty) || 0;
  const numAllocatedQty = parseFloat(allocatedQty) || 0;
  const numDamagedQty = parseFloat(damagedQty) || 0;
  const numExpiredQty = parseFloat(expiredQty) || 0;
  const numOnRouteQty = parseFloat(onRouteQty) || 0;
  const numSellableToExpired = parseFloat(sellableToExpired) || 0;
  const numExpiredToSellable = parseFloat(expiredToSellable) || 0;
  const numSellableToDamaged = parseFloat(sellableToDamaged) || 0;
  const numDamagedToSellable = parseFloat(damagedToSellable) || 0;

  // Validate quantities
  if (numSellableQty < 0 || numAllocatedQty < 0 || numDamagedQty < 0 || 
      numExpiredQty < 0 || numOnRouteQty < 0) {
    errors.push('All quantities must be greater than or equal to 0');
  }

  // Validate movements
  if (numSellableToExpired > 0) {
    if (!reasonCode) {
      errors.push('Reason code required for Sellable to Expired movement');
    }
    if (!newMfgDate) {
      errors.push('New MFG date required for Sellable to Expired movement');
    }
    if (numSellableQty - numSellableToExpired < 0) {
      errors.push('Sellable to Expired movement exceeds available sellable quantity');
    }
  }

  if (numExpiredToSellable > 0) {
    if (!newMfgDate) {
      errors.push('New MFG date required for Expired to Sellable movement');
    }
    if (numExpiredQty - numExpiredToSellable < 0) {
      errors.push('Expired to Sellable movement exceeds available expired quantity');
    }
  }

  if (numSellableToDamaged > 0 || numDamagedToSellable > 0) {
    if (!reasonCode) {
      errors.push('Reason code required for damage-related movements');
    }
  }

  return {
    skuId,
    description: description || '',
    dateAdded: dateAdded || '',
    mfgDate: mfgDate || '',
    baseUnit: (baseUnit as 'CS' | 'EA') || 'CS',
    inventoryOnHand: numInventoryOnHand,
    sellableQty: numSellableQty,
    allocatedQty: numAllocatedQty,
    damagedQty: numDamagedQty,
    expiredQty: numExpiredQty,
    onRouteQty: numOnRouteQty,
    sellableToExpired: numSellableToExpired,
    expiredToSellable: numExpiredToSellable,
    sellableToDamaged: numSellableToDamaged,
    damagedToSellable: numDamagedToSellable,
    reasonCode: reasonCode || undefined,
    newMfgDate: newMfgDate || undefined,
    hasError: errors.length > 0,
    errorMessage: errors.join('; ')
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      return NextResponse.json(
        { error: 'Only CSV files (.csv) are supported' },
        { status: 400 }
      );
    }

    // Read the file content
    const fileContent = await file.text();
    
    // Parse CSV
    const csvRows = parseCSV(fileContent);
    
    if (csvRows.length < 2) {
      return NextResponse.json(
        { error: 'CSV file must contain at least a header row and one data row' },
        { status: 400 }
      );
    }

    // Skip header row and parse data rows
    const dataRows = csvRows.slice(1);
    const items: InventoryItem[] = [];
    
    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      
      // Skip empty rows
      if (row.length === 0 || row.every(cell => !cell || cell.trim() === '')) {
        continue;
      }
      
      // Ensure row has enough columns
      if (row.length < 17) {
        // Pad with empty values if needed
        while (row.length < 17) {
          row.push('');
        }
      }
      
      const item = validateInventoryItem(row, i + 2); // +2 for header row and 1-based indexing
      
      // Only add items with valid SKU IDs
      if (item.skuId && item.skuId.trim() !== '') {
        items.push(item);
      }
    }

    if (items.length === 0) {
      return NextResponse.json(
        { error: 'No valid inventory items found in the uploaded file' },
        { status: 400 }
      );
    }

    const sessionId = Date.now().toString();
    
    const session: CycleCountSession = {
      sessionId,
      initiatedAt: new Date().toISOString(),
      status: 'active',
      items
    };

    return NextResponse.json(session);
  } catch (error) {
    console.error('Error parsing CSV file:', error);
    return NextResponse.json(
      { error: 'Failed to parse file. Please ensure the file is a valid CSV format.' },
      { status: 500 }
    );
  }
} 