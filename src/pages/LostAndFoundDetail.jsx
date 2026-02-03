import React, { useState, useEffect } from "react";
import { LostAndFound as LostAndFoundEntity, User } from "@/api/entities";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Calendar, Award, Edit, Trash2, Phone, Mail, Printer, Share2, ArrowLeft } from "lucide-react";
import QRCode from "react-qr-code";
import { SafeEmail } from "@/components/utils/emailObfuscation";
import MetaTags from "@/components/seo/MetaTags";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function LostAndFoundDetail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const itemId = searchParams.get('id');
  const { settings } = useSiteSettings();

  const [item, setItem] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPrintView, setShowPrintView] = useState(false);

  useEffect(() => {
    if (itemId) {
      loadItem();
    } else {
      navigate(createPageUrl("LostAndFound"));
    }
  }, [itemId]);

  const loadItem = async () => {
    try {
      const userData = await User.me().catch(() => null);
      setUser(userData);

      const itemData = await LostAndFoundEntity.get(itemId);
      setItem(itemData);
    } catch (error) {
      console.error("Error loading lost & found item:", error);
      navigate(createPageUrl("LostAndFound"));
    }
    setLoading(false);
  };

  const deleteItem = async () => {
    if (!confirm("Are you sure you want to delete this listing?")) {
      return;
    }

    try {
      await LostAndFoundEntity.delete(itemId);
      navigate(createPageUrl("LostAndFound"));
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete listing");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.pet_name || item.title,
          text: item.description,
          url: url,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'lost_pet': return 'bg-red-100 text-red-800';
      case 'found_pet': return 'bg-green-100 text-green-800';
      case 'lost_item': return 'bg-orange-100 text-orange-800';
      case 'found_item': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      lost_pet: "Lost Pet",
      found_pet: "Found Pet",
      lost_item: "Lost Item",
      found_item: "Found Item"
    };
    return labels[type] || type;
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <Heart className="w-12 h-12 text-orange-600 animate-pulse" />
    </div>;
  }

  if (!item) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <div className="text-center">
        <Heart className="w-20 h-20 mx-auto mb-4 text-gray-300" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Item not found</h2>
        <Button onClick={() => navigate(createPageUrl("LostAndFound"))}>
          Back to Lost & Found
        </Button>
      </div>
    </div>;
  }

  const isOwner = user && user.email === item.created_by;
  const listingUrl = window.location.href;

  return (
    <>
      <MetaTags
        title={`${item.title || item.item_name} - Lost & Found in ${settings.county_name || 'Navarro'} County`}
        description={item.description?.substring(0, 160) || `${item.status === 'lost' ? 'Lost' : 'Found'} item in ${settings.county_name || 'Navarro'} County, TX.`}
      />
      {/* Print Stylesheet */}
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
          body {
            background: white !important;
          }
          .print-flyer {
            page-break-after: always;
          }
        }
        .print-only {
          display: none;
        }
      `}</style>

      {/* Main View */}
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6 no-print">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => navigate(createPageUrl("LostAndFound"))}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Lost & Found
            </Button>

            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge className={getTypeColor(item.type)}>
                    {getTypeLabel(item.type)}
                  </Badge>
                  {item.has_reward && (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <Award className="w-3 h-3 mr-1" />
                      Reward Offered
                    </Badge>
                  )}
                  {item.status === 'reunited' && (
                    <Badge className="bg-green-100 text-green-800">
                      ✓ Reunited/Found
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {item.pet_name || item.title}
                </h1>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print Flyer
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Left Column - Photo */}
            <Card className="border-2 border-orange-100">
              <CardContent className="p-0">
                {item.photo_url ? (
                  <img
                    src={item.photo_url}
                    alt={item.pet_name || item.title}
                    className="w-full h-96 object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-96 bg-gray-200 rounded-t-lg flex items-center justify-center">
                    <Heart className="w-20 h-20 text-gray-400" />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-3">Details</h3>

                  {item.breed && (
                    <div className="mb-3">
                      <span className="font-semibold">Breed:</span> {item.breed}
                    </div>
                  )}

                  {item.color && (
                    <div className="mb-3">
                      <span className="font-semibold">Color:</span> {item.color}
                    </div>
                  )}

                  {item.distinguishing_features && (
                    <div className="mb-3">
                      <span className="font-semibold">Distinguishing Features:</span>
                      <p className="text-gray-700 mt-1">{item.distinguishing_features}</p>
                    </div>
                  )}

                  {item.description && (
                    <div className="mb-3">
                      <span className="font-semibold">Description:</span>
                      <p className="text-gray-700 mt-1">{item.description}</p>
                    </div>
                  )}

                  {item.has_reward && item.reward_amount && (
                    <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Award className="w-5 h-5 text-yellow-700" />
                        <span className="font-bold text-yellow-900">Reward Offered</span>
                      </div>
                      <p className="text-yellow-800">${item.reward_amount}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Right Column - Location & Contact */}
            <div className="space-y-6">
              {/* Last Seen Info */}
              <Card className="border-2 border-orange-100">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4">Last Seen Information</h3>

                  {item.last_seen_location && (
                    <div className="mb-3 flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-orange-600 mt-0.5" />
                      <div>
                        <span className="font-semibold">Location:</span>
                        <p className="text-gray-700">{item.last_seen_location}</p>
                      </div>
                    </div>
                  )}

                  {item.last_seen_date && (
                    <div className="mb-3 flex items-start gap-2">
                      <Calendar className="w-5 h-5 text-orange-600 mt-0.5" />
                      <div>
                        <span className="font-semibold">Date:</span>
                        <p className="text-gray-700">
                          {new Date(item.last_seen_date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Map placeholder - in a real app, integrate Google Maps or similar */}
                  {item.last_seen_location && (
                    <div className="mt-4 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <MapPin className="w-12 h-12 mx-auto mb-2" />
                        <p className="text-sm">Map: {item.last_seen_location}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="border-2 border-orange-100">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4">Contact Information</h3>

                  {item.contact_name && (
                    <div className="mb-3">
                      <span className="font-semibold">Name:</span> {item.contact_name}
                    </div>
                  )}

                  {item.contact_phone && (
                    <div className="mb-3">
                      <a
                        href={`tel:${item.contact_phone}`}
                        className="flex items-center gap-2 text-orange-600 hover:text-orange-700"
                      >
                        <Phone className="w-4 h-4" />
                        {item.contact_phone}
                      </a>
                    </div>
                  )}

                  {item.contact_email && (
                    <div className="mb-3 flex items-center gap-2 text-orange-600">
                      <Mail className="w-4 h-4" />
                      <SafeEmail email={item.contact_email} className="hover:text-orange-700" />
                    </div>
                  )}

                  {item.shelter_crosspost && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        ✓ This listing has been cross-posted to local animal shelters
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Owner Actions */}
              {isOwner && (
                <Card className="border-2 border-orange-100">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-4">Manage Listing</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => navigate(createPageUrl(`EditLostAndFound?id=${item.id}`))}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={deleteItem}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Posted Info */}
          <Card className="border-2 border-orange-100">
            <CardContent className="p-4">
              <div className="text-sm text-gray-600">
                Posted {item.created_date ? new Date(item.created_date).toLocaleDateString() : 'Recently'}
                {item.created_by && ` by ${item.contact_name || item.created_by}`}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Printable Flyer */}
      <div className="print-only print-flyer">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="text-center mb-4 pb-4 border-b-4 border-orange-500">
            <h1 className="text-4xl font-bold text-gray-900 mb-1">
              {item.type === 'lost_pet' || item.type === 'lost_item' ? 'LOST' : 'FOUND'}
            </h1>
            <h2 className="text-2xl font-semibold text-orange-600">
              {item.pet_name || item.title}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-4">
            {/* Photo */}
            <div>
              {item.photo_url ? (
                <img
                  src={item.photo_url}
                  alt={item.pet_name || item.title}
                  className="w-full h-64 object-cover border-4 border-gray-300"
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 border-4 border-gray-300 flex items-center justify-center">
                  <Heart className="w-24 h-24 text-gray-400" />
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <div className="space-y-2">
                {item.breed && (
                  <div>
                    <h3 className="font-bold text-base">Breed:</h3>
                    <p className="text-lg">{item.breed}</p>
                  </div>
                )}

                {item.color && (
                  <div>
                    <h3 className="font-bold text-base">Color:</h3>
                    <p className="text-lg">{item.color}</p>
                  </div>
                )}

                {item.last_seen_location && (
                  <div>
                    <h3 className="font-bold text-base">Last Seen:</h3>
                    <p className="text-lg">{item.last_seen_location}</p>
                    {item.last_seen_date && (
                      <p className="text-base text-gray-600">
                        {new Date(item.last_seen_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}

                {item.distinguishing_features && (
                  <div>
                    <h3 className="font-bold text-base">Features:</h3>
                    <p className="text-base">{item.distinguishing_features}</p>
                  </div>
                )}

                {item.has_reward && (
                  <div className="p-2 bg-yellow-100 border-2 border-yellow-500">
                    <h3 className="font-bold text-lg text-yellow-900">REWARD</h3>
                    {item.reward_amount && (
                      <p className="text-2xl font-bold text-yellow-800">${item.reward_amount}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {item.description && (
            <div className="mb-4">
              <h3 className="font-bold text-base mb-1">Description:</h3>
              <p className="text-base">{item.description}</p>
            </div>
          )}

          {/* Contact Info and QR Code */}
          <div className="border-t-4 border-orange-500 pt-4">
            <h3 className="font-bold text-xl mb-3 text-center">CONTACT INFORMATION</h3>
            <div className="grid grid-cols-2 gap-6 items-center">
              {/* Contact Details - Left */}
              <div className="space-y-1">
                {item.contact_name && (
                  <p className="text-lg font-semibold">{item.contact_name}</p>
                )}
                {item.contact_phone && (
                  <p className="text-xl font-bold text-orange-600">{item.contact_phone}</p>
                )}
                {item.contact_email && (
                  <p className="text-base text-gray-700">{item.contact_email}</p>
                )}
              </div>

              {/* QR Code - Right */}
              <div className="text-center">
                <div className="flex justify-center">
                  <QRCode value={listingUrl} size={120} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
