import React, { useState, useEffect } from "react";
import { School, User, Town } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, ArrowLeft, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AddSchool() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [towns, setTowns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newProgram, setNewProgram] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    school_types: [],
    district: "",
    address: "",
    town: "",
    town_id: "",
    phone: "",
    email: "",
    website: "",
    principal: "",
    superintendent: "",
    grades_served: "",
    enrollment: "",
    founded_year: "",
    mascot: "",
    school_colors: "",
    school_hours: "",
    description: "",
    image_url: "",
    facebook_url: "",
    twitter_url: "",
    programs: [],
    status: "active"
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      const allTowns = await Town.list('name');
      setTowns(allTowns);
    } catch (error) {
      console.error("Error loading data:", error);
      navigate(createPageUrl("Schools"));
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const schoolData = {
        ...formData,
        enrollment: formData.enrollment ? parseInt(formData.enrollment) : null,
        founded_year: formData.founded_year ? parseInt(formData.founded_year) : null,
        created_by: user.id
      };

      await School.create(schoolData);
      navigate(createPageUrl("MySchools"));
    } catch (error) {
      console.error("Error creating school:", error);
      alert("Failed to create school. Please try again.");
    }
    setSubmitting(false);
  };

  const addProgram = () => {
    if (newProgram.trim() && !formData.programs.includes(newProgram.trim())) {
      setFormData({
        ...formData,
        programs: [...formData.programs, newProgram.trim()]
      });
      setNewProgram("");
    }
  };

  const removeProgram = (program) => {
    setFormData({
      ...formData,
      programs: formData.programs.filter(p => p !== program)
    });
  };

  const schoolTypes = [
    { value: "daycare", label: "Daycare / Childcare" },
    { value: "pre_k", label: "Pre-K / Preschool" },
    { value: "elementary", label: "Elementary School" },
    { value: "middle", label: "Middle School" },
    { value: "high", label: "High School" },
    { value: "college", label: "College / University" },
    { value: "charter", label: "Charter School" },
    { value: "private", label: "Private School" },
    { value: "alternative", label: "Alternative School" },
    { value: "vocational", label: "Vocational / Trade School" }
  ];

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
      <GraduationCap className="w-12 h-12 text-blue-600 animate-pulse" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl("MySchools"))}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to My Schools
        </Button>

        <Card className="border-2 border-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-blue-600" />
              Add New School
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="name">School Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Corsicana High School"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Label>School Type(s) * <span className="text-xs text-gray-500">(select all that apply)</span></Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 p-3 border rounded-lg bg-gray-50">
                    {schoolTypes.map(type => (
                      <label key={type.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.school_types.includes(type.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, school_types: [...formData.school_types, type.value] });
                            } else {
                              setFormData({ ...formData, school_types: formData.school_types.filter(t => t !== type.value) });
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="district">School District</Label>
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    placeholder="e.g., Corsicana ISD"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Full street address"
                  />
                </div>

                <div>
                  <Label htmlFor="town">Town</Label>
                  <Select
                    value={formData.town_id}
                    onValueChange={(value) => {
                      const town = towns.find(t => t.id === value);
                      setFormData({
                        ...formData,
                        town_id: value,
                        town: town?.name || ""
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select town" />
                    </SelectTrigger>
                    <SelectContent>
                      {towns.map(town => (
                        <SelectItem key={town.id} value={town.id}>{town.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Contact */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(903) 555-0123"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="info@school.edu"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://www.school.edu"
                  />
                </div>
              </div>

              {/* Leadership */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="principal">Principal</Label>
                  <Input
                    id="principal"
                    value={formData.principal}
                    onChange={(e) => setFormData({ ...formData, principal: e.target.value })}
                    placeholder="Principal's name"
                  />
                </div>

                <div>
                  <Label htmlFor="superintendent">Superintendent</Label>
                  <Input
                    id="superintendent"
                    value={formData.superintendent}
                    onChange={(e) => setFormData({ ...formData, superintendent: e.target.value })}
                    placeholder="Superintendent's name"
                  />
                </div>
              </div>

              {/* School Details */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="grades_served">Grades Served</Label>
                  <Input
                    id="grades_served"
                    value={formData.grades_served}
                    onChange={(e) => setFormData({ ...formData, grades_served: e.target.value })}
                    placeholder="e.g., 9-12 or PK-5"
                  />
                </div>

                <div>
                  <Label htmlFor="enrollment">Enrollment</Label>
                  <Input
                    id="enrollment"
                    type="number"
                    value={formData.enrollment}
                    onChange={(e) => setFormData({ ...formData, enrollment: e.target.value })}
                    placeholder="Number of students"
                  />
                </div>

                <div>
                  <Label htmlFor="founded_year">Founded Year</Label>
                  <Input
                    id="founded_year"
                    type="number"
                    value={formData.founded_year}
                    onChange={(e) => setFormData({ ...formData, founded_year: e.target.value })}
                    placeholder="e.g., 1899"
                  />
                </div>
              </div>

              {/* School Identity */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mascot">Mascot</Label>
                  <Input
                    id="mascot"
                    value={formData.mascot}
                    onChange={(e) => setFormData({ ...formData, mascot: e.target.value })}
                    placeholder="e.g., Tigers"
                  />
                </div>

                <div>
                  <Label htmlFor="school_colors">School Colors</Label>
                  <Input
                    id="school_colors"
                    value={formData.school_colors}
                    onChange={(e) => setFormData({ ...formData, school_colors: e.target.value })}
                    placeholder="e.g., Blue and Gold"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="school_hours">School Hours</Label>
                <Input
                  id="school_hours"
                  value={formData.school_hours}
                  onChange={(e) => setFormData({ ...formData, school_hours: e.target.value })}
                  placeholder="e.g., 8:00 AM - 3:30 PM"
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the school, its mission, history, etc."
                  rows={4}
                />
              </div>

              {/* Programs */}
              <div>
                <Label>Programs & Activities</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newProgram}
                    onChange={(e) => setNewProgram(e.target.value)}
                    placeholder="Add a program (e.g., Band, STEM, Athletics)"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addProgram())}
                  />
                  <Button type="button" onClick={addProgram} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {formData.programs.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.programs.map((program, idx) => (
                      <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                        {program}
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => removeProgram(program)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Image */}
              <div>
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              {/* Social Media */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="facebook_url">Facebook URL</Label>
                  <Input
                    id="facebook_url"
                    type="url"
                    value={formData.facebook_url}
                    onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                    placeholder="https://facebook.com/..."
                  />
                </div>

                <div>
                  <Label htmlFor="twitter_url">Twitter/X URL</Label>
                  <Input
                    id="twitter_url"
                    type="url"
                    value={formData.twitter_url}
                    onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
                    placeholder="https://twitter.com/..."
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(createPageUrl("MySchools"))}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  {submitting ? "Creating..." : "Create School"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
