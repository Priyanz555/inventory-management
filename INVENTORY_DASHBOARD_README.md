# Inventory Dashboard

## Overview
The Inventory Dashboard provides a real-time view of stock health and order workload for the distributor management platform. It auto-refreshes every 10 minutes and includes manual refresh functionality.

## Route
- **URL**: `/inventory/dashboard` (also accessible via `/`)
- **Purpose**: Real-time view of stock health and order workload
- **Default Landing Page**: The inventory dashboard is now the main landing page of the application

## Features

### 1. KPI Bar
Displays three key metrics:
- **Closing Stock**: Snapshot at current moment
- **Opening Stock**: Snapshot at 00:00 today  
- **Sellable Stock**: Closing Stock – non-sellable (damaged/expired)

### 2. Low-Stock Cards
Two cards showing shortage items:

#### Fast-Moving Shortages
- Total Shortage SKUs (fast movers)
- Top-priority SKU & quantity gap
- Reorder quantity (cases)
- **CTA**: "Re-Order Fast Movers"

#### Regular-Moving Shortages  
- Same metrics for regular movers
- **CTA**: "Re-Order Regular Movers"

**Trigger Logic**: `Current Qty < 14-day Avg Sales × 14`

### 3. Order Management Hub
Three order management cards:

#### Incoming Primary Orders
- Total Orders
- Order Value (₹, rounded)
- Total SKUs
- Cases (whole)
- **Actions**: GRN, View Details

#### Secondary Pre-Sales Orders
- Same metrics
- **Actions**: Process Orders, View Details

#### Van-Sales Load-outs
- Same metrics  
- **Actions**: Process Orders, View Details

## Technical Implementation

### Auto-Refresh
- Automatically refreshes every 10 minutes
- Manual refresh button resets the timer
- Shows last refresh time

### API Endpoints
- `GET /api/inventory/dashboard` - Returns KPI metrics, low-stock aggregates, order hub stats
- `POST /api/orders/reorder` - Called by Re-Order CTAs

### Responsive Design
- Desktop: Three horizontal cards for order management
- Mobile: Stacked layout
- Uses Tailwind CSS for styling

### Color Scheme
- Primary Button: `#1A73E8` (blue)
- Accent Button: `#F4B400` (yellow)
- Error/Alert Text: `#D93025` (red)
- Font: Roboto

## Usage

1. Navigate to `/` or `/inventory/dashboard` (both lead to the same page)
2. View real-time KPI metrics
3. Monitor low-stock items and take action
4. Manage incoming orders through the hub
5. Use manual refresh when needed

## Future Enhancements
- Integration with actual database
- Real-time notifications for critical stock levels
- Export functionality for reports
- Advanced filtering and search capabilities 