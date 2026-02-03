import React, { useState, useEffect } from "react";
import { Job, User, Town } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2, Briefcase } from "lucide-react";

export default function AddJob() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [towns, setTowns] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    requirements: "",
    category: "",
    job_type: "full_time",
    town_id: "",
    location: "",
    salary_range: "",
    contact_email: "",
    contact_phone: "",
    application_url: "",
    status: "active"
  });

  useEffect(() => {
    checkAuth();
    loadTowns();
  }, []);

  const loadTowns = async () => {
    try {
      const allTowns = await Town.list('name');
      setTowns(allTowns);
    } catch (error) {
      console.error("Error loading towns:", error);
    }
  };

  const checkAuth = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      setFormData(prev => ({
        ...prev,
        contact_email: userData.email || "",
        town_id: userData.preferred_town_id || ""
      }));
    } catch (error) {
      navigate(createPageUrl("Jobs"));
    }
    setLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const jobData = {
        ...formData,
        town_id: formData.town_id || undefined,
        slug: generateSlug(formData.title)
      };

      await Job.create(jobData);
      navigate(createPageUrl("MyJobs"));
    } catch (error) {
      console.error("Failed to create job:", error);
      alert("Failed to create job: " + error.message);
    }

    setSaving(false);
  };

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const categories = [
    { value: "technology", label: "Technology" },
    { value: "healthcare", label: "Healthcare" },
    { value: "education", label: "Education" },
    { value: "retail", label: "Retail" },
    { value: "hospitality", label: "Hospitality" },
    { value: "construction", label: "Construction" },
    { value: "transportation", label: "Transportation" },
    { value: "finance", label: "Finance" },
    { value: "manufacturing", label: "Manufacturing" },
    { value: "sales", label: "Sales & Marketing" },
    { value: "administrative", label: "Administrative" },
    { value: "customer_service", label: "Customer Service" },
    { value: "other", label: "Other" }
  ];

  const jobTypes = [
    { value: "full_time", label: "Full Time" },
    { value: "part_time", label: "Part Time" },
    { value: "contract", label: "Contract" },
    { value: "temporary", label: "Temporary" },
    { value: "internship", label: "Internship" }
  ];

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("Jobs"))}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Post a Job or Gig</h1>
            <p className="text-gray-600 mt-1">Share job and gig opportunities with the community</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="border-2 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-orange-600" />
                Job Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Software Developer, Retail Associate, Nurse"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company Name *</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="Company or organization name"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="job_type">Job Type *</Label>
                  <Select value={formData.job_type} onValueChange={(value) => handleInputChange('job_type', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {jobTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Job Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the role, responsibilities, and what makes this opportunity great"
                  rows={6}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => handleInputChange('requirements', e.target.value)}
                  placeholder="Skills, experience, education, certifications required"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Location & Compensation */}
          <Card className="border-2 border-orange-200">
            <CardHeader>
              <CardTitle>Location & Compensation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="town_id">Town/City *</Label>
                  <Select value={formData.town_id} onValueChange={(value) => handleInputChange('town_id', value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your town" />
                    </SelectTrigger>
                    <SelectContent>
                      {towns.map(town => (
                        <SelectItem key={town.id} value={town.id}>{town.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    This helps filter jobs by location
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salary_range">Salary Range</Label>
                  <Input
                    id="salary_range"
                    value={formData.salary_range}
                    onChange={(e) => handleInputChange('salary_range', e.target.value)}
                    placeholder="e.g., $40,000 - $60,000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Specific Location/Address (Optional)</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g., 123 Main St, specific neighborhood"
                />
                <p className="text-xs text-gray-500">
                  Additional location details if needed
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-2 border-orange-200">
            <CardHeader>
              <CardTitle>Contact & Application</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact_email">Contact Email *</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => handleInputChange('contact_email', e.target.value)}
                  placeholder="applications@company.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_phone">Contact Phone</Label>
                <Input
                  id="contact_phone"
                  type="tel"
                  value={formData.contact_phone}
                  onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="application_url">Application URL</Label>
                <Input
                  id="application_url"
                  type="url"
                  value={formData.application_url}
                  onChange={(e) => handleInputChange('application_url', e.target.value)}
                  placeholder="https://company.com/apply"
                />
                <p className="text-xs text-gray-500">
                  Optional: Link to external application page
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(createPageUrl("Jobs"))}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            >
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Post Job
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
