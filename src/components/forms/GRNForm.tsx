import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BusinessUnitLabel } from "@/components/ui/business-unit-label";
import { mockVendors } from "@/data/mockGRNData";

export type GRNFormMode = "create" | "view" | "edit";

export interface GRNFormProps {
  mode: GRNFormMode;
  initialData?: any;
  onSubmit: (data: any) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onCancel?: () => void;
}

export const GRNForm: React.FC<GRNFormProps> = ({ mode, initialData = {}, onSubmit, onEdit, onDelete, onCancel }) => {
  const [form, setForm] = useState({
    refNumber: initialData.refNumber || "",
    date: initialData.date || new Date().toISOString().split("T")[0],
    invoiceDate: initialData.invoiceDate || "",
    invoiceNumber: initialData.invoiceNumber || "",
    description: initialData.description || "",
    receiver: initialData.receiver || "",
    vendorId: initialData.vendorId || "",
    businessUnit: initialData.businessUnit || "",
    isConsignment: initialData.isConsignment || false,
    isCashPayment: initialData.isCashPayment || false,
    currency: initialData.currency || "THB",
    exchangeRate: initialData.exchangeRate || 1.0,
  });

  const readOnly = mode === "view";

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold leading-tight">
            {mode === "create" ? "Create GRN" : `GRN ${form.refNumber}`}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <BusinessUnitLabel assignedBusinessUnits={[{ id: 1, name: form.businessUnit || "No BU" }]} />
          </div>
        </div>
        {mode === "view" && (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={onEdit}>Edit</Button>
            <Button size="sm" variant="destructive" onClick={onDelete}>Delete</Button>
          </div>
        )}
        {mode === "edit" && (
          <div className="flex gap-2">
            <Button size="sm" variant="default" onClick={() => onSubmit(form)}>Save</Button>
            <Button size="sm" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button size="sm" variant="destructive" onClick={onDelete}>Delete</Button>
          </div>
        )}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(form);
        }}
        className="space-y-4"
      >
        {/* Ref# and Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Ref#</label>
            <input
              type="text"
              value={form.refNumber}
              onChange={(e) => handleChange("refNumber", e.target.value)}
              className="w-full px-2 py-1.5 border border-input rounded-md bg-muted text-muted-foreground text-sm"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Date *</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => handleChange("date", e.target.value)}
              className="w-full px-2 py-1.5 border border-input rounded-md text-sm"
              required
              disabled={readOnly}
            />
          </div>
        </div>
        {/* Invoice Date and Invoice# */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Invoice Date</label>
            <input
              type="date"
              value={form.invoiceDate}
              onChange={(e) => handleChange("invoiceDate", e.target.value)}
              className="w-full px-2 py-1.5 border border-input rounded-md text-sm"
              disabled={readOnly}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Invoice#</label>
            <input
              type="text"
              value={form.invoiceNumber}
              onChange={(e) => handleChange("invoiceNumber", e.target.value)}
              className="w-full px-2 py-1.5 border border-input rounded-md text-sm"
              disabled={readOnly}
            />
          </div>
        </div>
        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full px-2 py-1.5 border border-input rounded-md text-sm"
            rows={2}
            disabled={readOnly}
          />
        </div>
        {/* Receiver and Vendor */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Receiver *</label>
            <input
              type="text"
              value={form.receiver}
              onChange={(e) => handleChange("receiver", e.target.value)}
              className="w-full px-2 py-1.5 border border-input rounded-md text-sm"
              required
              disabled={readOnly}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Vendor *</label>
            <select
              value={form.vendorId}
              onChange={(e) => handleChange("vendorId", e.target.value)}
              className="w-full px-2 py-1.5 border border-input rounded-md text-sm"
              required
              disabled={readOnly}
            >
              <option value="">Select vendor</option>
              {mockVendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.name} ({vendor.code})
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Consignment and Currency */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={form.isConsignment}
                  onChange={(e) => handleChange("isConsignment", e.target.checked)}
                  className="rounded border-input"
                  disabled={readOnly}
                />
                <span className="text-sm font-medium text-muted-foreground">Consignment</span>
              </label>
            </div>
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={form.isCashPayment}
                  onChange={(e) => handleChange("isCashPayment", e.target.checked)}
                  className="rounded border-input"
                  disabled={readOnly}
                />
                <span className="text-sm font-medium text-muted-foreground">Cash Payment</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Currency & Rate</label>
            <div className="space-y-2">
              <select
                value={form.currency}
                onChange={(e) => handleChange("currency", e.target.value)}
                className="w-full px-2 py-1.5 border border-input rounded-md text-sm"
                disabled={readOnly}
              >
                <option value="THB">THB</option>
                <option value="USD">USD</option>
                <option value="SGD">SGD</option>
                <option value="EUR">EUR</option>
              </select>
              <input
                type="number"
                value={form.exchangeRate}
                onChange={(e) => handleChange("exchangeRate", parseFloat(e.target.value) || 1)}
                placeholder="1.00000"
                step="0.00001"
                min="0"
                className="w-full px-2 py-1.5 border border-input rounded-md text-sm"
                disabled={readOnly}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Rate: {form.exchangeRate.toFixed(5)}</p>
          </div>
        </div>
        {/* Only show submit button in create mode */}
        {mode === "create" && (
          <Button className="w-full bg-green-600 hover:bg-green-700 text-white" type="submit">
            Create GRN
          </Button>
        )}
      </form>
    </Card>
  );
};
