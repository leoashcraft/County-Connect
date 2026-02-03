
import React, { useState, useEffect } from "react";
import { User, UserEntity } from "@/api/entities";
import { Store, Product, Service } from "@/api/entities";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Store as StoreIcon, 
  Search, 
  Eye, 
  EyeOff,
  MapPin,
  Phone,
  Mail,
  Package,
  Briefcase,
  Crown,
  Users
} from "lucide-react";


export default function AdminStores() {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState({});
  const [productCounts, setProductCounts] = useState({});
  const [serviceCounts, setServiceCounts] = useState({});
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const userData = await User.me();
      if (userData.role !== 'admin') {
        navigate(createPageUrl("Marketplace"));
        return;
      }
      await loadStores();
    } catch (error) {
      navigate(createPageUrl("Marketplace"));
    }
  };

  const loadStores = async () => {
    const [allStores, allUsers, allProducts, allServices] = await Promise.all([
      Store.list('-created_date'),
      UserEntity.list(),
      Product.list(),
      Service.list()
    ]);
    
    const usersMap = {};
    allUsers.forEach(u => usersMap[u.email] = u);
    
    const prodCounts = {};
    const servCounts = {};
    
    allStores.forEach(store => {
      prodCounts[store.id] = allProducts.filter(p => p.store_id === store.id).length;
      servCounts[store.id] = allServices.filter(s => s.store_id === store.id).length;
    });
    
    setStores(allStores);
    setUsers(usersMap);
    setProductCounts(prodCounts);
    setServiceCounts(servCounts);
    setLoading(false);
  };

  const toggleStoreStatus = async (storeId, currentStatus) => {
    await Store.update(storeId, { is_active: !currentStatus });
    await loadStores();
  };

  const filteredStores = stores.filter(s => {
    const matchesFilter = filter === "all" || 
      (filter === "active" && s.is_active) || 
      (filter === "inactive" && !s.is_active);
    
    const matchesSearch = !searchTerm || 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      users[s.created_by]?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <StoreIcon className="w-12 h-12 text-orange-600 animate-pulse" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Stores</h1>
          <p className="text-gray-600 mt-2">View and manage all marketplace stores</p>
        </div>

        {/* Filters */}
        <Card className="border-2 border-orange-100 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search stores, categories, or owners..."
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
                  <SelectItem value="all">All Stores</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Stores List */}
        <div className="space-y-4">
          {filteredStores.length === 0 ? (
            <Card className="border-2 border-orange-100">
              <CardContent className="p-12 text-center">
                <StoreIcon className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No stores found</h3>
                <p className="text-gray-600">Try adjusting your filters</p>
              </CardContent>
            </Card>
          ) : (
            filteredStores.map(store => {
              const owner = users[store.created_by];
              const coOwnerCount = store.co_owners?.length || 0;
              
              // Use store.slug if available, otherwise fallback to generated slug or ID
              const slug = store.slug || 
                (store.name ? store.name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-') : store.id);
              const storeUrl = `/StoreView?store=${slug}`;
              
              return (
                <Card key={store.id} className="border-2 border-orange-100">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg overflow-hidden flex-shrink-0">
                        {store.logo_url ? (
                          <img src={store.logo_url} alt={store.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <StoreIcon className="w-8 h-8 text-orange-300" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{store.name}</h3>
                            <p className="text-sm text-gray-500">
                              Category: {store.category.replace(/_/g, ' ')}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={store.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                              {store.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>

                        {store.description && (
                          <p className="text-gray-700 mb-3 line-clamp-2">{store.description}</p>
                        )}

                        <div className="grid md:grid-cols-2 gap-2 mb-3">
                          {store.location && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="w-4 h-4" />
                              {store.location}
                            </div>
                          )}
                          {store.contact_phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="w-4 h-4" />
                              {store.contact_phone}
                            </div>
                          )}
                          {store.contact_email && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="w-4 h-4" />
                              {store.contact_email}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-sm">
                              <Crown className="w-4 h-4 text-yellow-600" />
                              <span className="text-gray-600">
                                Owner: <span className="font-medium text-gray-900">
                                  {owner?.full_name || store.created_by}
                                </span>
                              </span>
                            </div>
                            {coOwnerCount > 0 && (
                              <div className="flex items-center gap-2 text-sm">
                                <Users className="w-4 h-4 text-blue-600" />
                                <span className="text-gray-600">
                                  {coOwnerCount} Co-{coOwnerCount === 1 ? 'Owner' : 'Owners'}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <Package className="w-4 h-4 text-orange-600" />
                                <span className="font-semibold text-gray-900">{productCounts[store.id] || 0}</span>
                                <span className="text-gray-500">Products</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Briefcase className="w-4 h-4 text-purple-600" />
                                <span className="font-semibold text-gray-900">{serviceCounts[store.id] || 0}</span>
                                <span className="text-gray-500">Services</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              onClick={() => toggleStoreStatus(store.id, store.is_active)}
                              variant="outline"
                              size="sm"
                            >
                              {store.is_active ? (
                                <><EyeOff className="w-4 h-4 mr-2" /> Deactivate</>
                              ) : (
                                <><Eye className="w-4 h-4 mr-2" /> Activate</>
                              )}
                            </Button>
                            <a href={storeUrl}>
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-2" />
                                View Store
                              </Button>
                            </a>
                          </div>
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
