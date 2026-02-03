import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { AlertTriangle, ExternalLink } from "lucide-react";

/**
 * Alert component shown when a duplicate listing is detected
 * Provides link to support to report issues
 */
export default function DuplicateListingAlert({ entityType, entityName, townName }) {
  const supportUrl = `${createPageUrl("Support")}?category=duplicate_listing&subject=${encodeURIComponent(`Duplicate ${entityType}: ${entityName}`)}`;

  return (
    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-semibold text-red-800 mb-1">
            Duplicate Listing Detected
          </h4>
          <p className="text-sm text-red-700 mb-3">
            A {entityType.toLowerCase()} with this name already exists in {townName || 'this area'}.
            Each listing must have a unique name within its town.
          </p>
          <p className="text-sm text-red-700 mb-3">
            If you believe this is an error or would like to claim an existing listing,
            please open a support ticket.
          </p>
          <Link
            to={supportUrl}
            className="inline-flex items-center gap-2 text-sm font-medium text-red-800 hover:text-red-900 underline"
          >
            <ExternalLink className="w-4 h-4" />
            Open Support Ticket
          </Link>
        </div>
      </div>
    </div>
  );
}
