# TASK-PR-001: Implement Purchase Request Viewing

## Overview
Implement purchase request viewing and approval functionality for the Carmen Supply Chain Mobile Application. Users can view, approve/reject, and track existing purchase requests created in the web application, but cannot create new purchase requests on mobile.

## Priority
**Medium** - Approval workflow functionality

## Estimated Effort
**6-8 hours**

## Dependencies
- TASK-AUTH-001: Core Authentication Service
- TASK-UI-001: Core UI Components
- TASK-NAV-001: Mobile Navigation
- TASK-SR-001: Store Requisition Viewing (similar patterns)

## Requirements

### Functional Requirements
Based on [PR Approval Module](../modules/pr-approval.md) - View/Approve Only:

1. **Purchase Request Listing**
   - Display paginated list of purchase requests
   - Filter by status (pending, approved, rejected, completed)
   - Filter by business unit, department, and requester
   - Sort by date, priority, amount, and status
   - Search by PR number, vendor, or description

2. **Purchase Request Detail View**
   - Comprehensive PR information display
   - Item-level details with specifications and justifications
   - Vendor information and quotations
   - Budget impact and approval limits
   - Approval workflow progress and history

3. **Multi-Level Approval Actions**
   - Approve/reject actions based on user authority level
   - Edit approval quantity/unit for pending items
   - Edit issue quantity/unit for pending items
   - Add approval comments and conditions
   - Escalation to higher approval levels
   - Conditional approval with quantity modifications
   - Budget validation and alerts

4. **Workflow Tracking**
   - Real-time approval workflow status
   - Multi-level approval progress tracking
   - Approval delegation and routing
   - History of all approval actions

5. **Mobile-Optimized Interface**
   - Touch-friendly approval interface
   - Responsive design for various screen sizes
   - Quick approval actions with confirmation
   - Offline viewing of cached requests

### Technical Requirements

1. **Component Structure**
   ```
   src/app/(mobile)/pr-approval/
   ├── page.tsx                    # Main PR dashboard
   ├── [id]/page.tsx              # Individual PR detail
   └── components/
       ├── PRList.tsx              # List view component
       ├── PRCard.tsx              # Card display component
       ├── PRDetail.tsx            # Detail view component
       ├── ApprovalWorkflow.tsx    # Workflow display
       └── PRApprovalActions.tsx   # Approval interface
   ```

2. **Data Models**
   ```typescript
   interface PurchaseRequest {
     id: string;
     prNumber: string;
     status: 'draft' | 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
     requester: User;
     department: Department;
     businessUnit: BusinessUnit;
     requestDate: string;
     requiredDate: string;
     priority: 'low' | 'medium' | 'high' | 'urgent';
     totalAmount: number;
     currency: string;
     justification: string;
     items: PRItem[];
     approvalWorkflow: ApprovalLevel[];
     currentApprovalLevel: number;
     budgetImpact: BudgetImpact;
   }

   interface PRItem {
     id: string;
     description: string;
     specification: string;
     requestedQuantity: number;
     requestedUnit: string;
     approvedQuantity?: number;
     approvedUnit?: string;
     issueQuantity?: number;
     issueUnit?: string;
     unitPrice: number;
     totalPrice: number;
     vendor?: Vendor;
     justification: string;
     category: string;
     status: 'pending' | 'approved' | 'rejected' | 'partial';
     isEditable: boolean; // true when status is pending
   }

   interface ApprovalLevel {
     level: number;
     approver: User;
     status: 'pending' | 'approved' | 'rejected' | 'skipped';
     comments?: string;
     approvedAmount?: number;
     approvalDate?: string;
     delegatedTo?: User;
   }

   interface BudgetImpact {
     budgetCode: string;
     availableBudget: number;
     requestedAmount: number;
     remainingBudget: number;
     exceedsBudget: boolean;
   }
   ```

## Implementation Details

### Core Components

#### 1. Purchase Request List Component
```typescript
// src/components/pr-approval/PRList.tsx
interface PRListProps {
  purchaseRequests: PurchaseRequest[];
  onPRSelect: (pr: PurchaseRequest) => void;
  filters: PRFilters;
  onFiltersChange: (filters: PRFilters) => void;
}

export function PRList({ 
  purchaseRequests, 
  onPRSelect, 
  filters, 
  onFiltersChange 
}: PRListProps) {
  return (
    <div className="space-y-4">
      <PRFilters 
        filters={filters}
        onFiltersChange={onFiltersChange}
      />
      
      <div className="space-y-3">
        {purchaseRequests.map(pr => (
          <PRCard
            key={pr.id}
            purchaseRequest={pr}
            onSelect={() => onPRSelect(pr)}
          />
        ))}
      </div>
    </div>
  );
}
```

#### 2. Purchase Request Detail Component
```typescript
// src/components/pr-approval/PRDetail.tsx
interface PRDetailProps {
  purchaseRequest: PurchaseRequest;
  userApprovalLevel: number | null;
  onApprove: (comments?: string, approvedAmount?: number) => void;
  onReject: (comments: string) => void;
  onDelegate: (delegateToUserId: string) => void;
}

export function PRDetail({ 
  purchaseRequest, 
  userApprovalLevel, 
  onApprove, 
  onReject, 
  onDelegate 
}: PRDetailProps) {
  const canApprove = userApprovalLevel === purchaseRequest.currentApprovalLevel;
  
  return (
    <div className="space-y-6">
      <PRHeader purchaseRequest={purchaseRequest} />
      <BudgetImpactDisplay budgetImpact={purchaseRequest.budgetImpact} />
      <PRItems items={purchaseRequest.items} />
      <ApprovalWorkflow 
        workflow={purchaseRequest.approvalWorkflow}
        currentLevel={purchaseRequest.currentApprovalLevel}
      />
      
      {canApprove && purchaseRequest.status === 'pending' && (
        <PRApprovalActions 
          purchaseRequest={purchaseRequest}
          onApprove={onApprove}
          onReject={onReject}
          onDelegate={onDelegate}
        />
      )}
    </div>
  );
}
```

#### 3. PR Approval Actions Component
```typescript
// src/components/pr-approval/PRApprovalActions.tsx
interface PRApprovalActionsProps {
  purchaseRequest: PurchaseRequest;
  onApprove: (comments?: string, approvedAmount?: number) => void;
  onReject: (comments: string) => void;
  onDelegate: (delegateToUserId: string) => void;
}

export function PRApprovalActions({ 
  purchaseRequest, 
  onApprove, 
  onReject, 
  onDelegate 
}: PRApprovalActionsProps) {
  const [action, setAction] = useState<'approve' | 'reject' | 'delegate' | null>(null);
  const [comments, setComments] = useState('');
  const [approvedAmount, setApprovedAmount] = useState(purchaseRequest.totalAmount);
  const [delegateToUser, setDelegateToUser] = useState('');

  const handleSubmit = () => {
    switch (action) {
      case 'approve':
        onApprove(comments || undefined, approvedAmount);
        break;
      case 'reject':
        onReject(comments);
        break;
      case 'delegate':
        onDelegate(delegateToUser);
        break;
    }
  };

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Approval Actions</h3>
      
      <div className="space-y-4">
        {/* Budget Alert */}
        {purchaseRequest.budgetImpact.exceedsBudget && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              ⚠️ This request exceeds available budget by {
                (purchaseRequest.totalAmount - purchaseRequest.budgetImpact.availableBudget).toLocaleString()
              } {purchaseRequest.currency}
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-3 gap-2">
          <Button 
            onClick={() => setAction('approve')}
            variant="default"
            size="sm"
          >
            Approve
          </Button>
          <Button 
            onClick={() => setAction('reject')}
            variant="destructive"
            size="sm"
          >
            Reject
          </Button>
          <Button 
            onClick={() => setAction('delegate')}
            variant="outline"
            size="sm"
          >
            Delegate
          </Button>
        </div>
        
        {action === 'approve' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                Approved Amount ({purchaseRequest.currency})
              </label>
              <input
                type="number"
                value={approvedAmount}
                onChange={(e) => setApprovedAmount(Number(e.target.value))}
                max={purchaseRequest.totalAmount}
                className="w-full p-2 border rounded-md"
              />
            </div>
            
            <textarea
              placeholder="Approval comments (optional)"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full p-3 border rounded-md"
              rows={3}
            />
          </div>
        )}
        
        {action === 'reject' && (
          <textarea
            placeholder="Rejection reason (required)"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="w-full p-3 border rounded-md"
            rows={3}
            required
          />
        )}
        
        {action === 'delegate' && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Delegate to User
            </label>
            <select
              value={delegateToUser}
              onChange={(e) => setDelegateToUser(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select user...</option>
              {/* User options */}
            </select>
          </div>
        )}
        
        {action && (
          <div className="flex gap-3">
            <Button onClick={() => setAction(null)} variant="outline">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={
                (action === 'reject' && !comments.trim()) ||
                (action === 'delegate' && !delegateToUser)
              }
            >
              Confirm {action.charAt(0).toUpperCase() + action.slice(1)}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
```

#### 4. Approval Workflow Component
```typescript
// src/components/pr-approval/ApprovalWorkflow.tsx
interface ApprovalWorkflowProps {
  workflow: ApprovalLevel[];
  currentLevel: number;
}

export function ApprovalWorkflow({ workflow, currentLevel }: ApprovalWorkflowProps) {
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Approval Workflow</h3>
      
      <div className="space-y-3">
        {workflow.map((level, index) => (
          <div 
            key={level.level}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg",
              level.level === currentLevel && "bg-blue-50 border border-blue-200",
              level.status === 'approved' && "bg-green-50 border border-green-200",
              level.status === 'rejected' && "bg-red-50 border border-red-200"
            )}
          >
            <div className="flex-shrink-0">
              {level.status === 'approved' && (
                <CheckCircle className="h-5 w-5 text-green-600" />
              )}
              {level.status === 'rejected' && (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              {level.status === 'pending' && level.level === currentLevel && (
                <Clock className="h-5 w-5 text-blue-600" />
              )}
              {level.status === 'pending' && level.level !== currentLevel && (
                <Circle className="h-5 w-5 text-gray-400" />
              )}
            </div>
            
            <div className="flex-1">
              <div className="font-medium">
                Level {level.level}: {level.approver.name}
              </div>
              <div className="text-sm text-gray-600">
                {level.approver.role} - {level.approver.department}
              </div>
              {level.comments && (
                <div className="text-sm text-gray-700 mt-1">
                  "{level.comments}"
                </div>
              )}
              {level.approvalDate && (
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(level.approvalDate).toLocaleDateString()}
                </div>
              )}
            </div>
            
            {level.approvedAmount && level.approvedAmount !== level.approvedAmount && (
              <div className="text-sm text-orange-600">
                Approved: {level.approvedAmount.toLocaleString()}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
```

### API Integration

#### 1. Purchase Request Service
```typescript
// src/lib/services/purchaseRequestService.ts
export class PurchaseRequestService {
  async getPurchaseRequests(filters: PRFilters): Promise<PRListResponse> {
    // GET /api/v1/purchase-requests
  }

  async getPurchaseRequest(id: string): Promise<PurchaseRequest> {
    // GET /api/v1/purchase-requests/{id}
  }

  async approve(id: string, comments?: string, approvedAmount?: number): Promise<void> {
    // POST /api/v1/purchase-requests/{id}/approve
  }

  async reject(id: string, comments: string): Promise<void> {
    // POST /api/v1/purchase-requests/{id}/reject
  }

  async delegate(id: string, delegateToUserId: string): Promise<void> {
    // POST /api/v1/purchase-requests/{id}/delegate
  }

  async getApprovalHistory(id: string): Promise<ApprovalLevel[]> {
    // GET /api/v1/purchase-requests/{id}/approval-history
  }
}
```

## Testing Requirements

### Unit Tests
```typescript
describe('Purchase Request Viewing', () => {
  describe('PRApprovalActions Component', () => {
    test('should handle approval with amount modification')
    test('should handle rejection with required comments')
    test('should handle delegation to another user')
    test('should show budget alerts for over-budget requests')
  })

  describe('ApprovalWorkflow Component', () => {
    test('should display workflow progress correctly')
    test('should highlight current approval level')
    test('should show approval history and comments')
  })
})
```

## Acceptance Criteria

### Core Functionality
- [ ] Display list of purchase requests with filtering and search
- [ ] View detailed PR information including budget impact
- [ ] Multi-level approval workflow with proper authorization
- [ ] Approve/reject/delegate actions with comments
- [ ] Budget validation and alerts for over-budget requests

### Approval Workflow
- [ ] Display approval workflow progress and history
- [ ] Support for partial amount approvals
- [ ] Delegation capabilities for approval authority
- [ ] Proper validation of approval permissions by level

### Mobile Experience
- [ ] Touch-friendly approval interface
- [ ] Responsive design for mobile devices
- [ ] Quick approval actions with confirmation
- [ ] Offline viewing of cached requests

## Implementation Steps

1. **Create Core Components**
2. **Implement Multi-Level Approval Logic**
3. **Add Budget Validation**
4. **Implement API Integration**
5. **Testing and Polish**

## Related Tasks
- TASK-SR-001: Store Requisition Viewing (similar approval patterns)
- TASK-AUTH-001: Core Authentication Service (for approval permissions)
- TASK-UI-001: Core UI Components (for interface elements)

## Notes
- This is a VIEW/APPROVE ONLY implementation - no creation functionality
- Focus on multi-level approval workflow and budget validation
- Ensure proper permission validation for each approval level
- Consider offline viewing capabilities for mobile approvers
- Plan for integration with notification system for approval alerts