import React, { useState, useEffect } from "react";
import { User, UserEntity } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, CheckCircle, Shield, Search, Mail } from "lucide-react";

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const loadingRef = React.useRef(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    // Prevent multiple simultaneous loads
    if (loadingRef.current) {
      console.log("Admin users load already in progress, skipping");
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
      await loadUsers();
    } catch (error) {
      console.error("Error loading admin users:", error);
      // Only redirect if authentication failed
      if (error.message?.includes('Authentication required') || error.message?.includes('not authenticated')) {
        navigate(createPageUrl("Marketplace"));
      }
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  const loadUsers = async () => {
    try {
      const allUsers = await UserEntity.list();
      console.log("All users loaded:", allUsers);
      console.log("Number of users:", allUsers.length);
      setUsers(allUsers);
    } catch (error) {
      console.error("Error loading users list:", error);
      throw error; // Re-throw to be caught by checkAdminAccess
    }
  };

  const verifyVendor = async (userId) => {
    await UserEntity.update(userId, {
      is_verified_vendor: true,
      verification_requested: false
    });
    await loadUsers();
  };

  const filteredUsers = users.filter(u =>
    !searchTerm ||
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log("Total users:", users.length);
  console.log("Filtered users:", filteredUsers.length);
  console.log("Search term:", searchTerm);

  const verificationRequests = filteredUsers.filter(u => u.verification_requested && !u.is_verified_vendor);

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <Users className="w-12 h-12 text-orange-600 animate-pulse" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
          <p className="text-gray-600 mt-2">View and manage all platform users</p>
        </div>

        {/* Search */}
        <Card className="border-2 border-orange-100 mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Verification Requests */}
        {verificationRequests.length > 0 && (
          <Card className="border-2 border-blue-200 bg-blue-50 mb-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Verification Requests ({verificationRequests.length})
              </h3>
              <div className="space-y-3">
                {verificationRequests.map(user => (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-white rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{user.full_name || 'Unnamed User'}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <Button
                      onClick={() => verifyVendor(user.id)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Verify Vendor
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Users List */}
        <div className="space-y-4">
          {filteredUsers.length === 0 ? (
            <Card className="border-2 border-orange-100">
              <CardContent className="p-12 text-center">
                <Users className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No users found</h3>
                <p className="text-gray-600">
                  {searchTerm
                    ? `No users match "${searchTerm}"`
                    : "No users in the system yet"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredUsers.map(user => (
              <Card key={user.id} className="border-2 border-orange-100">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-400 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-lg">
                          {user.full_name?.charAt(0) || user.email?.charAt(0) || '?'}
                        </span>
                      </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-gray-900">
                          {user.full_name || 'Unnamed User'}
                        </h3>
                        {user.role === 'admin' && (
                          <Badge className="bg-purple-500">
                            <Shield className="w-3 h-3 mr-1" />
                            Admin
                          </Badge>
                        )}
                        {user.is_verified_vendor && (
                          <Badge className="bg-blue-500">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {user.email}
                      </p>
                      {user.phone && (
                        <p className="text-sm text-gray-600 mt-1">Phone: {user.phone}</p>
                      )}
                      {user.city && (
                        <p className="text-sm text-gray-600">Location: {user.city}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        Joined: {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
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