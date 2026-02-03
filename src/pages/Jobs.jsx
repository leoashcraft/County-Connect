import React, { useState, useEffect } from "react";
import { Job, User, Town } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Search, MapPin, DollarSign, Clock, Building2, Filter, Star } from "lucide-react";
import LocationFilter from "@/components/LocationFilter";
import { useLocationFilter } from "@/hooks/useLocationFilter";
import { applyLocationFilter } from "@/utils/locationFilter";
import MetaTags from "@/components/seo/MetaTags";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function Jobs() {
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const [jobs, setJobs] = useState([]);
  const [user, setUser] = useState(null);
  const [userTown, setUserTown] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const { state: filterState } = useLocationFilter();
  const [towns, setTowns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const userData = await User.me().catch(() => null);
      setUser(userData);

      // Load user's preferred town if they have one
      if (userData?.preferred_town_id) {
        const town = await Town.get(userData.preferred_town_id);
        setUserTown(town);
      }

      // Load all towns for the filter modal
      const allTowns = await Town.list('name');
      setTowns(allTowns);

      const allJobs = await Job.filter({ status: "active" }, '-created_date');
      setJobs(allJobs);
    } catch (error) {
      console.error("Error loading jobs:", error);
    }
    setLoading(false);
  };

  const searchFiltered = jobs.filter(job => {
    const matchesSearch = !searchTerm ||
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === "all" || job.category === categoryFilter;
    const matchesType = typeFilter === "all" || job.job_type === typeFilter;

    return matchesSearch && matchesCategory && matchesType;
  });

  const filteredJobs = applyLocationFilter(
    searchFiltered,
    filterState,
    userTown,
    (item) => item.town_id
  );

  const categories = [
    { value: "all", label: "All Categories" },
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
    { value: "all", label: "All Types" },
    { value: "full_time", label: "Full Time" },
    { value: "part_time", label: "Part Time" },
    { value: "contract", label: "Contract" },
    { value: "temporary", label: "Temporary" },
    { value: "internship", label: "Internship" }
  ];

  const getJobTypeColor = (type) => {
    switch (type) {
      case 'full_time': return 'bg-blue-100 text-blue-800';
      case 'part_time': return 'bg-green-100 text-green-800';
      case 'contract': return 'bg-purple-100 text-purple-800';
      case 'temporary': return 'bg-yellow-100 text-yellow-800';
      case 'internship': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <Briefcase className="w-12 h-12 text-orange-600 animate-pulse" />
    </div>;
  }

  return (
    <>
      <MetaTags
        title={`Jobs in ${settings.county_name || 'Navarro'} County, TX`}
        description={`Find job opportunities in ${settings.county_name || 'Navarro'} County, Texas. Browse local employment listings and career opportunities.`}
      />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Briefcase className="w-8 h-8 text-orange-600" />
                Jobs & Gigs
              </h1>
              <p className="text-gray-600 mt-2">Find your next job or gig in the community</p>
            </div>
            <Button
              onClick={async () => {
                if (!user) {
                  localStorage.setItem('redirectAfterLogin', createPageUrl("AddJob"));
                  await User.login();
                  return;
                }
                navigate(createPageUrl("AddJob"));
              }}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Post a Job or Gig
            </Button>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mt-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <Input
                type="text"
                placeholder="Search jobs, companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-14 pr-4 py-6 text-lg border-2 border-orange-200 focus:border-orange-400"
              />
            </div>
          </div>
        </div>

        {/* Location Filter */}
        <LocationFilter
          userTown={userTown}
          towns={towns}
          itemName="jobs and gigs"
        />

        {/* Jobs Section */}
        <div className="mt-8">
        {/* Filters */}
        <Card className="border-2 border-orange-100 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-orange-600" />
              <h3 className="font-bold text-gray-900">Filters</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
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
          </CardContent>
        </Card>

        {/* Job Listings */}
        <div className="space-y-4">
          {filteredJobs.length === 0 ? (
            <Card className="border-2 border-orange-100">
              <CardContent className="p-12 text-center">
                <Briefcase className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No jobs found</h3>
                <p className="text-gray-600">
                  {searchTerm || categoryFilter !== "all" || typeFilter !== "all"
                    ? "Try adjusting your filters"
                    : "Be the first to post a job!"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredJobs.map(job => (
              <Card
                key={job.id}
                className="border-2 border-orange-100 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(createPageUrl(`JobDetail?id=${job.id}`))}
              >
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-400 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-8 h-8 text-white" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
                          <p className="text-gray-600 font-medium">{job.company}</p>
                        </div>
                        <Badge className={getJobTypeColor(job.job_type)}>
                          {job.job_type?.replace(/_/g, ' ')}
                        </Badge>
                      </div>

                      {job.description && (
                        <p className="text-gray-700 mb-3 line-clamp-2">{job.description}</p>
                      )}

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        {job.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </div>
                        )}
                        {job.salary_range && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {job.salary_range}
                          </div>
                        )}
                        {job.created_date && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Posted {new Date(job.created_date).toLocaleDateString()}
                          </div>
                        )}
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
    </div>
    </>
  );
}
