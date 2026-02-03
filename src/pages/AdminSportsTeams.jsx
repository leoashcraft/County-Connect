import React, { useState, useEffect } from "react";
import { SportsTeam, User } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, Search, Eye, CheckCircle, XCircle, AlertTriangle, ArrowLeft } from "lucide-react";

const LEVEL_LABELS = {
  youth: "Youth League",
  middle_school: "Middle School",
  high_school: "High School",
  college: "College",
  adult: "Adult League",
  senior: "Senior League",
  recreational: "Recreational"
};

const SPORT_LABELS = {
  football: "Football",
  basketball: "Basketball",
  baseball: "Baseball",
  softball: "Softball",
  soccer: "Soccer",
  volleyball: "Volleyball",
  tennis: "Tennis",
  golf: "Golf",
  track: "Track & Field",
  swimming: "Swimming",
  wrestling: "Wrestling",
  cheer: "Cheerleading",
  other: "Other"
};

export default function AdminSportsTeams() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sportFilter, setSportFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      if (userData.role !== 'admin') {
        alert("You don't have permission to access this page");
        navigate(createPageUrl("SportsTeams"));
        return;
      }

      const allTeams = await SportsTeam.list('-created_date');
      setTeams(allTeams);
    } catch (error) {
      console.error("Error loading teams:", error);
      navigate(createPageUrl("SportsTeams"));
    }
    setLoading(false);
  };

  const updateTeamStatus = async (teamId, newStatus) => {
    const team = teams.find(t => t.id === teamId);
    const confirmMessage = newStatus === 'suspended'
      ? `Are you sure you want to suspend ${team.name}? This will hide it from public view.`
      : `Are you sure you want to ${newStatus === 'active' ? 'activate' : 'change status of'} ${team.name}?`;

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      await SportsTeam.update(teamId, { status: newStatus });
      await loadTeams();
      alert(`${team.name} status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating team status:", error);
      alert("Failed to update team status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTeams = teams.filter(team => {
    const matchesSearch = !searchTerm ||
      team.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.organization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.town?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || team.status === statusFilter;
    const matchesSport = sportFilter === "all" || team.sport === sportFilter;

    return matchesSearch && matchesStatus && matchesSport;
  });

  const pendingCount = teams.filter(t => t.status === 'pending').length;

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <Trophy className="w-12 h-12 text-emerald-600 animate-pulse" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(createPageUrl("AdminDashboard"))}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Trophy className="w-8 h-8 text-emerald-600" />
                Sports Teams Moderation
              </h1>
              <p className="text-gray-600 mt-2">Review and manage sports team listings</p>
            </div>
            {pendingCount > 0 && (
              <Badge className="bg-yellow-500 text-white text-lg px-4 py-2">
                {pendingCount} Pending
              </Badge>
            )}
          </div>
        </div>

        {/* Filters */}
        <Card className="border-2 border-emerald-100 mb-6">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search teams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sportFilter} onValueChange={setSportFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sports</SelectItem>
                  {Object.entries(SPORT_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Teams List */}
        <div className="space-y-4">
          {filteredTeams.length === 0 ? (
            <Card className="border-2 border-emerald-100">
              <CardContent className="p-12 text-center">
                <Trophy className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No teams found</h3>
                <p className="text-gray-600">Try adjusting your filters</p>
              </CardContent>
            </Card>
          ) : (
            filteredTeams.map(team => (
              <Card key={team.id} className={`border-2 ${team.status === 'pending' ? 'border-yellow-300 bg-yellow-50' : 'border-emerald-100'}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    {/* Team Logo */}
                    {team.logo_url && (
                      <img
                        src={team.logo_url}
                        alt={team.name}
                        className="w-24 h-24 rounded-lg object-cover border-2 border-emerald-200"
                      />
                    )}

                    {/* Team Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-2 mb-3">
                        <Badge className={getStatusColor(team.status)}>
                          {team.status || 'pending'}
                        </Badge>
                        {team.sport && (
                          <Badge variant="outline" className="bg-emerald-50">
                            {SPORT_LABELS[team.sport] || team.sport}
                          </Badge>
                        )}
                        {team.level && (
                          <Badge variant="secondary">
                            {LEVEL_LABELS[team.level] || team.level}
                          </Badge>
                        )}
                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{team.name}</h3>

                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        {team.organization && (
                          <div>
                            <p className="text-sm font-semibold text-gray-600">Organization</p>
                            <p className="text-gray-900">{team.organization}</p>
                          </div>
                        )}

                        {team.town && (
                          <div>
                            <p className="text-sm font-semibold text-gray-600">Town</p>
                            <p className="text-gray-900">{team.town}</p>
                          </div>
                        )}

                        {team.coach_name && (
                          <div>
                            <p className="text-sm font-semibold text-gray-600">Coach</p>
                            <p className="text-gray-900">{team.coach_name}</p>
                          </div>
                        )}

                        {team.home_venue && (
                          <div>
                            <p className="text-sm font-semibold text-gray-600">Home Venue</p>
                            <p className="text-gray-900">{team.home_venue}</p>
                          </div>
                        )}

                        {team.season && (
                          <div>
                            <p className="text-sm font-semibold text-gray-600">Season</p>
                            <p className="text-gray-900">{team.season}</p>
                          </div>
                        )}
                      </div>

                      {team.description && (
                        <p className="text-gray-600 text-sm line-clamp-2">{team.description}</p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(createPageUrl(`SportsTeamDetail?id=${team.id}`))}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>

                      {team.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => updateTeamStatus(team.id, 'active')}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateTeamStatus(team.id, 'suspended')}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        </>
                      )}

                      {team.status === 'active' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateTeamStatus(team.id, 'suspended')}
                        >
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Suspend
                        </Button>
                      )}

                      {team.status === 'suspended' && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => updateTeamStatus(team.id, 'active')}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Reactivate
                        </Button>
                      )}
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
