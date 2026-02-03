import React, { useState, useEffect } from "react";
import { SportsTeam, User, Town } from "@/api/entities";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, ArrowLeft, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function EditSportsTeam() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const teamId = searchParams.get("id");
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

  useEffect(() => { loadData(); }, [teamId]);

  const loadData = async () => {
    const userData = await User.me().catch(() => null);
    if (!userData) { navigate(createPageUrl("Dashboard")); return; }
    const allTowns = await Town.list('name');
    setTowns(allTowns);
    if (teamId) {
      const team = await SportsTeam.get(teamId);
      if (team && (team.created_by === userData.id || userData.role === 'admin')) {
        setFormData({ ...team });
      } else {
        toast.error("You don't have permission to edit this team");
        navigate(createPageUrl("SportsTeams"));
      }
    }
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
    if (!formData.name || !formData.sport || !formData.level) { toast.error("Please fill required fields"); return; }
    setSaving(true);
    try {
      await SportsTeam.update(teamId, formData);
      toast.success("Team updated!");
      navigate(createPageUrl("MySportsTeams"));
    } catch (error) { toast.error("Failed to update team"); }
    setSaving(false);
  };

  const handleDelete = async () => {
    try {
      await SportsTeam.delete(teamId);
      toast.success("Team deleted");
      navigate(createPageUrl("SportsTeams"));
    } catch (error) { toast.error("Failed to delete team"); }
  };

  if (loading) return <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center"><Trophy className="w-12 h-12 text-emerald-600 animate-pulse" /></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(createPageUrl("MySportsTeams"))} className="mb-6"><ArrowLeft className="w-4 h-4 mr-2" />Back</Button>
        <Card className="border-2 border-emerald-100">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2"><Trophy className="w-6 h-6 text-emerald-600" />Edit Team</CardTitle>
            <AlertDialog>
              <AlertDialogTrigger asChild><Button variant="destructive" size="sm"><Trash2 className="w-4 h-4 mr-2" />Delete</Button></AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader><AlertDialogTitle>Delete Team</AlertDialogTitle><AlertDialogDescription>Are you sure? This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-red-600">Delete</AlertDialogAction></AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label>Team Name *</Label><Input value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Sport *</Label>
                  <Select value={formData.sport} onValueChange={(v) => setFormData(prev => ({ ...prev, sport: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{sports.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Level *</Label>
                  <Select value={formData.level} onValueChange={(v) => setFormData(prev => ({ ...prev, level: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{levels.map(l => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData(prev => ({ ...prev, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent>
                </Select>
              </div>
              <div><Label>Organization/School</Label><Input value={formData.organization} onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))} /></div>
              <div><Label>Town</Label>
                <Select value={formData.town_id} onValueChange={handleTownChange}>
                  <SelectTrigger><SelectValue placeholder="Select town" /></SelectTrigger>
                  <SelectContent>{towns.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Description</Label><Textarea value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} rows={3} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Season</Label><Input value={formData.season} onChange={(e) => setFormData(prev => ({ ...prev, season: e.target.value }))} /></div>
                <div><Label>Record</Label><Input value={formData.record} onChange={(e) => setFormData(prev => ({ ...prev, record: e.target.value }))} placeholder="e.g., 8-2" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Coach</Label><Input value={formData.coach_name} onChange={(e) => setFormData(prev => ({ ...prev, coach_name: e.target.value }))} /></div>
                <div><Label>Home Field</Label><Input value={formData.home_field} onChange={(e) => setFormData(prev => ({ ...prev, home_field: e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Email</Label><Input value={formData.contact_email} onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))} /></div>
                <div><Label>Phone</Label><Input value={formData.contact_phone} onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))} /></div>
              </div>
              <div><Label>Website</Label><Input value={formData.website} onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))} /></div>
              <div><Label>Logo URL</Label><Input value={formData.logo_url} onChange={(e) => setFormData(prev => ({ ...prev, logo_url: e.target.value }))} /></div>
              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => navigate(createPageUrl("MySportsTeams"))}>Cancel</Button>
                <Button type="submit" disabled={saving} className="bg-gradient-to-r from-emerald-500 to-teal-500"><Save className="w-4 h-4 mr-2" />{saving ? "Saving..." : "Save"}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
