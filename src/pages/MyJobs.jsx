import React, { useState, useEffect } from "react";
import { Job, User } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Edit, Eye, Trash2, Plus, ArrowLeft } from "lucide-react";

export default function MyJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyJobs();
  }, []);

  const loadMyJobs = async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      const allJobs = await Job.list('-created_date');
      const myJobs = allJobs.filter(job => job.created_by === userData.id);
      setJobs(myJobs);
    } catch (error) {
      console.error("Error loading jobs:", error);
      navigate(createPageUrl("Jobs"));
    }
    setLoading(false);
  };

  const deleteJob = async (jobId) => {
    if (!confirm("Are you sure you want to delete this job posting?")) {
      return;
    }

    try {
      await Job.delete(jobId);
      await loadMyJobs();
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Failed to delete job");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
                <Briefcase className="w-8 h-8 text-orange-600" />
                My Jobs & Gigs
              </h1>
              <p className="text-gray-600 mt-2">Manage your job and gig listings</p>
            </div>
            <Button
              onClick={() => navigate(createPageUrl("AddJob"))}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Post New Job or Gig
            </Button>
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-4">
          {jobs.length === 0 ? (
            <Card className="border-2 border-orange-100">
              <CardContent className="p-12 text-center">
                <Briefcase className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No job or gig postings yet</h3>
                <p className="text-gray-600 mb-6">Post your first job or gig to find great candidates</p>
                <Button
                  onClick={() => navigate(createPageUrl("AddJob"))}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Post a Job or Gig
                </Button>
              </CardContent>
            </Card>
          ) : (
            jobs.map(job => (
              <Card key={job.id} className="border-2 border-orange-100">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                          <p className="text-gray-600 font-medium">{job.company}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getStatusColor(job.status)}>
                            {job.status}
                          </Badge>
                          <Badge className={getJobTypeColor(job.job_type)}>
                            {job.job_type?.replace(/_/g, ' ')}
                          </Badge>
                        </div>
                      </div>

                      {job.description && (
                        <p className="text-gray-700 mb-3 line-clamp-2">{job.description}</p>
                      )}

                      <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-4">
                        {job.location && <span>📍 {job.location}</span>}
                        {job.salary_range && <span>💰 {job.salary_range}</span>}
                        {job.created_date && (
                          <span>Posted {new Date(job.created_date).toLocaleDateString()}</span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(createPageUrl(`JobDetail?id=${job.id}`))}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(createPageUrl(`EditJob?id=${job.id}`))}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => deleteJob(job.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
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
