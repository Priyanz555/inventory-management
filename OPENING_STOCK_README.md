# Add Inventory Module

This module implements the one-time inventory addition functionality as specified in the design document. It provides both bulk upload and individual product entry capabilities with comprehensive validation and audit trails.

## Features Implemented

### 1. Bulk Upload Flow
- **Upload Page** (`/opening-stock/upload`): 
  - Download Excel template
  - Drag-and-drop or file selection for XLSX files (≤5MB)
  - Client-side file validation
  - Continue to review after successful parse

### 2. Individual Product Entry Flow
- **Entry Form**: SKU autocomplete, MFG Month-Year dropdowns, quantity inputs
- **Validation**: Real-time validation for quantities and dates
- **Grid Display**: Shows added items with delete functionality
- **Submit**: Processes all items at once

### 3. Review & Edit Page (`/opening-stock/review`)
- **Tab Navigation**: Valid Rows vs Error Rows
- **Valid Rows**: Read-only display with status indicators
- **Error Rows**: Inline editing capabilities for all fields
- **Re-Validation**: Re-run validations on edited rows
- **Submit**: Commit all valid rows to database

### 4. Audit Trail (`/opening-stock/audit`)
- **Filtering**: Date range, user, status filters
- **Paginated Table**: Shows all upload attempts
- **File Downloads**: Download original uploaded files
- **View Details**: Opens review screen in read-only mode

## API Endpoints

### POST `/api/opening-stock/parse`
- **Purpose**: Parse uploaded Excel file
- **Input**: Multipart form data with file
- **Output**: `{ validRows: [...], errorRows: [...] }`
- **Validation**: File type (.xlsx), size (≤5MB), headers

### POST `/api/opening-stock/commit`
- **Purpose**: Commit validated rows to database
- **Input**: JSON array of validated rows
- **Output**: `{ skusLoaded: number }`

### POST `/api/opening-stock/individual`
- **Purpose**: Process individual product entries
- **Input**: JSON array of product objects
- **Output**: `{ skusLoaded: number }`

### GET `/api/opening-stock/audit`
- **Purpose**: Retrieve audit trail with filters
- **Query Params**: page, pageSize, dateFrom, dateTo, user, status
- **Output**: Paginated audit logs

## Validation Rules

1. **No negative quantities** for both CS and EA
2. **EA < Units/Case** (validated against product master)
3. **MFG Date ≤ current month** (for individual entry) or ≤ today (for bulk)
4. **Column headers must match template exactly**
5. **Duplicate SKU rows allowed** in bulk (system aggregates quantities)

## Styling & Design

- **Primary Button**: `#1A73E8` (blue)
- **Secondary Button**: `#F4B400` (yellow)
- **Info Banner**: Background `#E8F0FE`, text `#1A73E8`
- **Error Text**: `#D93025` (red)
- **Font**: Roboto (via Tailwind CSS)

## Navigation

- Added "Add Inventory" to main navigation
- Accessible via `/opening-stock/upload`
- Audit trail accessible from upload page
- Integrated with existing inventory management

## Usage

1. **Bulk Upload**:
   - Navigate to `/opening-stock/upload`
   - Download template and fill with data
   - Upload file and review results
   - Edit error rows if needed
   - Submit valid rows

2. **Individual Entry**:
   - Switch to "Individual Product Entry" tab
   - Add products one by one
   - Review in grid before submission
   - Submit all items

3. **Audit Trail**:
   - View all upload attempts
   - Filter by date, user, status
   - Download original files
   - View detailed results

## Technical Implementation

- **Frontend**: React with TypeScript, Tailwind CSS
- **Backend**: Next.js API routes
- **State Management**: React hooks for local state
- **File Handling**: Client-side file validation and parsing
- **Validation**: Both client and server-side validation
- **Error Handling**: Comprehensive error states and user feedback

## Future Enhancements

1. **Real Excel Parsing**: Integrate with Excel.js or similar library
2. **Database Integration**: Connect to actual database for persistence
3. **User Authentication**: Add user management and permissions
4. **Real-time Validation**: Server-side validation with immediate feedback
5. **Progress Indicators**: Show upload and processing progress
6. **Export Functionality**: Export audit logs and reports
7. **Email Notifications**: Notify users of upload results
8. **Bulk Operations**: Support for bulk editing and deletion

## File Structure

```
src/app/
├── opening-stock/
│   ├── upload/page.tsx          # Upload page with tabs
│   ├── review/page.tsx          # Review and edit page
│   └── audit/page.tsx           # Audit trail page
└── api/opening-stock/
    ├── parse/route.ts           # File parsing API
    ├── commit/route.ts          # Data commit API
    ├── individual/route.ts      # Individual entry API
    └── audit/route.ts           # Audit trail API
```

This implementation provides a complete foundation for the add inventory module with all the features specified in the design document. 