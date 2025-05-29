# Carmen Supply Chain Mobile App - User Journey Overview

## Document Information
- **Version**: 2.1
- **Date**: January 2025 (Updated with Store Requisition UI/UX enhancements and Receiving/GRN calendar integration)
- **Product**: Carmen Software Supply Chain Mobile App
- **Target Industry**: Hotels and Hospitality
- **Document Type**: User Journey Overview

## What is This App?

A **mobile-first supply chain management tool** designed specifically for **hotels and hospitality businesses**. It streamlines inventory, purchasing, and approval workflows that traditionally required desktop systems or manual processes.

## Key Users & Their Journeys

### 1. **Cost Controller** (Michelle's Story)
**Goal**: Ensure inventory accuracy through spot checks and audits

**Journey**:
- Opens app → Dashboard shows all assigned hotel properties
- Selects "Spot Check" → Chooses location (restaurant)
- Picks check method: Random (20 items) or Manual selection
- App generates locked item list for compliance
- Goes through each item: counts, photos, notes
- Uses [On Hand] and [On Order] buttons to verify expected quantities
- Submits completed check → Creates audit trail

**Pain Points Solved**: No more guessing, lost paperwork, or incomplete audits

### 2. **Receiving Clerk**
**Goal**: Efficiently receive deliveries and update inventory

**Journey**:
- Dashboard → "Purchase Orders" → Sees today's deliveries
- Selects PO(s) → Creates Goods Receipt Note (GRN)
- For each item: enters received quantity, handles unit conversions
- Captures photos of damaged goods, gets delivery signature
- Submits GRN → Inventory automatically updated

**Pain Points Solved**: No more manual calculations, missing receipts, or data entry errors

### 3. **PR Approver** (Department Head/Manager)
**Goal**: Review and approve purchase requests efficiently

**Journey**:
- Gets notification of pending PR → Taps to open directly
- Reviews request details, sees requester and business justification
- For each item: checks [On Hand] (current inventory) and [On Order] (incoming stock)
- Approves, rejects, or modifies quantities
- Adds comments if needed → Submits decision

**Pain Points Solved**: No more email chains, lost approvals, or uninformed decisions

### 4. **Store Staff** (Store Requisition)
**Goal**: Request items from other departments/locations

**Journey**:
- Creates Store Requisition → Selects requesting department and source location
- Adds items via search or barcode scan
- Submits for approval → Department Head approves → Store Manager approves
- Store staff fulfill request → Delivery confirmed with signature

## Core Business Logic

### Multi-Tenant Authorization
- Each user has access to specific **Business Units** (hotel properties)
- BU context is **always visible** but **never selectable** during workflows
- Example: "Grand Hotel Singapore" vs "Business Hotel Jakarta"

### State-Based Workflows
**GRN (Goods Receipt) States**:
- **Draft** → Can edit, some items may have zero quantities
- **Received** → All items have quantities > 0
- **Committed** → Finalized, cannot edit
- **Void** → Cancelled, returns items to PO

### Smart Features

**Name-First Display**: Product names always shown before SKU codes (mobile-friendly)

**Unit Conversion**: Can receive in "PO units" (cases) or "inventory units" (bottles) with automatic conversion

**Tax/Discount**: Always read-only on mobile - no overrides allowed (desktop only)

**Audit Everything**: Every action logged with user, timestamp, location, and before/after values

## Navigation Flow

```
Dashboard (Home)
├── Store Requisition
│   ├── Create SR → Submit → Approvals → Issue
├── Receiving (Purchase Orders)
│   ├── Select PO(s) → Create GRN → Item Entry → Submit
├── PR Approval  
│   ├── PR List → PR Detail → [On Hand]/[On Order] → Approve/Reject
├── Stock Take
│   ├── Physical Count OR Spot Check → Location → Count Items → Submit
└── Profile & Settings
```

## Key Mobile Optimizations

### **Enforce Proper Workflows**
- Can't access GRNs directly - must go through PO selection
- Spot check item lists are "locked" once started (compliance)
- No shortcuts that bypass audit requirements

### **Context-Aware Information**
- **[On Hand]** and **[On Order]** buttons only appear in PR Approval
- Show current inventory and pending orders when making approval decisions
- Not available in receiving workflows (prevents confusion)

### **Offline Support**
- Can create/edit Store Requisitions offline
- Actions queue up and sync when connection restored
- Clear indicators for offline-created content

## Business Impact Goals

- **90% increase** in supply chain transaction accuracy
- **75% reduction** in non-compliant inventory events  
- **80% user adoption** of mobile workflows within 6 months
- **30% decrease** in monthly inventory reconciliation time

## Why This Matters

Traditional hotel supply chain management involves:
- Manual paperwork that gets lost
- Desktop-only systems that aren't accessible on the floor
- Approval bottlenecks via email
- Incomplete audit trails
- Inventory discrepancies discovered too late

This mobile app brings **real-time, compliant, auditable** supply chain management directly to where the work happens - in the restaurant, kitchen, storeroom, and receiving dock.