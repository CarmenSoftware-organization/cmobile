// Shared Workflow Configuration for PR Approval System

export interface WorkflowStage {
  id: number;
  name: string;
  label: string;
  roles: string[];
}

export interface RolePermissions {
  canView: number[];
  canEdit: number[];
  canApprove: number[];
  canCreate: boolean;
}

// Explicit Workflow Configuration - WHERE the document is in the process
export const workflowConfig = {
  stages: [
    { id: 0, name: "Draft", label: "Draft", roles: ["Requestor"] },
    { id: 1, name: "HOD Review", label: "HOD Review", roles: ["HOD"] },
    { id: 2, name: "Finance Review", label: "Finance Review", roles: ["Finance"] },
    { id: 3, name: "Vendor Allocation", label: "Vendor Allocation", roles: ["Purchasing"] },
    { id: 4, name: "Approved", label: "Approved", roles: [] },
    // Terminal stages
    { id: -1, name: "Rejected", label: "Rejected", roles: [] },
    { id: -2, name: "On Hold", label: "On Hold", roles: [] },
    { id: -3, name: "Cancelled", label: "Cancelled", roles: [] }
  ] as WorkflowStage[]
};

// Document Status Configuration - STATE/CONDITION of the document
export const documentStatuses: Record<string, { color: string; description: string }> = {
  // Active workflow statuses
  "Draft": { color: "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200", description: "Document is being prepared" },
  "In-progress": { color: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200", description: "Document is in progress through workflow" },
  "Returned": { color: "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200", description: "Returned for changes" },
  "Completed": { color: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200", description: "Document completed" },
  // Terminal statuses
  "Rejected": { color: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200", description: "Rejected" },
  "On Hold": { color: "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200", description: "Temporarily on hold" },
  "Cancelled": { color: "bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400", description: "Cancelled" }
};

// Workflow Stage to Possible Document Statuses Mapping
export const stageToValidStatuses: Record<number, string[]> = {
  0: ["Draft"], // Draft stage
  1: ["In-progress", "Returned"], // HOD Review stage
  2: ["In-progress", "Returned"], // Finance Review stage
  3: ["In-progress", "Returned"], // Vendor Allocation stage
  4: ["Completed"], // Final stage
  [-1]: ["Rejected"], // Terminal rejection
  [-2]: ["On Hold"], // Terminal hold
  [-3]: ["Cancelled"] // Terminal cancellation
};

// Document Status to Default Workflow Stage Mapping
export const statusToDefaultStage: Record<string, number> = {
  "Draft": 0,
  "In-progress": 1, // Default to HOD Review when in progress
  "Returned": 0, // Return to draft for changes
  "Completed": 4,
  "Rejected": -1,
  "On Hold": -2,
  "Cancelled": -3
};

// Role-Based Permissions
export const rolePermissions: Record<string, RolePermissions> = {
  "Requestor": { 
    canView: [0, 1, 2, 3, 4], 
    canEdit: [0], 
    canApprove: [],
    canCreate: true
  },
  "HOD": { 
    canView: [0, 1, 2, 3, 4], 
    canEdit: [1], 
    canApprove: [1],
    canCreate: false
  },
  "Finance": { 
    canView: [0, 1, 2, 3, 4], 
    canEdit: [2], 
    canApprove: [2],
    canCreate: false
  },
  "Purchasing": {
    canView: [0, 1, 2, 3, 4],
    canEdit: [3],
    canApprove: [3],
    canCreate: false
  }
};

// Legacy compatibility - Status Colors Configuration
export const statusColors: Record<string, string> = Object.fromEntries(
  Object.entries(documentStatuses).map(([status, config]) => [status, config.color])
);

// User Interface
export interface User {
  id: string;
  name: string;
  role: string;
  businessUnits: string[];
  department: string;
}

// Enhanced PR Interface with separate workflow stage and document status
export interface PR {
  id: number;
  number: string;
  status: string; // Document status (Draft, Submitted, Under Review, etc.)
  workflowStage: number; // Workflow stage (0-4)
  requestor: string;
  department: string;
  date: string;
  value: string;
  business_unit: string;
  role: string; // Required role for current stage
}

// Helper Functions for Workflow Management
export function getCurrentWorkflowStage(pr: PR | string): number {
  if (typeof pr === 'string') {
    // Legacy compatibility - derive stage from status
    return statusToDefaultStage[pr] ?? 0;
  }
  return pr.workflowStage ?? statusToDefaultStage[pr.status] ?? 0;
}

export function getCurrentStep(pr: PR): number {
  const stage = getCurrentWorkflowStage(pr);
  if (stage < 0) return workflowConfig.stages.length; // Terminal states
  return stage;
}

export function canUserActOnPR(pr: PR | string, userRole: string): boolean {
  const stage = getCurrentWorkflowStage(pr);
  if (stage < 0) return false; // Terminal states
  
  const permissions = rolePermissions[userRole];
  if (!permissions) return false;
  
  return permissions.canApprove.includes(stage);
}

export function canUserViewPR(pr: PR | string, userRole: string): boolean {
  const stage = getCurrentWorkflowStage(pr);
  const permissions = rolePermissions[userRole];
  if (!permissions) return false;
  
  return permissions.canView.includes(Math.max(0, stage));
}

export function getWorkflowStageLabel(stage: number): string {
  const stageConfig = workflowConfig.stages.find(s => s.id === stage);
  return stageConfig?.label || "Unknown";
}

export function getDocumentStatusInfo(status: string) {
  return documentStatuses[status] || { 
    color: "bg-gray-100 text-gray-800", 
    description: "Unknown status" 
  };
}

export function isValidStatusForStage(stage: number, status: string): boolean {
  const validStatuses = stageToValidStatuses[stage];
  return validStatuses ? validStatuses.includes(status) : false;
}

export function getWorkflowSteps() {
  return workflowConfig.stages.slice(0, -1).map(stage => ({
    key: stage.name,
    label: stage.label,
    id: stage.id
  }));
}

export function getNextWorkflowStage(currentStage: number): number {
  if (currentStage >= workflowConfig.stages.length - 1) return currentStage;
  return currentStage + 1;
}

// Mock Users for Testing
export const mockUsers: User[] = [
  {
    id: "user-hod",
    name: "Alice Manager (HOD)",
    role: "HOD",
    businessUnits: ["Grand Hotel Singapore", "Business Hotel Jakarta"],
    department: "F&B"
  },
  {
    id: "user-finance",
    name: "Bob Finance (Finance)",
    role: "Finance", 
    businessUnits: ["Grand Hotel Singapore", "Boutique Hotel Bangkok"],
    department: "Finance"
  },
  {
    id: "user-requestor",
    name: "Charlie Staff (Requestor)",
    role: "Requestor",
    businessUnits: ["Business Hotel Jakarta"],
    department: "Operations"
  },
  {
    id: "user-purchasing",
    name: "David Buyer (Purchasing)",
    role: "Purchasing",
    businessUnits: ["Grand Hotel Singapore", "Business Hotel Jakarta", "Boutique Hotel Bangkok"],
    department: "Procurement"
  }
]; 