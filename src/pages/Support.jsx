
import React, { useState, useEffect } from "react";
import { SupportTicket } from "@/api/entities";
import { User } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { LifeBuoy, Plus, Ticket, MessageSquare, User as UserIcon, Send, X, Star } from "lucide-react";

// Format labels for display (converts snake_case to Title Case)
const formatLabel = (str) => {
  if (!str) return '';
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export default function SupportPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [closingTicket, setClosingTicket] = useState(null);
  const [closeData, setCloseData] = useState({
    issue_resolved: true,
    support_rating: 5,
    closing_feedback: ""
  });
  
  const [formData, setFormData] = useState({
    subject: "",
    category: "technical",
    priority: "medium",
    description: ""
  });

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      
      const userTickets = await SupportTicket.filter({ user_email: userData.email }, '-created_date');
      setTickets(userTickets);
    } catch (error) {
      navigate(createPageUrl("Marketplace"));
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await SupportTicket.create({
      ticket_number: `TICKET-${Date.now()}`,
      user_email: user.email,
      ...formData
    });
    setFormData({ subject: "", category: "technical", priority: "medium", description: "" });
    setShowCreate(false);
    await loadTickets();
  };

  const handleReply = async (ticketId) => {
    if (!replyText.trim()) return;
    
    setSending(true);
    try {
      const freshTickets = await SupportTicket.list();
      const freshTicket = freshTickets.find(t => t.id === ticketId);
      const existingResponses = freshTicket?.user_responses || [];
      
      await SupportTicket.update(ticketId, {
        user_responses: [
          ...existingResponses,
          {
            response: replyText,
            timestamp: new Date().toISOString()
          }
        ],
        status: 'in_progress'
      });
      
      setReplyText("");
      setReplyingTo(null);
      await loadTickets();
    } catch (error) {
      console.error("Failed to send reply:", error);
      alert("Failed to send reply. Please try again.");
    }
    setSending(false);
  };

  const handleCloseTicket = async () => {
    if (!closingTicket) return;
    
    setSending(true);
    try {
      await SupportTicket.update(closingTicket.id, {
        status: closeData.issue_resolved ? 'resolved' : 'closed',
        support_rating: closeData.support_rating,
        issue_resolved: closeData.issue_resolved,
        closing_feedback: closeData.closing_feedback
      });
      
      setClosingTicket(null);
      setCloseData({
        issue_resolved: true,
        support_rating: 5,
        closing_feedback: ""
      });
      await loadTickets();
    } catch (error) {
      console.error("Failed to close ticket:", error);
      alert("Failed to close ticket. Please try again.");
    }
    setSending(false);
  };

  const statusColors = {
    open: "bg-blue-100 text-blue-800",
    in_progress: "bg-yellow-100 text-yellow-800",
    resolved: "bg-green-100 text-green-800",
    closed: "bg-gray-100 text-gray-800"
  };

  const priorityColors = {
    low: "bg-gray-100 text-gray-800",
    medium: "bg-blue-100 text-blue-800",
    high: "bg-orange-100 text-orange-800",
    urgent: "bg-red-100 text-red-800"
  };

  const getAllMessages = (ticket) => {
    const messages = [];
    
    if (ticket.admin_responses && Array.isArray(ticket.admin_responses)) {
      ticket.admin_responses.forEach(resp => {
        messages.push({
          type: 'admin',
          message: resp.response,
          timestamp: resp.timestamp,
          admin_name: resp.admin_name || resp.admin_email
        });
      });
    }
    
    if (ticket.user_responses && Array.isArray(ticket.user_responses)) {
      ticket.user_responses.forEach(resp => {
        messages.push({
          type: 'user',
          message: resp.response,
          timestamp: resp.timestamp
        });
      });
    }
    
    messages.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return dateA - dateB;
    });
    
    messages.unshift({
      type: 'user',
      message: ticket.description,
      timestamp: ticket.created_date,
      isInitial: true
    });
    
    return messages;
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <LifeBuoy className="w-12 h-12 text-orange-600 animate-spin" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <LifeBuoy className="w-8 h-8 text-orange-600" />
              Support Center
            </h1>
            <p className="text-gray-600 mt-2">Get help with your issues</p>
          </div>
          <Button 
            onClick={() => setShowCreate(!showCreate)}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Ticket
          </Button>
        </div>

        {showCreate && (
          <Card className="border-2 border-orange-200 mb-6">
            <CardHeader>
              <CardTitle>Create Support Ticket</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  required
                />
                <div className="grid md:grid-cols-2 gap-4">
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical Issue</SelectItem>
                      <SelectItem value="billing">Billing</SelectItem>
                      <SelectItem value="product">Product Question</SelectItem>
                      <SelectItem value="account">Account Help</SelectItem>
                      <SelectItem value="duplicate_listing">Duplicate Listing</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="high">High Priority</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Textarea
                  placeholder="Describe your issue in detail..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={6}
                  required
                />
                <div className="flex gap-3">
                  <Button type="submit" className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600">
                    Submit Ticket
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {tickets.length === 0 ? (
            <Card className="border-2 border-orange-100">
              <CardContent className="p-12 text-center">
                <Ticket className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No support tickets</h3>
                <p className="text-gray-600 mb-6">Create a ticket if you need help</p>
              </CardContent>
            </Card>
          ) : (
            tickets.map(ticket => {
              const messages = getAllMessages(ticket);
              
              return (
                <Card key={ticket.id} className="border-2 border-orange-100">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{ticket.subject}</h3>
                          <Badge className={statusColors[ticket.status]}>
                            {ticket.status.replace(/_/g, ' ')}
                          </Badge>
                          <Badge className={priorityColors[ticket.priority]}>
                            {formatLabel(ticket.priority)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">
                          Ticket #{ticket.ticket_number} • {new Date(ticket.created_date).toLocaleDateString()}
                        </p>

                        {/* Show rating if ticket is closed/resolved */}
                        {ticket.support_rating && (ticket.status === 'resolved' || ticket.status === 'closed') && (
                          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-medium text-gray-700">Your Rating:</span>
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <Star 
                                    key={star}
                                    className={`w-4 h-4 ${star <= ticket.support_rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                            </div>
                            {ticket.closing_feedback && (
                              <p className="text-sm text-gray-600">Feedback: {ticket.closing_feedback}</p>
                            )}
                          </div>
                        )}

                        {/* Conversation Thread */}
                        <div className="space-y-3 mb-4 bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                          {messages.map((msg, idx) => (
                            <div 
                              key={idx} 
                              className={`flex gap-3 ${msg.type === 'user' ? 'flex-row' : 'flex-row-reverse'}`}
                            >
                              <div className={`w-8 h-8 ${
                                msg.type === 'admin' ? 'bg-blue-500' : 'bg-orange-500'
                              } rounded-full flex items-center justify-center flex-shrink-0`}>
                                <UserIcon className="w-5 h-5 text-white" />
                              </div>
                              <div className={`flex-1 ${msg.type === 'user' ? 'text-left' : 'text-right'}`}>
                                <div className={`inline-block max-w-[80%] ${
                                  msg.type === 'admin' 
                                    ? 'bg-blue-100 text-blue-900' 
                                    : 'bg-orange-100 text-orange-900'
                                } rounded-lg p-3`}>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-sm">
                                      {msg.type === 'admin' 
                                        ? (msg.admin_name && !msg.admin_name.includes('@') ? msg.admin_name : 'Support Team')
                                        : 'You'}
                                      {msg.isInitial && ' (Initial Message)'}
                                    </span>
                                  </div>
                                  <p className="text-gray-800 whitespace-pre-wrap text-sm">{msg.message}</p>
                                  <span className="text-xs opacity-70 mt-1 block">
                                    {new Date(msg.timestamp).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Reply or Close Section */}
                        {ticket.status !== 'closed' && ticket.status !== 'resolved' ? (
                          <div className="border-t border-gray-200 pt-4 space-y-3">
                            {replyingTo === ticket.id ? (
                              <div className="space-y-3">
                                <Textarea
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  placeholder="Type your reply..."
                                  rows={3}
                                />
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => handleReply(ticket.id)}
                                    disabled={!replyText.trim() || sending}
                                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                                  >
                                    {sending ? (
                                      <>Sending...</>
                                    ) : (
                                      <>
                                        <Send className="w-4 h-4 mr-2" />
                                        Send Reply
                                      </>
                                    )}
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setReplyingTo(null);
                                      setReplyText("");
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => setReplyingTo(ticket.id)}
                                  variant="outline"
                                  className="flex-1 border-orange-200 hover:bg-orange-50"
                                >
                                  <MessageSquare className="w-4 h-4 mr-2" />
                                  Reply to Support Team
                                </Button>
                                <Button
                                  onClick={() => setClosingTicket(ticket)}
                                  variant="outline"
                                  className="border-gray-300 hover:bg-gray-100"
                                >
                                  <X className="w-4 h-4 mr-2" />
                                  Close Ticket
                                </Button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="border-t border-gray-200 pt-4">
                            <Badge className={statusColors[ticket.status]}>
                              Ticket {ticket.status === 'resolved' ? 'Resolved' : 'Closed'}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                      <Badge variant="outline">{formatLabel(ticket.category)}</Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Close Ticket Dialog */}
      <Dialog open={!!closingTicket} onOpenChange={() => setClosingTicket(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Close Support Ticket</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <Label>Was your issue resolved?</Label>
              <RadioGroup 
                value={closeData.issue_resolved.toString()} 
                onValueChange={(value) => setCloseData({...closeData, issue_resolved: value === 'true'})}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="resolved-yes" />
                  <Label htmlFor="resolved-yes" className="cursor-pointer">Yes, my issue was resolved</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="resolved-no" />
                  <Label htmlFor="resolved-no" className="cursor-pointer">No, but I want to close this ticket</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Rate our support (1-5 stars)</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setCloseData({...closeData, support_rating: star})}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star 
                      className={`w-8 h-8 ${star <= closeData.support_rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Additional feedback (optional)</Label>
              <Textarea
                value={closeData.closing_feedback}
                onChange={(e) => setCloseData({...closeData, closing_feedback: e.target.value})}
                placeholder="Tell us about your experience..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleCloseTicket}
              disabled={sending}
              className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            >
              {sending ? 'Closing...' : 'Close Ticket'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setClosingTicket(null)}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
