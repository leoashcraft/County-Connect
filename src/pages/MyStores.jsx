
import React, { useState, useEffect } from "react";
import { Store, Product, Service, StoreInvitation } from "@/api/entities";
import { User, UserEntity } from "@/api/entities";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { createStoreUrl } from "@/components/utils/slugUtils"; // This import is kept, though the local storeUrl generation is prioritized for the 'View' link as per changes
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Store as StoreIcon,
  Plus,
  Package,
  Briefcase,
  Edit,
  Eye,
  MapPin,
  Phone,
  Mail,
  TrendingUp,
  Crown,
  Users,
  UserPlus,
  X,
  Search,
  Loader2,
  Trash2,
  ArrowLeft
} from "lucide-react";

export default function MyStores() {
  console.log("MyStores: Component rendering");

  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [ownedStores, setOwnedStores] = useState([]);
  const [coOwnedStores, setCoOwnedStores] = useState([]);
  const [pendingInvitations, setPendingInvitations] = useState([]);
  const [productsCount, setProductsCount] = useState({});
  const [servicesCount, setServicesCount] = useState({});
  const [loading, setLoading] = useState(true);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [inviting, setInviting] = useState(false);
  const [inviteMessage, setInviteMessage] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [isLoadingStores, setIsLoadingStores] = useState(false);
  const isFirstMount = React.useRef(true);

  useEffect(() => {
    loadStores();

    // Listen for store updates (e.g., when products/services are added/removed)
    const handleStoreUpdate = () => {
      loadStores();
    };

    window.addEventListener('storeUpdated', handleStoreUpdate);

    return () => {
      window.removeEventListener('storeUpdated', handleStoreUpdate);
    };
  }, []);

  // Reload when navigating back to this page (but not on first mount)
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    if (location.pathname === '/MyStores') {
      console.log("Reloading stores due to navigation");
      loadStores();
    }
  }, [location.pathname]);

  const loadStores = async () => {
    // Prevent multiple simultaneous loads
    if (isLoadingStores) {
      console.log("Already loading stores, skipping...");
      return;
    }

    setIsLoadingStores(true);
    setLoading(true); // Show loading spinner while fetching
    console.log("Loading stores and counts...");

    try {
      const userData = await User.me();
      setUser(userData);

      // Fetch stores and invitations - NOT including User.list() here
      const [allStores, invitations] = await Promise.all([
        Store.list(),
        StoreInvitation.filter({ invitee_email: userData.email, status: "pending" })
      ]);

      setPendingInvitations(invitations);

      // Stores owned by user (compare with user ID)
      const owned = allStores.filter(s => s.created_by === userData.id);
      const coOwned = allStores.filter(s =>
        s.co_owners && s.co_owners.includes(userData.email)
      );
      const allUserStores = [...owned, ...coOwned];

      console.log("User stores:", allUserStores.length);

      // Load products and services in parallel
      const [allProducts, allServices] = await Promise.all([
        Product.list(),
        Service.list()
      ]);

      console.log("Total products:", allProducts.length);
      console.log("Total services:", allServices.length);

      // Calculate counts
      const productCounts = {};
      const serviceCounts = {};

      allUserStores.forEach(store => {
        const productCount = allProducts.filter(p => p.store_id === store.id).length;
        const serviceCount = allServices.filter(s => s.store_id === store.id).length;
        productCounts[store.id] = productCount;
        serviceCounts[store.id] = serviceCount;
        console.log(`Store ${store.name} (${store.id}): ${productCount} products, ${serviceCount} services`);
      });

      // Set all states together to avoid partial updates
      setOwnedStores(owned);
      setCoOwnedStores(coOwned);
      setProductsCount(productCounts);
      setServicesCount(serviceCounts);

      // Try to load users if admin, otherwise skip
      try {
        const users = await UserEntity.list();
        setAllUsers(users);
      } catch (error) {
        // This is expected if the current user does not have admin permissions
        console.log("Cannot load all users (not admin or permission denied)");
        setAllUsers([]);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error loading stores:", error);
      // Only redirect if user is not authenticated
      if (error.message && error.message.includes("not authenticated")) {
        navigate(createPageUrl("Marketplace"));
      } else {
        // User is authenticated but there was another error, just stop loading
        setLoading(false);
      }
    } finally {
      setIsLoadingStores(false);
      console.log("Finished loading stores");
    }
  };

  const loadUsersForInvite = async () => {
    // Only load users if the list is currently empty
    if (allUsers.length > 0 && !loadingUsers) return;

    setLoadingUsers(true);
    try {
      const users = await UserEntity.list();
      setAllUsers(users);
    } catch (error) {
      console.error("Failed to load users for invitation:", error);
      alert("Unable to load user list for invitation. You may not have sufficient permissions.");
      setAllUsers([]);
    }
    setLoadingUsers(false);
  };

  const handleInviteCoOwner = async (store) => {
    setSelectedStore(store);
    setSearchTerm("");
    setInviteMessage("");
    setInviteDialogOpen(true);
    await loadUsersForInvite();
  };

  const handleSelectUser = async (selectedUser) => {
    if (!selectedUser || !selectedStore) return;

    setInviting(true);
    try {
      const currentCoOwners = selectedStore.co_owners || [];

      // Check if already co-owner
      if (currentCoOwners.includes(selectedUser.email)) {
        alert("This user is already a co-owner of this store");
        setInviting(false);
        return;
      }

      // Check if owner (compare IDs)
      if (selectedStore.created_by === selectedUser.id) {
        alert("This user is the owner of the store");
        setInviting(false);
        return;
      }

      // Check for existing pending invitation
      const existingInvites = await StoreInvitation.filter({
        store_id: selectedStore.id,
        invitee_email: selectedUser.email,
        status: "pending"
      });

      if (existingInvites.length > 0) {
        alert("An invitation has already been sent to this user");
        setInviting(false);
        return;
      }

      // Create invitation
      await StoreInvitation.create({
        store_id: selectedStore.id,
        store_name: selectedStore.name,
        inviter_email: user.email,
        invitee_email: selectedUser.email,
        message: inviteMessage,
        status: "pending"
      });

      alert(`Invitation sent to ${selectedUser.full_name || selectedUser.email}`);
      setInviteDialogOpen(false);
      setSearchTerm("");
      setInviteMessage("");
    } catch (error) {
      console.error("Failed to send invitation:", error);
      alert("Failed to send invitation");
    }
    setInviting(false);
  };

  const handleAcceptInvitation = async (invitation) => {
    try {
      const stores = await Store.list();
      const store = stores.find(s => s.id === invitation.store_id);

      if (!store) {
        alert("Store not found or no longer exists.");
        await StoreInvitation.update(invitation.id, { status: "declined" });
        await loadStores();
        return;
      }

      const currentCoOwners = store.co_owners || [];
      // Ensure user is not already a co-owner before adding
      if (!currentCoOwners.includes(user.email)) {
        await Store.update(store.id, {
          co_owners: [...currentCoOwners, user.email]
        });
      } else {
        alert("You are already a co-owner of this store.");
      }

      await StoreInvitation.update(invitation.id, { status: "accepted" });
      await loadStores();
    } catch (error) {
      console.error("Failed to accept invitation:", error);
      alert("Failed to accept invitation");
    }
  };

  const handleDeclineInvitation = async (invitation) => {
    try {
      await StoreInvitation.update(invitation.id, { status: "declined" });
      await loadStores();
    } catch (error) {
      console.error("Failed to decline invitation:", error);
      alert("Failed to decline invitation");
    }
  };

  const handleRemoveCoOwner = async (store, coOwnerEmail) => {
    const coOwnerName = getUserName(coOwnerEmail);
    if (!window.confirm(`Remove ${coOwnerName} as co-owner?`)) return;

    try {
      const currentCoOwners = store.co_owners || [];
      await Store.update(store.id, {
        co_owners: currentCoOwners.filter(email => email !== coOwnerEmail)
      });
      await loadStores();
    } catch (error) {
      console.error("Failed to remove co-owner:", error);
    }
  };

  const handleLeaveStore = async (store) => {
    if (!window.confirm(`Are you sure you want to leave ${store.name}? You'll need to be invited again to regain access.`)) return;

    try {
      const currentCoOwners = store.co_owners || [];
      await Store.update(store.id, {
        co_owners: currentCoOwners.filter(email => email !== user.email)
      });
      await loadStores();
    } catch (error) {
      console.error("Failed to leave store:", error);
      alert("Failed to leave store");
    }
  };

  const handleDeleteStore = async (store) => {
    const confirmMessage = `Are you sure you want to delete ${store.name}? This action cannot be undone and will delete all products and services associated with this store.`;
    if (!window.confirm(confirmMessage)) return;

    // Double confirmation for safety
    if (!window.confirm("This is permanent. Are you absolutely sure?")) return;

    try {
      // Delete all products in the store
      const allProducts = await Product.list();
      const storeProducts = allProducts.filter(p => p.store_id === store.id);
      for (const product of storeProducts) {
        await Product.delete(product.id);
      }

      // Delete all services in the store
      const allServices = await Service.list();
      const storeServices = allServices.filter(s => s.store_id === store.id);
      for (const service of storeServices) {
        await Service.delete(service.id);
      }

      // Delete the store
      await Store.delete(store.id);
      await loadStores();
    } catch (error) {
      console.error("Failed to delete store:", error);
      alert("Failed to delete store");
    }
  };

  const getFilteredUsers = () => {
    if (!searchTerm) return [];

    return allUsers.filter(u =>
      u.email !== user?.email && // Exclude current user
      u.id !== selectedStore?.created_by && // Exclude store owner (compare IDs)
      !(selectedStore?.co_owners || []).includes(u.email) && // Exclude existing co-owners
      (u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       u.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const getUserName = (email) => {
    const foundUser = allUsers.find(u => u.email === email);
    return foundUser?.full_name || email;
  };

  const getInitials = (email) => {
    const foundUser = allUsers.find(u => u.email === email);
    if (foundUser?.full_name) {
      const initials = foundUser.full_name.split(' ').map(n => n[0]).join('').toUpperCase();
      return initials.length > 0 ? initials : email.charAt(0).toUpperCase();
    }
    return email.charAt(0).toUpperCase();
  };

  const renderStoreCard = (store, isOwner) => {
    // Use store.slug if available, otherwise fallback to generated slug or ID
    const slug = store.slug ||
      (store.name ? store.name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-') : store.id);
    const storeUrl = `/StoreView?store=${slug}`;

    return (
      <Card key={store.id} className="border-2 border-orange-100 hover:shadow-lg transition-all h-full flex flex-col">
        <div className="relative h-48 bg-gradient-to-br from-orange-50 to-amber-50 overflow-hidden">
          {store.banner_url ? (
            <img
              src={store.banner_url}
              alt={store.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <StoreIcon className="w-16 h-16 text-orange-300" />
            </div>
          )}
          {store.logo_url && (
            <div className="absolute bottom-4 left-4 w-20 h-20 bg-white rounded-full border-4 border-white shadow-lg overflow-hidden">
              <img src={store.logo_url} alt={store.name} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="absolute top-4 right-4 flex gap-2">
            <Badge className={store.is_active ? "bg-green-500" : "bg-gray-500"}>
              {store.is_active ? "Active" : "Inactive"}
            </Badge>
            {isOwner ? (
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0">
                <Crown className="w-3 h-3 mr-1" />
                Owner
              </Badge>
            ) : (
              <Badge className="bg-gradient-to-r from-blue-400 to-purple-400 text-white border-0">
                <Users className="w-3 h-3 mr-1" />
                Co-Owner
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="p-6 flex-1 flex flex-col">
          <div className="flex-1 flex flex-col">
            <div>
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{store.name}</h3>
                <Badge variant="outline" className="border-orange-200">
                  {store.category.replace(/_/g, ' ')}
                </Badge>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {store.description || "No description provided"}
              </p>

              <div className="space-y-2 mb-4">
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

              {isOwner && store.co_owners && store.co_owners.length > 0 && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs font-semibold text-blue-900 mb-2 flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    Co-Owners ({store.co_owners.length})
                  </p>
                  <div className="space-y-1">
                    {store.co_owners.map((coOwner, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="text-blue-800">{getUserName(coOwner)}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-red-600 hover:bg-red-50"
                          onClick={() => handleRemoveCoOwner(store, coOwner)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-auto">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-orange-50 p-3 rounded-lg text-center">
                  <Package className="w-5 h-5 mx-auto mb-1 text-orange-600" />
                  <p className="text-2xl font-bold text-gray-900">{productsCount[store.id] || 0}</p>
                  <p className="text-xs text-gray-500">Products</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg text-center">
                  <Briefcase className="w-5 h-5 mx-auto mb-1 text-purple-600" />
                  <p className="text-2xl font-bold text-gray-900">{servicesCount[store.id] || 0}</p>
                  <p className="text-xs text-gray-500">Services</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex gap-2">
              <a href={storeUrl} className="flex-1">
                <Button variant="outline" className="w-full border-orange-200">
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
              </a>
              <Link to={createPageUrl(`StoreManagement?id=${store.id}`)} className="flex-1">
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Manage
                </Button>
              </Link>
            </div>

            <div className="pt-2 border-t border-gray-200 space-y-2">
              {isOwner ? (
                <>
                  <Button
                    variant="outline"
                    className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
                    onClick={() => handleInviteCoOwner(store)}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite Co-Owner
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => handleDeleteStore(store)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Store
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  className="w-full border-red-200 text-red-600 hover:bg-red-50"
                  onClick={() => handleLeaveStore(store)}
                >
                  <X className="w-4 h-4 mr-2" />
                  Leave Store
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <StoreIcon className="w-12 h-12 text-orange-600 animate-pulse" />
    </div>;
  }

  const allStores = [...ownedStores, ...coOwnedStores];
  const filteredUsers = getFilteredUsers();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="outline"
          onClick={() => navigate(createPageUrl("Dashboard"))}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Businesses</h1>
            <p className="text-gray-600 mt-2">
              Manage your businesses • {ownedStores.length} owned, {coOwnedStores.length} co-owned
            </p>
          </div>
          <Link to={createPageUrl("AddStore")}>
            <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
              <Plus className="w-5 h-5 mr-2" />
              Add New
            </Button>
          </Link>
        </div>

        {/* Pending Invitations */}
        {pendingInvitations.length > 0 && (
          <Card className="border-2 border-blue-200 bg-blue-50 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Mail className="w-5 h-5" />
                Store Invitations ({pendingInvitations.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingInvitations.map(invitation => (
                <div key={invitation.id} className="bg-white p-4 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{invitation.store_name}</p>
                    <p className="text-sm text-gray-600">
                      Invited by {getUserName(invitation.inviter_email)}
                    </p>
                    {invitation.message && (
                      <p className="text-sm text-gray-500 mt-1 italic">"{invitation.message}"</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAcceptInvitation(invitation)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Accept
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleDeclineInvitation(invitation)}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {allStores.length === 0 && pendingInvitations.length === 0 ? (
          <Card className="border-2 border-orange-100">
            <CardContent className="p-12 text-center">
              <StoreIcon className="w-20 h-20 mx-auto mb-6 text-gray-300" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No businesses yet</h3>
              <p className="text-gray-600 mb-6">Create your first business to offer products, services, and jobs</p>
              <Link to={createPageUrl("AddStore")}>
                <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
                  <Plus className="w-5 h-5 mr-2" />
                  Get Started
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {ownedStores.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-600" />
                  My Businesses ({ownedStores.length})
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ownedStores.map(store => renderStoreCard(store, true))}
                </div>
              </div>
            )}

            {coOwnedStores.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Co-Owned Businesses ({coOwnedStores.length})
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {coOwnedStores.map(store => renderStoreCard(store, false))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Invite Co-Owner Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Invite Co-Owner</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Invite another user to help manage {selectedStore?.name}. They'll be able to add/edit products and services.
            </p>

            <div className="space-y-2">
              <label className="text-sm font-medium">Optional Message</label>
              <Textarea
                placeholder="Add a personal message (optional)..."
                value={inviteMessage}
                onChange={(e) => setInviteMessage(e.target.value)}
                rows={2}
              />
            </div>

            {loadingUsers ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-orange-600 mx-auto" />
                <p className="text-sm text-gray-500 mt-2">Loading users...</p>
              </div>
            ) : allUsers.length === 0 && !loadingUsers ? (
              <div className="text-center py-8 text-red-600">
                <p className="text-sm">Unable to load user list. You may not have permission to invite co-owners or view the full user directory.</p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search Users</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {searchTerm ? (
                  <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg divide-y">
                    {filteredUsers.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 text-sm">
                        No users found
                      </div>
                    ) : (
                      filteredUsers.map(u => (
                        <button
                          key={u.email}
                          type="button"
                          onClick={() => handleSelectUser(u)}
                          disabled={inviting}
                          className="w-full p-3 hover:bg-blue-50 transition-colors flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-sm font-semibold">
                              {getInitials(u.email)}
                            </span>
                          </div>
                          <div className="text-left flex-1">
                            <div className="font-medium text-gray-900">{u.full_name || 'User'}</div>
                            <div className="text-sm text-gray-500">{u.email}</div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    Start typing to search for users
                  </div>
                )}
              </>
            )}

            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => setInviteDialogOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
