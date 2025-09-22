# Carmen Supply Chain Mobile App - User Journey Overview

## Document Information
- **Version**: 3.0
- **Date**: June 24, 2025 (Updated to reflect current implementation)
- **Product**: Carmen Software Supply Chain Mobile App
- **Target Industry**: Hotels and Hospitality
- **Document Type**: Current Implementation Overview

## What is This App?

A **mobile-first supply chain management tool** designed specifically for **hotels and hospitality businesses**. This implementation provides core functionality for inventory, purchasing, and approval workflows with a modern, responsive interface. The app currently operates with comprehensive mock data and demonstrates the complete user experience for hotel supply chain operations.

## Key Users & Their Journeys

### 1. **Cost Controller** (Michelle's Story)
**Goal**: Ensure inventory accuracy through spot checks and audits

**Current Implementation**:
- Opens app → Dashboard shows module cards with counts
- Selects "Stock Take" → Chooses "Spot Check" option
- Selects location from available locations list
- Picks check method: Random (20 items), High Value, or Manual selection
- Reviews generated item list and proceeds to counting session
- Goes through each item: enters counts and notes
- Reviews counts in review session → Submits completed check
- Success confirmation with session summary

**Current Features**: Location-based spot checks, multiple selection methods, session-based workflow

### 2. **Receiving Clerk**
**Goal**: Efficiently receive deliveries and update inventory

**Current Implementation**:
- Dashboard → "Receiving" → Sees PO list with search and filtering
- Can scan PO via QR/barcode or select from list
- Selects business unit and locations for receiving
- Creates GRN with Items, Summary, and Comments tabs
- For each item: enters received quantity with unit selection
- Adds comments and attachments as needed
- Reviews summary and submits GRN

**Current Features**: PO scanning, location-based receiving, tabbed GRN interface, comprehensive filtering

### 3. **PR Approver** (Department Head/Manager)
**Goal**: Review and approve purchase requests efficiently

**Current Implementation**:
- Dashboard → "Approval" → Sees PR list with filtering by status, department, BU
- Selects individual PR to review details
- Reviews request information including requester, department, and business context
- Reviews each item with workflow status indicators
- Makes approval decisions with clear action buttons
- Submits decisions with workflow progression logic

**Current Features**: Filtered PR lists, individual PR review, workflow status management, multi-stage approval process

### 4. **Store Staff** (Store Requisition)
**Goal**: Request items from other departments/locations

**Current Implementation**:
- Dashboard → "Store Req." → Sees SR list with filtering by status, department
- Can create new store requisition with item selection
- Reviews individual SRs with detailed item information
- Manages SR workflow states (Draft, In-progress, Approved, etc.)
- Views SR history and status progression

**Current Features**: SR list management, create new requisitions, workflow status tracking, filtering capabilities

## Current Implementation Features

### Multi-Tenant Business Units
- Users are assigned to specific **Business Units** (hotel properties)
- Business unit selection during authentication workflow
- BU context displayed throughout the application
- Examples: "Grand Hotel Singapore", "Business Hotel Jakarta", "Boutique Hotel Bangkok"

### Workflow Management
**PR (Purchase Request) States**:
- **Draft** → Initial creation state
- **In-progress** → Submitted for approval
- **Approved** → Approved by manager
- **Rejected** → Rejected with comments

**SR (Store Requisition) States**:
- **Draft** → Initial creation state
- **In-progress** → Submitted for approval workflow
- **Approved** → Approved by manager
- **Fulfilled** → Items delivered

### Current Features

**Mobile-First Design**: Touch-optimized interface with responsive layouts

**Session-Based Workflows**: Physical count and spot check sessions with progress tracking

**Comprehensive Filtering**: Search and filter capabilities across all modules

**Theme Support**: Dark/light mode toggle with consistent styling

**Mock Data Integration**: Realistic business scenarios with comprehensive test data

## Current Navigation Structure

```
Dashboard (Home)
├── Receiving
│   ├── PO List → Scan PO OR Select PO → Business Unit → Locations → GRN Detail
│   ├── GRN List → View/Edit GRNs
│   ├── Draft GRNs → Manage Draft Documents
│   └── Advanced Search → Filter and Search POs
├── PR Approval (Approval)
│   ├── PR List → Filter by Status/Department/BU
│   └── PR Detail → Review and Approve Individual Requests
├── Store Requisition (Store Req.)
│   ├── SR List → Filter by Status/Department
│   ├── SR Detail → View/Edit Individual Requisitions
│   └── Create SR → New Requisition Interface
├── Stock Take
│   ├── Physical Count → Location Selection → Count Sessions
│   └── Spot Check → Location → Method → Count Sessions
├── Notifications
│   └── Notification Center → Manage All Notifications
└── Profile
    ├── User Profile → View Personal Information
    └── Edit Profile → Update Personal Details
```

## Current Mobile Features

### **Responsive Design**
- Mobile-first interface with touch-optimized controls
- Bottom tab navigation for easy thumb access
- Card-based layouts for better mobile readability
- Responsive layouts that adapt to different screen sizes

### **User Experience**
- Clear visual hierarchy with consistent styling
- Loading states and progress indicators
- Form validation with real-time feedback
- Theme toggle (dark/light mode) with system preference detection

### **Session Management**
- Persistent navigation state across app sessions
- Form state preservation during navigation
- Business unit context maintained throughout workflows
- Client-side session handling with local storage

### **Current Limitations**
- Mock data integration (no real backend connectivity)
- Basic authentication (no advanced security features)
- No offline capabilities (requires internet connection)
- Limited audit trail functionality

## Current Implementation Value

### **Demonstration Capabilities**
- **Complete User Experience**: Full workflow demonstrations for all major supply chain processes
- **Mobile-First Design**: Showcases modern, responsive interface design principles
- **Realistic Data Scenarios**: Comprehensive mock data reflecting real hotel operations
- **Workflow Validation**: Proves concept viability for hotel supply chain management

### **Ready for Enhancement**
- **Backend Integration**: Foundation ready for API integration and real data
- **Advanced Features**: Architecture supports offline capabilities, advanced security, and audit trails
- **Scalability**: Component-based design allows for easy feature expansion
- **User Training**: Current implementation serves as effective training and demonstration tool

## Why This Implementation Matters

### **Current State Validation**
This implementation demonstrates how modern mobile technology can transform hotel supply chain management by:
- **Proving Mobile-First Viability**: Shows that complex supply chain workflows can be effectively managed on mobile devices
- **Validating User Experience**: Demonstrates intuitive, touch-optimized interfaces for hotel staff
- **Showcasing Integration Potential**: Provides foundation for future backend integration and advanced features
- **Enabling Stakeholder Buy-In**: Offers tangible demonstration of concept value and user experience

### **Foundation for Growth**
The current implementation provides:
- **Solid Architecture**: React/TypeScript foundation ready for production enhancement
- **Proven Workflows**: Validated user journeys and business logic
- **Design System**: Consistent, scalable UI components and patterns
- **Development Roadmap**: Clear path from demonstration to production deployment

This mobile app implementation proves that **modern, mobile-first supply chain management** is not only possible but practical for hotel operations, setting the stage for future development and deployment.