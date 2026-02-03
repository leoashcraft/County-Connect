import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, DollarSign, Clock } from "lucide-react";

export default function TownJobCard({ job }) {
  const navigate = useNavigate();

  const getJobTypeLabel = (type) => {
    const labels = {
      full_time: "Full-Time",
      part_time: "Part-Time",
      contract: "Contract",
      temporary: "Temporary",
      internship: "Internship"
    };
    return labels[type] || type?.replace(/_/g, ' ');
  };

  const getJobTypeColor = (type) => {
    const colors = {
      full_time: "bg-green-50 text-green-700",
      part_time: "bg-blue-50 text-blue-700",
      contract: "bg-purple-50 text-purple-700",
      temporary: "bg-amber-50 text-amber-700",
      internship: "bg-pink-50 text-pink-700"
    };
    return colors[type] || "bg-gray-50 text-gray-700";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card
      className="border border-gray-200 hover:border-green-300 hover:shadow-md transition-all cursor-pointer"
      onClick={() => navigate(createPageUrl(`JobDetail?id=${job.id}`))}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          {job.job_type && (
            <Badge variant="secondary" className={`text-xs ${getJobTypeColor(job.job_type)}`}>
              {getJobTypeLabel(job.job_type)}
            </Badge>
          )}
        </div>
        <h3 className="font-semibold text-gray-900 line-clamp-1">{job.title}</h3>
        {job.company_name && (
          <p className="text-sm text-gray-600 line-clamp-1">{job.company_name}</p>
        )}
        {job.town && (
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3" />
            {job.town}
          </p>
        )}
        <div className="flex items-center justify-between mt-2">
          {job.salary_range && (
            <span className="text-xs text-green-600 flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              {job.salary_range}
            </span>
          )}
          {job.created_date && (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDate(job.created_date)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
