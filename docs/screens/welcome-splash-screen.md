# Welcome/Splash Screen Specification
## Carmen Supply Chain Mobile App

### Document Information
- **Screen Type**: Welcome/Splash Screen
- **Screen ID**: AUTH-001
- **Module**: Authentication & Session Management
- **Priority**: High
- **Version**: 1.0
- **Date**: January 2025

---

## 1. Screen Overview

### 1.1 Purpose
The Welcome/Splash Screen serves as the initial entry point for the Carmen Supply Chain Mobile App, providing:
- Brand introduction and recognition
- App loading and initialization
- User onboarding preparation
- System status communication
- Professional first impression for hospitality users

### 1.2 User Context
**Target Users:**
- First-time app users
- Returning users during app launch
- Users experiencing app updates

**Usage Scenarios:**
- Initial app installation and first launch
- Daily app opening by hotel staff
- App updates requiring re-initialization
- System maintenance or connectivity checks

---

## 2. Brand Identity & Visual Design

### 2.1 Carmen Software Branding

**Primary Brand Elements:**
- **Carmen Software Logo**: Prominently displayed, high-resolution vector format
- **Brand Colors**:
  - Primary Blue: `#1E40AF` (Carmen corporate blue)
  - Secondary Blue: `#3B82F6` (lighter accent)
  - White: `#FFFFFF` (background and text)
  - Gray: `#6B7280` (secondary text)
- **Typography**: 
  - Primary: Roboto Bold for headlines
  - Secondary: Roboto Regular for body text
  - Size hierarchy optimized for mobile screens

**Logo Specifications:**
- Minimum size: 120px width on mobile
- Optimal size: 200px width for standard phones
- Format: SVG for scalability, PNG fallback
- Positioning: Centered horizontally, upper-third vertically
- Clear space: Minimum 24px on all sides

### 2.2 Supply Chain Context

**Industry-Specific Elements:**
- Hospitality iconography (subtle background elements)
- Professional color scheme suitable for hotel environments
- Clean, modern design reflecting operational efficiency
- Trust indicators for enterprise software

**Visual Hierarchy:**
1. Carmen Software Logo (primary focus)
2. App name "Supply Chain Mobile"
3. Tagline "Hospitality Operations Excellence"
4. Loading indicator
5. Version/status information

---

## 3. Screen Layout & Components

### 3.1 Layout Structure

**Screen Dimensions:**
- Design for: 375px × 812px (iPhone X/11/12 standard)
- Responsive scaling for: 320px-428px width range
- Support for: 18:9, 19.5:9, 20:9 aspect ratios

**Layout Grid:**
- Container: Full screen with safe area insets
- Margin: 24px horizontal, safe area vertical
- Component spacing: 16px vertical rhythm
- Alignment: Center-aligned content

### 3.2 Component Breakdown

**Header Section (Top Third)**
```
┌─────────────────────────────────┐
│                                 │
│         [Carmen Logo]           │
│                                 │
│     Supply Chain Mobile        │
│                                 │
└─────────────────────────────────┘
```

**Middle Section (Center)**
```
┌─────────────────────────────────┐
│                                 │
│    "Hospitality Operations      │
│         Excellence"             │
│                                 │
│     [Loading Indicator]         │
│                                 │
└─────────────────────────────────┘
```

**Footer Section (Bottom)**
```
┌─────────────────────────────────┐
│                                 │
│      Powered by Carmen          │
│         Version 2.0             │
│                                 │
└─────────────────────────────────┘
```

### 3.3 Detailed Component Specifications

**Carmen Logo Component:**
- Position: Center, 120px from top (safe area)
- Size: 200px width × auto height
- Animation: Fade-in (0.5s delay, 0.8s duration)
- Accessibility: Alt text "Carmen Software Logo"

**App Title Component:**
- Text: "Supply Chain Mobile"
- Font: Roboto Bold, 28px
- Color: `#1E40AF` (Primary Blue)
- Position: 24px below logo
- Animation: Slide-up (1.0s delay, 0.6s duration)

**Tagline Component:**
- Text: "Hospitality Operations Excellence"
- Font: Roboto Regular, 16px
- Color: `#6B7280` (Gray)
- Position: 16px below app title
- Animation: Fade-in (1.3s delay, 0.6s duration)

**Loading Indicator Component:**
- Type: Circular progress indicator
- Size: 48px diameter
- Color: `#3B82F6` (Secondary Blue)
- Position: Center screen, 40px below tagline
- Animation: Continuous rotation
- Accessibility: "Loading application" announcement

**Footer Information:**
- "Powered by Carmen" - Roboto Regular, 12px, `#6B7280`
- "Version 2.0" - Roboto Regular, 12px, `#6B7280`
- Position: 40px from bottom (safe area)
- Alignment: Center

---

## 4. Animations & Transitions

### 4.1 Entry Animations

**Sequence Timeline:**
```
0.0s  - Screen appears with background color
0.5s  - Logo fades in (0.8s duration)
1.0s  - App title slides up (0.6s duration)
1.3s  - Tagline fades in (0.6s duration)
1.6s  - Loading indicator appears
2.0s  - Footer information fades in (0.4s duration)
```

**Animation Specifications:**
- **Easing**: `cubic-bezier(0.4, 0.0, 0.2, 1)` (Material Design standard)
- **Performance**: Hardware-accelerated transforms
- **Accessibility**: Respect "Reduce Motion" system preference
- **Fallback**: Instant display if animations disabled

### 4.2 Loading States

**Loading Indicator Behavior:**
- Continuous rotation at 360°/2s
- Smooth animation without frame drops
- Opacity changes based on network status
- Color intensity reflects loading progress

**Progress Communication:**
- 0-25%: Initial app loading
- 26-50%: Authentication check
- 51-75%: Data synchronization
- 76-100%: Final initialization

### 4.3 Exit Transitions

**Transition to Login:**
- Logo scales down and fades (0.4s)
- Background crossfade to login screen (0.6s)
- Maintain brand color continuity

**Transition to Dashboard:**
- Quick fade-out (0.3s) for returning users
- Maintain loading indicator during transition

---

## 5. Functionality & Behavior

### 5.1 Initialization Tasks

**System Checks (Parallel Execution):**
1. **Network Connectivity**: Verify internet connection
2. **Authentication Status**: Check existing valid tokens
3. **App Version**: Verify latest version compatibility
4. **Business Unit Data**: Sync BU assignments
5. **Permissions**: Validate camera, location, storage access
6. **Security**: Verify device integrity and app signature

**Loading Sequence:**
```
Start → Background Tasks → Status Evaluation → Route Decision
                                                      ↓
                              [New User → Onboarding]
                              [Existing User → Dashboard]
                              [Auth Expired → Login]
                              [Update Required → Update Screen]
```

### 5.2 Decision Logic

**Routing Conditions:**
- **First Launch**: Terms/Privacy → Account Setup
- **Valid Session**: Direct to Dashboard
- **Expired Session**: Login Screen
- **Network Issues**: Offline Mode
- **App Update**: Update Required Screen
- **Maintenance**: Maintenance Mode Screen

**Timeout Handling:**
- Maximum splash duration: 5 seconds
- Fallback to login screen after timeout
- Error logging for debugging
- Graceful degradation for slow networks

### 5.3 Error States

**Network Connectivity Issues:**
- Display: "Checking connection..." under loading indicator
- Retry mechanism: Automatic retry every 2 seconds (max 3 attempts)
- Fallback: Proceed to offline mode or login

**Authentication Failures:**
- Log security events for audit
- Clear invalid tokens
- Route to fresh login screen
- Display appropriate error messaging

**System Errors:**
- Log crash reports and errors
- Display generic "Please try again" message
- Provide support contact information
- Enable crash reporting for diagnostics

---

## 6. Technical Specifications

### 6.1 Performance Requirements

**Loading Time Targets:**
- Cold start: < 3 seconds
- Warm start: < 1.5 seconds
- Hot start: < 0.5 seconds

**Memory Usage:**
- Peak memory: < 50MB during splash
- Image optimization: WebP with PNG fallback
- Asset preloading: Essential assets only

**Battery Optimization:**
- CPU usage: Minimal during splash
- Network requests: Batched and prioritized
- Screen brightness: Respect system settings

### 6.2 Asset Management

**Image Assets:**
- **Logo**: SVG primary, PNG @1x, @2x, @3x fallbacks
- **Background**: Solid color (no image) for performance
- **Icons**: System loading indicators preferred
- **Total Size**: < 2MB for all splash assets

**Localization Support:**
- Text externalized for i18n
- Right-to-left (RTL) layout support
- Dynamic text sizing for translations
- Font loading optimization

### 6.3 Platform Considerations

**iOS Specific:**
- Launch Screen storyboard integration
- Safe area inset handling
- Dark mode support
- Dynamic Type support

**Android Specific:**
- Splash theme integration
- Navigation bar handling
- Multiple screen density support
- Material Design compliance

**Cross-Platform:**
- React Native compatibility
- Consistent timing across platforms
- Platform-specific asset optimization

---

## 7. Accessibility Requirements

### 7.1 WCAG AA Compliance

**Visual Accessibility:**
- **Color Contrast**: 7:1 ratio for logo on background
- **Text Contrast**: 4.5:1 minimum for all text
- **Color Independence**: No color-only information
- **High Contrast Mode**: System setting respect

**Motor Accessibility:**
- **Touch Targets**: N/A (no interactive elements)
- **Gesture Requirements**: N/A (view-only screen)
- **Timeout Accommodation**: Extended time for slow connections

### 7.2 Screen Reader Support

**Content Structure:**
```
Screen Reader Sequence:
1. "Carmen Supply Chain Mobile App"
2. "Hospitality Operations Excellence"
3. "Loading application"
4. "Powered by Carmen, Version 2.0"
```

**Announcements:**
- Initial: "Carmen Supply Chain Mobile App loading"
- Progress: "Loading..." with progress percentage if available
- Completion: "App loaded successfully" before transition

### 7.3 Reduced Motion Support

**Animation Alternatives:**
- Instant display of all elements
- Static loading indicator (opacity changes only)
- Immediate transitions (no fades or slides)
- Maintain visual hierarchy without movement

---

## 8. Content Strategy

### 8.1 Messaging Framework

**Primary Message**: "Professional supply chain management"
**Secondary Message**: "Built for hospitality excellence"
**Brand Promise**: "Reliable, accurate, compliant"

**Tone of Voice:**
- Professional yet approachable
- Confident and reliable
- Industry-specific but not jargony
- Efficient and time-conscious

### 8.2 Tagline Options

**Current**: "Hospitality Operations Excellence"
**Alternatives**:
- "Supply Chain Simplified"
- "Operational Excellence, Mobile First"
- "Your Supply Chain, Streamlined"
- "Hospitality. Simplified. Mobile."

### 8.3 Localization Considerations

**Text Length Variations:**
- English: Base length
- Spanish: +20% length allowance
- French: +25% length allowance
- German: +35% length allowance

**Cultural Adaptations:**
- Color preferences by region
- Logo positioning preferences
- Reading pattern considerations

---

## 9. Quality Assurance

### 9.1 Testing Scenarios

**Device Testing Matrix:**
- iPhone SE (smaller screen)
- iPhone 12 Pro (standard)
- iPhone 12 Pro Max (larger screen)
- iPad (tablet mode)
- Android phones (various manufacturers)
- Android tablets

**Network Conditions:**
- WiFi (fast connection)
- 4G/LTE (standard mobile)
- 3G (slow mobile)
- Offline (no connection)
- Intermittent connection

**System Configurations:**
- Dark mode enabled/disabled
- Reduce motion enabled/disabled
- High contrast enabled/disabled
- Various text size settings
- Different language settings

### 9.2 Acceptance Criteria

**Visual Quality:**
- [ ] Logo displays clearly at all screen sizes
- [ ] Text remains readable at all zoom levels
- [ ] Colors match brand guidelines exactly
- [ ] Animations are smooth (60fps target)
- [ ] Loading indicator rotates smoothly

**Functionality:**
- [ ] Splash duration stays within 3-5 second range
- [ ] Proper routing to next screen based on user state
- [ ] Error handling works for all failure scenarios
- [ ] Accessibility features function correctly
- [ ] Performance targets met on target devices

**Cross-Platform:**
- [ ] Identical appearance on iOS and Android
- [ ] Consistent timing across platforms
- [ ] Proper handling of platform-specific UI elements
- [ ] Responsive design works on all target devices

---

## 10. Implementation Notes

### 10.1 Development Guidelines

**Code Structure:**
```
/screens/welcome/
  ├── WelcomeScreen.tsx (main component)
  ├── components/
  │   ├── CarmenLogo.tsx
  │   ├── AppTitle.tsx
  │   ├── TagLine.tsx
  │   ├── LoadingIndicator.tsx
  │   └── FooterInfo.tsx
  ├── animations/
  │   ├── entryAnimations.ts
  │   └── exitAnimations.ts
  ├── assets/
  │   ├── carmen-logo.svg
  │   ├── carmen-logo@2x.png
  │   └── carmen-logo@3x.png
  └── styles/
      └── WelcomeScreen.styles.ts
```

**Key Dependencies:**
- React Native Reanimated 3.x for animations
- React Native SVG for logo rendering
- AsyncStorage for state management
- NetInfo for connectivity checking

### 10.2 Configuration Options

**Customizable Elements:**
- Splash duration (default: 3-5 seconds)
- Animation timing (configurable per element)
- Tagline text (environment-specific)
- Logo variant (different hotels/brands)
- Color scheme (light/dark mode)

**Feature Flags:**
- `ENABLE_SPLASH_ANIMATIONS`: Animation toggle
- `SPLASH_TIMEOUT_MS`: Maximum display time
- `SHOW_VERSION_INFO`: Footer information display
- `ENABLE_PROGRESS_TRACKING`: Loading progress display

---

## 11. Maintenance & Updates

### 11.1 Regular Review Items

**Quarterly Reviews:**
- Brand compliance verification
- Performance metrics analysis
- User feedback incorporation
- Device compatibility updates

**Annual Reviews:**
- Complete design refresh consideration
- Accessibility standard updates
- Platform guideline compliance
- Brand evolution integration

### 11.2 Version History

**Version 1.0** (Current)
- Initial implementation with Carmen branding
- Basic loading and routing functionality
- Full accessibility compliance
- Cross-platform consistency

**Planned Updates:**
- Version 1.1: Enhanced loading progress tracking
- Version 1.2: Personalized welcome messages
- Version 2.0: Advanced branding customization

---

## 12. Success Metrics

### 12.1 User Experience Metrics

**Performance KPIs:**
- Average splash duration: < 4 seconds
- User drop-off rate: < 2% during splash
- Animation smoothness: 95% at 60fps
- Error rate: < 0.1% of launches

**User Satisfaction:**
- Professional appearance rating: > 4.5/5
- Brand recognition: > 90% after 1 week
- Loading satisfaction: > 85% positive
- Overall first impression: > 4.7/5

### 12.2 Technical Metrics

**Performance Monitoring:**
- Cold start time tracking
- Memory usage monitoring
- Battery impact measurement
- Network usage optimization

**Error Tracking:**
- Crash rate during splash: < 0.01%
- Network timeout rate: < 5%
- Asset loading failures: < 1%
- Platform-specific issues: < 2%

---

This comprehensive specification ensures the Welcome/Splash Screen serves as an effective brand introduction while maintaining optimal performance and accessibility for all users of the Carmen Supply Chain Mobile App. 