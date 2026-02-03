import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Product, Store } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, CheckCircle, XCircle, Eye, Search } from "lucide-react";

export default function AdminProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState({});
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const loadingRef = React.useRef(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    // Prevent multiple simultaneous loads
    if (loadingRef.current) {
      console.log("Admin products load already in progress, skipping");
      return;
    }

    loadingRef.current = true;
    setLoading(true);

    try {
      const userData = await User.me();
      if (userData.role !== 'admin') {
        navigate(createPageUrl("Marketplace"));
        return;
      }
      await loadProducts();
    } catch (error) {
      console.error("Error loading admin products:", error);
      // Only redirect if authentication failed
      if (error.message?.includes('Authentication required') || error.message?.includes('not authenticated')) {
        navigate(createPageUrl("Marketplace"));
      }
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  const loadProducts = async () => {
    try {
      const [allProducts, allStores] = await Promise.all([
        Product.list('-created_date'),
        Store.list()
      ]);

      const storesMap = {};
      allStores.forEach(s => storesMap[s.id] = s);

      setProducts(allProducts);
      setStores(storesMap);
    } catch (error) {
      console.error("Error loading products list:", error);
      throw error; // Re-throw to be caught by checkAdminAccess
    }
  };

  const updateProductStatus = async (productId, newStatus) => {
    await Product.update(productId, { status: newStatus });
    await loadProducts();
  };

  const filteredProducts = products.filter(p => {
    const matchesFilter = filter === "all" || p.status === filter;
    const matchesSearch = !searchTerm || 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stores[p.store_id]?.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const statusColors = {
    active: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    hidden: "bg-gray-100 text-gray-800",
    draft: "bg-blue-100 text-blue-800"
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <Package className="w-12 h-12 text-orange-600 animate-pulse" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Products</h1>
          <p className="text-gray-600 mt-2">Review and moderate all marketplace products</p>
        </div>

        {/* Filters */}
        <Card className="border-2 border-orange-100 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search products or stores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="pending">Pending Review</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="hidden">Hidden</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Products List */}
        <div className="space-y-4">
          {filteredProducts.length === 0 ? (
            <Card className="border-2 border-orange-100">
              <CardContent className="p-12 text-center">
                <Package className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No products found</h3>
                <p className="text-gray-600">Try adjusting your filters</p>
              </CardContent>
            </Card>
          ) : (
            filteredProducts.map(product => {
              const store = stores[product.store_id];
              return (
                <Card key={product.id} className="border-2 border-orange-100">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg overflow-hidden flex-shrink-0">
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-8 h-8 text-orange-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                            <p className="text-sm text-gray-500">
                              Store: {store?.name || 'Unknown'} • Category: {product.category}
                            </p>
                          </div>
                          <Badge className={statusColors[product.status]}>
                            {product.status}
                          </Badge>
                        </div>
                        <p className="text-gray-700 mb-3 line-clamp-2">{product.description}</p>
                        <div className="flex items-center gap-4">
                          <span className="text-2xl font-bold text-orange-600">
                            ${product.price.toFixed(2)}
                          </span>
                          {product.stock_quantity && (
                            <span className="text-sm text-gray-500">
                              Stock: {product.stock_quantity}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2 mt-4">
                          {product.status === 'pending' && (
                            <>
                              <Button
                                onClick={() => updateProductStatus(product.id, 'active')}
                                className="bg-green-600 hover:bg-green-700"
                                size="sm"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Approve
                              </Button>
                              <Button
                                onClick={() => updateProductStatus(product.id, 'hidden')}
                                variant="outline"
                                size="sm"
                                className="border-red-200 text-red-600 hover:bg-red-50"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject
                              </Button>
                            </>
                          )}
                          {product.status === 'active' && (
                            <Button
                              onClick={() => updateProductStatus(product.id, 'hidden')}
                              variant="outline"
                              size="sm"
                            >
                              Hide Product
                            </Button>
                          )}
                          {product.status === 'hidden' && (
                            <Button
                              onClick={() => updateProductStatus(product.id, 'active')}
                              className="bg-green-600 hover:bg-green-700"
                              size="sm"
                            >
                              Activate
                            </Button>
                          )}
                          <Button
                            onClick={() => window.open(createPageUrl(`ProductDetail?id=${product.id}`), '_blank')}
                            variant="outline"
                            size="sm"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}