# EXHIBIT F: MOBILE PLATFORM GUIDELINES AND APP STORE REQUIREMENTS

**Carmen Supply Chain Mobile App Development Agreement**

---

## 1. PLATFORM COMPLIANCE OVERVIEW

### 1.1 Platform Standards Adherence
The mobile application must strictly adhere to all official platform guidelines and requirements:
- **iOS Human Interface Guidelines**: Complete compliance with Apple's design and interaction standards
- **Android Material Design Guidelines**: Full adherence to Google's Material Design principles
- **App Store Review Guidelines**: Compliance with iOS App Store submission requirements
- **Google Play Developer Policy**: Compliance with Google Play Store publishing requirements
- **Platform-Specific APIs**: Proper usage of platform-native APIs and capabilities
- **Security Standards**: Implementation of platform-recommended security practices

### 1.2 Cross-Platform Consistency Requirements
While respecting platform conventions, the application must maintain:
- **Brand Consistency**: Uniform brand identity across both platforms
- **Functional Parity**: Identical feature set and capabilities on both platforms
- **Data Synchronization**: Seamless data sharing between iOS and Android versions
- **User Experience Coherence**: Consistent user workflows adapted to platform conventions
- **Performance Standards**: Equivalent performance benchmarks across platforms
- **Update Coordination**: Synchronized release schedules for both platforms

---

## 2. IOS PLATFORM REQUIREMENTS

### 2.1 iOS Human Interface Guidelines Compliance
**2.1.1 Visual Design Standards**
- **Typography**: San Francisco system font with appropriate type scales
- **Color System**: iOS-appropriate color usage with support for light/dark modes
- **Layout**: Proper use of iOS layout guides and safe areas
- **Iconography**: SF Symbols usage where appropriate, custom icons following iOS style
- **Navigation**: iOS-standard navigation patterns (tab bars, navigation bars, modal presentation)
- **Control Elements**: Native iOS controls (buttons, switches, pickers, sliders)

**2.1.2 Interaction Design Standards**
- **Touch Targets**: Minimum 44x44 points for all interactive elements
- **Gestures**: Standard iOS gestures (tap, swipe, pinch, drag, long press)
- **Haptic Feedback**: Appropriate use of haptic feedback for user actions
- **Animation**: iOS-standard animations and transitions (spring animations, ease curves)
- **State Changes**: Clear visual feedback for state changes and loading states
- **Error Handling**: iOS-appropriate error presentation and recovery mechanisms

### 2.2 iOS Technical Requirements
**2.2.1 System Integration**
- **iOS SDK**: Latest stable iOS SDK with backward compatibility to iOS 12.0+
- **Architecture Support**: ARM64 architecture with Universal Binary support
- **Device Support**: iPhone 6s and newer, iPad (6th generation) and newer
- **Orientation Support**: Portrait primary with landscape support where appropriate
- **Multitasking**: Proper background execution and state preservation
- **Memory Management**: Efficient memory usage with proper lifecycle management

**2.2.2 iOS-Specific Features Implementation**
```
Required iOS Integrations:
✓ Face ID / Touch ID biometric authentication
✓ iOS Keychain for secure credential storage
✓ Core Spotlight integration for search
✓ iOS Share Sheet for content sharing
✓ Push Notifications with proper permission handling
✓ Camera integration with AVFoundation
✓ Core Location for location-based features
✓ Background App Refresh support
✓ Handoff support between devices (if applicable)
✓ Siri Shortcuts integration (recommended)
```

### 2.3 iOS App Store Submission Requirements
**2.3.1 App Store Connect Preparation**
- **App Metadata**: Complete app information, descriptions, keywords, and categories
- **Screenshots**: Required screenshots for all supported device sizes
- **App Preview Videos**: Optional but recommended app preview videos
- **App Store Optimization**: Keyword optimization and compelling app descriptions
- **Privacy Policy**: Comprehensive privacy policy meeting Apple requirements
- **Terms of Service**: Legal terms of service for business applications

**2.3.2 Technical Submission Requirements**
- **Code Signing**: Proper distribution certificates and provisioning profiles
- **App Binary**: Universal binary supporting all target devices and architectures
- **Info.plist Configuration**: Complete configuration with required permissions
- **Privacy Permissions**: Detailed usage descriptions for all requested permissions
- **Third-Party SDKs**: Documentation of all third-party libraries and their purposes
- **TestFlight Beta**: Beta testing program setup for pre-release validation

---

## 3. ANDROID PLATFORM REQUIREMENTS

### 3.1 Material Design Guidelines Compliance
**3.1.1 Visual Design Standards**
- **Typography**: Roboto font family with Material Design type scale
- **Color System**: Material Design color palette with support for themes
- **Layout**: Material Design layout principles with proper spacing and grid system
- **Components**: Material Design components (FAB, Cards, Bottom Sheets, etc.)
- **Iconography**: Material Design icons with consistent styling
- **Elevation and Shadows**: Proper use of Material Design elevation system

**3.1.2 Material Motion and Animation**
- **Transitions**: Standard Material Design transitions and shared element animations
- **Micro-interactions**: Appropriate use of Material Design micro-interactions
- **Loading States**: Material Design loading indicators and skeleton screens
- **Gesture Navigation**: Support for Android gesture navigation systems
- **Ripple Effects**: Touch feedback using Material Design ripple effects
- **State Animations**: Smooth state transitions following Material guidelines

### 3.2 Android Technical Requirements
**3.2.1 Platform Technical Standards**
- **Target SDK**: Latest stable Android API level with minimum API 21 (Android 5.0)
- **Architecture Support**: ARM64-v8a, armeabi-v7a, and x86_64 architectures
- **Screen Support**: All screen densities (mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi)
- **Form Factors**: Phone and tablet layouts with responsive design
- **Android Jetpack**: Utilization of Android Jetpack components where appropriate
- **Background Processing**: Proper use of background execution limits and WorkManager

**3.2.2 Android-Specific Features Implementation**
```
Required Android Integrations:
✓ Biometric authentication (fingerprint, face unlock)
✓ Android Keystore for secure credential storage
✓ Android Share Intent for content sharing
✓ Firebase Cloud Messaging for push notifications
✓ Camera2 API or CameraX for camera functionality
✓ Android Location Services
✓ Android Permissions model compliance
✓ Adaptive Icons with proper scaling
✓ Android Auto-Backup (if applicable)
✓ Android App Shortcuts (recommended)
```

### 3.3 Google Play Store Submission Requirements
**3.3.1 Google Play Console Preparation**
- **Store Listing**: Complete app information, descriptions, and categorization
- **Graphic Assets**: Feature graphic, screenshots, and promotional images
- **Content Rating**: Appropriate content rating through Google Play Console
- **Target Audience**: Proper audience targeting and age-appropriate design
- **App Content**: Detailed app content description and functionality explanation
- **Privacy Policy**: Google Play-compliant privacy policy with data handling disclosure

**3.3.2 Technical Publishing Requirements**
- **App Bundle**: Android App Bundle (AAB) format for optimized delivery
- **Signing**: App signing key management and Google Play App Signing
- **Permissions**: Minimal permission requests with clear justification
- **Target API Requirements**: Compliance with Google Play target API level requirements
- **Security Requirements**: No security vulnerabilities or malicious behavior
- **Performance Requirements**: Meeting Google Play performance and stability standards

---

## 4. CROSS-PLATFORM DEVELOPMENT STANDARDS

### 4.1 Platform-Agnostic Architecture
**4.1.1 Shared Business Logic**
- **Code Reusability**: Maximum code sharing for business logic and data management
- **Platform Abstraction**: Clean separation between platform-specific and shared code
- **Dependency Injection**: Platform-appropriate dependency injection patterns
- **State Management**: Consistent state management approach across platforms
- **API Integration**: Shared API client with platform-specific optimizations
- **Data Models**: Common data models with platform-specific serialization

**4.1.2 Platform-Specific Implementations**
- **UI Components**: Platform-native UI components following respective design guidelines
- **Navigation**: Platform-appropriate navigation patterns and stack management
- **Platform Services**: Native integration with platform-specific services
- **Performance Optimization**: Platform-specific performance optimizations
- **Security Implementation**: Platform-native security features and keychain integration
- **Device Features**: Native camera, location, and sensor integrations

### 4.2 Quality Assurance Standards
**4.2.1 Cross-Platform Testing**
- **Feature Parity Testing**: Verification of identical functionality across platforms
- **UI Consistency Testing**: Platform-appropriate UI implementation verification
- **Performance Comparison**: Equivalent performance benchmarks on both platforms
- **Security Validation**: Platform-specific security implementation testing
- **Integration Testing**: Platform service integration testing
- **User Experience Testing**: Platform-appropriate UX pattern validation

**4.2.2 Platform-Specific Quality Gates**
```
iOS Quality Gates:
✓ Human Interface Guidelines compliance verification
✓ App Store Review Guidelines adherence
✓ iOS-specific feature integration testing
✓ iPhone and iPad layout validation
✓ iOS accessibility standards compliance
✓ Performance on iOS devices validation

Android Quality Gates:
✓ Material Design Guidelines compliance verification
✓ Google Play Developer Policy adherence
✓ Android-specific feature integration testing
✓ Phone and tablet layout validation
✓ Android accessibility standards compliance
✓ Performance across Android device matrix
```

---

## 5. APP STORE OPTIMIZATION AND MARKETING

### 5.1 App Store Optimization (ASO)
**5.1.1 Metadata Optimization**
- **App Title**: Compelling and keyword-optimized app titles for both stores
- **App Description**: Detailed feature descriptions with strategic keyword placement
- **Keywords**: Research-based keyword strategy for iOS App Store optimization
- **Categories**: Appropriate primary and secondary category selection
- **Developer Information**: Professional developer profile and company information
- **Update Notes**: Clear and informative release notes for each version

**5.1.2 Visual Asset Optimization**
- **App Icon**: Professional, recognizable app icon following platform guidelines
- **Screenshots**: High-quality screenshots showcasing key features and workflows
- **App Preview Videos**: Engaging preview videos demonstrating core functionality
- **Feature Graphics**: Eye-catching feature graphics for Google Play Store
- **Promotional Assets**: Additional promotional materials for featured placement
- **Localization**: Localized assets for target markets (if applicable)

### 5.2 App Store Compliance and Approval
**5.2.1 Content and Policy Compliance**
- **Content Guidelines**: Compliance with platform content policies and restrictions
- **Age Appropriateness**: Proper age rating and content suitable for business users
- **Intellectual Property**: Respect for intellectual property rights and proper attribution
- **User-Generated Content**: Appropriate handling of user-generated content (if applicable)
- **Advertising**: Compliance with advertising policies (if ads are implemented)
- **In-App Purchases**: Proper implementation if subscription or purchase features added

**5.2.2 Technical Compliance Validation**
- **App Functionality**: Full functionality testing in production-like environment
- **Crash Prevention**: Comprehensive crash testing and error handling validation
- **Performance Standards**: Meeting platform performance requirements and guidelines
- **Security Validation**: Security implementation meeting platform standards
- **Privacy Compliance**: Privacy policy and data handling compliance verification
- **Accessibility Standards**: Platform accessibility requirement compliance

---

## 6. POST-LAUNCH PLATFORM REQUIREMENTS

### 6.1 Maintenance and Updates
**6.1.1 Platform Update Compliance**
- **OS Version Support**: Ongoing support for new OS versions and features
- **API Deprecation**: Timely updates for deprecated API replacements
- **Security Updates**: Prompt security patch implementation and deployment
- **Performance Optimization**: Ongoing performance improvements and optimizations
- **Bug Fixes**: Rapid response to critical bugs and user-reported issues
- **Feature Updates**: Regular feature updates maintaining platform compliance

**6.1.2 Store Guideline Evolution**
- **Guideline Monitoring**: Continuous monitoring of platform guideline changes
- **Policy Compliance**: Ongoing compliance with evolving store policies
- **Technical Requirements**: Adaptation to changing technical requirements
- **Privacy Regulations**: Compliance with evolving privacy and data protection regulations
- **Accessibility Updates**: Ongoing accessibility improvements and compliance
- **Performance Standards**: Meeting evolving platform performance expectations

### 6.2 Analytics and Performance Monitoring
**6.2.1 Platform-Specific Analytics**
- **iOS Analytics**: App Store Connect analytics and performance monitoring
- **Android Analytics**: Google Play Console analytics and crash reporting
- **Custom Analytics**: Privacy-compliant custom analytics implementation
- **Performance Monitoring**: Real-time app performance and crash monitoring
- **User Feedback**: Integration with platform feedback and review systems
- **A/B Testing**: Platform-appropriate A/B testing for feature optimization

**6.2.2 Continuous Improvement Process**
- **User Feedback Analysis**: Systematic analysis of user reviews and feedback
- **Performance Metrics**: Regular analysis of key performance indicators
- **Competitive Analysis**: Ongoing competitive analysis and feature gap assessment
- **Platform Best Practices**: Continuous adoption of platform best practices
- **User Experience Optimization**: Data-driven user experience improvements
- **Feature Roadmap**: Long-term feature planning aligned with platform evolution

---

## 7. COMPLIANCE DOCUMENTATION AND REPORTING

### 7.1 Platform Compliance Documentation
**7.1.1 Compliance Checklists**
- **iOS HIG Compliance Checklist**: Detailed checklist with verification evidence
- **Material Design Compliance Checklist**: Complete Material Design adherence verification
- **App Store Guideline Compliance**: Documentation of guideline compliance measures
- **Google Play Policy Compliance**: Verification of policy adherence throughout app
- **Accessibility Compliance**: Platform-specific accessibility standard compliance
- **Security Compliance**: Platform security requirement compliance documentation

**7.1.2 Technical Documentation**
- **Platform Architecture Documentation**: Technical architecture for each platform
- **API Integration Documentation**: Platform-specific API usage and integration
- **Performance Benchmarking**: Platform performance testing results and analysis
- **Security Implementation**: Platform security feature implementation documentation
- **Testing Coverage**: Platform-specific testing coverage and validation results
- **Deployment Procedures**: Platform-specific build and deployment documentation

### 7.2 Ongoing Compliance Reporting
**7.2.1 Regular Compliance Reviews**
- **Monthly Compliance Assessment**: Regular review of platform guideline adherence
- **Platform Update Impact Analysis**: Assessment of platform updates on app compliance
- **User Feedback Compliance Review**: Analysis of user feedback for compliance issues
- **Performance Monitoring Reports**: Regular performance and compliance reporting
- **Security Audit Reports**: Periodic security compliance and vulnerability assessments
- **Accessibility Audit Reports**: Regular accessibility compliance reviews and improvements

**7.2.2 Compliance Improvement Process**
- **Issue Identification**: Systematic identification of compliance gaps or issues
- **Improvement Planning**: Strategic planning for compliance improvements
- **Implementation Tracking**: Progress tracking for compliance improvement initiatives
- **Validation and Testing**: Comprehensive testing of compliance improvements
- **Documentation Updates**: Continuous update of compliance documentation
- **Best Practice Adoption**: Ongoing adoption of platform best practices and recommendations

---

This exhibit ensures comprehensive platform compliance while maintaining the highest standards for mobile application development and app store submission across both iOS and Android platforms.