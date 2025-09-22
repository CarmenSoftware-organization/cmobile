# GRN Multiple PO Selection Testing Guide

## Overview
This guide provides comprehensive testing scenarios for the Goods Received Note (GRN) flow with multiple Purchase Order (PO) selection functionality in the Carmen Supply Chain Mobile App.

## Available Test Data

### Purchase Orders by Vendor

#### 🌊 Aqua Supplier (3 POs available)
- **PO-1001** - Water & Supplies - $1,295.00 (USD) - ETA: 2024-06-01
  - 10 items: Mineral Water, Bottled Water, Sparkling Water, Wine Glasses, etc.
  - Locations: Main Store, Bar Storage, Kitchen Storage, Maintenance Workshop

- **PO-1004** - Housekeeping Supplies - $890.00 (USD) - ETA: 2024-06-05  
  - 6 items: Distilled Water, Glass Cleaner, Microfiber Cloths, Bathroom Cleaner, etc.
  - Location: Housekeeping Store

- **PO-1005** - Pool & Spa Supplies - $650.00 (USD) - ETA: 2024-06-07
  - 4 items: Pool Chlorine, pH Test Strips, Skimmer Nets, Spa Filters
  - Location: Pool Equipment Room

#### 🧃 Juice Co. (2 POs available)
- **PO-1002** - Breakfast Beverages - €185.00 (EUR) - ETA: 2024-06-02
  - 3 items: Orange Juice, Apple Juice, Cranberry Juice
  - Locations: Kitchen Store, Bar Store

- **PO-1006** - Wellness Center Supplies - €320.00 (EUR) - ETA: 2024-06-08
  - 5 items: Mango Juice, Pineapple Juice, Green Smoothie Mix, Coconut Water, Protein Powder
  - Location: Wellness Center Bar

#### ☕ Coffee Traders (1 PO available)
- **PO-1003** - Coffee Supplies - $285.00 (USD) - ETA: 2024-06-03
  - 4 items: Arabica Beans, Espresso Blend, Coffee Filters, Frother Cleaner
  - Location: Kitchen Store

## Testing Scenarios

### 🎯 Scenario 1: Multiple POs from Same Vendor (Aqua Supplier)
**Objective**: Test selecting multiple POs from the same vendor

**Steps**:
1. Navigate to **Receiving** → **New GRN**
2. Select Business Unit: **Grand Hotel Singapore**
3. Select Vendor: **Aqua Supplier**
4. **Multiple PO Selection**: Select 2-3 POs:
   - ✅ PO-1001 (Water & Supplies)
   - ✅ PO-1004 (Housekeeping Supplies)  
   - ✅ PO-1005 (Pool & Spa Supplies)
5. Proceed with receiving items from multiple POs
6. Verify items are grouped by location and PO number

**Expected Results**:
- All selected POs appear in the receiving list
- Items are properly categorized by store location
- Total value combines all selected POs: $2,835.00
- Different departments are represented (F&B, Housekeeping, Pool Maintenance)

### 🎯 Scenario 2: Multiple POs from Same Vendor (Juice Co.)
**Objective**: Test selecting both available POs from Juice Co.

**Steps**:
1. Navigate to **Receiving** → **New GRN**
2. Select Business Unit: **Business Hotel Jakarta**
3. Select Vendor: **Juice Co.**
4. **Multiple PO Selection**: Select both POs:
   - ✅ PO-1002 (Breakfast Beverages)
   - ✅ PO-1006 (Wellness Center Supplies)
5. Proceed with receiving
6. Note currency handling (EUR) and different locations

**Expected Results**:
- Both POs selected successfully
- Total value: €505.00 (€185.00 + €320.00)
- Items distributed across Kitchen Store, Bar Store, and Wellness Center Bar
- Different departments: F&B, Bar, Wellness

### 🎯 Scenario 3: Mixed Vendor Selection
**Objective**: Test selecting POs from different vendors (if supported)

**Steps**:
1. Navigate to **Receiving** → **New GRN**
2. Try selecting POs from different vendors
3. Observe system behavior and validation

**Expected Results**:
- System should either allow mixed vendor selection or provide clear validation
- If not allowed, clear error message should appear

### 🎯 Scenario 4: Partial Receiving Across Multiple POs
**Objective**: Test partial receiving when multiple POs are selected

**Steps**:
1. Select multiple POs from Aqua Supplier (PO-1001, PO-1004)
2. During receiving, only partially receive items:
   - PO-1001: Receive 50% of Mineral Water
   - PO-1004: Receive 100% of Glass Cleaner, 0% of Microfiber Cloths
3. Complete GRN
4. Verify remaining quantities are tracked correctly

**Expected Results**:
- Partial quantities are properly recorded
- Remaining quantities are updated in the system
- GRN shows accurate received vs. ordered quantities

### 🎯 Scenario 5: Location-Based Receiving
**Objective**: Test receiving items grouped by storage location

**Steps**:
1. Select PO-1001 and PO-1004 from Aqua Supplier
2. Notice items are from different locations:
   - Main Store (PO-1001)
   - Bar Storage (PO-1001)
   - Kitchen Storage (PO-1001)
   - Housekeeping Store (PO-1004)
3. Receive items location by location
4. Verify location-based organization

**Expected Results**:
- Items are properly grouped by storage location
- Easy navigation between different storage areas
- Clear indication of which PO each item belongs to

## Access Information

### 🌐 Application URLs
- **Port 3000**: http://localhost:3000
- **Port 3001**: http://localhost:3001  
- **Port 3002**: http://localhost:3002
- **Port 3003**: http://localhost:3003
- **Port 3004**: http://localhost:3004
- **Port 3005**: http://localhost:3005

### 🔐 Login Credentials
- **Email**: admin@carmen.com
- **Password**: password

### 📱 Navigation Path
1. Login → Dashboard
2. **Receiving** (from main menu)
3. **New GRN** (+ button)
4. Follow the multi-step flow:
   - Business Unit Selection
   - Vendor Selection  
   - **PO Selection** (multiple selection enabled)
   - Item Receiving
   - GRN Completion

## Key Features to Test

### ✅ Multiple PO Selection Interface
- [ ] Checkbox selection for multiple POs
- [ ] Select All / Deselect All functionality
- [ ] PO summary information display
- [ ] Total value calculation across selected POs

### ✅ Data Validation
- [ ] Same vendor requirement (if applicable)
- [ ] Same business unit validation
- [ ] Currency consistency checks
- [ ] ETA and status validation

### ✅ Receiving Flow
- [ ] Items grouped by PO and location
- [ ] Quantity adjustment controls
- [ ] Barcode scanning integration
- [ ] Quality inspection notes
- [ ] Photo capture for discrepancies

### ✅ GRN Generation
- [ ] Multiple PO references in GRN
- [ ] Accurate quantity and value calculations
- [ ] Proper location assignments
- [ ] Department allocations
- [ ] Tax calculations across multiple POs

## Troubleshooting

### Common Issues
1. **PO Not Appearing**: Ensure correct business unit is selected
2. **Multiple Selection Not Working**: Check if vendor has multiple POs available
3. **Currency Mismatch**: Verify all selected POs use same currency
4. **Location Conflicts**: Review storage location assignments

### Debug Information
- Check browser console for any JavaScript errors
- Verify mock data is loading correctly
- Ensure localStorage is functioning properly
- Check network requests in browser dev tools

## Test Results Template

```
Test Date: ___________
Tester: ___________
Browser: ___________

Scenario 1 - Multiple Aqua Supplier POs:
✅ / ❌ PO selection works
✅ / ❌ Total calculation correct  
✅ / ❌ Location grouping proper
✅ / ❌ Receiving flow smooth
Notes: ___________

Scenario 2 - Multiple Juice Co. POs:
✅ / ❌ EUR currency handling
✅ / ❌ Different locations supported
✅ / ❌ Department allocation correct
Notes: ___________

Overall Assessment:
✅ / ❌ Multiple PO selection functional
✅ / ❌ User experience intuitive
✅ / ❌ Data accuracy maintained
✅ / ❌ Performance acceptable

Recommendations:
___________
```

---

**Happy Testing! 🚀**

For any issues or questions, check the browser console or review the mock data in `src/data/mockPOData.ts`. 