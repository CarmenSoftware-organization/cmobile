# 📱 Carmen Supply Chain Mobile App - Product Overview

> **Version**: 2.1 | **Date**: January 2025 | **Status**: 85-90% Complete

## 🎯 What is This App?

A **mobile-first supply chain management tool** designed specifically for **hotels and hospitality businesses**. It streamlines inventory, purchasing, and approval workflows that traditionally required desktop systems or manual processes.

## 👥 Key Users & Their Journeys

### 🔍 **Cost Controller** (Michelle's Story)
**Goal**: Ensure inventory accuracy through spot checks and audits

**Journey**:
1. Opens app → Dashboard shows all assigned hotel properties
2. Selects "Spot Check" → Chooses location (restaurant)
3. Picks check method: Random (20 items) or Manual selection
4. App generates locked item list for compliance
5. Goes through each item: counts, photos, notes
6. Uses [On Hand] and [On Order] buttons to verify expected quantities
7. Submits completed check → Creates audit trail

**Pain Points Solved**: No more guessing, lost paperwork, or incomplete audits

### 📦 **Receiving Clerk**
**Goal**: Efficiently receive deliveries and update inventory

**Journey**:
1. Dashboard → "Purchase Orders" → Sees today's deliveries
2. Selects PO(s) → Creates Goods Receipt Note (GRN)
3. For each item: enters received quantity, handles unit conversions
4. Captures photos of damaged goods, gets delivery signature
5. Submits GRN → Inventory automatically updated

**Pain Points Solved**: No more manual calculations, missing receipts, or data entry errors

### ✅ **PR Approver** (Department Head/Manager)
**Goal**: Review and approve purchase requests efficiently

**Journey**:
1. Gets notification of pending PR → Taps to open directly
2. Reviews request details, sees requester and business justification
3. For each item: checks [On Hand] (current inventory) and [On Order] (incoming stock)
4. Approves, rejects, or modifies quantities
5. Adds comments if needed → Submits decision

**Pain Points Solved**: No more email chains, lost approvals, or uninformed decisions

### 🏪 **Store Staff** (Store Requisition)
**Goal**: Request items from other departments/locations

**Journey**:
1. Creates Store Requisition → Selects requesting department and source location
2. Adds items via search or barcode scan
3. Submits for approval → Department Head approves → Store Manager approves
4. Store staff fulfill request → Delivery confirmed with signature

## 🏗️ Core Business Logic

### 🏢 Multi-Tenant Authorization
- Each user has access to specific **Business Units** (hotel properties)
- BU context is **always visible** but **never selectable** during workflows
- Example: "Grand Hotel Singapore" vs "Business Hotel Jakarta"

### 🔄 State-Based Workflows
**GRN (Goods Receipt) States**:
- **Draft** → Can edit, some items may have zero quantities
- **Received** → All items have quantities > 0
- **Committed** → Finalized, cannot edit
- **Void** → Cancelled, returns items to PO

### ⚡ Smart Features

**Name-First Display**: Product names always shown before SKU codes (mobile-friendly)

**Unit Conversion**: Can receive in "PO units" (cases) or "inventory units" (bottles) with automatic conversion

**Tax/Discount**: Always read-only on mobile - no overrides allowed (desktop only)

**Audit Everything**: Every action logged with user, timestamp, location, and before/after values

## 🗺️ Navigation Flow

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

## 📱 Key Mobile Optimizations

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

## 📊 Business Impact Goals

- **90% increase** in supply chain transaction accuracy
- **75% reduction** in non-compliant inventory events  
- **80% user adoption** of mobile workflows within 6 months
- **30% decrease** in monthly inventory reconciliation time

## 🎯 Why This Matters

Traditional hotel supply chain management involves:
- Manual paperwork that gets lost
- Desktop-only systems that aren't accessible on the floor
- Approval bottlenecks via email
- Incomplete audit trails
- Inventory discrepancies discovered too late

This mobile app brings **real-time, compliant, auditable** supply chain management directly to where the work happens - in the restaurant, kitchen, storeroom, and receiving dock.

---

**Related Documents**: Master PRD, UX/UI Guide, Workflow Documentation
**Implementation Status**: 85-90% Complete (December 2024)
**Next Milestone**: Backend Integration (Q1 2025)