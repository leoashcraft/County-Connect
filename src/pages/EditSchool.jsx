import React, { useState, useEffect } from "react";
import { School, User, Town } from "@/api/entities";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, ArrowLeft, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function EditSchool() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const schoolId = searchParams.get("id");
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
  }, [schoolId]);

  const loadData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      const allTowns = await Town.list('name');
      setTowns(allTowns);

      if (schoolId) {
        const school = await School.get(schoolId);

        // Check permissions
        if (userData.id !== school.owner_id && userData.id !== school.created_by && userData.role !== 'admin') {
          alert("You don't have permission to edit this school");
          navigate(createPageUrl("Schools"));
          return;
        }

        setFormData({
          name: school.name || "",
          school_types: school.school_types || (school.school_type ? [school.school_type] : []),
          district: school.district || "",
          address: school.address || "",
          town: school.town || "",
          town_id: school.town_id || "",
          phone: school.phone || "",
          email: school.email || "",
          website: school.website || "",
          principal: school.principal || "",
          superintendent: school.superintendent || "",
          grades_served: school.grades_served || "",
          enrollment: school.enrollment || "",
          founded_year: school.founded_year || "",
          mascot: school.mascot || "",
          school_colors: school.school_colors || "",
          school_hours: school.school_hours || "",
          description: school.description || "",
          image_url: school.image_url || "",
          facebook_url: school.facebook_url || "",
          twitter_url: school.twitter_url || "",
          programs: school.programs || [],
          status: school.status || "active"
        });
      }
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
        founded_year: formData.founded_year ? parseInt(formData.founded_year) : null
      };

      await School.update(schoolId, schoolData);
      navigate(createPageUrl(`SchoolDetail?id=${schoolId}`));
    } catch (error) {
      console.error("Error updating school:", error);
      alert("Failed to update school. Please try again.");
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
          onClick={() => navigate(createPageUrl(`SchoolDetail?id=${schoolId}`))}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to School
        </Button>

        <Card className="border-2 border-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-blue-600" />
              Edit School
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
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
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
                  />
                </div>

                <div>
                  <Label htmlFor="superintendent">Superintendent</Label>
                  <Input
                    id="superintendent"
                    value={formData.superintendent}
                    onChange={(e) => setFormData({ ...formData, superintendent: e.target.value })}
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
                  />
                </div>

                <div>
                  <Label htmlFor="enrollment">Enrollment</Label>
                  <Input
                    id="enrollment"
                    type="number"
                    value={formData.enrollment}
                    onChange={(e) => setFormData({ ...formData, enrollment: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="founded_year">Founded Year</Label>
                  <Input
                    id="founded_year"
                    type="number"
                    value={formData.founded_year}
                    onChange={(e) => setFormData({ ...formData, founded_year: e.target.value })}
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
                  />
                </div>

                <div>
                  <Label htmlFor="school_colors">School Colors</Label>
                  <Input
                    id="school_colors"
                    value={formData.school_colors}
                    onChange={(e) => setFormData({ ...formData, school_colors: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="school_hours">School Hours</Label>
                <Input
                  id="school_hours"
                  value={formData.school_hours}
                  onChange={(e) => setFormData({ ...formData, school_hours: e.target.value })}
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                    placeholder="Add a program"
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
                  />
                </div>

                <div>
                  <Label htmlFor="twitter_url">Twitter/X URL</Label>
                  <Input
                    id="twitter_url"
                    type="url"
                    value={formData.twitter_url}
                    onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(createPageUrl(`SchoolDetail?id=${schoolId}`))}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  {submitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
