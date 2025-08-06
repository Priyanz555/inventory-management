# Product Requirements Document (PRD)
## RCPL DMS - Inventory Management System

**Document Version:** 1.0  
**Date:** January 2025  
**Prepared By:** Product Team  
**Stakeholders:** Engineering Team, Business Team, Operations Team  

---

## 1. Executive Summary

### 1.1 Product Overview
The RCPL DMS (Digital Management System) is a comprehensive inventory management solution designed for distributors and retailers in the FMCG (Fast Moving Consumer Goods) sector. The system provides real-time inventory tracking, order management, stock closing workflows, and comprehensive reporting capabilities.

### 1.2 Business Objectives
- **Streamline Inventory Operations:** Reduce manual processes and improve accuracy
- **Real-time Visibility:** Provide instant access to stock levels and order status
- **Automated Workflows:** Implement daily stock closing and order processing
- **Data-driven Decisions:** Enable analytics and reporting for business insights
- **Multi-location Support:** Manage inventory across multiple distribution centers

### 1.3 Success Metrics
- 50% reduction in manual inventory counting time
- 90% accuracy in stock level reporting
- 30% improvement in order fulfillment speed
- 25% reduction in stock-out incidents
- 100% compliance with daily stock closing requirements

---

## 2. Product Vision & Strategy

### 2.1 Target Users
**Primary Users:**
- **Inventory Managers:** Oversee stock levels and manage inventory operations
- **Warehouse Supervisors:** Handle daily stock closing and cycle counting
- **Field Operations Staff (FOS):** Process retailer orders and manage deliveries
- **Administrators:** Manage master data and system configurations

**Secondary Users:**
- **Business Analysts:** Generate reports and analyze performance
- **Senior Management:** View dashboards and strategic insights

### 2.2 User Personas

#### Persona 1: Inventory Manager (Priya)
- **Role:** Manages inventory across multiple locations
- **Goals:** Maintain optimal stock levels, prevent stockouts
- **Pain Points:** Manual counting, delayed reporting, lack of real-time visibility
- **Tech Comfort:** Moderate, prefers intuitive interfaces

#### Persona 2: Warehouse Supervisor (Rajesh)
- **Role:** Handles daily operations and stock closing
- **Goals:** Accurate daily stock closing, efficient cycle counting
- **Pain Points:** Time-consuming manual processes, data entry errors
- **Tech Comfort:** Basic, needs simple workflows

#### Persona 3: Field Operations Staff (Amit)
- **Role:** Processes retailer orders and manages deliveries
- **Goals:** Quick order processing, accurate delivery tracking
- **Pain Points:** Complex order workflows, lack of mobile access
- **Tech Comfort:** High, uses mobile devices extensively

---

## 3. Functional Requirements

### 3.1 Core Modules

#### 3.1.1 Dashboard & Analytics
**Purpose:** Provide real-time overview of inventory and order status

**Key Features:**
- **KPI Cards:** Display closing stock, opening stock, sellable stock with metrics
- **Time Filters:** Today, Yesterday, This Week, This Month filters
- **Low Stock Alerts:** Highlight items requiring reorder
- **Order Management Hub:** Track primary and secondary orders
- **Real-time Updates:** Auto-refresh data every 5 minutes

**User Stories:**
- As an Inventory Manager, I want to see real-time stock levels so I can make quick decisions
- As a Supervisor, I want to identify low stock items so I can initiate reorders
- As Management, I want to view order status so I can track business performance

#### 3.1.2 Inventory Management
**Purpose:** Comprehensive inventory tracking and management

**Key Features:**
- **Inventory Listing:** View all items with search and filter capabilities
- **Item Details:** Batch-wise inventory tracking with expiry dates
- **Stock Categories:** Sellable, Lost, Damaged, Expired quantities
- **Inline Editing:** Direct editing of stock quantities with confirmation
- **Status Tracking:** In Stock, Low Stock, Out of Stock indicators

**User Stories:**
- As a Warehouse Supervisor, I want to edit stock quantities so I can update inventory quickly
- As an Inventory Manager, I want to view batch-wise details so I can manage expiry dates
- As a Staff member, I want to search inventory so I can find items quickly

#### 3.1.3 Order Management
**Purpose:** Manage primary (supplier) and secondary (retailer) orders

**Key Features:**
- **Primary Orders:** Track incoming supplier orders with GRN creation
- **Secondary Orders:** Manage retailer orders with processing workflows
- **Order Status Tracking:** Pending, Accepted, Processed, Delivered statuses
- **Bulk Operations:** Process multiple orders simultaneously
- **Order History:** Complete audit trail of order changes

**User Stories:**
- As a FOS member, I want to process multiple orders so I can improve efficiency
- As an Inventory Manager, I want to track order status so I can plan inventory
- As a Supervisor, I want to view order history so I can resolve disputes

#### 3.1.4 Stock Closing Workflow
**Purpose:** Daily stock closing process with validation and variance analysis

**Key Features:**
- **Daily Tasks:** Automated task creation for daily stock closing
- **Template Download:** Excel template with predefined columns
- **Validation Engine:** Check uploaded data for errors and inconsistencies
- **Variance Analysis:** Compare physical vs system quantities
- **Reason Codes:** Tag variances with predefined reason codes
- **Final Report:** Generate comprehensive closing report

**User Stories:**
- As a Warehouse Supervisor, I want to download templates so I can standardize data entry
- As a Manager, I want to validate uploaded data so I can ensure accuracy
- As an Analyst, I want variance reports so I can identify process improvements

#### 3.1.5 Master Data Management
**Purpose:** Manage article master data and system configurations

**Key Features:**
- **Article Master:** Comprehensive product catalog with pricing and specifications
- **Inline Editing:** Direct editing of master data with validation
- **Bulk Operations:** Import/export master data in Excel format
- **Category Management:** Organize products by categories and subcategories
- **Pricing Management:** PTD (Price to Distributor) and billing information

**User Stories:**
- As an Administrator, I want to edit article details so I can maintain accurate data
- As a Manager, I want to import master data so I can add products efficiently
- As a Staff member, I want to view product details so I can process orders accurately

#### 3.1.6 Reporting & Analytics
**Purpose:** Generate comprehensive reports for business insights

**Key Features:**
- **Low Stock Reports:** Identify items requiring reorder with distributor summaries
- **Inventory Reports:** Stock levels, movement, and valuation reports
- **Order Reports:** Order processing, delivery, and performance reports
- **Export Capabilities:** Download reports in Excel format
- **Custom Filters:** Date ranges, categories, status filters

**User Stories:**
- As a Business Analyst, I want low stock reports so I can optimize inventory levels
- As Management, I want performance reports so I can track business metrics
- As a Supervisor, I want exportable reports so I can share data with stakeholders

### 3.2 Technical Requirements

#### 3.2.1 System Architecture
- **Frontend:** Next.js 14 with TypeScript and React
- **Styling:** Tailwind CSS with custom design system
- **UI Components:** Shadcn UI component library
- **Icons:** Lucide React icon library
- **State Management:** React hooks and context API

#### 3.2.2 Performance Requirements
- **Page Load Time:** < 3 seconds for dashboard
- **Search Response:** < 1 second for inventory search
- **Data Refresh:** Real-time updates every 5 minutes
- **Mobile Responsiveness:** Optimized for tablets and mobile devices

#### 3.2.3 Security Requirements
- **Authentication:** User login with role-based access
- **Data Encryption:** HTTPS for all data transmission
- **Audit Trail:** Complete logging of all data changes
- **Backup:** Daily automated backups of critical data

---

## 4. User Experience Requirements

### 4.1 Design Principles
- **Intuitive Navigation:** Collapsible sidebar with clear menu structure
- **Consistent Design:** Unified color scheme and component library
- **Mobile-First:** Responsive design for all screen sizes
- **Accessibility:** WCAG 2.1 AA compliance

### 4.2 Key User Flows

#### 4.2.1 Daily Stock Closing Flow
1. User receives daily task notification
2. Download stock closing template
3. Fill physical quantities in Excel
4. Upload completed template
5. System validates data and shows errors
6. User corrects errors and re-uploads
7. System calculates variances
8. User tags variances with reason codes
9. System generates final report
10. Stock closing is marked as complete

#### 4.2.2 Order Processing Flow
1. FOS receives retailer orders
2. Review order details and quantities
3. Check inventory availability
4. Process orders in bulk or individually
5. Update order status to "Processed"
6. Generate delivery documentation
7. Track delivery status
8. Mark orders as "Delivered"

#### 4.2.3 Inventory Management Flow
1. View inventory listing with filters
2. Search for specific items
3. Edit stock quantities inline
4. Confirm changes with popup
5. View batch-wise details
6. Track expiry dates and alerts
7. Generate inventory reports

### 4.3 Interface Requirements

#### 4.3.1 Dashboard Layout
- **Header:** Application title, user info, notifications
- **Sidebar:** Navigation menu with collapsible functionality
- **Main Content:** KPI cards, charts, and data tables
- **Footer:** System status and version information

#### 4.3.2 Data Tables
- **Sortable Columns:** Click headers to sort data
- **Search Functionality:** Global and column-specific search
- **Pagination:** Navigate through large datasets
- **Inline Editing:** Direct editing with validation
- **Bulk Actions:** Select multiple items for operations

#### 4.3.3 Forms and Modals
- **Validation:** Real-time form validation with error messages
- **Auto-save:** Automatic saving of form data
- **Confirmation Dialogs:** Confirm destructive actions
- **Progress Indicators:** Show loading states for long operations

---

## 5. Technical Specifications

### 5.1 Technology Stack
- **Frontend Framework:** Next.js 14 with App Router
- **Language:** TypeScript for type safety
- **Styling:** Tailwind CSS with custom design system
- **UI Library:** Shadcn UI components
- **Icons:** Lucide React
- **State Management:** React hooks and context
- **Build Tool:** Vite (via Next.js)
- **Package Manager:** npm

### 5.2 Data Models

#### 5.2.1 Article Master
```typescript
interface ArticleMaster {
  id: string
  articleId: string
  articleName: string
  category: string
  subCategory: string
  baseUnit: 'CS' | 'EA'
  eaPerCase: number
  status: 'Active' | 'Inactive'
  dateAdded: string
  ptdPrice: number
  lastBillingDate: string
  safetyStock: number
  moq: number
}
```

#### 5.2.2 Inventory Item
```typescript
interface InventoryItem {
  id: number
  name: string
  ean: string
  sku: string
  batchId: string
  sellableQty: number
  lostQty: number
  damagedQty: number
  expiredQty: number
  status: 'in stock' | 'low stock' | 'out-of-stock'
}
```

#### 5.2.3 Order
```typescript
interface Order {
  id: string
  orderId: string
  orderType: 'primary' | 'secondary'
  retailerName?: string
  orderDate: string
  status: 'pending' | 'accepted' | 'processed' | 'delivered'
  totalValue: number
  itemCount: number
  processingStatus?: 'processed' | 'unprocessed'
}
```

### 5.3 API Endpoints

#### 5.3.1 Dashboard APIs
- `GET /api/inventory/dashboard` - Dashboard KPI data
- `GET /api/inventory/refresh/log` - Refresh activity log

#### 5.3.2 Inventory APIs
- `GET /api/inventory` - List inventory items
- `PUT /api/inventory/:id` - Update inventory item
- `GET /api/inventory/:id` - Get item details

#### 5.3.3 Order APIs
- `GET /api/orders/primary` - List primary orders
- `GET /api/orders/retailer` - List retailer orders
- `POST /api/orders/process` - Process orders

#### 5.3.4 Master Data APIs
- `GET /api/admin/articles` - List article master data
- `PUT /api/admin/articles/:id` - Update article
- `POST /api/admin/articles/import` - Import master data

### 5.4 Performance Requirements
- **Initial Load:** < 3 seconds for dashboard
- **Search Response:** < 1 second for inventory search
- **Data Updates:** Real-time updates with 5-minute refresh
- **Mobile Performance:** Optimized for 3G networks
- **Concurrent Users:** Support 100+ simultaneous users

---

## 6. Integration Requirements

### 6.1 External Systems
- **ERP Integration:** Connect with existing ERP systems
- **Accounting Software:** Export data to accounting systems
- **Mobile Apps:** API endpoints for mobile applications
- **Reporting Tools:** Integration with BI tools

### 6.2 Data Import/Export
- **Excel Import:** Support for bulk data import
- **CSV Export:** Export reports in CSV format
- **PDF Generation:** Generate printable reports
- **API Access:** RESTful APIs for third-party integration

---

## 7. Deployment & Infrastructure

### 7.1 Hosting Requirements
- **Cloud Platform:** Vercel (recommended) or AWS/Azure
- **CDN:** Global content delivery network
- **SSL Certificate:** HTTPS encryption for all traffic
- **Backup Strategy:** Daily automated backups

### 7.2 Environment Configuration
- **Development:** Local development environment
- **Staging:** Pre-production testing environment
- **Production:** Live system with monitoring

### 7.3 CI/CD Pipeline
- **Version Control:** GitHub repository
- **Automated Testing:** Unit and integration tests
- **Deployment:** Automatic deployment on code push
- **Monitoring:** Application performance monitoring

---

## 8. Testing Requirements

### 8.1 Functional Testing
- **Unit Tests:** Component and utility function testing
- **Integration Tests:** API endpoint testing
- **End-to-End Tests:** Complete user workflow testing
- **Performance Tests:** Load and stress testing

### 8.2 User Acceptance Testing
- **User Interface Testing:** UI/UX validation
- **Workflow Testing:** Business process validation
- **Data Validation:** Accuracy and integrity testing
- **Mobile Testing:** Responsive design validation

---

## 9. Security & Compliance

### 9.1 Security Requirements
- **Authentication:** Secure user login system
- **Authorization:** Role-based access control
- **Data Encryption:** Encrypt sensitive data
- **Audit Logging:** Track all system activities

### 9.2 Compliance Requirements
- **Data Privacy:** GDPR compliance for user data
- **Financial Reporting:** Accurate financial data handling
- **Audit Trail:** Complete audit trail for all transactions
- **Backup Compliance:** Regular backup verification

---

## 10. Success Criteria & KPIs

### 10.1 Technical KPIs
- **System Uptime:** 99.9% availability
- **Response Time:** < 3 seconds for all operations
- **Error Rate:** < 1% error rate
- **User Adoption:** 90% user adoption within 3 months

### 10.2 Business KPIs
- **Process Efficiency:** 50% reduction in manual processes
- **Data Accuracy:** 95% accuracy in inventory data
- **Order Processing:** 30% faster order processing
- **Cost Savings:** 25% reduction in operational costs

---

## 11. Risk Assessment

### 11.1 Technical Risks
- **Data Migration:** Complex data migration from legacy systems
- **Performance:** Large dataset handling and real-time updates
- **Integration:** Third-party system integration challenges
- **Security:** Data security and compliance requirements

### 11.2 Business Risks
- **User Adoption:** Resistance to new system adoption
- **Training:** Extensive user training requirements
- **Data Quality:** Inconsistent or inaccurate legacy data
- **Change Management:** Organizational change management

### 11.3 Mitigation Strategies
- **Phased Rollout:** Gradual system implementation
- **Comprehensive Training:** User training and support programs
- **Data Validation:** Robust data validation and cleaning
- **Change Management:** Clear communication and stakeholder engagement

---

## 12. Timeline & Milestones

### 12.1 Development Phases

#### Phase 1: Core Infrastructure (Weeks 1-4)
- Set up development environment
- Implement authentication and authorization
- Create basic UI components and layout
- Establish API structure

#### Phase 2: Core Modules (Weeks 5-12)
- Implement inventory management
- Develop order processing system
- Create dashboard and analytics
- Build master data management

#### Phase 3: Advanced Features (Weeks 13-16)
- Implement stock closing workflow
- Develop reporting and analytics
- Add bulk operations and automation
- Create mobile-responsive design

#### Phase 4: Testing & Deployment (Weeks 17-20)
- Comprehensive testing and bug fixes
- Performance optimization
- User acceptance testing
- Production deployment

### 12.2 Key Milestones
- **Week 4:** Core infrastructure complete
- **Week 8:** Basic inventory management functional
- **Week 12:** Order processing system complete
- **Week 16:** Advanced features implemented
- **Week 20:** Production deployment

---

## 13. Resource Requirements

### 13.1 Development Team
- **1 Product Manager:** Requirements and stakeholder management
- **2 Frontend Developers:** React/Next.js development
- **1 Backend Developer:** API and database development
- **1 UI/UX Designer:** Interface design and user experience
- **1 QA Engineer:** Testing and quality assurance

### 13.2 Infrastructure
- **Development Environment:** Local development setup
- **Staging Environment:** Pre-production testing
- **Production Environment:** Live system hosting
- **Monitoring Tools:** Application performance monitoring

### 13.3 Budget Considerations
- **Development Costs:** Team salaries and tools
- **Infrastructure Costs:** Hosting and cloud services
- **Training Costs:** User training and documentation
- **Maintenance Costs:** Ongoing support and updates

---

## 14. Appendices

### 14.1 Glossary
- **DMS:** Digital Management System
- **FOS:** Field Operations Staff
- **GRN:** Goods Receipt Note
- **PTD:** Price to Distributor
- **SKU:** Stock Keeping Unit
- **CS:** Case (unit of measurement)
- **EA:** Each (unit of measurement)

### 14.2 References
- Next.js Documentation: https://nextjs.org/docs
- Tailwind CSS Documentation: https://tailwindcss.com/docs
- Shadcn UI Components: https://ui.shadcn.com
- Lucide React Icons: https://lucide.dev

### 14.3 Change Log
- **Version 1.0:** Initial PRD creation based on codebase analysis
- **Future versions:** Will track changes and updates

---

**Document Status:** Ready for Review  
**Next Review Date:** February 2025  
**Approval Required:** Engineering Lead, Product Manager, Business Stakeholders 