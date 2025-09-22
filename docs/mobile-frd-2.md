# Supply Chain Mobile App: Functional Requirements Document (FRD)

## Document Information
- **Version**: 3.0
- **Date**: June 24, 2025 (Updated to reflect current implementation)
- **Product**: Carmen Software Supply Chain Mobile App
- **Target Industry**: Hotels and Hospitality
- **Document Type**: Functional Requirements Document (FRD)
- **Status**: Implementation-Based Documentation

## Introduction

This Functional Requirements Document (FRD) defines the actual implemented capabilities, rules, and behaviors for the Carmen Software Supply Chain Mobile App. This document reflects the current state of implementation as of December 2024. The target audience includes Product, Engineering, QA, Design, and implementation teams responsible for supporting hotel and hospitality finance and supply chain operations.

### Purpose

To document the current implemented functionality of the supply chain mobile app, providing an accurate reference for the features that are currently available and operational. This serves as a baseline for understanding what has been built and what functionality users can expect.

### Currently Implemented Features

- **Multi-Tenant Authentication & Session Management**
  - Login with email/password
  - Business unit selection
  - Two-factor authentication
  - Password reset workflow
  - Account locked and session expired handling

- **Receiving Module**
  - PO list and batch receiving interface
  - Scan PO workflow with QR/barcode scanning
  - GRN detail interface with Items, Summary, and Comments tabs
  - Business unit and location selection
  - Advanced search and filtering

- **PR Approval Module**
  - PR list with filtering capabilities
  - Individual PR detail and approval workflow
  - Multi-stage approval process

- **Store Requisition Module**
  - SR list and management
  - Individual SR detail pages
  - Create new store requisitions

- **Physical Count Module**
  - Location-based counting sessions
  - Count, review, and success workflows

- **Spot Check Module**
  - Location and method selection
  - Session-based spot checking workflow

- **Stock Take Module**
  - Options page routing to Physical Count or Spot Check

- **Notification Module**
  - In-app notification center
  - Notification management and history

- **Profile & Settings Module**
  - User profile management
  - Edit profile functionality

### Not Currently Implemented

- Advanced offline capabilities
- Comprehensive API integrations
- Advanced reporting and analytics
- Print/export functionality
- Email integration
- Advanced security features beyond basic authentication
- Multi-language support
- Accessibility features
- Advanced workflow automation

---

## Performance Requirements

### Response Time Targets
- **Page Load Time**: < 2 seconds for all screens
- **API Response Time**: < 500ms for standard operations
- **Scan PO Complete Context**: ~30 seconds end-to-end
- **Scan PO Partial Context**: ~60 seconds end-to-end
- **Search Operations**: < 1 second for results display

### Scalability Requirements
- Support 1000+ concurrent users across multiple hotel properties
- Handle 10,000+ PO items per business unit
- Process 500+ simultaneous GRN operations

---

## Functional Requirements by Module

### Multi-Tenant Auth & Session

#### Login & Authentication (Implemented)
- **Email/Password Authentication**: Standard login form with client-side validation
- **Error Messaging**: Clear error messages for invalid credentials, account lockout, and session expiry
- **Form Validation**: Real-time form validation with user feedback
- **Remember Me**: Optional remember me functionality for user convenience
- **Loading States**: Visual feedback during authentication process

#### Business Unit Definition (Implemented)
- **Multi-Property Support**: Business Units represent distinct hotel properties in the system
- **Example Properties**: "Grand Hotel Singapore", "Business Hotel Jakarta", "Boutique Hotel Bangkok"
- **User Assignment**: Users are assigned to one or more Business Units during authentication
- **Data Segregation**: Business unit-based data separation and access control
- **Selection Interface**: Clean business unit selection interface with property details

#### Session State Management (Implemented)
- **Client-Side Sessions**: Browser-based session management with local storage
- **Business Unit Context**: All actions scoped to selected business unit
- **Navigation State**: Persistent navigation state across app sessions
- **Form State**: Preservation of form data during navigation

---

### Receiving Module (PO, GRN, Batch)

#### Receiving Navigation Flow

**Entry Point**
- Users access the Receiving module through the "Good Receive Note" card on the dashboard
- Direct access to GRN management is intentionally removed to enforce the proper receiving workflow

**Routing Flow**
1. **Dashboard → Good Receive Note**: Users first see the batch receiving/PO list screen
2. **PO Selection**: Users select one or more POs to process via traditional or scan workflow
3. **Business Unit Selection**: When creating GRNs, users select from their assigned hotel properties only
4. **Location Selection**: Users select specific store locations for receiving (with location-based item filtering)
5. **GRN Creation**: System creates GRN(s) based on selected PO(s) and locations
6. **GRN Detail**: Users are directed to the streamlined GRN detail page for item receiving
7. **Item Processing**: Users verify and update received quantities with enhanced unit selection
8. **GRN Completion**: Users finalize the GRN with appropriate status

**Navigation Restrictions**
- Users cannot directly access GRNs without going through the PO selection process
- This enforces data integrity by ensuring all GRNs are properly linked to source POs
- The "Add Item" functionality is intentionally removed to maintain traceability to source documents

#### Scan PO Workflow (Critical Feature)

**Smart QR/Barcode Scanning Implementation**
- **Three-Tier Detection Approach**:
  1. **Complete Context**: QR code contains full PO data, BU, and vendor information
  2. **Partial Context**: Barcode contains PO number only, requires BU selection
  3. **No Match**: Invalid or unrecognized codes, provides manual entry option

**Context-Aware Routing Logic**
- **Complete Context Flow**:
  - Scan QR → Auto-detect BU and vendor → Navigate directly to location selection
  - Performance target: ~30 seconds end-to-end
  - No manual data entry required

- **Partial Context Flow**:
  - Scan barcode → Extract PO number → Present BU selection → Navigate to location selection
  - Performance target: ~60 seconds end-to-end
  - Minimal manual input required

- **No Match Flow**:
  - Invalid scan → Present manual PO entry → Validate against system → Continue to location selection
  - Fallback to traditional workflow

**Smart Detection Features**
- **Automatic BU Detection**: When QR contains complete context, automatically route to correct business unit
- **Vendor Validation**: Cross-reference scanned data with system records for accuracy
- **Error Handling**: Clear feedback for invalid codes with suggested next steps
- **Scan History**: Track successful scans for audit and performance optimization

**Technical Implementation**
- **Camera Integration**: Native camera access with auto-focus and flash control
- **Code Recognition**: Support for QR codes, Code 128, Code 39, and EAN/UPC formats
- **Data Parsing**: Intelligent parsing of embedded PO data with validation
- **Offline Capability**: Cache recent PO data for offline scan validation

#### Enhanced Unit Selection (Critical Feature)

**Dual Unit Dropdown Implementation**
- **Separate Unit Selectors**: Each item provides independent unit dropdowns for:
  - "Received Qty" input field
  - "FOC Qty" (Free of Charge) input field
- **Flexible Receiving Scenarios**: Support different units for received vs. FOC quantities
- **Real-time Conversion**: Display conversion factors and totals as units are selected

**GrnItem Interface Enhancement**
```typescript
interface GrnItem {
  // ... existing fields ...
  receivedUnit: string;  // Unit for received quantity
  focUnit: string;       // Unit for FOC quantity
  receivedQty: number;
  focQty: number;
  // ... other fields ...
}
```

**Unit Selection Logic**
- **Available Units**: Display both PO units and inventory units for each item
- **Conversion Display**: Show conversion factors (e.g., "1 case = 12 bottles")
- **Validation**: Prevent invalid unit combinations and quantities
- **Default Behavior**: Pre-select PO unit as default, allow user override

#### Location-Based Item Organization (Critical Feature)

**Smart Item Filtering**
- **Automatic Filtering**: Items filtered by `itemDetail.storeLocation` matching selected locations
- **Location Grouping**: Items visually organized with location headers and item counts
- **Relevant Display**: Users only see items assigned to their selected receiving locations

**Location Selection Logic**
- **All Locations**: Show all items when "All locations" is selected
- **No Selection**: Display all items when no specific locations are chosen
- **Specific Locations**: Filter items to only those assigned to selected locations
- **Visual Organization**: Clear location headers with item counts for workflow efficiency

**Implementation Requirements**
- **Filter Method**: `items.filter(item => selectedLocations.includes(item.itemDetail.storeLocation))`
- **Fallback Handling**: Proper handling of items without assigned locations
- **Consistency**: Apply same filtering logic across all receiving flows (traditional and scan)

#### Streamlined GRN Interface (Critical Feature)

**Tab Structure Simplification**
- **Items Tab**: Core receiving functionality with enhanced unit selection
- **Summary Tab**: Financial totals, tax calculations, and approval workflow
- **Comments Tab**: Renamed from "Attachments" with chat-style interface

**Removed Functionality**
- **Signature Tab**: Explicitly removed from interface
- **Extra Cost Tab**: Explicitly removed from interface
- **Signature Capture**: No longer required in mobile workflow
- **Extra Cost Entry**: Set to 0 in financial calculations

**Comments Interface Enhancement**
- **Chat-Style Interface**: Modern messaging interface for communication
- **File Attachments**: Support for document and image attachments
- **Photo Capture**: Direct camera integration for damage documentation
- **Text Comments**: Rich text support for detailed notes

#### GRN List / Receiving History

**Overview**
- Users access a list of all past and in-progress Goods Receipt Notes (GRNs) associated with every BU they are authorized for
- The list uses a card-based format for each GRN, presenting vital details for mobile scanability and touch interaction
- Each GRN card displays the BU as a non-interactive, clearly-labeled field for context

**Card List Display**
Each GRN is displayed as a card with:
    - GRN Reference/Number (prominent/bold)
    - Status Badge (Draft, Committed, Void; color-coded)
    - Vendor Name
    - Received Date
    - Total Value
    - Linked PO(s)/Order Numbers
    - Created By (for audit)
    - Business Unit (clear label, reference only)
    - Action Buttons:
      - View (always)
      - Resume (if Draft)
      - Print/Export (if Committed, optional)
- Icons/Indicators (e.g., attachment present, comments, alert if incomplete)

**Actions**
- Tapping any card opens GRN details for review, continuation, or print/export based on status/permissions

**Search & Filter**
- **Search Capabilities**: GRN number, vendor, PO, date range, and status
- **Date Range Picker**: Comprehensive calendar integration with predefined filters:
  - Today
  - This Week
  - Next Week
  - Overdue
  - Custom date range with progressive date picking
- **Filter Options**: Optional filter by BU (chip/dropdown in filter, never required)
- **Smart Display**: Progressive date picking with intelligent display text

**Role/Permission**
- Only users with receiving/GRN rights see/create/edit GRNs

**Audit**
- All list access, card views, resumes, and creates are audit-logged

#### Dashboard & List View

**Today's Deliveries**
- Include all permitted units; show past deliveries, filter/search by vendor, status
- **Currency Grouping**: Purchase Orders grouped by currency with exchange rate display
- **Performance Optimization**: Load times < 2 seconds for dashboard display

**PO Table Display**
Columns: Product name, SKU, PO#, vendor, ETA, value, status
- Each PO/GRN displays its associated Business Unit as a reference-only label
- **Item Count Calculation**: Use `po.items.length` for accurate item counts (not quantity sums)

#### PO Receipt Processing

**PO Detail Header**
Displays: PO#, vendor, location, date, status, and non-editable BU label
- All line items list product name before SKU (name-first display)

**Enhanced Unit Handling**
- **Dual Unit Support**: Enter received quantity by PO unit or inventory unit
- **Separate Unit Dropdowns**: Independent unit selection for received and FOC quantities
- **Conversion Display**: Show conversion factors (e.g., "1 case = 12 bottles")
- **Real-time Sync**: Immediate validation and conversion calculations
- **Partial Units**: Permitted/blocked per configuration

**Tax & Discount Logic**
- Taxes and discounts are calculated automatically and visible on line and summary levels
- Tax and discount values are always displayed as read-only information on mobile, using the format: "Tax: [Name] ([Type], [Rate]%)" (e.g., "Tax: VAT (Add, 7%)")
- Override actions are desktop-only and not present in mobile flows

#### Business Dimensions Integration

**Terminology Standardization**
- Consistently use "Business Dimensions" terminology throughout all interfaces
- **Structure Components**:
  - Project Code
  - Market Segment
  - Event
- **Display Format**: Clear labeling and consistent presentation across all screens

---

### PR Approval Module

#### Approval Workflow
- **Notification Integration**: Real-time notifications for pending approvals
- **Context-Aware Decisions**: Current inventory data ([On Hand], [On Order]) displayed during approval
- **Mobile-Optimized Interface**: Touch-friendly approval controls with clear action buttons
- **Audit Trail**: Complete approval history with user, timestamp, and decision rationale

#### Enhanced Workflow Decision Engine
- **Priority-Based Logic**: Hierarchical decision tree for PR progression:
  1. **All Rejected Priority**: If ALL items rejected → PR status becomes "Rejected"
  2. **Any Review Priority**: If ANY item marked "Review" → PR returns to previous stage
  3. **Any Pending Priority**: If ANY item "Pending" → Submission blocked
  4. **Any Approved Priority**: If ANY item approved → PR progresses to next stage
- **Item-Level Actions**: Individual approve/reject/review decisions for each line item
- **Bulk Operations**: Multi-select actions for efficient processing of similar items
- **Dynamic Submit Interface**: Single context-aware submit button with status indicators
- **Real-Time Feedback**: Visual workflow status indicators with color-coded messaging

#### Workflow Status Management
- **Item Status Types**: Pending, Approved, Rejected, Review, Returned
- **Status Validation**: All items must be reviewed before PR submission
- **Mixed Approval Support**: Flexible approval allowing 1 to all items approved
- **Review Override**: Review status takes priority over approvals for workflow routing

#### Business Unit Context
- **Multi-Property Support**: Approvers can handle requests across assigned business units
- **Scope Enforcement**: Users only see requests for their authorized properties
- **Clear BU Labeling**: Business unit clearly displayed for each request
- **Role-Based Filtering**: Smart filtering based on user's workflow stage assignments

---

### Store Requisition (SR) Module

#### Current Implementation
- **SR List Interface**: Display current and historical store requisitions with filtering by status, department, and business unit
- **Individual SR Management**: View and edit individual store requisitions with detailed item information
- **Create New SR**: Interface for creating new store requisitions with item selection and business dimensions
- **Workflow Integration**: Basic workflow status management and progression
- **Mock Data Integration**: Currently operates with mock data for demonstration and testing

#### State Workflow (Implemented)
- **Draft**: Initial creation state, editable
- **In-progress**: Submitted for approval workflow
- **Approved**: Approved by manager
- **Rejected**: Rejected with comments
- **Fulfilled**: Items delivered, process complete

---

### Stock Take Module

#### Current Implementation
- **Options Interface**: Simple routing page that directs users to either Physical Count or Spot Check modules
- **Integration Point**: Serves as a central entry point for inventory counting activities
- **Navigation Hub**: Provides clear options for different types of inventory counting workflows

---

### Spot Check Module

#### Current Implementation
- **Location Selection**: Interface for selecting locations to perform spot checks
- **Method Selection**: Choose between random selection, high-value items, or manual selection
- **Session Management**: Complete spot check sessions with count, review, and success workflows
- **Item Selection**: Support for both automated and manual item selection for spot checking
- **Mock Data Integration**: Currently operates with mock inventory data for demonstration

#### Workflow Features (Implemented)
- **Random Selection**: Automated random item selection for compliance checking
- **Manual Selection**: Targeted spot checks for specific items
- **Session Tracking**: Complete session management from start to completion
- **Progress Tracking**: Visual indicators of spot check progress and completion

---

### Notification Module

#### Current Implementation
- **In-App Notification Center**: Centralized notification management interface
- **Notification List**: Display of all notifications with filtering capabilities
- **Search and Filter**: Search notifications by content and filter by type/status
- **Mark as Read/Unread**: Individual and bulk notification status management
- **Notification Types**: Support for different notification categories and priorities
- **Mock Notification Data**: Comprehensive mock notifications for testing and demonstration

#### Notification Features (Implemented)
- **Notification History**: Complete history of all notifications
- **Status Management**: Read/unread status tracking
- **Bulk Operations**: Select and manage multiple notifications
- **Visual Indicators**: Clear visual indicators for notification status and priority

---

### Profile & Settings Module

#### Current Implementation
- **User Profile Display**: View personal information, role, and business unit assignments
- **Profile Editing**: Edit personal information and contact details
- **Business Unit Information**: Display assigned business units and roles
- **Theme Toggle**: Dark/light mode selection with system preference detection
- **Security Information**: Display security settings and authentication status
- **Mock User Data**: Comprehensive mock user profiles for testing

#### Profile Features (Implemented)
- **Personal Information Management**: Name, email, phone, and contact details
- **Business Context**: Clear display of assigned business units and roles
- **Security Status**: Authentication method and security feature status
- **Theme Preferences**: System-wide theme selection and persistence

---

## Screen Inventory and Navigation Flows

### Currently Implemented Screens (40+ Screens)

#### Authentication Flow (6 screens)
1. **Login Screen**: Email/password entry with validation
2. **Business Unit Selection**: Multi-property selection for users
3. **Two-Factor Authentication**: Security verification with 6-digit code
4. **Password Reset**: Multi-step password recovery process
5. **Account Locked**: Lockout notification and recovery
6. **Session Expired**: Re-authentication prompt

#### Dashboard & Navigation (3 screens)
7. **Main Dashboard**: Module cards and quick actions with feature counts
8. **Notification Center**: All notifications and alerts with filtering
9. **Profile Page**: User profile management and settings

#### Receiving Module (14 screens)
10. **Receiving Main Page**: PO list with search and filtering
11. **Scan PO**: QR/barcode scanning interface with manual entry fallback
12. **Business Unit Selection**: BU picker for receiving workflow
13. **Select Locations**: Location selection for receiving
14. **Select GRN Locations**: Location selection for GRN creation
15. **GRN Detail**: Streamlined receiving interface with tabs
16. **GRN Items Tab**: Core receiving functionality with item management
17. **GRN Summary Tab**: Financial totals and calculations
18. **GRN Comments Tab**: Chat-style communication interface
19. **Item Detail**: Individual item receiving with unit selection
20. **GRN List**: Historical GRN management and viewing
21. **Draft GRNs**: Management of draft receiving documents
22. **Pending POs**: List of pending purchase orders
23. **Advanced Search**: Enhanced search and filtering capabilities

#### PR Approval Module (2 screens)
24. **PR List**: Pending approval requests with filtering
25. **PR Detail**: Individual request review and approval interface

#### Store Requisition Module (3 screens)
26. **SR List**: Current and historical requisitions with filtering
27. **SR Detail**: Individual requisition review and editing
28. **Create SR**: New requisition interface

#### Physical Count Module (4 screens)
29. **Physical Count Main**: Location selection and session management
30. **Count Session**: Individual counting session interface
31. **Count Review**: Review and confirmation of counts
32. **Count Success**: Completion confirmation

#### Spot Check Module (5 screens)
33. **Spot Check Location**: Location selection for spot checks
34. **Spot Check Method**: Method selection (random, manual, high-value)
35. **Spot Check Session**: Individual spot check execution
36. **Spot Check Review**: Review and confirmation of results
37. **Spot Check Success**: Completion confirmation

#### Stock Take Module (1 screen)
38. **Stock Take Options**: Route to Physical Count or Spot Check

#### Profile & Settings (2 screens)
39. **User Profile**: Personal information and business unit display
40. **Edit Profile**: Profile editing interface

### Cross-Module Navigation Patterns

#### Deep Linking Support
- **Direct Navigation**: URL-based navigation to specific screens
- **Context Preservation**: Maintain user context across navigation
- **Back Button Handling**: Intelligent navigation history management

#### State Management
- **Session Persistence**: Maintain user state across app sessions
- **Offline State**: Handle offline/online state transitions
- **Error Recovery**: Graceful handling of navigation errors

---

## Current Technical Implementation

### Data Management
- **Mock Data Integration**: Application currently operates with comprehensive mock data sets
- **Local State Management**: Client-side state management for application data
- **Component-Based Architecture**: React-based component structure with TypeScript
- **Responsive Design**: Mobile-first design with responsive layouts

### Authentication Implementation
- **Local Authentication**: Basic email/password authentication with local validation
- **Session Management**: Client-side session state management
- **Business Unit Selection**: Multi-tenant business unit selection workflow
- **Security Features**: Two-factor authentication and password reset workflows

---

## Current Security Implementation

### Authentication Features
- **Email/Password Authentication**: Standard login with validation
- **Two-Factor Authentication**: 6-digit code verification system
- **Password Reset**: Multi-step password recovery workflow
- **Session Management**: Basic client-side session handling
- **Account Security**: Account lockout and session expiry handling

### Access Control (Implemented)
- **Business Unit Scope**: Users assigned to specific business units
- **Role-Based Access**: Basic role-based permission system
- **Workflow Permissions**: Access control for approval workflows
- **Data Segregation**: Business unit-based data separation

---

## Current UI/UX Implementation

### Responsive Design (Implemented)
- **Mobile-First**: Optimized for mobile devices with touch-friendly interfaces
- **Responsive Layout**: Adaptive layouts that work across different screen sizes
- **Touch Optimization**: Large touch targets and gesture-based navigation
- **Bottom Navigation**: Mobile-optimized bottom tab navigation
- **Card-Based UI**: Modern card-based interface design for better mobile experience

### Theme Support (Implemented)
- **Dark/Light Mode**: Theme toggle functionality with system preference detection
- **Consistent Styling**: Unified design system across all components
- **Modern UI Components**: Custom UI component library with consistent styling

---

## Current Data Management

### Mock Data Implementation
- **Comprehensive Mock Data**: Extensive mock data sets for POs, GRNs, PRs, and SRs
- **Realistic Business Scenarios**: Mock data reflects real-world hotel supply chain scenarios
- **Multi-Business Unit Data**: Mock data supports multiple hotel properties
- **Workflow State Management**: Mock data includes various workflow states and statuses

### Client-Side State Management
- **React State Management**: Component-level state management for UI interactions
- **Local Storage**: Basic browser local storage for user preferences and session data
- **Form State Management**: Comprehensive form state handling for data entry workflows

---

## Current Implementation Status

### Functional Features (Implemented)
- **Authentication Workflow**: Complete login, 2FA, password reset, and business unit selection
- **Receiving Module**: PO scanning, GRN management, and location-based workflows
- **Approval Workflows**: PR and SR approval processes with filtering and status management
- **Inventory Management**: Physical count and spot check workflows with session management
- **Navigation**: Mobile-optimized navigation with bottom tabs and responsive design
- **Theme Support**: Dark/light mode toggle with consistent styling

### User Experience Features (Implemented)
- **Mobile-First Design**: Touch-optimized interface with appropriate sizing
- **Responsive Layout**: Adaptive design that works across mobile devices
- **Intuitive Navigation**: Clear navigation patterns with visual feedback
- **Form Management**: Comprehensive form handling with validation
- **Loading States**: Loading indicators and state management
- **Error Handling**: Basic error handling and user feedback

### Technical Implementation (Current State)
- **React/TypeScript**: Modern React application with TypeScript for type safety
- **Component Architecture**: Reusable component library with consistent styling
- **Mock Data Integration**: Comprehensive mock data for all modules
- **Client-Side Routing**: Next.js routing with protected routes
- **State Management**: React state management for UI and form interactions

---

## Development Status & Next Steps

### Completed Implementation
- **Core Authentication**: Login, 2FA, password reset, business unit selection
- **Receiving Workflows**: PO management, scanning, GRN creation and management
- **Approval Systems**: PR and SR approval workflows with filtering
- **Inventory Operations**: Physical count and spot check session management
- **User Interface**: Mobile-optimized responsive design with theme support
- **Navigation**: Bottom tab navigation with protected routing

### Ready for Enhancement
- **API Integration**: Backend API integration for real data
- **Offline Capabilities**: Local storage and offline functionality
- **Advanced Security**: Enhanced authentication and authorization
- **Performance Optimization**: Caching and performance improvements
- **Accessibility**: WCAG compliance and accessibility features
- **Advanced Features**: Reporting, analytics, and advanced workflows

---

## Technology Stack

### Frontend Framework
- **Next.js**: React framework with TypeScript for type safety
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Lucide React**: Icon library for consistent iconography
- **React Hooks**: Modern React patterns for state management

### Development Tools
- **TypeScript**: Type safety and enhanced developer experience
- **ESLint**: Code linting and quality enforcement
- **PostCSS**: CSS processing and optimization
- **Component Architecture**: Reusable UI component library

### Current Architecture
- **Client-Side Rendering**: React-based single-page application
- **Mock Data Layer**: Comprehensive mock data for all business entities
- **Responsive Design**: Mobile-first responsive layouts
- **Theme System**: Dark/light mode support with CSS variables

---

## Document Control
- **Version**: 3.0
- **Created**: December 2024
- **Last Updated**: June 24, 2025
- **Document Type**: Implementation-Based FRD
- **Status**: Current Implementation Documentation
- **Owner**: Development Team
- **Purpose**: Document actual implemented features and capabilities
