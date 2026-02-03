import React, { useState, useEffect } from "react";
import { Store, Product, Service, Job } from "@/api/entities";
import { User } from "@/api/entities";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { createStoreUrl } from "@/components/utils/slugUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Package,
  Briefcase,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Search,
  ArrowLeft,
  Loader2,
  FileText,
  Globe
} from "lucide-react";

export default function StoreManagement() {
  const location = useLocation();
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(location.search);
  const storeId = urlParams.get('id');

  const [user, setUser] = useState(null);
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("products");
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (storeId) {
      loadStoreData();
    }
  }, [storeId]);

  const loadStoreData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      const stores = await Store.list();
      const storeData = stores.find(s => s.id === storeId);

      const userIsOwner = storeData && storeData.created_by === userData.id;
      const userIsCoOwner = storeData && storeData.co_owners && storeData.co_owners.includes(userData.email);

      if (!storeData || (!userIsOwner && !userIsCoOwner)) {
        navigate(createPageUrl("MyStores"));
        return;
      }

      setIsOwner(userIsOwner);
      setStore(storeData);

      const [allProducts, allServices, allJobs] = await Promise.all([
        Product.filter({ store_id: storeId }, "-created_date"),
        Service.filter({ store_id: storeId }),
        Job.filter({ store_id: storeId }, "-created_date")
      ]);

      setProducts(allProducts);
      setServices(allServices);
      setJobs(allJobs);
    } catch (error) {
      console.error("Failed to load store data:", error);
      navigate(createPageUrl("MyStores"));
    }
    setLoading(false);
  };

  const deleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await Product.delete(productId);
      await loadStoreData();
    }
  };

  const deleteService = async (serviceId) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      await Service.delete(serviceId);
      await loadStoreData();
    }
  };

  const deleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job posting?")) {
      await Job.delete(jobId);
      await loadStoreData();
    }
  };

  const toggleProductStatus = async (product) => {
    const newStatus = product.status === 'active' ? 'hidden' : 'active';
    await Product.update(product.id, { status: newStatus });
    await loadStoreData();
  };

  const toggleServiceAvailability = async (service) => {
    await Service.update(service.id, { is_available: !service.is_available });
    await loadStoreData();
  };

  const toggleJobStatus = async (job) => {
    const newStatus = job.status === 'active' ? 'closed' : 'active';
    await Job.update(job.id, { status: newStatus });
    await loadStoreData();
  };

  const filteredProducts = products.filter(p =>
    !searchTerm ||
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredServices = services.filter(s =>
    !searchTerm ||
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredJobs = jobs.filter(j =>
    !searchTerm ||
    j.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getProductStats = () => {
    return {
      total: products.length,
      active: products.filter(p => p.status === 'active').length,
      pending: products.filter(p => p.status === 'pending').length,
      hidden: products.filter(p => p.status === 'hidden').length,
      draft: products.filter(p => p.status === 'draft').length
    };
  };

  const getServiceStats = () => {
    return {
      total: services.length,
      available: services.filter(s => s.is_available).length,
      unavailable: services.filter(s => !s.is_available).length
    };
  };

  const getJobStats = () => {
    return {
      total: jobs.length,
      active: jobs.filter(j => j.status === 'active').length,
      closed: jobs.filter(j => j.status === 'closed').length
    };
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <Loader2 className="w-12 h-12 animate-spin text-orange-600" />
    </div>;
  }

  if (!store) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <p className="text-gray-600">Store not found or access denied.</p>
    </div>;
  }

  const productStats = getProductStats();
  const serviceStats = getServiceStats();
  const jobStats = getJobStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl("MyStores")}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{store.name}</h1>
            <p className="text-gray-600 mt-1">Manage your products, services, and jobs</p>
          </div>
          <Link to={createPageUrl(`StoreCMS?id=${store.id}`)}>
            <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50">
              <FileText className="w-4 h-4 mr-2" />
              Website Builder
            </Button>
          </Link>
          {isOwner && (
            <Link to={createPageUrl(`EditStore?id=${store.id}`)}>
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit Store
              </Button>
            </Link>
          )}
          <a href={createStoreUrl(store.slug)}>
            <Button variant="outline">
              <Globe className="w-4 h-4 mr-2" />
              View Store
            </Button>
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-orange-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-orange-600" />
                Products & Goods
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{productStats.total}</div>
                  <div className="text-sm text-gray-500">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{productStats.active}</div>
                  <div className="text-sm text-gray-500">Active</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">{productStats.pending}</div>
                  <div className="text-sm text-gray-500">Pending</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-purple-600" />
                Services & Rentals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{serviceStats.total}</div>
                  <div className="text-sm text-gray-500">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{serviceStats.available}</div>
                  <div className="text-sm text-gray-500">Available</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-600">{serviceStats.unavailable}</div>
                  <div className="text-sm text-gray-500">Unavailable</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                Jobs & Gigs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{jobStats.total}</div>
                  <div className="text-sm text-gray-500">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{jobStats.active}</div>
                  <div className="text-sm text-gray-500">Active</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-600">{jobStats.closed}</div>
                  <div className="text-sm text-gray-500">Closed</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <TabsList className="bg-white border-2 border-orange-100">
              <TabsTrigger value="products" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                <Package className="w-4 h-4 mr-2" />
                Products & Goods ({products.length})
              </TabsTrigger>
              <TabsTrigger value="services" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                <Briefcase className="w-4 h-4 mr-2" />
                Services & Rentals ({services.length})
              </TabsTrigger>
              <TabsTrigger value="jobs" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                <Briefcase className="w-4 h-4 mr-2" />
                Jobs & Gigs ({jobs.length})
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              {activeTab === "products" && (
                <Link to={createPageUrl(`AddProduct?store_id=${store.id}`)}>
                  <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </Link>
              )}
              {activeTab === "services" && (
                <Link to={createPageUrl(`AddService?store_id=${store.id}`)}>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Service
                  </Button>
                </Link>
              )}
              {activeTab === "jobs" && (
                <Link to={createPageUrl(`AddJob?store_id=${store.id}`)}>
                  <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Post Job
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <TabsContent value="products">
            {filteredProducts.length === 0 ? (
              <Card className="border-2 border-orange-100">
                <CardContent className="p-12 text-center">
                  <Package className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {searchTerm ? "No products found" : "No products yet"}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm ? "Try adjusting your search" : "Add your first product to start selling"}
                  </p>
                  {!searchTerm && (
                    <Link to={createPageUrl(`AddProduct?store_id=${store.id}`)}>
                      <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
                        <Plus className="w-5 h-5 mr-2" />
                        Add First Product
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map(product => (
                  <Card key={product.id} className="border-2 border-orange-100">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="w-24 h-24 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg overflow-hidden flex-shrink-0">
                          {product.images && product.images.length > 0 ? (
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
                              <p className="text-sm text-gray-500">{product.category.replace(/_/g, ' ')}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={
                                product.status === 'active' ? 'bg-green-100 text-green-800' :
                                product.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                product.status === 'hidden' ? 'bg-gray-100 text-gray-800' :
                                'bg-blue-100 text-blue-800'
                              }>
                                {product.status}
                              </Badge>
                              <Badge variant="outline" className="border-orange-200">
                                {product.condition.replace(/_/g, ' ')}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-3 line-clamp-2">{product.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <span className="text-2xl font-bold text-orange-600">
                                ${product.price.toFixed(2)}
                              </span>
                              {product.stock_quantity !== undefined && (
                                <span className="text-sm text-gray-500">
                                  Stock: {product.stock_quantity}
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleProductStatus(product)}
                              >
                                {product.status === 'active' ? (
                                  <><EyeOff className="w-4 h-4 mr-2" /> Hide</>
                                ) : (
                                  <><Eye className="w-4 h-4 mr-2" /> Show</>
                                )}
                              </Button>
                              <Link to={createPageUrl(`EditProduct?id=${product.id}`)}>
                                <Button variant="outline" size="sm">
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </Button>
                              </Link>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteProduct(product.id)}
                                className="border-red-200 text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="services">
            {filteredServices.length === 0 ? (
              <Card className="border-2 border-purple-100">
                <CardContent className="p-12 text-center">
                  <Briefcase className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {searchTerm ? "No services found" : "No services yet"}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm ? "Try adjusting your search" : "Add your first service to start offering"}
                  </p>
                  {!searchTerm && (
                    <Link to={createPageUrl(`AddService?store_id=${store.id}`)}>
                      <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                        <Plus className="w-5 h-5 mr-2" />
                        Add First Service
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredServices.map(service => (
                  <Card key={service.id} className="border-2 border-purple-100">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="w-24 h-24 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg overflow-hidden flex-shrink-0">
                          {service.image_url ? (
                            <img src={service.image_url} alt={service.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Briefcase className="w-8 h-8 text-purple-300" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{service.name}</h3>
                              <p className="text-sm text-gray-500">{service.category.replace(/_/g, ' ')}</p>
                            </div>
                            <Badge className={service.is_available ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                              {service.is_available ? 'Available' : 'Unavailable'}
                            </Badge>
                          </div>
                          <p className="text-gray-700 mb-3 line-clamp-2">{service.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <span className="text-2xl font-bold text-purple-600">
                                ${service.price.toFixed(2)}
                                <span className="text-sm text-gray-500 font-normal ml-1">
                                  {service.price_type === 'hourly' ? '/hr' :
                                   service.price_type === 'per_project' ? '/project' :
                                   service.price_type === 'negotiable' ? '(negotiable)' : ''}
                                </span>
                              </span>
                              {service.availability && (
                                <span className="text-sm text-gray-500">
                                  {service.availability}
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleServiceAvailability(service)}
                              >
                                {service.is_available ? (
                                  <><EyeOff className="w-4 h-4 mr-2" /> Disable</>
                                ) : (
                                  <><Eye className="w-4 h-4 mr-2" /> Enable</>
                                )}
                              </Button>
                              <Link to={createPageUrl(`EditService?id=${service.id}`)}>
                                <Button variant="outline" size="sm">
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </Button>
                              </Link>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteService(service.id)}
                                className="border-red-200 text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="jobs">
            {filteredJobs.length === 0 ? (
              <Card className="border-2 border-blue-100">
                <CardContent className="p-12 text-center">
                  <Briefcase className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {searchTerm ? "No jobs found" : "No job postings yet"}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm ? "Try adjusting your search" : "Post your first job opening"}
                  </p>
                  {!searchTerm && (
                    <Link to={createPageUrl(`AddJob?store_id=${store.id}`)}>
                      <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                        <Plus className="w-5 h-5 mr-2" />
                        Post First Job
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map(job => (
                  <Card key={job.id} className="border-2 border-blue-100">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                              {job.company && <p className="text-sm text-gray-500">{job.company}</p>}
                            </div>
                            <Badge className={job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                              {job.status}
                            </Badge>
                          </div>
                          {job.description && (
                            <p className="text-gray-700 mb-3 line-clamp-2">{job.description}</p>
                          )}
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                            {job.location && (
                              <div className="flex items-center gap-1">
                                <Badge variant="outline">{job.location}</Badge>
                              </div>
                            )}
                            {job.job_type && (
                              <div className="flex items-center gap-1">
                                <Badge variant="outline">{job.job_type.replace(/_/g, ' ')}</Badge>
                              </div>
                            )}
                            {job.salary_range && (
                              <div className="flex items-center gap-1">
                                <Badge variant="outline">{job.salary_range}</Badge>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleJobStatus(job)}
                            >
                              {job.status === 'active' ? (
                                <><EyeOff className="w-4 h-4 mr-2" /> Close</>
                              ) : (
                                <><Eye className="w-4 h-4 mr-2" /> Reopen</>
                              )}
                            </Button>
                            <Link to={createPageUrl(`EditJob?id=${job.id}`)}>
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteJob(job.id)}
                              className="border-red-200 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}