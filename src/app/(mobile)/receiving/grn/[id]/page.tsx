"use client";

import { useRouter, useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BusinessUnitLabel } from "@/components/ui/business-unit-label";
import { ChevronLeft, FileText, Eye } from "lucide-react";
import { useState } from "react";
import { getGRNById } from "@/data/mockGRNData";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Committed": return "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200";
    case "Void": return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200";
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-200";
  }
};

export default function ViewGRNPage() {
  const router = useRouter();
  const params = useParams();
  const [tab, setTab] = useState<'items' | 'summary' | 'signature' | 'extraCost' | 'attachments'>('items');
  
  const grnId = params.id as string;
  const grnData = getGRNById(grnId);

  if (!grnData) {
    return (
      <div className="p-4 pb-32 space-y-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ChevronLeft className="w-5 h-5" /> Back
        </Button>
        <div className="text-center py-8">
          <div className="text-muted-foreground">GRN not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-32 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ChevronLeft className="w-5 h-5" /> Back
        </Button>
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">View Only</span>
        </div>
      </div>

      <h1 className="text-xl font-bold mt-2 mb-4">{grnData.grnNumber}</h1>

      {/* GRN Header Info */}
      <Card className="p-4 mb-6 bg-card text-card-foreground">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">GRN Information</h3>
            <span className={`rounded px-2 py-1 text-xs font-medium ${getStatusColor(grnData.status)}`}>
              {grnData.status}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Vendor:</span>
              <div className="font-medium">{grnData.vendorName}</div>
              <div className="text-xs text-muted-foreground">({grnData.vendorCode})</div>
            </div>
            <div>
              <span className="text-muted-foreground">Total Value:</span>
              <div className="font-medium">{grnData.totalValue} {grnData.currency}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Linked POs:</span>
              <div className="font-medium">{grnData.linkedPOs.join(", ")}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Created By:</span>
              <div className="font-medium">{grnData.createdBy}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Created Date:</span>
              <div className="font-medium">{grnData.createdDate}</div>
            </div>
            {grnData.receivedDate && (
              <div>
                <span className="text-muted-foreground">Received Date:</span>
                <div className="font-medium">{grnData.receivedDate}</div>
              </div>
            )}
            <div>
              <span className="text-muted-foreground">Receipt Location:</span>
              <div className="font-medium">{grnData.receiptLocation}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Priority:</span>
              <div className="font-medium">{grnData.priority}</div>
            </div>
          </div>
          
          <div className="pt-2 border-t border-border">
            <BusinessUnitLabel assignedBusinessUnits={[{ id: 1, name: grnData.businessUnit }]} />
          </div>

          {grnData.notes && (
            <div className="pt-2 border-t border-border">
              <span className="text-muted-foreground text-sm">Notes:</span>
              <div className="font-medium italic">{grnData.notes}</div>
            </div>
          )}

          {grnData.deliveryNote && (
            <div className="pt-2 border-t border-border text-sm">
              <span className="text-muted-foreground">Delivery Note:</span>
              <span className="ml-2 font-medium">{grnData.deliveryNote}</span>
            </div>
          )}

          {grnData.invoiceNumber && (
            <div className="text-sm">
              <span className="text-muted-foreground">Invoice Number:</span>
              <span className="ml-2 font-medium">{grnData.invoiceNumber}</span>
            </div>
          )}
        </div>
      </Card>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex gap-1 mb-4 overflow-x-auto">
          <button
            className={`px-3 py-2 rounded-t text-sm font-medium border-b-2 whitespace-nowrap ${
              tab === 'items' 
                ? 'border-primary text-primary bg-card' 
                : 'border-transparent text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80'
            }`}
            onClick={() => setTab('items')}
          >
            Items
          </button>
          <button
            className={`px-3 py-2 rounded-t text-sm font-medium border-b-2 whitespace-nowrap ${
              tab === 'summary' 
                ? 'border-primary text-primary bg-card' 
                : 'border-transparent text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80'
            }`}
            onClick={() => setTab('summary')}
          >
            Summary
          </button>
          <button
            className={`px-3 py-2 rounded-t text-sm font-medium border-b-2 whitespace-nowrap ${
              tab === 'signature' 
                ? 'border-primary text-primary bg-card' 
                : 'border-transparent text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80'
            }`}
            onClick={() => setTab('signature')}
          >
            Signature
          </button>
          <button
            className={`px-3 py-2 rounded-t text-sm font-medium border-b-2 whitespace-nowrap ${
              tab === 'extraCost' 
                ? 'border-primary text-primary bg-card' 
                : 'border-transparent text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80'
            }`}
            onClick={() => setTab('extraCost')}
          >
            Extra Cost
          </button>
          <button
            className={`px-3 py-2 rounded-t text-sm font-medium border-b-2 whitespace-nowrap ${
              tab === 'attachments' 
                ? 'border-primary text-primary bg-card' 
                : 'border-transparent text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80'
            }`}
            onClick={() => setTab('attachments')}
          >
            Comments{grnData.comments.length > 0 && <span className="ml-1 bg-primary text-primary-foreground rounded-full px-2 text-xs">{grnData.comments.length}</span>}
          </button>
        </div>

        {/* Tab Content */}
        {tab === 'items' && (
          <Card className="p-4 bg-card text-card-foreground">
            <div className="font-semibold mb-4">Received Items</div>
            <div className="space-y-4">
              {grnData.items.map((item, idx) => (
                <div key={idx} className="border border-border rounded-lg p-3">
                  <div className="font-medium mb-2">{item.product}</div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div>SKU: {item.sku}</div>
                    <div>Unit: {item.unit}</div>
                    <div>PO: {item.poNumber}</div>
                    <div>Unit Price: ${item.unitPrice.toFixed(2)}</div>
                    <div>Ordered: {item.orderedQty}</div>
                    <div>Received: {item.receivedQty}</div>
                    <div>FOC: {item.focQty}</div>
                    <div>Total: ${item.totalAmount.toFixed(2)}</div>
                  </div>
                  
                  {/* Additional item details */}
                  {(item.expiryDate || item.batchNumber) && (
                    <div className="mt-2 pt-2 border-t border-border grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                      {item.expiryDate && (
                        <div>Expiry: {item.expiryDate}</div>
                      )}
                      {item.batchNumber && (
                        <div>Batch: {item.batchNumber}</div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {tab === 'summary' && (
          <Card className="p-4 bg-card text-card-foreground">
            <div className="font-semibold mb-4">Financial Summary</div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${grnData.summary.subtotal.toFixed(2)} {grnData.summary.currency}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax Amount:</span>
                <span>${grnData.summary.taxAmount.toFixed(2)} {grnData.summary.currency}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount:</span>
                <span>-${grnData.summary.discountAmount.toFixed(2)} {grnData.summary.currency}</span>
              </div>
              <div className="flex justify-between">
                <span>Extra Cost:</span>
                <span>${grnData.summary.extraCostAmount.toFixed(2)} {grnData.summary.currency}</span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between font-bold">
                  <span>Total Amount:</span>
                  <span>${grnData.summary.totalAmount.toFixed(2)} {grnData.summary.currency}</span>
                </div>
              </div>
              
              {/* Exchange rate information */}
              {grnData.summary.exchangeRate && grnData.summary.exchangeRate !== 1 && (
                <div className="mt-4 pt-3 border-t border-border text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Exchange Rate:</span>
                    <span>1 {grnData.summary.currency} = {grnData.summary.exchangeRate} Base Currency</span>
                  </div>
                  {grnData.summary.baseCurrencyTotal && (
                    <div className="flex justify-between font-medium">
                      <span>Base Currency Total:</span>
                      <span>{grnData.summary.baseCurrencyTotal.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        )}

        {tab === 'signature' && (
          <Card className="p-4 bg-card text-card-foreground">
            <div className="font-semibold mb-4">Signature & Confirmation</div>
            {grnData.signature ? (
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-muted-foreground">Receiver Name:</span>
                  <div className="font-medium">{grnData.signature.receiverName}</div>
                </div>
                {grnData.signature.designation && (
                  <div>
                    <span className="text-sm text-muted-foreground">Designation:</span>
                    <div className="font-medium">{grnData.signature.designation}</div>
                  </div>
                )}
                {grnData.signature.department && (
                  <div>
                    <span className="text-sm text-muted-foreground">Department:</span>
                    <div className="font-medium">{grnData.signature.department}</div>
                  </div>
                )}
                <div>
                  <span className="text-sm text-muted-foreground">Signature:</span>
                  <div className="mt-2 p-4 border border-border rounded bg-muted text-center text-muted-foreground">
                    {grnData.signature.receiverSignature}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Received Date:</span>
                    <div className="font-medium">{grnData.signature.receivedDate}</div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Received Time:</span>
                    <div className="font-medium">{grnData.signature.receivedTime}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No signature information available for this GRN.
              </div>
            )}
          </Card>
        )}

        {tab === 'extraCost' && (
          <Card className="p-4 bg-card text-card-foreground">
            <div className="font-semibold mb-4">Extra Costs</div>
            {grnData.extraCosts.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-4">
                No extra costs for this GRN.
              </div>
            ) : (
              <div className="space-y-3">
                {grnData.extraCosts.map((cost) => (
                  <div key={cost.id} className="border border-border rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{cost.description}</div>
                        <div className="text-sm text-muted-foreground">
                          Distribution: {cost.distributionMethod === 'qty' ? 'By Quantity' : 'By Value'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">${cost.amount.toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">{cost.currency}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {tab === 'attachments' && (
          <Card className="p-4 bg-card text-card-foreground">
            <div className="font-semibold mb-4">Comments & Attachments</div>
            {grnData.comments.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-4">
                No comments for this GRN.
              </div>
            ) : (
              <div className="space-y-3">
                {grnData.comments.map((comment) => (
                  <div key={comment.id} className="border border-border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium">{comment.sender}</span>
                      <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                    </div>
                    <div className="text-sm mb-2">{comment.text}</div>
                    
                    {/* Show attachments if any */}
                    {comment.attachments && comment.attachments.length > 0 && (
                      <div className="space-y-2">
                        {comment.attachments.map((attachment) => (
                          <div key={attachment.id} className="flex items-center gap-2 text-sm text-muted-foreground bg-muted p-2 rounded">
                            <span>{attachment.type === 'photo' ? '📷' : '📄'}</span>
                            <span>{attachment.name}</span>
                            {attachment.size && (
                              <span className="text-xs">({Math.round(attachment.size / 1024)} KB)</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => router.push('/receiving/grn-list')}
        >
          <FileText className="w-4 h-4 mr-2" />
          Back to GRN List
        </Button>
      </div>
    </div>
  );
} 