import React, { useState, useEffect } from "react";
import { SportsTeam, User, Town } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

export default function AddSportsTeam() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [towns, setTowns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "", sport: "", level: "", organization: "", description: "",
    town: "", town_id: "", coach_name: "", contact_email: "", contact_phone: "",
    website: "", facebook_url: "", instagram_url: "", twitter_url: "",
    logo_url: "", home_field: "", season: "", age_group: "", record: "",
    registration_info: "", registration_url: "", status: "active"
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const userData = await User.me().catch(() => null);
    if (!userData) { navigate(createPageUrl("Dashboard")); return; }
    setUser(userData);
    const allTowns = await Town.list('name');
    setTowns(allTowns);
    setLoading(false);
  };

  const sports = [
    { value: "football", label: "Football" }, { value: "basketball", label: "Basketball" },
    { value: "baseball", label: "Baseball" }, { value: "softball", label: "Softball" },
    { value: "soccer", label: "Soccer" }, { value: "volleyball", label: "Volleyball" },
    { value: "tennis", label: "Tennis" }, { value: "golf", label: "Golf" },
    { value: "track", label: "Track & Field" }, { value: "cross_country", label: "Cross Country" },
    { value: "swimming", label: "Swimming" }, { value: "wrestling", label: "Wrestling" },
    { value: "cheer", label: "Cheer/Dance" }, { value: "esports", label: "eSports" },
    { value: "other", label: "Other" }
  ];

  const levels = [
    { value: "youth", label: "Youth League" }, { value: "middle_school", label: "Middle School" },
    { value: "high_school", label: "High School" }, { value: "college", label: "College" },
    { value: "adult", label: "Adult League" }, { value: "recreational", label: "Recreational" },
    { value: "travel", label: "Travel/Select" }, { value: "club", label: "Club" }
  ];

  const handleTownChange = (townId) => {
    const town = towns.find(t => t.id === townId);
    setFormData(prev => ({ ...prev, town_id: townId, town: town?.name || "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.sport || !formData.level) {
      toast.error("Please fill in the required fields"); return;
    }
    setSaving(true);
    try {
      await SportsTeam.create(formData);
      toast.success("Team added successfully!");
      navigate(createPageUrl("MySportsTeams"));
    } catch (error) {
      toast.error("Failed to add team");
    }
    setSaving(false);
  };

  if (loading) return <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center"><Trophy className="w-12 h-12 text-emerald-600 animate-pulse" /></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(createPageUrl("SportsTeams"))} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />Back to Teams
        </Button>
        <Card className="border-2 border-emerald-100">
          <CardHeader><CardTitle className="flex items-center gap-2"><Trophy className="w-6 h-6 text-emerald-600" />Add Sports Team</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div><Label>Team Name *</Label><Input value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} required /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Sport *</Label>
                    <Select value={formData.sport} onValueChange={(v) => setFormData(prev => ({ ...prev, sport: v }))}>
                      <SelectTrigger><SelectValue placeholder="Select sport" /></SelectTrigger>
                      <SelectContent>{sports.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div><Label>Level *</Label>
                    <Select value={formData.level} onValueChange={(v) => setFormData(prev => ({ ...prev, level: v }))}>
                      <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                      <SelectContent>{levels.map(l => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div><Label>Organization/School</Label><Input value={formData.organization} onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))} placeholder="e.g., Corsicana ISD" /></div>
                <div><Label>Town</Label>
                  <Select value={formData.town_id} onValueChange={handleTownChange}>
                    <SelectTrigger><SelectValue placeholder="Select town" /></SelectTrigger>
                    <SelectContent>{towns.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Description</Label><Textarea value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} rows={3} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Season</Label><Input value={formData.season} onChange={(e) => setFormData(prev => ({ ...prev, season: e.target.value }))} placeholder="e.g., Fall 2024" /></div>
                  <div><Label>Age Group</Label><Input value={formData.age_group} onChange={(e) => setFormData(prev => ({ ...prev, age_group: e.target.value }))} placeholder="e.g., U12, Varsity" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Coach Name</Label><Input value={formData.coach_name} onChange={(e) => setFormData(prev => ({ ...prev, coach_name: e.target.value }))} /></div>
                  <div><Label>Home Field/Venue</Label><Input value={formData.home_field} onChange={(e) => setFormData(prev => ({ ...prev, home_field: e.target.value }))} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Contact Email</Label><Input type="email" value={formData.contact_email} onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))} /></div>
                  <div><Label>Contact Phone</Label><Input value={formData.contact_phone} onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))} /></div>
                </div>
                <div><Label>Website</Label><Input value={formData.website} onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))} /></div>
                <div><Label>Team Logo URL</Label><Input value={formData.logo_url} onChange={(e) => setFormData(prev => ({ ...prev, logo_url: e.target.value }))} /></div>
                <div className="grid grid-cols-3 gap-4">
                  <div><Label>Facebook</Label><Input value={formData.facebook_url} onChange={(e) => setFormData(prev => ({ ...prev, facebook_url: e.target.value }))} /></div>
                  <div><Label>Instagram</Label><Input value={formData.instagram_url} onChange={(e) => setFormData(prev => ({ ...prev, instagram_url: e.target.value }))} /></div>
                  <div><Label>Twitter/X</Label><Input value={formData.twitter_url} onChange={(e) => setFormData(prev => ({ ...prev, twitter_url: e.target.value }))} /></div>
                </div>
                <div><Label>Registration Info</Label><Textarea value={formData.registration_info} onChange={(e) => setFormData(prev => ({ ...prev, registration_info: e.target.value }))} rows={2} /></div>
                <div><Label>Registration URL</Label><Input value={formData.registration_url} onChange={(e) => setFormData(prev => ({ ...prev, registration_url: e.target.value }))} /></div>
              </div>
              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => navigate(createPageUrl("SportsTeams"))}>Cancel</Button>
                <Button type="submit" disabled={saving} className="bg-gradient-to-r from-emerald-500 to-teal-500"><Save className="w-4 h-4 mr-2" />{saving ? "Saving..." : "Add Team"}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
