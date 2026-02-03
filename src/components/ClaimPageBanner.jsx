import React, { useState } from "react";
import { User } from "@/api/entities";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge, Shield, CheckCircle, Building2 } from "lucide-react";

// This component creates a claim request via the ClaimRequest entity
const createClaimRequest = async (data) => {
  const response = await fetch('/api/entities/ClaimRequest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to create claim request');
  return response.json();
};

export default function ClaimPageBanner({
  entityType,
  entityId,
  entityName,
  ownerId,
  user,
  onClaimSubmitted
}) {
  const [showClaimDialog, setShowClaimDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    your_role: "",
    phone: "",
    verification_info: ""
  });

  // Don't show if already owned
  if (ownerId) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please sign in to claim this page");
      User.login();
      return;
    }

    setSubmitting(true);
    try {
      await createClaimRequest({
        entity_type: entityType,
        entity_id: entityId,
        entity_name: entityName,
        user_id: user.id,
        user_email: user.email,
        user_name: user.full_name || user.email,
        your_role: formData.your_role,
        contact_phone: formData.phone,
        verification_info: formData.verification_info,
        status: "pending",
        created_date: new Date().toISOString()
      });

      setSubmitted(true);
      setShowClaimDialog(false);
      if (onClaimSubmitted) onClaimSubmitted();
    } catch (error) {
      console.error("Error submitting claim:", error);
      alert("Failed to submit claim request. Please try again.");
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <Card className="border-2 border-green-200 bg-green-50 mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-semibold text-green-800">Claim Request Submitted</p>
              <p className="text-sm text-green-700">
                We'll review your request and contact you soon.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Is this your {entityType.toLowerCase()}?</p>
                <p className="text-sm text-gray-600">
                  Claim this page to manage your listing, add photos, and respond to the community.
                </p>
              </div>
            </div>
            <Button
              onClick={() => user ? setShowClaimDialog(true) : User.login()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Shield className="w-4 h-4 mr-2" />
              Claim This Page
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showClaimDialog} onOpenChange={setShowClaimDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Claim "{entityName}"
            </DialogTitle>
            <DialogDescription>
              Please provide information to verify your connection to this {entityType.toLowerCase()}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="your_role">Your Role / Position *</Label>
              <Input
                id="your_role"
                placeholder="e.g., Pastor, Owner, Manager, Coach"
                value={formData.your_role}
                onChange={(e) => setFormData({ ...formData, your_role: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Contact Phone *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="verification_info">How can we verify you? *</Label>
              <Textarea
                id="verification_info"
                placeholder="Please describe how we can verify your connection to this listing. For example: 'I'm listed on the church website as pastor' or 'Call the main number and ask for me'"
                value={formData.verification_info}
                onChange={(e) => setFormData({ ...formData, verification_info: e.target.value })}
                rows={3}
                required
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowClaimDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700">
                {submitting ? "Submitting..." : "Submit Claim Request"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
