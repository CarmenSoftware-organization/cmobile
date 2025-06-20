"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Search, Filter, ChevronDown, ChevronUp, Package, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getProductsByLocation, searchProducts, getCategories, type InventoryItem } from "@/data/mockInventoryData";

const selectionMethods = [
  {
    id: "random",
    name: "Random Selection",
    description: "System randomly selects items for checking",
    icon: "🎲",
    recommended: true
  },
  {
    id: "highvalue",
    name: "High Value Items",
    description: "Focus on items with highest monetary value",
    icon: "💎",
    recommended: false
  },
  {
    id: "manual",
    name: "Manual Selection",
    description: "Manually choose specific items to check",
    icon: "✋",
    recommended: false
  }
];

function SpotCheckMethodContent() {
  const [method, setMethod] = useState("random");
  const [minValue, setMinValue] = useState(50);
  const [itemCount, setItemCount] = useState(20);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const location = searchParams.get("location") || "";
  const locationId = searchParams.get("locationId") || "";

  // Manual selection state
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [availableProducts, setAvailableProducts] = useState<InventoryItem[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<InventoryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);

  const categories = getCategories(location);
  
  // Load products when location changes
  useEffect(() => {
    if (location) {
      const products = getProductsByLocation(location);
      setAvailableProducts(products);
      setFilteredProducts(products);
      setSelectedProducts(new Set());
      setProductSearchQuery("");
      setSelectedCategory("All");
    } else {
      setAvailableProducts([]);
      setFilteredProducts([]);
    }
  }, [location]);
  
  // Filter products based on search and category
  useEffect(() => {
    let filtered = availableProducts;
    
    // Apply search filter
    if (productSearchQuery.trim()) {
      filtered = searchProducts(productSearchQuery, location);
    }
    
    // Apply category filter
    if (selectedCategory && selectedCategory !== "All") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    setFilteredProducts(filtered);
  }, [productSearchQuery, selectedCategory, availableProducts, location]);

  const handleBack = () => {
    router.push("/spot-check/location");
  };

  const handleStartSpotCheck = () => {
    let queryParams = `method=${method}&location=${encodeURIComponent(location)}`;
    
    // Add minValue for high value method
    if (method === "highvalue") {
      queryParams += `&minValue=${minValue}`;
    }
    
    if (method === "manual") {
      // For manual selection, pass selected product SKUs
      const selectedSKUs = Array.from(selectedProducts);
      queryParams += `&count=${selectedSKUs.length}&products=${selectedSKUs.join(',')}`;
    } else {
      // For other methods, use item count
      queryParams += `&count=${itemCount}`;
    }
    
    router.push(`/spot-check/session/${locationId}?${queryParams}`);
  };
  
  // Product selection handlers
  const handleProductToggle = (sku: string) => {
    const newSelection = new Set(selectedProducts);
    if (newSelection.has(sku)) {
      newSelection.delete(sku);
    } else {
      newSelection.add(sku);
    }
    setSelectedProducts(newSelection);
  };
  
  const handleSelectAll = () => {
    setSelectedProducts(new Set(filteredProducts.map(p => p.sku)));
  };
  
  const handleClearAll = () => {
    setSelectedProducts(new Set());
  };

  const getMethodName = () => {
    switch (method) {
      case "random": return "Random Selection";
      case "highvalue": return "High Value Items";
      case "manual": return "Manual Selection";
      default: return "Unknown";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <header className="p-4 border-b bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-2">
          <button 
            onClick={handleBack}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          
          {/* Progress Indicator */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 flex-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Step 1: Location ✓</span>
              <span className="text-blue-600 dark:text-blue-400 font-medium">Step 2: Method & Items</span>
            </div>
            <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-1 mt-2">
              <div className="bg-blue-600 h-1 rounded-full" style={{ width: "100%" }}></div>
            </div>
          </div>
        </div>
        
        {/* Selected Location */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Selected Location:</strong> {location}
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 flex flex-col gap-6">
        {/* Selection Method */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <label className="block font-medium mb-3 text-gray-900 dark:text-gray-100">
            Item Selection Method
          </label>
          
          <div className="space-y-3">
            {selectionMethods.map(methodOption => (
              <div
                key={methodOption.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  method === methodOption.id 
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400" 
                    : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500"
                }`}
                onClick={() => setMethod(methodOption.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{methodOption.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-medium text-gray-900 dark:text-gray-100">{methodOption.name}</div>
                      {methodOption.recommended && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded text-xs font-medium">
                          Recommended
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{methodOption.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* High Value Configuration */}
        {method === "highvalue" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
            <label className="block font-medium mb-3 text-gray-900 dark:text-gray-100">
              Minimum Value Threshold
            </label>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-gray-700 dark:text-gray-300">$</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={minValue}
                  onChange={(e) => setMinValue(Number(e.target.value))}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Enter minimum value"
                />
              </div>
              
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Note:</strong> Only items with total value (unit price × quantity) of ${minValue} or higher will be included in the selection.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Number of Items (for non-manual methods) */}
        {method !== "manual" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
            <label className="block font-medium mb-3 text-gray-900 dark:text-gray-100">
              Number of Items to Check
            </label>
            
            <div className="grid grid-cols-3 gap-3">
              {[10, 20, 50].map(n => (
                <button
                  key={n}
                  className={`py-3 rounded-lg border font-medium transition-all ${
                    itemCount === n 
                      ? "border-blue-600 bg-blue-600 text-white" 
                      : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-400"
                  }`}
                  onClick={() => setItemCount(n)}
                >
                  {n} Items
                </button>
              ))}
            </div>
            
            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Recommendation:</strong> Start with 20 items for balanced coverage and efficiency.
                Use 10 for quick checks or 50 for comprehensive audits.
              </div>
            </div>
          </div>
        )}

        {/* Manual Product Selection */}
        {method === "manual" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Select Products to Check
              </h3>
              <Badge variant="secondary">
                {selectedProducts.size} selected
              </Badge>
            </div>
            
            {/* Search and Filter Controls */}
            <div className="space-y-3 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search products by name, SKU, or category..."
                  className="pl-10"
                  value={productSearchQuery}
                  onChange={(e) => setProductSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCategoryFilter(!showCategoryFilter)}
                  className="flex items-center gap-1"
                >
                  <Filter className="w-3 h-3" />
                  Category: {selectedCategory}
                  {showCategoryFilter ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  disabled={filteredProducts.length === 0}
                >
                  Select All ({filteredProducts.length})
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                  disabled={selectedProducts.size === 0}
                >
                  Clear All
                </Button>
              </div>
              
              {showCategoryFilter && (
                <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <button
                    className={`p-2 text-left rounded text-sm transition-colors ${
                      selectedCategory === "All"
                        ? "bg-blue-600 text-white"
                        : "bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500"
                    }`}
                    onClick={() => setSelectedCategory("All")}
                  >
                    All Categories
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      className={`p-2 text-left rounded text-sm transition-colors ${
                        selectedCategory === category
                          ? "bg-blue-600 text-white"
                          : "bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500"
                      }`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  {productSearchQuery || selectedCategory !== "All" 
                    ? "No products match your search criteria."
                    : "No products available in this location."
                  }
                </div>
              ) : (
                filteredProducts.map((product) => {
                  const isSelected = selectedProducts.has(product.sku);
                  return (
                    <div
                      key={product.sku}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400"
                          : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500"
                      }`}
                      onClick={() => handleProductToggle(product.sku)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
                          isSelected
                            ? "border-blue-600 bg-blue-600"
                            : "border-gray-300 dark:border-gray-500"
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                              {product.product}
                            </h4>
                            <Badge variant="secondary" className="text-xs ml-2">
                              {product.sku}
                            </Badge>
                          </div>
                          
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {product.description}
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-3">
                              <span className="bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                                {product.category}
                              </span>
                              <span>Qty: {product.systemQty} {product.unit}</span>
                              <span>${product.unitPrice.toFixed(2)}</span>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">${product.totalValue.toFixed(2)}</div>
                              <div>Updated: {product.lastUpdated}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            
            {selectedProducts.size > 0 && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="text-sm text-green-700 dark:text-green-300">
                  <strong>{selectedProducts.size} products selected</strong> for spot check.
                  Estimated time: {Math.ceil(selectedProducts.size * 1.5)} minutes.
                </div>
              </div>
            )}
          </div>
        )}

        {/* Session Preview */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
          <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Spot Check Preview</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-700 dark:text-blue-300">Location:</span>
              <span className="font-medium text-blue-900 dark:text-blue-100">{location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700 dark:text-blue-300">Method:</span>
              <span className="font-medium text-blue-900 dark:text-blue-100">{getMethodName()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700 dark:text-blue-300">Items to Check:</span>
              <span className="font-medium text-blue-900 dark:text-blue-100">
                {method === "manual" ? selectedProducts.size : itemCount}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700 dark:text-blue-300">Estimated Time:</span>
              <span className="font-medium text-blue-900 dark:text-blue-100">
                {Math.ceil((method === "manual" ? selectedProducts.size : itemCount) * 1.5)} minutes
              </span>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <button
          className="w-full py-4 bg-blue-700 hover:bg-blue-800 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors disabled:cursor-not-allowed text-lg"
          disabled={method === "manual" && selectedProducts.size === 0}
          onClick={handleStartSpotCheck}
        >
          {method === "manual" && selectedProducts.size === 0
            ? "Select Products to Continue"
            : "Start Spot Check Session"
          }
        </button>
      </main>
    </div>
  );
}

export default function SpotCheckMethodPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <SpotCheckMethodContent />
    </Suspense>
  );
}