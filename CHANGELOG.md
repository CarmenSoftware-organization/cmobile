# Changelog

All notable changes to the Carmen Supply Chain Mobile App will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Enhanced GRN Flow**: Implemented smart PO scanning with context-aware routing for streamlined receiving workflow
- **Scan PO Functionality**: Camera-based barcode/QR code scanning with instant PO recognition and validation
- **Smart Context Detection**: Automatic Business Unit detection from PO data enabling intelligent workflow routing
- **Location Selection Enhancement**: Context-aware location selection with pre-populated delivery information
- **Progressive Enhancement**: Three-tier workflow approach (complete context → partial context → manual flow)
- **Visual Feedback System**: Color-coded scan result indicators (green=complete, yellow=partial, red=failed)
- **Comprehensive PO Data Integration**: Enhanced mock PO database with complete item details, pricing, and inventory information
- **Enhanced GRN Creation**: GRN detail page now populates with complete scanned PO data including all item details and specifications
- **Smart Data Flow**: Seamless data transfer from scan to GRN creation with preserved item details, pricing, and inventory context
- **Multi-Currency Support**: Enhanced mock data includes multiple currencies (USD, EUR, IDR) with proper exchange rates
- **Detailed Item Information**: Complete item specifications including expiry dates, departments, account codes, and inventory levels
- **Location-Based Receiving**: Smart location detection from PO items with multi-location selection interface
- **Selective Location Receiving**: Option to receive items for all locations or select specific locations based on item distribution
- **Location Summary Display**: Visual breakdown of items by location and department in scan results
- **Enhanced PO Mock Data**: Expanded mock data with items across multiple locations (Main Store, Bar Storage, Housekeeping Storage, Kitchen Storage)
- **Dual GRN Creation Options**: Added "Create GRN" (all locations) and "Select Locations" (custom selection) options in scan PO flow for improved user experience
- **Streamlined Receiving Workflow**: Users can now choose between quick GRN creation with all locations or detailed location selection for specific receiving needs
- **Enhanced User Guidance**: Added clear descriptions and visual indicators to help users understand the difference between GRN creation options
- **GRN Creation Location Selection**: Added location selection step in the traditional "Create Good Receive Note" flow for consistent location-based receiving across all entry points
- **Unified Location Selection Experience**: Both scan PO and manual GRN creation now include comprehensive location selection with multi-location support
- **Enhanced GRN Creation Workflow**: Updated "Create Goods Receive Note" button to navigate through location selection before GRN detail creation for better user experience
- **Location-Aware GRN Processing**: GRN detail page now displays selected locations information and processes items based on location selection context
- **Store Location Focus**: Enhanced location selection interface to emphasize store locations rather than departments for clearer receiving workflow
- **Improved Location Display**: Updated location selection UI to show store location names prominently with simplified item and PO information
- **Streamlined Location Interface**: Removed department emphasis in favor of clear store location identification for better user understanding
- **Location-Based Item Grouping**: Enhanced GRN detail page to group items by their store locations for better organization and clarity
- **Improved GRN Items Display**: Items are now organized by location with clear visual separation and location headers showing item counts
- **Enhanced Location Visualization**: Added location-specific sections with MapPin icons and item counts for better receiving workflow organization
- **Comprehensive Mock Data Enhancement**: Expanded PO-1001 with 10 items across 5 different store locations (Main Store, Bar Storage, Housekeeping Storage, Kitchen Storage, Maintenance Workshop) for thorough location grouping testing
- **Diverse Product Categories**: Added varied product types including beverages, cleaning supplies, linens, glassware, tools, and food items to demonstrate real-world inventory scenarios
- **Enhanced Item Details**: Each mock item includes complete specifications with pricing, expiry dates, inventory levels, and location-specific comments for realistic testing
- Good Receive Note (GRN): Added comprehensive date range picker with calendar integration for delivery date filtering
- Good Receive Note (GRN): Added shadcn UI components (dropdown-menu, popover, calendar) for enhanced user experience
- Good Receive Note (GRN): Added predefined date filter options (Today, This Week, Next Week, Overdue)
- Good Receive Note (GRN): Added custom date range selection with progressive date picking
- Good Receive Note (GRN): Added currency grouping for Purchase Orders with exchange rate display
- Good Receive Note (GRN): Added business unit context persistence throughout the receiving flow
- Good Receive Note (GRN): Added comprehensive GRN management with status-based actions (Resume, Continue, View)
- Good Receive Note (GRN): Added multi-tab interface for GRN details (Items, Summary, Signature, Extra Cost, Attachments)
- Good Receive Note (GRN): Added item-level receiving with quantities, FOC, and unit management
- Good Receive Note (GRN): Added digital signature capture and comments with attachments
- Documentation updates in FRD, PRD, and Content Specification to reflect Store Requisition UI improvements
- Store Requisition detail page: Added comprehensive Business Dimensions structure with specific fields (Project Code, Market Segment, Event)
- Store Requisition detail page: Added price and cost totals to item cards
- Enhanced Store Requisition Module documentation in FRD with comprehensive details on functional overview, workflows, and acceptance criteria
- Added detailed Store Requisition screen specifications to Content Specification document, including UI components, data fields, states, and business rules
- **Unified Data Source for GRN Flows**: Created centralized mock PO data source (`src/data/mockPOData.ts`) that both scan PO and traditional GRN creation flows now use
  - Ensures data consistency across all receiving workflows
  - Eliminates duplicate mock data structures
  - Provides single source of truth for PO information
  - Enhanced PO-1001 with comprehensive 10-item dataset across 5 store locations
  - Improved type safety with shared interfaces for POItem and PurchaseOrder
- **Store Requisition Issue Quantity Feature**: Added comprehensive Issue Quantity functionality to Store Requisition detail page
  - **Three-Column Quantity Layout**: Enhanced item rows with Requested, Approved, and Issue Quantity fields in mobile-optimized grid
  - **Independent Unit Selection**: Each quantity field (Approved and Issue) has dedicated unit selectors for flexible receiving scenarios
  - **Vertical Input Stacking**: Compact design with quantity input and unit selector stacked vertically for better mobile usability
  - **Real-Time Variance Tracking**: Automatic calculation of differences between requested, approved, and issued quantities
  - **Complete Audit Trail**: Full tracking of quantity changes from initial request through approval to final issuance
  - **Enhanced Data Model**: Updated Item interface to properly support `issuedQty` field with default values and proper state management
- **PR Approval Save/Cancel Functionality**: Added comprehensive edit tracking and state management for PR approval workflow
  - **Edit State Tracking**: Added `originalItemsState` to store initial values for cancel functionality
  - **Smart Button Display**: Dynamic bottom action bar shows Save/Cancel buttons when any item is edited, replacing submit button
  - **Controlled Components**: Changed approved quantity and unit inputs from `defaultValue` to `value` for proper state synchronization
  - **Save Changes Function**: Clears edit flags and updates original state to current values when saving
  - **Cancel Changes Function**: Reverts all items to original state and closes any open dialogs
  - **Edit Detection Logic**: Added `hasEditedItems()` helper function to determine when Save/Cancel buttons should appear
  - **State Preservation**: Maintains original item values throughout session for accurate reversion capability
  - **User Experience Enhancement**: Provides clear feedback when changes are made and allows users to save or discard modifications

### Changed
- Dashboard: Updated module card title from "Store Requisition" to "SR Approval" for better clarity and consistency
- Good Receive Note (GRN): Enhanced delivery date filter from simple select to sophisticated dropdown with calendar picker
- Good Receive Note (GRN): Improved PO selection with multi-criteria search (PO number, product name, vendor)
- Good Receive Note (GRN): Updated filtering logic to handle both single dates and date ranges
- Good Receive Note (GRN): Enhanced UI with professional calendar integration and smart display text
- Good Receive Note (GRN): Improved business unit selection flow with search functionality and detailed information
- Store Requisition detail page: Added `ml-auto` to the Detail button to create space between "On Order" and "Detail" buttons
- Store Requisition detail page: Updated approved quantity input and unit selector to use small (sm) size with reduced padding and font size
- Store Requisition detail page: Changed "From" label to "Store Name" and "To" label to "Request from" for clearer inventory movement visualization
- Store Requisition detail page: Removed approved quantity controls from the approval modal to streamline the approval workflow
- Updated all occurrences of "Transaction Analytics Dimensions" to "Business Dimensions" across all documentation
- Fixed hydration issues in ThemeToggle component by implementing a mounted state check with placeholder content

### Fixed
- **Fixed "Continue to GRN Creation" button in scan PO flow**: Resolved navigation issue where the select-location page was not properly handling scanned PO data, causing the "Continue to GRN Creation" button to fail. Updated the page to correctly parse `poData` parameter and navigate to GRN detail with proper parameters for both scanned PO and traditional flows.
- **Fixed URI malformed error in scan PO flow**: Resolved `URIError: URI malformed` error when passing complex PO data between pages. Replaced `encodeURIComponent`/`decodeURIComponent` with base64 encoding (`btoa`/`atob`) to safely handle special characters in PO descriptions and other data fields. Added fallback decoding for backward compatibility.
- **Fixed InvalidCharacterError in base64 decoding**: Resolved `InvalidCharacterError: Failed to execute 'atob'` error by implementing proper URL encoding of base64 data and robust decoding logic that handles both URL-encoded base64 and direct base64 strings. Added intelligent detection of data format and multiple fallback strategies.
- **Fixed Turbopack module resolution error**: Resolved `Cannot find module '../chunks/ssr/[turbopack]_runtime.js'` error by adding alternative webpack-based development script (`npm run dev:webpack`). This provides a fallback when Turbopack encounters module resolution issues in development mode.
- **Standardized GRN creation forms**: Unified the Create GRN form interface between New GRN flow and Scan PO flow to ensure consistent user experience. Both flows now display identical PO information, location details, and form structure. Updated parameter handling to use consistent URL format (multiple `po` parameters) for both traditional and scan flows.
- **Fixed remaining URI encoding issues in scan flow**: Resolved additional `URIError: URI malformed` error in the scan PO location selection flow by ensuring all PO data encoding uses the standardized base64 + URL encoding method consistently across all navigation paths.
- **Implemented location-based item filtering in GRN creation**: Fixed critical issue where all PO items were showing in GRN creation regardless of selected locations. Now only items from selected store locations appear in the Create GRN form, ensuring accurate receiving workflow for both traditional and scan PO flows.
- **Fixed item count calculations in location selection**: Corrected item summary calculations in select-grn-locations page that were using non-existent `po.itemCount` field and incorrectly summing quantities instead of counting items. Now accurately displays item counts for both individual locations and total selections.
- **Unified GRN creation interface between scan PO and New GRN flows**: Updated scan PO flow to use the same `select-grn-locations` page as the New GRN flow, ensuring consistent user experience. Both flows now use identical location selection interface with detailed PO information, item counts by location, and standardized navigation parameters. Eliminated the separate `select-location` page to maintain single source of truth for location selection functionality.
- **Simplified GRN detail form interface**: Removed Signature and Extra Cost tabs from the GRN detail form to streamline the user experience. The form now focuses on the core functionality with Items, Summary, and Attachments tabs only, reducing complexity and improving usability.
- **Enhanced unit selection in GRN items**: Updated GRN detail form to provide separate unit dropdowns for both "Received Qty" and "FOC Qty" inputs. Each quantity input now has its own dedicated unit selector, allowing for more flexible receiving scenarios where different units may be used for received quantities versus free-of-charge quantities.
- **Updated project documentation**: Revised Functional Requirements Document (FRD) and Content Specification Document to reflect all recent GRN interface changes, including removal of Signature and Extra Cost tabs, enhanced unit selection, location-based item organization, and unified workflow consistency between scan PO and New GRN flows.
- Resolved React hydration mismatch error in the ThemeToggle component
- Completed thorough documentation updates in FRD, PRD, and Content Specification to maintain alignment with UI implementation
- Resolved infinite re-render loop in select-grn-locations page
- Fixed linter errors related to unused imports and type conflicts
- Corrected URL parameter parsing for PO ID handling

## [0.1.0] - 2023-06-15

### Added
- Initial project setup with Next.js
- Authentication flow
- Dashboard layout
- Responsive mobile-first design
- Receiving module (PO, GRN)
- PR Approval module
- Store Requisition module
- Theme toggle with light/dark mode support

## [2024-12-19] - Enhanced GRN Location-Based Receiving 