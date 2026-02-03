import React, { useState, useEffect } from "react";
import { LostAndFound as LostAndFoundEntity, User } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Edit, Eye, Trash2, Plus, Calendar, MapPin, Award, ArrowLeft } from "lucide-react";

export default function MyLostAndFound() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyItems();
  }, []);

  const loadMyItems = async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      const allItems = await LostAndFoundEntity.list('-created_date');
      const myItems = allItems.filter(item => item.created_by === userData.id);
      setItems(myItems);
    } catch (error) {
      console.error("Error loading lost & found items:", error);
      navigate(createPageUrl("LostAndFound"));
    }
    setLoading(false);
  };

  const deleteItem = async (itemId) => {
    if (!confirm("Are you sure you want to delete this listing?")) {
      return;
    }

    try {
      await LostAndFoundEntity.delete(itemId);
      await loadMyItems();
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete listing");
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

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Heart className="w-8 h-8 text-orange-600" />
                My Lost & Found Listings
              </h1>
              <p className="text-gray-600 mt-2">Manage your lost and found reports</p>
            </div>
            <Button
              onClick={() => navigate(createPageUrl("AddLostAndFound"))}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Report Lost/Found
            </Button>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid md:grid-cols-3 gap-4">
          {items.length === 0 ? (
            <div className="col-span-3">
              <Card className="border-2 border-orange-100">
                <CardContent className="p-12 text-center">
                  <Heart className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">No listings yet</h3>
                  <p className="text-gray-600 mb-6">Create your first lost or found report</p>
                  <Button
                    onClick={() => navigate(createPageUrl("AddLostAndFound"))}
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Report Lost/Found
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            items.map(item => (
              <Card
                key={item.id}
                className={`border-2 ${item.status === 'reunited' ? 'border-green-200 bg-green-50/30' : 'border-orange-100'}`}
              >
                {item.photo_url && (
                  <div className="h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={item.photo_url}
                      alt={item.pet_name || item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={getTypeColor(item.type)}>
                      {getTypeLabel(item.type)}
                    </Badge>
                    {item.has_reward && (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <Award className="w-3 h-3 mr-1" />
                        Reward
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {item.pet_name || item.title}
                  </h3>

                  {item.breed && (
                    <p className="text-sm text-gray-600 mb-2">{item.breed}</p>
                  )}

                  {item.description && (
                    <p className="text-gray-700 text-sm mb-3 line-clamp-2">{item.description}</p>
                  )}

                  <div className="space-y-1 text-xs text-gray-600 mb-3">
                    {item.last_seen_location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {item.last_seen_location}
                      </div>
                    )}
                    {item.last_seen_date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.last_seen_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {item.status === 'reunited' && (
                    <div className="mb-3 pt-3 border-t border-orange-100">
                      <Badge className="bg-green-100 text-green-800 w-full justify-center">
                        ✓ Reunited/Found
                      </Badge>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(createPageUrl(`LostAndFoundDetail?id=${item.id}`))}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(createPageUrl(`EditLostAndFound?id=${item.id}`))}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => deleteItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
