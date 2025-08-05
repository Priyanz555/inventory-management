# GRN - Manual Entry Module

## Overview
This module provides manual Goods Receipt Note entry functionality for RCPL invoices until automation is live. It allows users to create and manage GRN entries with invoice details and line items.

## Features

### Invoice Header
- **Invoice Number**: Required field (max 30 characters)
- **Invoice Date**: Required field (cannot be future date)
- **Supplier**: Automatically set to "RCPL" (read-only)

### Line Items Grid
- **SKU**: Required field with autocomplete
- **Manufacturing Month-Year**: Required field (≤ Invoice Month-Year)
- **Quantity (CS)**: Integer input (≥ 0)
- **Quantity (EA)**: Integer input (0 ≤ EA < Units-per-Case)
- **PTD (₹)**: Required decimal field (2 decimal places)
- **CGST %**: Optional decimal field
- **SGST %**: Optional decimal field
- **IGST %**: Optional decimal field
- **Line Total**: Auto-calculated (rounded to nearest rupee)

### Grid Behaviors
- **Add Line**: Inserts blank row
- **Duplicate SKU rows**: Allowed (multiple MFG months)
- **Delete Selected**: Checkbox multi-delete
- **Inline validation**: Invalid cells highlighted in red
- **Auto-totals**: Live updates in footer

### Footer Actions
- **Save Draft**: Saves as editable draft
- **Post GRN**: Final validation and locks record
- **Error handling**: Shows first 3 errors with full list link

## Navigation

### From Inventory Dashboard
- Primary "GRN" button in header
- Direct access to `/grn/rcpl`

### From Order Management Hub
- "GRN" button in Incoming Primary Orders card
- Links to `/grn/rcpl`

## API Endpoints

### POST `/api/grn/rcpl/draft`
Saves or updates a draft GRN.

**Request Body:**
```json
{
  "invoiceNo": "RCPL/12345",
  "invoiceDate": "2025-01-29",
  "lines": [
    {
      "sku": "SKU001",
      "mfgMonth": 6,
      "mfgYear": 2025,
      "qtyCS": 10,
      "qtyEA": 4,
      "ptd": 125.50,
      "cgstPct": 2.5,
      "sgstPct": 2.5,
      "igstPct": 0
    }
  ]
}
```

### POST `/api/grn/rcpl/post`
Commits and posts a GRN (finalizes it).

**Request Body:** Same as draft endpoint

**Response:**
```json
{
  "success": true,
  "grnId": "GRN-1706543210000",
  "message": "GRN posted successfully",
  "data": {
    "id": "GRN-1706543210000",
    "status": "posted",
    "postedAt": "2025-01-29T10:30:00.000Z",
    "createdAt": "2025-01-29T10:30:00.000Z"
  }
}
```

## Validation Rules

### Invoice Level
- Invoice number required (max 30 chars)
- Invoice date required (not future)
- At least one line item required

### Line Item Level
- SKU required
- PTD required (> 0)
- Quantities ≥ 0
- Manufacturing date ≤ Invoice date

## Status Flow

1. **Draft**: Editable, can be saved multiple times
2. **Posted**: Finalized, locked for editing, updates inventory

## Styling

- **Primary Button**: `#1A73E8` (blue)
- **Secondary Button**: `#F4B400` (yellow)
- **Error Text**: `#D93025` (red)
- **Success**: Green indicators
- **Warning**: Yellow indicators

## Technical Implementation

### Components Used
- `Card`, `CardContent`, `CardHeader`, `CardTitle` from `@/components/ui/card`
- `Button` from `@/components/ui/button`
- `Input` from `@/components/ui/input`
- `Label` from `@/components/ui/label`

### State Management
- React hooks for local state
- Form validation with error display
- Auto-calculation of totals
- Real-time updates

### File Structure
```
src/
├── app/
│   ├── grn/
│   │   └── rcpl/
│   │       └── page.tsx
│   └── api/
│       └── grn/
│           └── rcpl/
│               ├── draft/
│               │   └── route.ts
│               └── post/
│                   └── route.ts
└── components/
    └── ui/
        ├── input.tsx
        └── label.tsx
```

## Usage

1. Navigate to GRN from dashboard header or Order Management Hub
2. Fill in invoice header details
3. Add line items using "Add Line" button
4. Fill in line item details (SKU, quantities, pricing, taxes)
5. Review auto-calculated totals
6. Save as draft or post directly
7. Handle any validation errors displayed

## Future Enhancements

- Database integration for persistent storage
- File upload for invoice attachments
- Advanced SKU search and validation
- Batch processing capabilities
- Audit trail and history
- Integration with inventory system 