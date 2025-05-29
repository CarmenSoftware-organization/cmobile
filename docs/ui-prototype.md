# Supply Chain Mobile App: UI Prototype

## Document Information
- **Version**: 2.1
- **Date**: January 2025 (Updated with Store Requisition UI/UX enhancements and Receiving/GRN calendar integration)
- **Product**: Carmen Software Supply Chain Mobile App
- **Target Industry**: Hotels and Hospitality
- **Document Type**: UI Prototype Specification

> **Recent UI Updates (2024-06):**
> - All list filters (status, BU, department, date, etc.) are now dropdown selects or mobile-friendly date pickers, not chips.
> - All list and card layouts are mobile-optimized, with large tap targets, card-based design, and clear visual hierarchy.
> - PR, PO, and SR list and detail screens use name-first display for items, and always show BU as a non-interactive label.
> - The "New SR" button is removed from the SR List.
> - PR Approval Detail uses workflowSteps for workflow logic and the Return action, and the action bar is sticky, mobile-friendly, and always reads user from localStorage.
> - On Hand/On Order overlays are present only in PR Approval, Stock Take, and Spot Check modules, never in Receiving/PO/GRN.
> - All overlays are mobile-optimized, read-only, and display a non-editable BU label.
> - All tax/discount fields are read-only on mobile.
> - All mock data and UI examples reflect realistic, FRD-compliant data and flows.

This document outlines the UI prototype for the Carmen Siftware Supply Chain Mobile App, focusing on the key UX/UI tasks from the PRD.

## Core Design Principles

- **SKU-first hierarchy** in all displays
- **Business Unit as non-interactive label** (never as a selector)
- **Mobile-optimized** with tab bar or hamburger menu navigation
- **Strong contrast** and **large touch targets** for accessibility
- **Visual distinction** between informational and actionable content

## Navigation Structure

### Mobile Navigation

- **Tab Bar** (primary navigation)
  - Receiving
  - PR Approval
  - Stock Take
  - Spot Check
  - Profile

- **Hamburger Menu** (secondary/additional options)
  - Settings
  - Help
  - Logout
  - Additional features

### Desktop Navigation

- **Sidebar** with the same core modules
- Expanded view options

## Core Module Prototypes

### 1. Dashboard

![Dashboard Wireframe](placeholder-for-dashboard.png)

```jsx
// Dashboard Component
const Dashboard = () => {
  const { user } = useAuth();
  const { data: assignedBusinessUnits } = useAssignedBusinessUnits(user.id);
  const { data: summaryData } = useSummaryData();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <BusinessUnitDisplay 
        assignedBusinessUnits={assignedBusinessUnits} 
      />
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Feature cards */}
        <FeatureCard 
          title="Receiving (PO & GRN)" 
          icon={<ReceivingIcon />} 
          href="/receiving" 
          count={summaryData?.pendingReceipts || 0} 
        />
        <FeatureCard 
          title="PR Approval" 
          icon={<ApprovalIcon />} 
          href="/pr-approval" 
          count={summaryData?.pendingApprovals || 0} 
        />
        <FeatureCard 
          title="Stock Take" 
          icon={<StockTakeIcon />} 
          href="/stock-take" 
          count={summaryData?.activeStockTakes || 0} 
        />
        <FeatureCard 
          title="Spot Check" 
          icon={<SpotCheckIcon />} 
          href="/spot-check" 
          count={summaryData?.activeSpotChecks || 0} 
        />
      </div>
    </div>
  );
};
```

### 2. Receiving Module

![Receiving Wireframe](placeholder-for-receiving.png)

#### Key Components:
- Receipt List View
- Receipt Detail View
- Shipment Processing Form

```jsx
// Receiving List Component
const ReceivingList = () => {
  const { user } = useAuth();
  const { data: receipts, isLoading, error } = useReceipts();
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div>
      <div className="flex flex-col gap-4 mb-6">
        <h1 className="text-2xl font-bold">Receiving</h1>
        {/* Mobile-optimized dropdown filters */}
        <div className="flex gap-2">
          <select className="dropdown-filter">{/* Status filter */}</select>
          <select className="dropdown-filter">{/* BU filter */}</select>
          <input type="date" className="date-filter" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {receipts.map(receipt => (
          <div key={receipt.id} className="card bg-white rounded-lg shadow p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base">{receipt.product_name}</span>
              <span className="text-xs text-muted-foreground">PO#: {receipt.number}</span>
              <span className="business-unit-label ml-auto">{receipt.business_unit_name}</span>
            </div>
            <div className="flex gap-2 text-xs">
              <span>ETA: {formatDate(receipt.eta)}</span>
              <span>Value: {receipt.value}</span>
              <span>Status: <span className={`status-badge ${receipt.status}`}>{receipt.status}</span></span>
            </div>
            <div className="flex gap-2 text-xs">
              <span>Description: {receipt.description}</span>
            </div>
            <div className="flex gap-2 mt-2">
              <Link href={`/receiving/${receipt.id}`} className="btn-primary flex-1">View</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

### 3. PR Approval Module

![PR Approval Wireframe](placeholder-for-pr-approval.png)

#### Key Components:
- PR List View with status filters (pending, urgent, escalated)
- PR Detail View with line items
- [On Hand] and [On Order] overlay panels

> **Note:** Each PR item card now includes a 'Price Comparison' section, listing prices for the item from each vendor's pricelist. This supports approvers in making informed decisions by comparing current, last, and alternative vendor prices. On Hand and On Order overlays are accessible from each item card.

#### PR Detail / Items Row Card (Mobile-Optimized)

Each item in the PR Detail view is displayed as a card for fast, touch-friendly review and approval. The card includes all required fields and actions for approvers, with a clear, mobile-first layout.

**Fields:**
- Product Name (bold, name-first)
- SKU
- Requested Qty / Unit
- Approved Qty (editable) / Unit
- Price (current)
- Last Price
- Tax Type/Rate (read-only)
- Comments
- Attachments (if any)
- **Price Comparison:** List of vendor names and their prices for the item (from vendor price lists)
- **On Hand** button: opens overlay/modal with location-wise inventory (read-only, BU label shown)
- **On Order** button: opens overlay/modal with open POs for the item (read-only, BU label shown)

> **Note:** All overlays are mobile-optimized, read-only, and display a non-editable BU label. Price comparison is a vendor-by-vendor price list for the item, supporting approver decision-making.

```jsx
// PR Detail Items Row Card (Mobile)
<div className="rounded-lg border bg-white p-3 flex flex-col gap-2 shadow-sm">
  <div className="flex items-center gap-2 mb-1">
    <span className="font-bold text-base">{item.name}</span>
    <span className="text-xs text-muted-foreground">SKU: {item.sku}</span>
  </div>
  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
    <div>Requested: <span className="font-medium">{item.requestedQty} {item.unit}</span></div>
    <div>
      Approved: 
      <input
        type="number"
        min="0"
        className="ml-1 w-16 px-2 py-1 border rounded text-xs font-medium"
        value={item.approveQty}
        onChange={...}
      /> {item.unit}
    </div>
    <div>Price: <span className="font-medium">{item.price.toFixed(2)}</span></div>
    <div>Last Price: <span className="font-medium">{item.lastPrice.toFixed(2)}</span></div>
    <div>Tax: <span className="font-medium">{item.taxType} {item.taxRate}%</span></div>
  </div>
  {/* Price Comparison List */}
  <div className="mt-2">
    <div className="font-semibold text-xs mb-1">Price Comparison</div>
    <ul className="text-xs text-muted-foreground ml-2">
      {item.vendorPrices.map(vp => (
        <li key={vp.vendor} className="flex justify-between">
          <span>{vp.vendor}</span>
          <span className="font-medium">{vp.price.toFixed(2)}</span>
        </li>
      ))}
    </ul>
  </div>
  <div className="flex gap-2 mt-2">
    <button
      className="btn-secondary flex-1"
      onClick={() => setShowOnHand(item)}
    >
      On Hand
    </button>
    <button
      className="btn-secondary flex-1"
      onClick={() => setShowOnOrder(item)}
    >
      On Order
    </button>
  </div>
  <div className="text-xs text-muted-foreground mt-1">Comments: {item.comments}</div>
  {/* Attachments, if any */}
  {item.attachments.length > 0 && (
    <div className="text-xs text-muted-foreground mt-1">
      Attachments:
      <ul className="ml-4 list-disc">
        {item.attachments.map(att => (
          <li key={att.id}>{att.name} ({att.desc})</li>
        ))}
      </ul>
    </div>
  )}
</div>
```

### 4. Stock Take Module

![Stock Take Wireframe](placeholder-for-stock-take.png)

#### Key Components:
- Session Initiation View
- Active Session View with count entry
- [On Hand] and [On Order] overlay panels

### 5. Spot Check Module

![Spot Check Wireframe](placeholder-for-spot-check.png)

#### Key Components:
- Session Initiation View (Random/Manual selection)
- Active Session View with progress indicator
- [On Hand] and [On Order] overlay panels

## Common Components

### 1. On Hand Modal

```jsx
const OnHandModal = ({ item, businessUnitName, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">On Hand: {item.sku} - {item.name}</h3>
          <span className="business-unit-label">{businessUnitName}</span>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <span className="sr-only">Close</span>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Location</th>
              <th className="px-4 py-2 text-left">Qty Available</th>
              <th className="px-4 py-2 text-left">Min</th>
              <th className="px-4 py-2 text-left">Max</th>
              <th className="px-4 py-2 text-left">Last Counted/Stocked</th>
            </tr>
          </thead>
          <tbody>
            {item.onHandData.map((location, index) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-2">{location.name}</td>
                <td className="px-4 py-2">{location.qty_available}</td>
                <td className="px-4 py-2">{location.min_qty}</td>
                <td className="px-4 py-2">{location.max_qty}</td>
                <td className="px-4 py-2">{formatDate(location.last_counted)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
```

### 2. On Order Modal

```jsx
const OnOrderModal = ({ item, businessUnitName, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">On Order: {item.sku} - {item.name}</h3>
          <span className="business-unit-label">{businessUnitName}</span>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <span className="sr-only">Close</span>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">PO Number</th>
              <th className="px-4 py-2 text-left">Vendor</th>
              <th className="px-4 py-2 text-left">Ordered Qty</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {item.onOrderData.map((po, index) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-2">{po.number}</td>
                <td className="px-4 py-2">{po.vendor_name}</td>
                <td className="px-4 py-2">{po.ordered_qty}</td>
                <td className="px-4 py-2">{po.status}</td>
                <td className="px-4 py-2">{formatDate(po.due_date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
```

### 3. Business Unit Display

```jsx
const BusinessUnitDisplay = ({ assignedBusinessUnits }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-2">Your Business Units</h2>
      <div className="flex flex-wrap gap-2">
        {assignedBusinessUnits.map(bu => (
          <span 
            key={bu.id} 
            className="business-unit-label px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
          >
            {bu.name}
          </span>
        ))}
      </div>
    </div>
  );
};
```

## UI Component Library

We'll use a combination of:
- **Tailwind CSS** for responsive styling
- **ShadCN** for list/table components
- **Material UI** for dialogs and modals
- **Chakra UI** for accessible form components

## Color Palette

- **Primary**: #0F52BA (Carmen Siftware Blue)
- **Secondary**: #F9A826 (Amber)
- **Success**: #10B981 (Green)
- **Warning**: #F59E0B (Amber)
- **Danger**: #EF4444 (Red)
- **Info**: #3B82F6 (Blue)
- **Background**: #F9FAFB (Light Gray)
- **Text**: #111827 (Dark Gray)

## Typography

- **Font Family**: Inter, system-ui, sans-serif
- **Base Size**: 16px
- **Scale**: 1.25 (Major Third)

## Accessibility Features

- Minimum contrast ratio of 4.5:1 for normal text
- Minimum touch target size of 44x44px
- Proper ARIA attributes throughout
- Keyboard navigation support
- Screen reader compatibility

## Responsive Breakpoints

- **Small**: 640px and up
- **Medium**: 768px and up
- **Large**: 1024px and up
- **Extra Large**: 1280px and up

## Next Steps

1. Create high-fidelity mockups in Figma
2. Develop component prototypes
3. Conduct usability testing
4. Refine designs based on feedback
5. Implement in code with Next.js and Tailwind CSS

### GRN State Workflow & UI Rules

Goods Receipt Notes (GRNs) follow a four-state workflow:

1. **Draft**
   - GRN is being created or edited.
   - If any item quantity is empty or zero, the GRN remains in Draft.
   - Can be edited or voided (voiding returns all items to PO remaining).

2. **Received**
   - All item quantities are greater than zero.
   - GRN status automatically changes to Received.
   - Can still be edited or voided (voiding returns all items to PO remaining).
   - If any item quantity is set back to zero, status returns to Draft.

3. **Committed**
   - User explicitly commits the GRN (after review/approval).
   - GRN is finalized and cannot be edited.
   - Cannot be voided.

4. **Void**
   - Can be applied to GRNs in Draft or Received state.
   - All items in the GRN are returned to the PO remaining quantity.
   - GRN is marked as cancelled/invalid.

**State Transition Rules:**
- Draft → Received: When all item quantities > 0.
- Received → Draft: If any item quantity is set back to zero.
- Received → Committed: When user commits the GRN.
- Draft/Received → Void: At any time before commit.
- Committed: Final state; cannot revert or void.

**UI Implications:**
- Status badge and available actions update according to current state.
- Only Draft and Received GRNs can be edited or voided.
- Committed GRNs are locked and view-only.
- Voided GRNs are view-only and marked as cancelled.

// GRN Detail Component
const GRNDetail = ({ grn }) => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">GRN #{grn.number}</h1>
        <span className="business-unit-label">{grn.business_unit_name}</span>
      </div>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        {/* GRN Header Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500">Vendor</p>
            <p>{grn.vendor_name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Received Date</p>
            <p>{formatDate(grn.received_date)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Receiver</p>
            <p>{grn.receiver_name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className={`status-badge ${grn.status}`}>{grn.status}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Value</p>
            <p>{grn.total_value}</p>
          </div>
        </div>
        {/* ...rest of GRN detail... */}
      </div>
    </div>
  );
};

// SR List View (updated for dropdown filters, card layout, and no New SR button)
const SRList = () => {
  // ... existing code ...
  return (
    <div>
      <div className="flex flex-col gap-4 mb-6">
        <h1 className="text-2xl font-bold">Store Requisition</h1>
        <div className="flex gap-2">
          <select className="dropdown-filter">{/* Status filter */}</select>
          <select className="dropdown-filter">{/* Department filter */}</select>
          <input type="date" className="date-filter" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {srs.map(sr => (
          <div key={sr.id} className="card bg-white rounded-lg shadow p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base">{sr.number}</span>
              <span className="business-unit-label ml-auto">{sr.business_unit_name}</span>
            </div>
            <div className="flex gap-2 text-xs">
              <span>Department: {sr.department}</span>
              <span>Date: {formatDate(sr.date)}</span>
              <span>Status: <span className={`status-badge ${sr.status}`}>{sr.status}</span></span>
              <span>Item Count: {sr.itemCount}</span>
              <span>Requestor: {sr.requestor}</span>
            </div>
            <div className="flex gap-2 mt-2">
              <Link href={`/store-requisition/${sr.id}`} className="btn-primary flex-1">View</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
