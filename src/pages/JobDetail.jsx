import React, { useState, useEffect } from "react";
import { Job, User } from "@/api/entities";
import { useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, DollarSign, Clock, Building2, Mail, Phone, Briefcase, Edit } from "lucide-react";
import { SafeEmail } from "@/components/utils/emailObfuscation";
import MetaTags from "@/components/seo/MetaTags";
import JsonLdSchema from "@/components/seo/JsonLdSchema";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function JobDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const jobId = urlParams.get('id');

  const [job, setJob] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { settings } = useSiteSettings();

  useEffect(() => {
    loadJob();
  }, [jobId]);

  const loadJob = async () => {
    if (!jobId) {
      navigate(createPageUrl("Jobs"));
      return;
    }

    try {
      const jobData = await Job.get(jobId);
      if (!jobData) {
        alert("Job not found");
        navigate(createPageUrl("Jobs"));
        return;
      }

      setJob(jobData);

      const userData = await User.me().catch(() => null);
      setUser(userData);
    } catch (error) {
      console.error("Error loading job:", error);
      navigate(createPageUrl("Jobs"));
    }

    setLoading(false);
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

  const isOwner = user && job && (user.email === job.created_by);

  if (loading || !job) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <Briefcase className="w-12 h-12 text-orange-600 animate-pulse" />
    </div>;
  }

  return (
    <>
      <MetaTags
        title={`${job.title} - Job in ${settings.county_name || 'Navarro'} County`}
        description={job.description || `Job opportunity at ${job.company}`}
      />
      <JsonLdSchema type="localBusiness" data={job} />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
        <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("Jobs"))}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">Job Details</h1>
          </div>
          {isOwner && (
            <Button
              variant="outline"
              onClick={() => navigate(createPageUrl(`EditJob?id=${job.id}`))}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </div>

        {/* Job Info */}
        <Card className="border-2 border-orange-200 mb-6">
          <CardHeader className="border-b border-orange-100 bg-orange-50/50">
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-amber-400 rounded-lg flex items-center justify-center flex-shrink-0">
                <Building2 className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
                <p className="text-lg text-gray-700 font-medium">{job.company}</p>
                <div className="mt-3">
                  <Badge className={getJobTypeColor(job.job_type)}>
                    {job.job_type?.replace(/_/g, ' ')}
                  </Badge>
                  {job.category && (
                    <Badge variant="outline" className="ml-2">
                      {job.category.replace(/_/g, ' ')}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {job.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Location</p>
                    <p className="text-gray-700">{job.location}</p>
                  </div>
                </div>
              )}

              {job.salary_range && (
                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Salary Range</p>
                    <p className="text-gray-700">{job.salary_range}</p>
                  </div>
                </div>
              )}

              {job.created_date && (
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Posted</p>
                    <p className="text-gray-700">{new Date(job.created_date).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        {job.description && (
          <Card className="border-2 border-orange-200 mb-6">
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Requirements */}
        {job.requirements && (
          <Card className="border-2 border-orange-200 mb-6">
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{job.requirements}</p>
            </CardContent>
          </Card>
        )}

        {/* Contact Information */}
        <Card className="border-2 border-orange-200">
          <CardHeader>
            <CardTitle>How to Apply</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {job.contact_email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-orange-600" />
                  <SafeEmail email={job.contact_email} className="text-orange-600 hover:text-orange-700 font-medium" />
                </div>
              )}

              {job.contact_phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-orange-600" />
                  <a
                    href={`tel:${job.contact_phone}`}
                    className="text-orange-600 hover:text-orange-700 font-medium"
                  >
                    {job.contact_phone}
                  </a>
                </div>
              )}

              {job.application_url && (
                <div className="mt-4">
                  <Button
                    onClick={() => window.open(job.application_url, '_blank')}
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  >
                    Apply Now
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </>
  );
}
