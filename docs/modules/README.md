# Carmen Supply Chain Mobile App - Module Documentation

## Overview
This directory contains comprehensive documentation for all modules in the Carmen Supply Chain Mobile Application. Each module is documented with its purpose, structure, key features, and integration points.

## Application Architecture
The Carmen Supply Chain Mobile App is built using Next.js with a mobile-first approach, featuring a modular architecture that separates concerns into distinct, well-defined modules.

### Technology Stack
- **Framework**: Next.js 15+ with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **State Management**: React hooks and context
- **Mobile Optimization**: PWA-ready with responsive design

## Module Overview

### 1. [Authentication Module](./authentication.md)
**Location**: `src/lib/auth.ts`, `src/app/(auth)/`

Comprehensive user authentication and session management system featuring:
- Email/password login with 2FA support
- Session management with automatic expiration
- Account lockout protection
- Business unit selection and context
- Role-based access control

**Key Features**:
- Singleton AuthService pattern
- Token-based authentication
- Multi-business unit support
- Security features (account lockout, session timeout)

### 2. [Workflow Management Module](./workflow-management.md)
**Location**: `src/lib/workflow.ts`, `src/app/(mobile)/pr-approval/`

Document approval workflow system for purchase requests and other business processes:
- Multi-stage approval process
- Role-based permissions
- Document status management
- Workflow configuration and validation

**Key Features**:
- Configurable workflow stages
- Role-based permissions matrix
- Status transition validation
- Approval process automation

### 3. [Mobile Navigation Module](./mobile-navigation.md)
**Location**: `src/app/(mobile)/layout.tsx`, `src/components/ui/appbar.tsx`

Mobile-optimized navigation system with bottom tab navigation and app bar:
- Fixed bottom navigation with 5 main tabs
- Dynamic app bar with contextual titles
- Touch-optimized design
- Route-based active state management

**Key Features**:
- Bottom tab navigation
- Dynamic title generation
- Mobile-first responsive design
- Accessibility compliance

### 4. [Receiving Management Module](./receiving-management.md)
**Location**: `src/app/(mobile)/receiving/`, `src/components/forms/GRNForm.tsx`

Complete goods receiving process management:
- Purchase order management and tracking
- GRN (Goods Receipt Note) creation and processing
- Barcode scanning for quick PO lookup
- Advanced search and filtering capabilities

**Key Features**:
- Multi-mode GRN forms (create, view, edit)
- QR code scanning integration
- Advanced search and filtering
- Business unit context support

### 5. [UI Components Module](./ui-components.md)
**Location**: `src/components/ui/`, `src/components/forms/`, `src/components/screens/`

Comprehensive set of reusable, accessible UI components:
- Core UI components (Button, Input, Card, Badge, Dialog)
- Navigation components (AppBar, Tabs, Dropdown)
- Data display components (Loading, Calendar, File attachments)
- Theme system with dark/light mode support

**Key Features**:
- Accessibility-first design
- Mobile-optimized touch targets
- Consistent design system
- Theme provider integration

### 6. [Dashboard Module](./dashboard.md)
**Location**: `src/app/(mobile)/dashboard/page.tsx`

Central hub providing overview and quick access to key features:
- Priority actions section for urgent tasks
- Operations section for core business functions
- Quality control section for compliance activities
- Real-time count displays and status updates

**Key Features**:
- Grid-based mobile layout
- Real-time data integration
- Quick navigation to all modules
- Priority-based task organization

### 7. [Physical Count Module](./physical-count.md)
**Location**: `src/app/(mobile)/physical-count/`, `src/mock/physicalCountData.ts`

Comprehensive inventory counting system for complete location-based stock verification:
- Session management with progress tracking
- Location-based counting with business unit filtering
- Advanced counting interface with calculator and barcode scanning
- Variance analysis with accuracy metrics
- Photo evidence and notes support

**Key Features**:
- Multi-location counting sessions
- Real-time variance calculation
- Mobile-optimized counting interface
- Offline counting capabilities

### 8. [Stock Take Module](./stock-take.md)
**Location**: `src/app/(mobile)/stock-take/page.tsx`

Central hub for inventory counting operations providing method selection:
- Physical Count option for comprehensive verification
- Spot Check option for targeted quality assurance
- User-friendly selection interface
- Navigation hub for counting operations

**Key Features**:
- Method selection interface
- Clear operational guidance
- Touch-optimized design
- Integrated navigation

### 9. [Spot Check Module](./spot-check.md)
**Location**: `src/app/(mobile)/spot-check/`, `src/mock/spotCheckData.ts`

Targeted inventory verification for quality assurance and compliance:
- Flexible selection methods (Random, Manual, High Value, Category-based)
- Quick verification process with streamlined interface
- Location-based operations with business unit context
- Compliance tracking with audit trail

**Key Features**:
- Multiple selection algorithms
- Rapid verification workflow
- Compliance documentation
- Risk-based targeting

### 10. [Purchase Request (PR) Approval Module](./pr-approval.md)
**Location**: `src/app/(mobile)/pr-approval/`, `src/lib/workflow.ts`

Comprehensive workflow management system for purchase request approvals:
- Multi-stage approval workflow (Draft → HOD → Finance → Purchasing → Approved)
- Role-based access control with permission matrix
- Item-level management with vendor price comparisons
- Multi-currency support with exchange rate handling
- Business dimension tracking and audit trail

**Key Features**:
- Advanced workflow engine
- Item-level approval control
- Vendor price comparison
- Multi-currency support
- Comprehensive audit trail

### 11. [Store Requisition (SR) Module](./store-requisition.md)
**Location**: `src/app/(mobile)/store-requisition/`, `src/lib/workflow.ts`

Internal inventory request management between departments and storage locations:
- Simplified approval workflow (Draft → Dept Review → Store Review → Approved → Issued)
- Business dimension tracking (Project Code, Market Segment, Event, Job Code)
- Real-time inventory availability checking
- Item requisition with purpose classification
- Store operations integration

**Key Features**:
- Internal transfer management
- Business dimension tracking
- Real-time stock checking
- Purpose-based classification
- Store operations integration

### 12. [Notifications Module](./notifications.md)
**Location**: `src/app/(mobile)/notifications/page.tsx`, `src/lib/notifications.ts`

Comprehensive notification management system for real-time alerts and communications:
- Multiple notification types (Inventory, System, User, Success, Warning, Error)
- Priority-based organization (High, Medium, Low)
- Advanced filtering and search capabilities
- Action-oriented design with direct navigation
- Real-time updates with badge counters

**Key Features**:
- Real-time notification delivery
- Priority-based management
- Advanced filtering system
- Action-oriented navigation
- Subscription-based updates

### 13. [Profile Management Module](./profile-management.md)
**Location**: `src/app/(mobile)/profile/`

Comprehensive user profile management with role and permission display:
- Personal information display and editing
- Role and permission management
- Business unit assignments and approval limits
- System preferences and notification settings
- Security and audit trail

**Key Features**:
- Comprehensive profile display
- Secure profile editing
- Role and permission overview
- System preference management
- Security and audit features

### 14. [Welcome & Onboarding Module](./welcome-onboarding.md)
**Location**: `src/app/welcome/`, `src/app/onboarding/`, `src/components/screens/welcome-screen.tsx`

Sophisticated welcome experience and structured onboarding for new users:
- Multi-phase loading with system status checking
- Brand presentation with Carmen logo and animations
- Structured onboarding process (Terms, Account Setup, Business Unit Assignment)
- System validation and error handling
- Responsive design with accessibility support

**Key Features**:
- Multi-phase loading system
- System status validation
- Structured onboarding workflow
- Brand presentation
- Error handling and recovery

### 15. [Theme System Module](./theme-system.md)
**Location**: `src/lib/theme.ts`, `src/components/ui/theme-provider.tsx`, `src/components/ui/theme-toggle.tsx`

Comprehensive theming system with brand colors, typography, and dark/light mode support:
- Brand color system (Carmen Blue, Carmen Amber, Status Colors)
- Dark/light mode with automatic detection and manual toggle
- Typography system with Geist fonts
- Animation system with consistent timing
- CSS variable system for dynamic theming

**Key Features**:
- Brand color management
- Dark/light mode support
- Typography system
- Animation framework
- Accessibility compliance

## Module Relationships

### Core Dependencies
```
Authentication Module
├── Provides user context to all modules
├── Manages business unit selection
└── Handles session management

Mobile Navigation Module
├── Integrates with Authentication for user context
├── Provides navigation framework for all modules
└── Manages route-based state

UI Components Module
├── Used by all modules for consistent design
├── Integrates with theme system
└── Provides accessibility features

Workflow Management Module
├── Depends on Authentication for user roles
├── Uses UI Components for status display
└── Integrates with business modules

Receiving Management Module
├── Uses Authentication for business unit context
├── Leverages UI Components for forms and display
├── Integrates with Workflow for approval processes
└── Uses Mobile Navigation for routing

Dashboard Module
├── Aggregates data from all operational modules
├── Uses UI Components for display
├── Integrates with Mobile Navigation
└── Respects Authentication context

Physical Count Module
├── Uses Authentication for business unit context
├── Leverages UI Components for counting interface
├── Integrates with Workflow for approval processes
├── Uses Mobile Navigation for routing
└── Connects with Stock Take for method selection

Stock Take Module
├── Provides navigation hub for counting operations
├── Routes to Physical Count and Spot Check modules
├── Uses UI Components for selection interface
├── Integrates with Mobile Navigation
└── Respects Authentication context

Spot Check Module
├── Uses Authentication for business unit context
├── Leverages UI Components for verification interface
├── Integrates with Workflow for compliance processes
├── Uses Mobile Navigation for routing
└── Connects with Stock Take for method selection

Purchase Request (PR) Approval Module
├── Core integration with Workflow Management for approval engine
├── Uses Authentication for role-based permissions and user context
├── Leverages UI Components for complex approval interfaces
├── Integrates with Mobile Navigation for routing
├── Connects with Receiving for PO conversion
└── Uses Dashboard for priority action display

Store Requisition (SR) Module
├── Uses Workflow Management for approval processes
├── Integrates with Authentication for user and department context
├── Leverages UI Components for requisition interfaces
├── Uses Mobile Navigation for routing
├── Connects with inventory systems for stock checking
└── Links with Dashboard for requisition count display

Notifications Module
├── Integrates with all modules for notification generation
├── Uses Authentication for user context and permissions
├── Leverages UI Components for notification display
├── Connects with Mobile Navigation for app bar badge
├── Links with Dashboard for priority alerts
└── Provides real-time updates across all modules

Profile Management Module
├── Core integration with Authentication for user data
├── Uses Notifications for profile change alerts
├── Leverages UI Components for profile interfaces
├── Integrates with Mobile Navigation for profile access
├── Connects with Workflow for role and permission display
└── Links with Theme System for preference management

Welcome & Onboarding Module
├── Entry point integration with Authentication
├── Uses Theme System for brand presentation
├── Leverages UI Components for onboarding interfaces
├── Connects with Mobile Navigation for initial routing
├── Integrates with all modules for system validation
└── Provides foundation for user experience

Theme System Module
├── Foundation for all UI Components styling
├── Integrates with Mobile Navigation for theme toggle
├── Supports Welcome & Onboarding brand presentation
├── Connects with Profile Management for preferences
├── Provides consistent styling across all modules
└── Ensures accessibility compliance throughout app
```

### Data Flow
1. **Authentication** → Provides user context and business unit selection
2. **Mobile Navigation** → Manages routing and active states
3. **Dashboard** → Aggregates data and provides central access
4. **Business Modules** → Handle specific operations (Receiving, Workflow)
5. **UI Components** → Provide consistent interface across all modules

## Development Guidelines

### Module Structure
Each module follows a consistent structure:
- **Primary module file**: Core logic and functionality
- **Component files**: UI components specific to the module
- **Type definitions**: TypeScript interfaces and types
- **Mock data**: Development and testing data
- **Integration points**: Clear interfaces with other modules

### Code Organization
```
src/
├── app/                    # Next.js app router pages
│   ├── (auth)/            # Authentication pages
│   ├── (mobile)/          # Mobile app pages
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # Core UI components
│   ├── forms/            # Form components
│   └── screens/          # Screen-specific components
├── lib/                  # Core utilities and services
│   ├── auth.ts           # Authentication service
│   ├── workflow.ts       # Workflow management
│   └── utils.ts          # Utility functions
├── data/                 # Mock data and constants
└── mock/                 # Additional mock data
```

### Best Practices
1. **Separation of Concerns**: Each module has a single responsibility
2. **Type Safety**: Full TypeScript coverage with strict typing
3. **Accessibility**: WCAG 2.1 AA compliance
4. **Mobile First**: Responsive design with mobile optimization
5. **Performance**: Optimized for mobile devices and slow networks
6. **Testing**: Comprehensive test coverage for all modules
7. **Documentation**: Clear documentation for all public APIs

## Integration Testing

### Module Integration Points
- Authentication with all modules for user context
- Navigation with all pages for routing
- UI Components with all modules for consistent design
- Workflow with business modules for approval processes
- Dashboard with all modules for data aggregation

### Testing Strategy
1. **Unit Tests**: Individual module functionality
2. **Integration Tests**: Module interaction testing
3. **E2E Tests**: Complete user workflow testing
4. **Accessibility Tests**: WCAG compliance validation
5. **Performance Tests**: Mobile performance optimization

## Deployment Considerations

### Build Optimization
- Tree shaking for unused code elimination
- Code splitting for optimal loading
- Asset optimization for mobile networks
- Progressive Web App (PWA) features

### Environment Configuration
- Development, staging, and production environments
- Environment-specific configuration
- Feature flags for gradual rollouts
- Monitoring and analytics integration

## Future Roadmap

### Planned Enhancements
1. **Real-time Features**: WebSocket integration for live updates
2. **Offline Support**: Enhanced offline capabilities with sync
3. **Advanced Analytics**: Business intelligence and reporting
4. **AI Integration**: Smart suggestions and automation
5. **Extended Workflows**: Additional business process support

### Scalability Considerations
- Microservice architecture preparation
- API gateway integration
- Database optimization
- Caching strategies
- Load balancing support

## Getting Started

### For Developers
1. Review the module documentation for your area of work
2. Understand the integration points with other modules
3. Follow the established patterns and conventions
4. Ensure proper testing coverage
5. Update documentation for any changes

### For Architects
1. Review the overall module structure and relationships
2. Understand the data flow and dependencies
3. Plan for future enhancements and scalability
4. Ensure security and performance requirements are met
5. Maintain architectural consistency across modules

### For Product Owners
1. Understand the feature capabilities of each module
2. Review the user workflows and experience
3. Plan feature enhancements within module boundaries
4. Ensure business requirements are properly addressed
5. Coordinate cross-module feature development