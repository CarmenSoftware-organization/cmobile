"use client";

import { useState, useEffect, Suspense } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Calendar, ChevronDown, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { mockPOs } from "@/data/mockPOData";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

interface BusinessUnit {
  id: number;
  name: string;
  code: string;
  location: string;
  type: string;
  active: boolean;
  description: string;
}

interface DateRange {
  from: Date | undefined;
  to?: Date | undefined;
}

const vendors = [
  { id: 1, name: "Aqua Supplier" },
  { id: 2, name: "Juice Co." },
  { id: 3, name: "Coffee Traders" },
  { id: 4, name: "Fresh Farms" },
  { id: 5, name: "Bakery Bros" },
  { id: 6, name: "Dairy Direct" },
  { id: 7, name: "Meat Masters" },
  { id: 8, name: "Veggie Valley" },
  { id: 9, name: "Seafood Source" },
  { id: 10, name: "Spice World" },
];

// Use centralized mock data instead of local pos array
const pos = mockPOs;

const statusOptions = ["All", "Sent", "Partial"];
const deliveryDateOptions = ["All", "Today", "This Week", "Next Week", "Overdue"];

function NewGoodReceiveNotePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vendorIdParam = searchParams.get("vendorId");
  const skipVendorSelect = searchParams.get("skipVendorSelect") === "true";
  const isResume = skipVendorSelect && vendorIdParam;
  const [selectedVendor, setSelectedVendor] = useState<null | number>(
    isResume ? Number(vendorIdParam) : null
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deliveryDateFilter, setDeliveryDateFilter] = useState("All");
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [selectedPOs, setSelectedPOs] = useState<number[]>([]);
  const [selectedBusinessUnit, setSelectedBusinessUnit] = useState<BusinessUnit | null>(null);

  // Get selected business unit from sessionStorage
  useEffect(() => {
    // Always try to get BU from query param first
    const buParam = searchParams.get('bu');
    if (buParam) {
      setSelectedBusinessUnit({
        id: 0, // or fetch the correct id if available
        name: buParam,
        code: buParam,
        location: '',
        type: '',
        active: true,
        description: ''
      });
      sessionStorage.setItem('selectedBusinessUnit', JSON.stringify({
        id: 0,
        name: buParam,
        code: buParam,
        location: '',
        type: '',
        active: true,
        description: ''
      }));
    } else {
      const storedBU = sessionStorage.getItem('selectedBusinessUnit');
      if (storedBU) {
        setSelectedBusinessUnit(JSON.parse(storedBU));
      } else {
        router.push('/receiving/select-bu');
      }
    }
  }, [router, searchParams]);

  // Helper function to check if date matches filter
  const matchesDeliveryDateFilter = (eta: string, filter: string) => {
    if (filter === "All") return true;
    
    const today = new Date();
    const poDate = new Date(eta);
    
    // Reset time to compare dates only
    today.setHours(0, 0, 0, 0);
    poDate.setHours(0, 0, 0, 0);
    
    // Handle custom date selection
    if (filter === "Custom" && selectedDateRange.from) {
      if (selectedDateRange.to) {
        // Date range selected
        return poDate >= selectedDateRange.from && poDate <= selectedDateRange.to;
      } else {
        // Only start date selected
        return poDate.getTime() === selectedDateRange.from.getTime();
      }
    }
    
    switch (filter) {
      case "Today":
        return poDate.getTime() === today.getTime();
      case "This Week":
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return poDate >= startOfWeek && poDate <= endOfWeek;
      case "Next Week":
        const nextWeekStart = new Date(today);
        nextWeekStart.setDate(today.getDate() + (7 - today.getDay()));
        const nextWeekEnd = new Date(nextWeekStart);
        nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
        return poDate >= nextWeekStart && poDate <= nextWeekEnd;
      case "Overdue":
        return poDate < today;
      default:
        return true;
    }
  };

  // Filter POs based on selected business unit
  const filteredPOs = pos.filter(po => {
    if (selectedVendor && po.vendorId !== selectedVendor) return false;
    if (statusFilter !== "All" && po.status !== statusFilter) return false;
    if (!matchesDeliveryDateFilter(po.eta, deliveryDateFilter)) return false;
    if (search && !(
      po.number.toLowerCase().includes(search.toLowerCase()) ||
      po.items[0].product.toLowerCase().includes(search.toLowerCase())
    )) return false;
    // Filter by business unit if one is selected
    if (selectedBusinessUnit && po.businessUnit !== selectedBusinessUnit.name) return false;
    return true;
  });

  // Group POs by currency
  const groupedPOsByCurrency = filteredPOs.reduce((groups, po) => {
    const currency = po.currency || 'USD';
    if (!groups[currency]) {
      groups[currency] = [];
    }
    groups[currency].push(po);
    return groups;
  }, {} as Record<string, typeof filteredPOs>);

  const currencyGroups = Object.entries(groupedPOsByCurrency);

  const togglePO = (id: number) => {
    setSelectedPOs(selected =>
      selected.includes(id)
        ? selected.filter(pid => pid !== id)
        : [...selected, id]
    );
  };

  return (
    <div className="p-4 pb-32 space-y-4">
      {/* Only show vendor selection if not in resume/add PO mode */}
      {(!selectedVendor && !isResume) ? (
        <>
          <div className="flex items-center mb-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="ml-2">
              <h1 className="text-xl font-bold">
                {selectedVendor && vendors.find(v => v.id === selectedVendor)?.name ? vendors.find(v => v.id === selectedVendor)?.name : 'New Good Receive Note'}
              </h1>
              {selectedBusinessUnit && (
                <p className="text-sm text-muted-foreground">
                  {selectedBusinessUnit.name} ({selectedBusinessUnit.code})
                </p>
              )}
            </div>
          </div>
          <h2 className="text-lg font-semibold mb-4">Select Vendor</h2>
          <input
            type="text"
            placeholder="Search vendor..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring"
          />
          <div className="space-y-3">
            {vendors
              .filter(vendor => vendor.name.toLowerCase().includes(search.toLowerCase()))
              .map(vendor => (
                <button
                  key={vendor.id}
                  className="w-full text-left bg-transparent border-none p-0 m-0"
                  onClick={() => setSelectedVendor(vendor.id)}
                >
                  <Card className="p-4 flex items-center justify-between shadow-md rounded-xl cursor-pointer hover:bg-muted">
                    <span className="font-semibold text-base">{vendor.name}</span>
                    <ChevronLeft className="w-5 h-5 rotate-180 text-muted-foreground" />
                  </Card>
                </button>
              ))}
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" onClick={() => setSelectedVendor(null)}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div className="ml-2">
                <h1 className="text-xl font-bold">
                  {vendors.find(v => v.id === selectedVendor)?.name}
                </h1>
                {selectedBusinessUnit && (
                  <p className="text-sm text-muted-foreground">
                    {selectedBusinessUnit.name} ({selectedBusinessUnit.code})
                  </p>
                )}
              </div>
            </div>
            <Button
              variant="default"
              size="sm"
              className="ml-auto"
              disabled={selectedPOs.length === 0}
              onClick={() => {
                const params = selectedPOs.map(id => `po=${id}`).join("&");
                const buParam = selectedBusinessUnit ? `&bu=${encodeURIComponent(selectedBusinessUnit.name)}` : '';
                const vendorName = vendors.find(v => v.id === selectedVendor)?.name;
                const vendorParam = vendorName ? `&vendor=${encodeURIComponent(vendorName)}` : '';
                router.push(`/receiving/select-grn-locations?${params}${buParam}${vendorParam}`);
              }}
            >
              Continue to Location Selection
            </Button>
          </div>
          {/* Filters */}
          <div className="flex gap-2 mb-3">
            {statusOptions.map(option => (
              <Button
                key={option}
                size="sm"
                variant={statusFilter === option ? "default" : "secondary"}
                className="rounded-full"
                onClick={() => setStatusFilter(option)}
              >
                {option}
              </Button>
            ))}
          </div>
          <div className="flex gap-2 mb-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  {selectedDateRange.from && selectedDateRange.to
                    ? `${format(selectedDateRange.from, "MMM dd")} - ${format(selectedDateRange.to, "MMM dd, yyyy")}`
                    : selectedDateRange.from
                    ? `From ${format(selectedDateRange.from, "MMM dd, yyyy")}`
                    : deliveryDateFilter === "All"
                    ? "Delivery Date"
                    : deliveryDateFilter}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[300px]">
                {deliveryDateOptions.map(option => (
                  <DropdownMenuItem
                    key={option}
                    onClick={() => {
                      setDeliveryDateFilter(option);
                      if (option === "All") setSelectedDateRange({ from: undefined, to: undefined });
                    }}
                  >
                    {option}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <div className="p-2">
                  <div className="text-sm font-medium mb-2">Select Custom Date Range:</div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <Calendar className="mr-2 h-4 w-4" />
                        {selectedDateRange.from && selectedDateRange.to ? (
                          `${format(selectedDateRange.from, "MMM dd, yyyy")} - ${format(selectedDateRange.to, "MMM dd, yyyy")}`
                        ) : selectedDateRange.from ? (
                          `From ${format(selectedDateRange.from, "MMM dd, yyyy")} - Select end date`
                        ) : "Select start and end date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="p-3">
                        <div className="text-xs text-muted-foreground mb-2">
                          Click to select start date, then click again to select end date
                        </div>
                        <CalendarComponent
                          mode="range"
                          selected={selectedDateRange}
                          onSelect={(dates) => {
                            if (dates) {
                              setSelectedDateRange(dates);
                              setDeliveryDateFilter("Custom");
                            }
                          }}
                          initialFocus
                        />
                        {(selectedDateRange.from || selectedDateRange.to) && (
                          <div className="border-t pt-2 mt-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full"
                              onClick={() => {
                                setSelectedDateRange({ from: undefined, to: undefined });
                                setDeliveryDateFilter("All");
                              }}
                            >
                              Clear Date Range
                            </Button>
                          </div>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Search PO number or product..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-3 py-2 pr-12 border rounded focus:outline-none focus:ring"
            />
            {/* Scan PO Icon Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 p-2"
              onClick={() => router.push("/receiving/scan-po")}
              aria-label="Scan PO"
            >
              <Camera className="w-5 h-5 text-primary" />
            </Button>
          </div>
          <div className="space-y-3">
            {filteredPOs.length === 0 ? (
              <div className="text-muted-foreground text-center">No POs for this vendor.</div>
            ) : (
              currencyGroups.map(([currency, pos]) => (
                <div key={currency}>
                  {/* Currency Group Header */}
                  <div className="flex items-center gap-2 mb-3 mt-4">
                    <div className="h-px bg-border flex-1"></div>
                    <div className="bg-muted px-3 py-1 rounded-full text-sm font-medium">
                      {currency} ({pos.length} PO{pos.length !== 1 ? 's' : ''})
                    </div>
                    <div className="h-px bg-border flex-1"></div>
                  </div>

                  {/* POs in this currency group */}
                  {pos.map((po) => (
                    <button
                      key={po.id}
                      className={cn(
                        "w-full text-left bg-transparent border-none p-0 m-0 relative",
                        selectedPOs.includes(po.id) ? "ring-2 ring-primary/60" : ""
                      )}
                      onClick={() => togglePO(po.id)}
                      tabIndex={0}
                      aria-label={`Select PO ${po.number}`}
                      role="button"
                      onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => { if (e.key === 'Enter' || e.key === ' ') togglePO(po.id); }}
                      aria-pressed={selectedPOs.includes(po.id)}
                    >
                      <Card className="p-4 flex flex-col gap-2 shadow-md rounded-xl cursor-pointer hover:bg-muted">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-sm font-bold">
                              {po.number}
                            </span>
                            <span className="text-muted-foreground text-xs">
                              <span className="font-medium">Delivery date:</span> {po.eta}
                            </span>
                          </div>
                          <span className={`rounded px-2 py-0.5 text-xs
                            ${po.status === "Open" ? "bg-blue-100 text-blue-800"
                              : po.status === "Partial" ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"}`}>{po.status}</span>
                        </div>

                        <div>
                          <div className="font-semibold text-base">
                            {po.description}
                          </div>
                        </div>

                        <div className="flex items-center justify-end text-xs">
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground font-medium">{po.totalValue}</span>
                            {po.currency !== 'USD' && (
                              <span className="text-xs bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200 px-1 rounded">
                                ≈ ${(parseFloat(po.totalValue.replace(/[^0-9.]/g, '')) * po.exchangeRate).toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                        {selectedPOs.includes(po.id) && (
                          <span className="absolute top-2 right-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">✓</span>
                        )}
                      </Card>
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function NewGoodReceiveNotePageWithSuspense() {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <NewGoodReceiveNotePage />
    </Suspense>
  );
}