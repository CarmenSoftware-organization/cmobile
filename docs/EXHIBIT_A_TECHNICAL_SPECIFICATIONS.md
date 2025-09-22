# EXHIBIT A: DETAILED TECHNICAL SPECIFICATIONS

**Carmen Supply Chain Mobile App Development Agreement**

---

## 1. MOBILE APPLICATION ARCHITECTURE

### 1.1 Technology Stack Requirements
**Primary Option: Flutter (Recommended)**
- **Framework**: Flutter 3.16+ with Dart 3.0+
- **State Management**: Riverpod 2.4+ or Provider 6.0+
- **Local Database**: SQLite with Floor 1.4+ or Drift 2.13+
- **HTTP Client**: Dio 5.3+ for API integration
- **Authentication**: flutter_secure_storage for token management
- **Navigation**: go_router 10.0+ for type-safe routing
- **UI Components**: Material 3 design system

**Alternative Option: React Native**
- **Framework**: React Native 0.72+ with TypeScript 5.0+
- **State Management**: Redux Toolkit 1.9+ or Zustand 4.4+
- **Local Database**: SQLite with react-native-sqlite-storage
- **HTTP Client**: Axios 1.5+ for API integration
- **Authentication**: react-native-keychain for secure storage
- **Navigation**: React Navigation 6.0+ with TypeScript
- **UI Components**: React Native Elements or NativeBase

### 1.2 Development Environment Requirements
- **Minimum System**: macOS 12+ for iOS development, Windows 10+ or Linux for Android
- **IDE**: Android Studio with Flutter/React Native plugins, or VS Code with extensions
- **Version Control**: Git with semantic versioning
- **CI/CD**: GitHub Actions or GitLab CI for automated builds
- **Testing Framework**: Flutter Test/Jest with minimum 80% code coverage
- **Code Quality**: ESLint/Dart Analyzer with project-specific rules

### 1.3 Architecture Patterns
- **Pattern**: Clean Architecture with Repository pattern
- **Dependency Injection**: GetIt (Flutter) or React Navigation DI
- **Error Handling**: Centralized error handling with user-friendly messages
- **Logging**: Structured logging with log levels (debug, info, warn, error)
- **Performance**: Lazy loading, image caching, and memory optimization

---

## 2. PLATFORM COMPATIBILITY SPECIFICATIONS

### 2.1 iOS Requirements
- **Minimum Version**: iOS 12.0+ (Flutter) / iOS 11.0+ (React Native)
- **Target Devices**: iPhone 6s and newer, iPad (6th generation) and newer
- **Screen Sizes**: 4.7" to 6.7" phones, 7.9" to 12.9" tablets
- **Orientation**: Portrait primary, landscape supported
- **iOS Features**: Face ID/Touch ID, Core Spotlight, iOS Share Sheet
- **App Store**: Ready for submission with proper provisioning profiles

### 2.2 Android Requirements
- **Minimum API**: Android 5.0 (API level 21)
- **Target API**: Latest stable Android API (33+)
- **Screen Densities**: mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi
- **Hardware**: ARM64, ARMv7, x86_64 architectures
- **Android Features**: Biometric authentication, Android Share Intent
- **Google Play**: Ready for submission with proper signing certificates

### 2.3 Cross-Platform Considerations
- **Code Sharing**: 90%+ shared business logic between platforms
- **Platform-Specific**: Native implementations for biometric auth, camera
- **Performance**: 60fps target with smooth animations
- **Memory**: Maximum 150MB RAM usage under normal operations
- **Battery**: Optimized for minimal battery drain during background operations

---

## 3. FEATURE SPECIFICATIONS

### 3.1 Authentication System
**3.1.1 Login Methods**
- Email/password with form validation
- Two-factor authentication (SMS, Email, TOTP)
- Biometric authentication (Face ID, Touch ID, Fingerprint)
- Business unit selection with role-based access
- Remember me functionality with secure token storage

**3.1.2 Security Implementation**
- JWT token management with automatic refresh
- Certificate pinning for API calls
- Secure storage using device keychain/keystore
- Session timeout with configurable duration
- Offline authentication with cached credentials

### 3.2 Dashboard Module
**3.2.1 Real-Time Data Display**
- Priority actions section with actionable counts
- Operations overview with pending items
- Quality control status indicators
- Real-time updates via WebSocket or polling
- Pull-to-refresh functionality

**3.2.2 Navigation Integration**
- Quick access to key modules
- Search functionality across all data
- Notification center integration
- User profile access
- Settings and preferences

### 3.3 Receiving Module (GRN Processing)
**3.3.1 Purchase Order Management**
- PO search with multiple filter criteria
- Barcode/QR code scanning for PO lookup
- Detailed PO view with item breakdown
- Vendor information and contact details
- PO status tracking and updates

**3.3.2 GRN Creation and Processing**
- Step-by-step GRN creation workflow
- Item-by-item receiving with quantity validation
- Photo capture for damaged or discrepant items
- Batch number and expiry date capture
- Digital signature capture for receipt confirmation
- Draft saving with auto-sync when online

**3.3.3 Advanced Search and Filtering**
- Multi-criteria search (PO number, vendor, date range, status)
- Advanced filtering with date pickers
- Search history and saved searches
- Export functionality for search results
- Real-time search suggestions

### 3.4 Purchase Request Approval Workflow
**3.4.1 Multi-Stage Approval System**
- 5-stage approval workflow (Requestor → HOD → Finance → Purchasing → Complete)
- Role-based approval permissions
- Bulk approval capabilities for multiple PRs
- Approval delegation when users are unavailable
- Approval history and audit trail

**3.4.2 Request Management**
- PR creation with item details and justification
- Budget validation and spend analysis
- Vendor recommendation system
- Priority level assignment
- Comments and approval notes

### 3.5 Store Requisition Management
**3.5.1 Requisition Creation**
- Item search and selection from inventory
- Quantity specification with unit validation
- Department and cost center assignment
- Priority level and urgency indicators
- Approval routing based on request value

**3.5.2 Fulfillment Tracking**
- Real-time status updates
- Partial fulfillment handling
- Item substitution management
- Delivery scheduling and tracking
- Receipt confirmation workflow

### 3.6 Inventory Management System
**3.6.1 Physical Count Module**
- Count session creation and management
- Location-based counting with GPS validation
- Barcode scanning for item identification
- Variance detection and reconciliation
- Count team assignment and progress tracking

**3.6.2 Spot Check Module**
- Random location selection algorithms
- Item sampling strategies
- Quality assessment workflows
- Non-conformance reporting
- Corrective action tracking

**3.6.3 Stock Take Comprehensive**
- Full inventory audit capabilities
- Cycle counting schedule management
- ABC analysis integration
- Stock movement tracking
- Inventory valuation reporting

---

## 4. DATA MANAGEMENT SPECIFICATIONS

### 4.1 Local Data Storage
**4.1.1 Database Schema**
- SQLite database with normalized tables
- Offline-first architecture with sync capabilities
- Data compression for large datasets
- Automatic backup and recovery mechanisms
- Database migration strategies for updates

**4.1.2 Data Models**
```
Core Entities:
- Users (authentication, roles, permissions)
- BusinessUnits (locations, currencies, settings)
- PurchaseOrders (header, items, vendor details)
- GRNs (receipt records, signatures, photos)
- PurchaseRequests (approval workflow, items)
- StoreRequisitions (requests, fulfillment)
- InventoryItems (products, locations, quantities)
- Vendors (supplier information, contacts)
- Locations (warehouses, storage areas)
- Approvals (workflow state, history)
```

### 4.2 Synchronization Strategy
**4.2.1 Offline Capabilities**
- Complete offline functionality for all core features
- Data queuing for actions performed offline
- Conflict resolution for concurrent edits
- Intelligent sync prioritization
- Background sync with progress indicators

**4.2.2 Data Conflict Resolution**
- Last-write-wins for simple conflicts
- User-mediated resolution for complex conflicts
- Automatic merge for non-conflicting changes
- Conflict notification and resolution UI
- Audit trail for all conflict resolutions

---

## 5. USER INTERFACE SPECIFICATIONS

### 5.1 Design System Implementation
**5.1.1 Visual Design Standards**
- Material Design 3 (Android) / Human Interface Guidelines (iOS)
- Consistent color palette with brand alignment
- Typography scale with accessibility compliance
- Icon system with consistent styling
- Component library with reusable elements

**5.1.2 Responsive Design**
- Mobile-first design approach
- Adaptive layouts for different screen sizes
- Touch-friendly interface with minimum 44px touch targets
- Gesture support (swipe, long press, pinch)
- Landscape mode support for all screens

### 5.2 Navigation Architecture
**5.2.1 Navigation Patterns**
- Bottom tab navigation for primary sections
- Stack navigation for detail screens
- Modal presentation for forms and workflows
- Deep linking support for notifications
- Back button handling consistent with platform conventions

**5.2.2 Information Architecture**
- Logical grouping of related functionality
- Progressive disclosure for complex data
- Search-driven navigation
- Contextual actions and shortcuts
- Breadcrumb navigation for deep hierarchies

---

## 6. PERFORMANCE SPECIFICATIONS

### 6.1 Performance Benchmarks
- **App Launch Time**: Cold start <3 seconds, warm start <1 second
- **Screen Transitions**: <300ms transition animations
- **Data Loading**: Initial data load <2 seconds, subsequent loads <1 second
- **Memory Usage**: <150MB average, <200MB peak
- **Battery Usage**: <2% per hour of active use
- **Network Usage**: Optimized API calls with request batching

### 6.2 Optimization Strategies
**6.2.1 Code Optimization**
- Tree shaking for unused code elimination
- Code splitting for feature-based loading
- Image optimization with multiple resolutions
- Asset bundling and compression
- Lazy loading for non-critical components

**6.2.2 Runtime Optimization**
- Efficient state management with minimal re-renders
- Database query optimization with indexing
- Image caching with LRU eviction policy
- Background task optimization
- Memory leak prevention and monitoring

---

## 7. SECURITY SPECIFICATIONS

### 7.1 Data Security
**7.1.1 Encryption Standards**
- AES-256 encryption for local data storage
- TLS 1.3 for all network communications
- Certificate pinning for API endpoints
- Secure key derivation using PBKDF2
- Biometric authentication with secure enclave

**7.1.2 Authentication Security**
- JWT token validation with signature verification
- Token expiration handling with automatic refresh
- Secure token storage in device keychain
- Biometric fallback to PIN/password
- Session management with secure logout

### 7.2 Application Security
**7.2.1 Runtime Protection**
- Code obfuscation to prevent reverse engineering
- Root/jailbreak detection with appropriate responses
- Debug detection and anti-tampering measures
- SSL pinning with fallback strategies
- Input validation and sanitization

**7.2.2 Privacy Protection**
- Minimal data collection with user consent
- Data retention policies with automatic cleanup
- User data export capabilities
- Privacy-compliant analytics implementation
- Secure handling of sensitive information

---

## 8. TESTING SPECIFICATIONS

### 8.1 Automated Testing Requirements
**8.1.1 Unit Testing**
- Minimum 80% code coverage for business logic
- Test coverage for all data models and services
- Mock implementations for external dependencies
- Automated test execution in CI/CD pipeline
- Performance regression testing

**8.1.2 Integration Testing**
- API integration testing with mock servers
- Database integration testing
- Authentication flow testing
- Offline/online synchronization testing
- Cross-platform compatibility testing

### 8.2 Manual Testing Requirements
**8.2.1 User Acceptance Testing**
- End-to-end workflow testing
- Usability testing on target devices
- Accessibility testing with assistive technologies
- Performance testing under various conditions
- Security penetration testing

**8.2.2 Device Testing Matrix**
- Testing on minimum 5 iOS devices (iPhone 8, X, 12, 13, 14)
- Testing on minimum 5 Android devices (various OEMs, API levels)
- Tablet testing for both platforms
- Different screen sizes and resolutions
- Various network conditions (WiFi, 4G, 3G, offline)

---

## 9. DEPLOYMENT SPECIFICATIONS

### 9.1 Build Configuration
**9.1.1 Release Builds**
- Production-ready builds with optimizations enabled
- Code signing with proper certificates
- App store compliance with guidelines
- Automated build generation via CI/CD
- Version management with semantic versioning

**9.1.2 Distribution Preparation**
- iOS: IPA file ready for App Store Connect
- Android: AAB file ready for Google Play Console
- Proper app metadata and descriptions
- Screenshot generation for store listings
- Privacy policy and terms of service integration

### 9.2 Monitoring and Analytics
**9.2.1 Application Monitoring**
- Crash reporting with detailed stack traces
- Performance monitoring with key metrics
- User analytics with privacy compliance
- Network monitoring and error tracking
- Custom event tracking for business metrics

**9.2.2 Maintenance Support**
- 90-day warranty period for bug fixes
- Performance issue resolution
- Store submission support
- Documentation for maintenance procedures
- Knowledge transfer for ongoing development

---

This technical specification ensures comprehensive coverage of all development aspects while maintaining alignment with the Next.js prototype requirements and mobile platform best practices.