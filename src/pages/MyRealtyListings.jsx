import React, { useState, useEffect } from "react";
import { RealtyListing, User } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, Plus, Edit, Trash2, Eye, MapPin, Bed, Bath, Square, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function MyRealtyListings() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await User.me().catch(() => null);
      setUser(userData);

      if (userData) {
        const userListings = await RealtyListing.filter({ created_by: userData.id }, '-created_date');
        setListings(userListings);
      }
    } catch (error) {
      console.error("Error loading listings:", error);
    }
    setLoading(false);
  };

  const handleDelete = async (listing) => {
    if (!window.confirm(`Are you sure you want to delete "${listing.title}"?`)) {
      return;
    }

    try {
      await RealtyListing.delete(listing.id);
      setListings(prev => prev.filter(l => l.id !== listing.id));
      toast.success("Listing deleted");
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast.error("Failed to delete listing");
    }
  };

  const formatPrice = (price, listingType) => {
    if (!price) return "Contact for price";
    if (listingType === "rent") {
      return `$${price.toLocaleString()}/mo`;
    }
    return `$${price.toLocaleString()}`;
  };

  const getTypeColor = (type) => {
    const colors = {
      sale: "bg-green-100 text-green-800",
      rent: "bg-blue-100 text-blue-800",
      land: "bg-amber-100 text-amber-800",
      commercial: "bg-purple-100 text-purple-800"
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const getTypeLabel = (type) => {
    const labels = {
      sale: "For Sale",
      rent: "For Rent",
      land: "Land",
      commercial: "Commercial"
    };
    return labels[type] || type;
  };

  const getStatusColor = (status) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      sold: "bg-gray-100 text-gray-800",
      rented: "bg-gray-100 text-gray-800",
      inactive: "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status) => {
    const labels = {
      active: "Active",
      pending: "Pending",
      sold: "Sold",
      rented: "Rented",
      inactive: "Inactive"
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <Home className="w-12 h-12 text-green-600 animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-6 flex items-center justify-center">
        <Card className="border-2 border-green-100 max-w-md">
          <CardContent className="p-8 text-center">
            <Home className="w-16 h-16 mx-auto mb-4 text-green-300" />
            <h2 className="text-xl font-bold mb-2">Sign In Required</h2>
            <p className="text-gray-600 mb-4">Please sign in to manage your listings.</p>
            <Button onClick={() => User.login()} className="bg-gradient-to-r from-green-500 to-emerald-500">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-6">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="outline"
          onClick={() => navigate(createPageUrl("Realty"))}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to All Listings
        </Button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Home className="w-8 h-8 text-green-600" />
                My Listings
              </h1>
              <p className="text-gray-600 mt-2">Manage your property listings</p>
            </div>
            <Button
              onClick={() => navigate(createPageUrl("AddRealtyListing"))}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Listing
            </Button>
          </div>
        </div>

        {/* Listings */}
        {listings.length === 0 ? (
          <Card className="border-2 border-green-100">
            <CardContent className="p-12 text-center">
              <Home className="w-20 h-20 mx-auto mb-6 text-gray-300" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No listings yet</h3>
              <p className="text-gray-600 mb-6">Create your first property listing to get started.</p>
              <Button
                onClick={() => navigate(createPageUrl("AddRealtyListing"))}
                className="bg-gradient-to-r from-green-500 to-emerald-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Listing
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {listings.map(listing => (
              <Card key={listing.id} className="border-2 border-green-100">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="md:w-48 h-48 md:h-auto bg-gray-200 flex-shrink-0">
                      {listing.image_url ? (
                        <img
                          src={listing.image_url}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                          <Home className="w-12 h-12 text-green-300" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getTypeColor(listing.listing_type)}>
                            {getTypeLabel(listing.listing_type)}
                          </Badge>
                          <Badge className={getStatusColor(listing.status)}>
                            {getStatusLabel(listing.status)}
                          </Badge>
                        </div>
                        <span className="text-lg font-bold text-green-600">
                          {formatPrice(listing.price, listing.listing_type)}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-1">{listing.title}</h3>

                      {listing.address && (
                        <p className="text-sm text-gray-600 flex items-center gap-1 mb-2">
                          <MapPin className="w-3 h-3" />
                          {listing.address}
                          {listing.city && `, ${listing.city}`}
                          {listing.state && `, ${listing.state}`}
                          {listing.zip_code && ` ${listing.zip_code}`}
                        </p>
                      )}

                      {/* Property Details */}
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        {listing.bedrooms && (
                          <span className="flex items-center gap-1">
                            <Bed className="w-4 h-4" />
                            {listing.bedrooms} bed
                          </span>
                        )}
                        {listing.bathrooms && (
                          <span className="flex items-center gap-1">
                            <Bath className="w-4 h-4" />
                            {listing.bathrooms} bath
                          </span>
                        )}
                        {listing.square_feet && (
                          <span className="flex items-center gap-1">
                            <Square className="w-4 h-4" />
                            {listing.square_feet.toLocaleString()} sqft
                          </span>
                        )}
                        {listing.lot_size && (
                          <span className="flex items-center gap-1">
                            {listing.lot_size} acres
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(createPageUrl(`RealtyDetail?id=${listing.id}`))}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(createPageUrl(`EditRealtyListing?id=${listing.id}`))}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(listing)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
