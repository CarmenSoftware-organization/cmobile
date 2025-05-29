// Mock data for Physical Count sessions and items

export const mockPhysicalCountSessions = [
  {
    id: 101,
    name: "Main Store - June 2024",
    location: "Main Store",
    locationType: "Count",
    businessUnit: "Grand Hotel Singapore",
    status: "In Progress",
    counted: 120,
    total: 200,
    startedAt: "2024-06-01T09:00:00Z",
    completedAt: null,
  },
  {
    id: 102,
    name: "Bar - June 2024",
    location: "Bar",
    locationType: "System Default",
    businessUnit: "Grand Hotel Singapore",
    status: "Review",
    counted: 200,
    total: 200,
    startedAt: "2024-06-02T10:00:00Z",
    completedAt: null,
  },
  {
    id: 103,
    name: "Mini Bar - May 2024",
    location: "Mini Bar",
    locationType: "Direct",
    businessUnit: "Business Hotel Jakarta",
    status: "Completed",
    counted: 150,
    total: 150,
    startedAt: "2024-05-15T08:00:00Z",
    completedAt: "2024-05-15T12:00:00Z",
  },
];

export const mockPhysicalCountItems = [
  {
    sku: "SKU001",
    name: "Tomato Sauce",
    systemQty: 50,
    actual: 45,
    variance: -5,
    unit: "bottle",
    notes: "Shortage due to spillage",
    photo: null,
    counted: true,
  },
  {
    sku: "SKU002",
    name: "Olive Oil",
    systemQty: 20,
    actual: 20,
    variance: 0,
    unit: "bottle",
    notes: "",
    photo: null,
    counted: true,
  },
  {
    sku: "SKU003",
    name: "Mozzarella Cheese",
    systemQty: 15,
    actual: 18,
    variance: 3,
    unit: "kg",
    notes: "Extra stock found in fridge",
    photo: null,
    counted: true,
  },
  {
    sku: "SKU004",
    name: "Basil Leaves",
    systemQty: 10,
    actual: null,
    variance: 0,
    unit: "pack",
    notes: "",
    photo: null,
    counted: false,
  },
];

export const mockPhysicalCountVariances = mockPhysicalCountItems.filter(
  item => item.variance !== 0 && item.counted
);
// ...rest of file
