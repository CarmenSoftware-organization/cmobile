# TASK-PC-001: Implement Physical Count Sessions

## Overview
Implement comprehensive physical count session management functionality including session creation, location-based counting, progress tracking, and multi-location session support for the Carmen Supply Chain Mobile Application.

## Priority
**High** - Core inventory management functionality

## Estimated Effort
**10-15 hours**

## Dependencies
- TASK-AUTH-001: Core Authentication Service
- TASK-UI-001: Core UI Components
- TASK-NAV-001: Mobile Navigation

## Requirements

### Functional Requirements
Based on [Physical Count Module](../modules/physical-count.md) and [Physical Count API](../api/physical-count-api.md):

1. **Session Management**
   - Create new physical count sessions
   - Multi-location counting sessions
   - Period-based inventory cycles
   - Session status tracking (Draft, In Progress, Review, Completed)
   - Progress monitoring with real-time updates

2. **Location-Based Counting**
   - Location type classification (Count, Not Count)
   - Business unit filtering and selection
   - Location-specific item management
   - Multi-location session support
   - Location hierarchy navigation

3. **Session Configuration**
   - Counting period selection
   - Location selection and filtering
   - User assignment and permissions
   - Count type configuration (Full, Partial, Spot)
   - Scheduling and deadline management

4. **Progress Tracking**
   - Real-time progress monitoring
   - Item count completion tracking
   - Variance detection and alerts
   - Accuracy rate calculations
   - Session completion metrics

5. **Mobile-Optimized Interface**
   - Touch-friendly session management
   - Responsive design for various screen sizes
   - Offline session data access
   - Quick session actions and navigation

### Technical Requirements

1. **Component Structure**
   ```
   src/app/(mobile)/physical-count/
   ├── page.tsx                           # Main physical count dashboard
   ├── sessions/page.tsx                  # Session list view
   ├── session/[sessionId]/page.tsx       # Session overview
   ├── session/[sessionId]/count/page.tsx # Counting interface
   └── session/[sessionId]/review/page.tsx # Review and approval
   ```

2. **Data Models**
   ```typescript
   interface PhysicalCountSession {
     id: string;
     name: string;
     description?: string;
     status: 'draft' | 'in-progress' | 'review' | 'completed' | 'cancelled';
     type: 'scheduled' | 'ad-hoc' | 'cycle';
     period: CountingPeriod;
     locations: CountLocation[];
     progress: SessionProgress;
     assignedUsers: User[];
     createdBy: User;
     createdAt: string;
     startedAt?: string;
     completedAt?: string;
     deadline?: string;
   }

   interface CountLocation {
     id: string;
     name: string;
     type: 'storage' | 'production' | 'retail';
     businessUnit: BusinessUnit;
     countType: 'count' | 'not-count';
     itemCount: number;
     countedItems: number;
     varianceItems: number;
     status: 'pending' | 'in-progress' | 'completed';
   }

   interface SessionProgress {
     totalItems: number;
     countedItems: number;
     percentage: number;
     varianceItems: number;
     accuracyRate: number;
     estimatedCompletion?: string;
   }
   ```

3. **State Management**
   - Session state management with React hooks
   - Real-time progress updates
   - Offline session data caching
   - Optimistic updates for user actions

## Implementation Details

### Core Components

#### 1. Session List Component
```typescript
// src/components/physical-count/SessionList.tsx
interface SessionListProps {
  sessions: PhysicalCountSession[];
  onSessionSelect: (session: PhysicalCountSession) => void;
  onCreateSession: () => void;
  filters: SessionFilters;
  onFiltersChange: (filters: SessionFilters) => void;
}

export function SessionList({ 
  sessions, 
  onSessionSelect, 
  onCreateSession,
  filters,
  onFiltersChange 
}: SessionListProps) {
  // Implementation with filtering, sorting, and search
}
```

#### 2. Session Card Component
```typescript
// src/components/physical-count/SessionCard.tsx
interface SessionCardProps {
  session: PhysicalCountSession;
  onSelect: () => void;
  onQuickAction?: (action: string) => void;
}

export function SessionCard({ session, onSelect, onQuickAction }: SessionCardProps) {
  return (
    <Card className="p-4 space-y-3 touch-manipulation">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{session.name}</h3>
          <p className="text-sm text-gray-600">{session.description}</p>
        </div>
        <Badge variant={getStatusVariant(session.status)}>
          {session.status}
        </Badge>
      </div>
      
      <SessionProgress progress={session.progress} />
      
      <div className="flex justify-between items-center text-sm">
        <span>{session.locations.length} locations</span>
        <span>{session.assignedUsers.length} users</span>
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onSelect()}
        >
          View Details
        </Button>
        {session.status === 'draft' && (
          <Button 
            size="sm" 
            onClick={() => onQuickAction?.('start')}
          >
            Start Count
          </Button>
        )}
      </div>
    </Card>
  );
}
```

#### 3. Session Creation Component
```typescript
// src/components/physical-count/SessionCreation.tsx
interface SessionCreationProps {
  onSessionCreate: (session: Partial<PhysicalCountSession>) => void;
  onCancel: () => void;
  businessUnits: BusinessUnit[];
  locations: Location[];
}

export function SessionCreation({ 
  onSessionCreate, 
  onCancel, 
  businessUnits, 
  locations 
}: SessionCreationProps) {
  const [formData, setFormData] = useState<SessionFormData>({});
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Session Name
          </label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Enter session name"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Counting Period
          </label>
          <Select 
            value={formData.periodId}
            onValueChange={(value) => setFormData({...formData, periodId: value})}
          >
            {/* Period options */}
          </Select>
        </div>
        
        <LocationSelector
          locations={locations}
          selectedLocations={formData.locations}
          onLocationsChange={(locations) => setFormData({...formData, locations})}
        />
        
        <UserAssignment
          users={availableUsers}
          assignedUsers={formData.assignedUsers}
          onUsersChange={(users) => setFormData({...formData, assignedUsers: users})}
        />
      </div>
      
      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Create Session
        </Button>
      </div>
    </form>
  );
}
```

#### 4. Session Progress Component
```typescript
// src/components/physical-count/SessionProgress.tsx
interface SessionProgressProps {
  progress: SessionProgress;
  showDetails?: boolean;
}

export function SessionProgress({ progress, showDetails = false }: SessionProgressProps) {
  const progressPercentage = (progress.countedItems / progress.totalItems) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Progress</span>
        <span>{progress.countedItems} / {progress.totalItems} items</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
      {showDetails && (
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Accuracy Rate</span>
            <div className="font-semibold">{progress.accuracyRate}%</div>
          </div>
          <div>
            <span className="text-gray-600">Variance Items</span>
            <div className="font-semibold">{progress.varianceItems}</div>
          </div>
        </div>
      )}
    </div>
  );
}
```

### Page Implementations

#### 1. Physical Count Dashboard
```typescript
// src/app/(mobile)/physical-count/page.tsx
export default function PhysicalCountDashboard() {
  const { sessions, loading } = usePhysicalCountSessions();
  const activeSessions = sessions.filter(s => s.status === 'in-progress');
  const recentSessions = sessions.slice(0, 5);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Physical Count</h1>
        <Button onClick={() => router.push('/physical-count/sessions/new')}>
          New Session
        </Button>
      </div>
      
      <PhysicalCountStats sessions={sessions} />
      
      {activeSessions.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3">Active Sessions</h2>
          <div className="space-y-3">
            {activeSessions.map(session => (
              <SessionCard 
                key={session.id}
                session={session}
                onSelect={() => router.push(`/physical-count/session/${session.id}`)}
                onQuickAction={handleQuickAction}
              />
            ))}
          </div>
        </section>
      )}
      
      <section>
        <h2 className="text-lg font-semibold mb-3">Recent Sessions</h2>
        <SessionList 
          sessions={recentSessions}
          onSessionSelect={handleSessionSelect}
          onCreateSession={() => router.push('/physical-count/sessions/new')}
        />
      </section>
    </div>
  );
}
```

#### 2. Session List Page
```typescript
// src/app/(mobile)/physical-count/sessions/page.tsx
export default function SessionsPage() {
  const [filters, setFilters] = useState<SessionFilters>({});
  const { sessions, loading, error } = usePhysicalCountSessions(filters);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Count Sessions</h1>
        <Button onClick={() => router.push('/physical-count/sessions/new')}>
          New Session
        </Button>
      </div>
      
      <SessionFilters 
        filters={filters}
        onFiltersChange={setFilters}
      />
      
      {loading ? (
        <LoadingIndicator />
      ) : error ? (
        <ErrorMessage error={error} />
      ) : (
        <SessionList 
          sessions={sessions}
          onSessionSelect={handleSessionSelect}
          onCreateSession={() => router.push('/physical-count/sessions/new')}
          filters={filters}
          onFiltersChange={setFilters}
        />
      )}
    </div>
  );
}
```

#### 3. Session Detail Page
```typescript
// src/app/(mobile)/physical-count/session/[sessionId]/page.tsx
export default function SessionDetailPage({ params }: { params: { sessionId: string } }) {
  const { session, loading, error } = usePhysicalCountSession(params.sessionId);
  
  if (loading) return <LoadingIndicator />;
  if (error) return <ErrorMessage error={error} />;
  if (!session) return <NotFound />;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-bold">{session.name}</h1>
          <p className="text-gray-600">{session.description}</p>
        </div>
        <Badge variant={getStatusVariant(session.status)}>
          {session.status}
        </Badge>
      </div>
      
      <SessionProgress progress={session.progress} showDetails />
      
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Locations</h3>
          <div className="text-2xl font-bold">{session.locations.length}</div>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Assigned Users</h3>
          <div className="text-2xl font-bold">{session.assignedUsers.length}</div>
        </Card>
      </div>
      
      <LocationList 
        locations={session.locations}
        onLocationSelect={handleLocationSelect}
      />
      
      <div className="flex gap-3">
        {session.status === 'draft' && (
          <Button onClick={() => handleStartSession(session.id)}>
            Start Session
          </Button>
        )}
        {session.status === 'in-progress' && (
          <Button onClick={() => router.push(`/physical-count/session/${session.id}/count`)}>
            Continue Counting
          </Button>
        )}
        {session.status === 'review' && (
          <Button onClick={() => router.push(`/physical-count/session/${session.id}/review`)}>
            Review Results
          </Button>
        )}
      </div>
    </div>
  );
}
```

### API Integration

#### 1. Physical Count Service
```typescript
// src/lib/services/physicalCountService.ts
export class PhysicalCountService {
  async getSessions(filters: SessionFilters): Promise<SessionListResponse> {
    // GET /api/v1/physical-count/sessions
  }

  async getSession(id: string): Promise<PhysicalCountSession> {
    // GET /api/v1/physical-count/sessions/{id}
  }

  async createSession(session: CreateSessionRequest): Promise<PhysicalCountSession> {
    // POST /api/v1/physical-count/sessions
  }

  async updateSession(id: string, updates: Partial<PhysicalCountSession>): Promise<PhysicalCountSession> {
    // PUT /api/v1/physical-count/sessions/{id}
  }

  async startSession(id: string): Promise<void> {
    // POST /api/v1/physical-count/sessions/{id}/start
  }

  async completeSession(id: string): Promise<void> {
    // POST /api/v1/physical-count/sessions/{id}/complete
  }
}
```

#### 2. Data Fetching Hooks
```typescript
// src/hooks/usePhysicalCountSessions.ts
export function usePhysicalCountSessions(filters?: SessionFilters) {
  const [sessions, setSessions] = useState<PhysicalCountSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await physicalCountService.getSessions(filters);
      setSessions(response.sessions);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return { sessions, loading, error, refetch: fetchSessions };
}

// src/hooks/usePhysicalCountSession.ts
export function usePhysicalCountSession(sessionId: string) {
  // Single session fetching with real-time updates
}
```

## Testing Requirements

### Unit Tests
```typescript
describe('Physical Count Sessions', () => {
  describe('SessionList Component', () => {
    test('should render session list correctly')
    test('should handle session filtering')
    test('should support session selection')
    test('should show correct progress indicators')
  })

  describe('SessionCard Component', () => {
    test('should display session information correctly')
    test('should show appropriate action buttons')
    test('should handle quick actions')
  })

  describe('SessionCreation Component', () => {
    test('should validate required fields')
    test('should handle location selection')
    test('should handle user assignment')
  })
})
```

### Integration Tests
```typescript
describe('Physical Count Integration', () => {
  test('should create new session successfully')
  test('should start session and update status')
  test('should track progress correctly')
  test('should handle session completion')
})
```

## Acceptance Criteria

### Core Functionality
- [ ] Create new physical count sessions with location and user assignment
- [ ] View list of sessions with filtering and search capabilities
- [ ] Track session progress in real-time
- [ ] Support multi-location counting sessions
- [ ] Manage session status transitions (Draft → In Progress → Review → Completed)

### Mobile Experience
- [ ] Responsive design optimized for mobile devices
- [ ] Touch-friendly interface with appropriate touch targets
- [ ] Offline access to session data
- [ ] Quick actions for common operations
- [ ] Smooth navigation between session views

### Performance
- [ ] Fast loading of session lists and details
- [ ] Real-time progress updates
- [ ] Efficient filtering and search
- [ ] Proper caching for offline access

## Implementation Steps

1. **Setup Component Structure**
2. **Implement Core Components**
3. **Add API Integration**
4. **Implement Mobile Optimization**
5. **Add Real-time Updates**
6. **Testing Implementation**
7. **Documentation and Polish**

## Related Tasks
- TASK-PC-002: Counting Interface (follows this task)
- TASK-PC-003: Variance Analysis (integrates with this task)
- TASK-API-003: Physical Count API Integration (parallel task)

## Notes
- Focus on mobile-first design and offline capabilities
- Implement real-time progress tracking
- Consider multi-user collaboration scenarios
- Plan for integration with counting interface