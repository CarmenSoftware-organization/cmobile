# TASK-RETURN-001: Implement Return Functionality

## Overview
Implement comprehensive return functionality for the Carmen Supply Chain Mobile Application, including GRN void operations, store requisition cancellation, and purchase request return-to-review workflows.

## Priority
**Medium** - Important workflow functionality

## Estimated Effort
**4-6 hours**

## Dependencies
- TASK-REC-002: GRN Creation and Management
- TASK-SR-001: Store Requisition Viewing
- TASK-PR-001: Purchase Request Viewing

## Requirements

### Functional Requirements
Based on [UI Prototype](../ui-prototype.md) and workflow documentation:

1. **GRN Void Operations**
   - Void GRNs in Draft or Received status
   - Return all items to PO remaining quantity
   - Cannot void Committed GRNs
   - Audit trail for void operations

2. **Store Requisition Returns**
   - Return requisition to previous workflow stage
   - Cancel requisition with reason codes
   - Proper authorization checks
   - Workflow stage management

3. **Purchase Request Returns**
   - Return PR to previous workflow stage for review
   - Item-level return marking
   - Multi-level workflow support
   - Return reason documentation

### Technical Requirements

1. **Return Action Types**
   ```typescript
   type ReturnAction = 
     | 'void_grn'           // Void GRN and return items to PO
     | 'cancel_sr'          // Cancel store requisition
     | 'return_sr'          // Return SR to previous stage
     | 'return_pr'          // Return PR to previous stage
     | 'return_pr_items';   // Return specific PR items for review

   interface ReturnRequest {
     action: ReturnAction;
     reason: string;
     comments?: string;
     itemIds?: string[];    // For item-level returns
   }
   ```

2. **Workflow Integration**
   - Integration with existing workflow management
   - Stage transition validation
   - Permission-based return actions
   - Audit trail maintenance

## Implementation Details

### Core Components

#### 1. Return Actions Component
```typescript
// src/components/common/ReturnActions.tsx
interface ReturnActionsProps {
  documentType: 'grn' | 'sr' | 'pr';
  documentId: string;
  currentStatus: string;
  canVoid?: boolean;
  canCancel?: boolean;
  canReturn?: boolean;
  onReturnComplete: () => void;
}

export function ReturnActions({
  documentType,
  documentId,
  currentStatus,
  canVoid = false,
  canCancel = false,
  canReturn = false,
  onReturnComplete
}: ReturnActionsProps) {
  const [showReturnDialog, setShowReturnDialog] = useState(false);
  const [returnAction, setReturnAction] = useState<ReturnAction | null>(null);

  const getAvailableActions = () => {
    const actions: { action: ReturnAction; label: string; variant: string }[] = [];
    
    if (documentType === 'grn' && canVoid && ['draft', 'received'].includes(currentStatus)) {
      actions.push({ action: 'void_grn', label: 'Void GRN', variant: 'destructive' });
    }
    
    if (documentType === 'sr') {
      if (canReturn) {
        actions.push({ action: 'return_sr', label: 'Return for Review', variant: 'outline' });
      }
      if (canCancel) {
        actions.push({ action: 'cancel_sr', label: 'Cancel', variant: 'secondary' });
      }
    }
    
    if (documentType === 'pr' && canReturn) {
      actions.push({ action: 'return_pr', label: 'Return for Review', variant: 'outline' });
    }
    
    return actions;
  };

  const availableActions = getAvailableActions();

  if (availableActions.length === 0) {
    return null;
  }

  return (
    <>
      <div className="flex gap-2 flex-wrap">
        {availableActions.map(({ action, label, variant }) => (
          <Button
            key={action}
            variant={variant as any}
            size="sm"
            onClick={() => {
              setReturnAction(action);
              setShowReturnDialog(true);
            }}
          >
            {label}
          </Button>
        ))}
      </div>

      {showReturnDialog && returnAction && (
        <ReturnDialog
          action={returnAction}
          documentType={documentType}
          documentId={documentId}
          onClose={() => {
            setShowReturnDialog(false);
            setReturnAction(null);
          }}
          onComplete={() => {
            setShowReturnDialog(false);
            setReturnAction(null);
            onReturnComplete();
          }}
        />
      )}
    </>
  );
}
```

#### 2. Return Dialog Component
```typescript
// src/components/common/ReturnDialog.tsx
interface ReturnDialogProps {
  action: ReturnAction;
  documentType: 'grn' | 'sr' | 'pr';
  documentId: string;
  onClose: () => void;
  onComplete: () => void;
}

export function ReturnDialog({
  action,
  documentType,
  documentId,
  onClose,
  onComplete
}: ReturnDialogProps) {
  const [reason, setReason] = useState('');
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getReasonOptions = () => {
    switch (action) {
      case 'void_grn':
        return [
          { value: 'incorrect_quantities', label: 'Incorrect Quantities' },
          { value: 'wrong_items', label: 'Wrong Items Received' },
          { value: 'damaged_goods', label: 'Damaged Goods' },
          { value: 'data_entry_error', label: 'Data Entry Error' },
          { value: 'other', label: 'Other' }
        ];
      case 'cancel_sr':
        return [
          { value: 'event_cancelled', label: 'Event Cancelled' },
          { value: 'budget_constraints', label: 'Budget Constraints' },
          { value: 'no_longer_needed', label: 'No Longer Needed' },
          { value: 'duplicate_request', label: 'Duplicate Request' },
          { value: 'other', label: 'Other' }
        ];
      case 'return_sr':
      case 'return_pr':
        return [
          { value: 'missing_information', label: 'Missing Information' },
          { value: 'incorrect_quantities', label: 'Incorrect Quantities' },
          { value: 'budget_review_needed', label: 'Budget Review Needed' },
          { value: 'approval_clarification', label: 'Approval Clarification' },
          { value: 'other', label: 'Other' }
        ];
      default:
        return [];
    }
  };

  const getActionTitle = () => {
    switch (action) {
      case 'void_grn': return 'Void GRN';
      case 'cancel_sr': return 'Cancel Store Requisition';
      case 'return_sr': return 'Return Store Requisition';
      case 'return_pr': return 'Return Purchase Request';
      default: return 'Return Action';
    }
  };

  const getActionDescription = () => {
    switch (action) {
      case 'void_grn':
        return 'This will void the GRN and return all items to the PO remaining quantity. This action cannot be undone.';
      case 'cancel_sr':
        return 'This will permanently cancel the store requisition. This action cannot be undone.';
      case 'return_sr':
        return 'This will return the store requisition to the previous workflow stage for review.';
      case 'return_pr':
        return 'This will return the purchase request to the previous workflow stage for review.';
      default:
        return '';
    }
  };

  const handleSubmit = async () => {
    if (!reason || (action !== 'void_grn' && !comments.trim())) {
      return;
    }

    setIsSubmitting(true);
    try {
      await returnService.performReturnAction({
        action,
        documentType,
        documentId,
        reason,
        comments: comments.trim() || undefined
      });
      
      onComplete();
    } catch (error) {
      console.error('Return action failed:', error);
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  const reasonOptions = getReasonOptions();
  const isDestructive = action === 'void_grn' || action === 'cancel_sr';

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{getActionTitle()}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className={`p-3 rounded-lg ${isDestructive ? 'bg-red-50 border border-red-200' : 'bg-blue-50 border border-blue-200'}`}>
            <p className={`text-sm ${isDestructive ? 'text-red-800' : 'text-blue-800'}`}>
              {isDestructive && '⚠️ '}{getActionDescription()}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Reason (required)
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select reason...</option>
              {reasonOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Comments {action === 'void_grn' ? '(optional)' : '(required)'}
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Provide additional details..."
              className="w-full p-3 border rounded-md"
              rows={3}
              required={action !== 'void_grn'}
            />
          </div>
          
          <div className="flex gap-3">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!reason || (action !== 'void_grn' && !comments.trim()) || isSubmitting}
              variant={isDestructive ? 'destructive' : 'default'}
              className="flex-1"
            >
              {isSubmitting ? 'Processing...' : `Confirm ${getActionTitle()}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

### API Integration

#### 1. Return Service
```typescript
// src/lib/services/returnService.ts
export class ReturnService {
  async performReturnAction(request: ReturnRequest & {
    documentType: 'grn' | 'sr' | 'pr';
    documentId: string;
  }): Promise<void> {
    const { action, documentType, documentId, reason, comments, itemIds } = request;
    
    switch (action) {
      case 'void_grn':
        await this.voidGRN(documentId, reason, comments);
        break;
      case 'cancel_sr':
        await this.cancelStoreRequisition(documentId, reason, comments);
        break;
      case 'return_sr':
        await this.returnStoreRequisition(documentId, reason, comments);
        break;
      case 'return_pr':
        await this.returnPurchaseRequest(documentId, reason, comments, itemIds);
        break;
      default:
        throw new Error(`Unsupported return action: ${action}`);
    }
  }

  private async voidGRN(grnId: string, reason: string, comments?: string): Promise<void> {
    // POST /api/v1/receiving/grns/{id}/void
    await apiClient.post(`/receiving/grns/${grnId}/void`, {
      reason,
      comments
    });
  }

  private async cancelStoreRequisition(srId: string, reason: string, comments?: string): Promise<void> {
    // POST /api/v1/store-requisitions/{id}/cancel
    await apiClient.post(`/store-requisitions/${srId}/cancel`, {
      reason,
      comments
    });
  }

  private async returnStoreRequisition(srId: string, reason: string, comments: string): Promise<void> {
    // POST /api/v1/store-requisitions/{id}/return
    await apiClient.post(`/store-requisitions/${srId}/return`, {
      reason,
      comments
    });
  }

  private async returnPurchaseRequest(prId: string, reason: string, comments: string, itemIds?: string[]): Promise<void> {
    // POST /api/v1/purchase-requests/{id}/return
    await apiClient.post(`/purchase-requests/${prId}/return`, {
      reason,
      comments,
      itemIds
    });
  }
}

export const returnService = new ReturnService();
```

### Integration with Existing Components

#### 1. GRN Detail Integration
```typescript
// In GRN Detail component
const GRNDetail = ({ grn }) => {
  const { user } = useAuth();
  const canVoid = grn.status === 'draft' || grn.status === 'received';
  
  return (
    <div>
      {/* Existing GRN detail content */}
      
      <ReturnActions
        documentType="grn"
        documentId={grn.id}
        currentStatus={grn.status}
        canVoid={canVoid && user.permissions.includes('grn.void')}
        onReturnComplete={() => {
          // Refresh GRN data
          router.refresh();
        }}
      />
    </div>
  );
};
```

#### 2. Store Requisition Integration
```typescript
// In Store Requisition Detail component
const StoreRequisitionDetail = ({ requisition }) => {
  const { user } = useAuth();
  const canReturn = requisition.status === 'pending' && user.permissions.includes('sr.return');
  const canCancel = user.permissions.includes('sr.cancel') && requisition.requesterId === user.id;
  
  return (
    <div>
      {/* Existing SR detail content */}
      
      <ReturnActions
        documentType="sr"
        documentId={requisition.id}
        currentStatus={requisition.status}
        canReturn={canReturn}
        canCancel={canCancel}
        onReturnComplete={() => {
          // Refresh SR data
          router.refresh();
        }}
      />
    </div>
  );
};
```

## Testing Requirements

### Unit Tests
```typescript
describe('Return Functionality', () => {
  describe('ReturnActions Component', () => {
    test('should show appropriate actions based on document type and permissions')
    test('should handle GRN void action')
    test('should handle SR cancel action')
    test('should handle SR return action')
    test('should handle PR return action')
  })

  describe('ReturnDialog Component', () => {
    test('should validate required fields')
    test('should show appropriate reason options')
    test('should handle form submission')
    test('should show confirmation for destructive actions')
  })

  describe('ReturnService', () => {
    test('should call correct API endpoints for each action')
    test('should handle API errors gracefully')
    test('should validate request parameters')
  })
})
```

### Integration Tests
```typescript
describe('Return Integration', () => {
  test('should void GRN and update PO remaining quantities')
  test('should cancel store requisition and update workflow')
  test('should return SR to previous stage')
  test('should return PR to previous stage with item marking')
})
```

## Acceptance Criteria

### Core Functionality
- [ ] Void GRNs in Draft/Received status and return items to PO
- [ ] Cancel store requisitions with proper reason codes
- [ ] Return store requisitions to previous workflow stage
- [ ] Return purchase requests to previous workflow stage
- [ ] Proper authorization checks for all return actions

### User Experience
- [ ] Clear confirmation dialogs for destructive actions
- [ ] Appropriate reason code selection for each action type
- [ ] Visual feedback for action consequences
- [ ] Proper error handling and user feedback

### Workflow Integration
- [ ] Proper workflow stage transitions
- [ ] Audit trail maintenance for all return actions
- [ ] Permission-based action availability
- [ ] Integration with existing approval workflows

## Implementation Steps

1. **Create Core Return Components**
   - Implement ReturnActions component
   - Create ReturnDialog component
   - Add reason code management

2. **Implement Return Service**
   - Create return service class
   - Add API integration methods
   - Implement error handling

3. **Integrate with Existing Components**
   - Add return actions to GRN detail
   - Integrate with SR approval workflow
   - Add PR return functionality

4. **Add Workflow Integration**
   - Implement stage transition logic
   - Add audit trail support
   - Integrate with permission system

5. **Testing and Validation**
   - Unit tests for all components
   - Integration tests for workflows
   - User acceptance testing

## Related Tasks
- TASK-REC-002: GRN Creation and Management (GRN void integration)
- TASK-SR-001: Store Requisition Viewing (SR return/cancel integration)
- TASK-PR-001: Purchase Request Viewing (PR return integration)

## Notes
- Return functionality is critical for error correction and workflow management
- Ensure proper audit trails for all return actions
- Consider offline scenarios for return operations
- Plan for integration with notification system for return alerts
- Implement proper permission checks to prevent unauthorized returns