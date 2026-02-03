import React, { useState, useEffect } from "react";
import { SportsTeam, User } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Plus, Edit, ArrowLeft, Eye, School } from "lucide-react";

export default function MySportsTeams() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const userData = await User.me().catch(() => null);
    if (!userData) { navigate(createPageUrl("Dashboard")); return; }
    const myTeams = await SportsTeam.filter({ created_by: userData.id }, 'name');
    setTeams(myTeams);
    setLoading(false);
  };

  const sports = { football: "Football", basketball: "Basketball", baseball: "Baseball", softball: "Softball", soccer: "Soccer", volleyball: "Volleyball", other: "Other" };
  const levels = { youth: "Youth", middle_school: "Middle School", high_school: "High School", college: "College", adult: "Adult", recreational: "Rec", travel: "Travel", club: "Club" };

  if (loading) return <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center"><Trophy className="w-12 h-12 text-emerald-600 animate-pulse" /></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
      <div className="max-w-5xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(createPageUrl("SportsTeams"))} className="mb-6"><ArrowLeft className="w-4 h-4 mr-2" />Back to All Teams</Button>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><Trophy className="w-8 h-8 text-emerald-600" />My Sports Teams</h1>
            <p className="text-gray-600 mt-2">Manage the teams you've added</p>
          </div>
          <Button onClick={() => navigate(createPageUrl("AddSportsTeam"))} className="bg-gradient-to-r from-emerald-500 to-teal-500"><Plus className="w-4 h-4 mr-2" />Add Team</Button>
        </div>
        {teams.length === 0 ? (
          <Card className="border-2 border-emerald-100"><CardContent className="p-12 text-center">
            <Trophy className="w-20 h-20 mx-auto mb-6 text-gray-300" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No teams yet</h3>
            <p className="text-gray-600 mb-6">Add local sports teams to help the community follow and support them.</p>
            <Button onClick={() => navigate(createPageUrl("AddSportsTeam"))} className="bg-gradient-to-r from-emerald-500 to-teal-500"><Plus className="w-4 h-4 mr-2" />Add Your First Team</Button>
          </CardContent></Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {teams.map(team => (
              <Card key={team.id} className="border-2 border-emerald-100 hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-emerald-100 text-emerald-800">{sports[team.sport] || team.sport}</Badge>
                    <Badge variant="secondary">{levels[team.level] || team.level}</Badge>
                    <Badge variant={team.status === 'active' ? 'default' : 'outline'}>{team.status}</Badge>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{team.name}</h3>
                  {team.organization && <p className="text-sm text-gray-600 flex items-center gap-1 mb-2"><School className="w-4 h-4" />{team.organization}</p>}
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" onClick={() => navigate(createPageUrl(`SportsTeamDetail?id=${team.id}`))}><Eye className="w-4 h-4 mr-1" />View</Button>
                    <Button variant="outline" size="sm" onClick={() => navigate(createPageUrl(`EditSportsTeam?id=${team.id}`))}><Edit className="w-4 h-4 mr-1" />Edit</Button>
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
