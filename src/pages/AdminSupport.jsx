
import React, { useState, useEffect } from "react";
import { User, UserEntity } from "@/api/entities";
import { SupportTicket } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  LifeBuoy, 
  Search, 
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  User as UserIcon,
  Star // Added Star icon
} from "lucide-react";

// Format labels for display (converts snake_case to Title Case)
const formatLabel = (str) => {
  if (!str) return '';
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export default function AdminSupport() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [response, setResponse] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const userData = await User.me();
      if (userData.role !== 'admin') {
        navigate(createPageUrl("Marketplace"));
        return;
      }
      await loadTickets();
    } catch (error) {
      navigate(createPageUrl("Marketplace"));
    }
  };

  const loadTickets = async () => {
    const [allTickets, allUsers] = await Promise.all([
      SupportTicket.list('-created_date'),
      UserEntity.list()
    ]);
    
    const usersMap = {};
    allUsers.forEach(u => usersMap[u.email] = u);
    
    setTickets(allTickets);
    setUsers(usersMap);
    setLoading(false);
  };

  const updateTicketStatus = async (ticketId, newStatus) => {
    setUpdating(true);
    await SupportTicket.update(ticketId, { status: newStatus });
    await loadTickets();
    // Update selected ticket in state if it's the one being updated
    setSelectedTicket(prevTicket => {
      if (prevTicket?.id === ticketId) {
        return { ...prevTicket, status: newStatus };
      }
      return prevTicket;
    });
    setUpdating(false);
  };

  const updateTicketPriority = async (ticketId, newPriority) => {
    setUpdating(true);
    await SupportTicket.update(ticketId, { priority: newPriority });
    await loadTickets();
    // Update selected ticket in state if it's the one being updated
    setSelectedTicket(prevTicket => {
      if (prevTicket?.id === ticketId) {
        return { ...prevTicket, priority: newPriority };
      }
      return prevTicket;
    });
    setUpdating(false);
  };

  const addResponse = async () => {
    if (!response.trim() || !selectedTicket) return;
    
    setUpdating(true);
    try {
      const currentUser = await User.me();
      
      // Get fresh ticket data to ensure we have latest responses
      const freshTickets = await SupportTicket.list();
      const freshTicket = freshTickets.find(t => t.id === selectedTicket.id);
      const existingResponses = freshTicket?.admin_responses || [];
      
      const newResponse = {
        response: response,
        timestamp: new Date().toISOString(),
        admin_email: currentUser.email,
        admin_name: currentUser.full_name || currentUser.email
      };
      
      await SupportTicket.update(selectedTicket.id, {
        admin_responses: [...existingResponses, newResponse],
        status: 'in_progress' // Automatically set to in_progress on admin response
      });
      
      setResponse("");
      await loadTickets();
      
      // Get the updated ticket to update selectedTicket state
      const updatedTickets = await SupportTicket.list();
      const updated = updatedTickets.find(t => t.id === selectedTicket.id);
      setSelectedTicket(updated);
    } catch (error) {
      console.error("Failed to add response:", error);
      alert("Failed to add response. Please try again.");
    }
    setUpdating(false);
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
    
    // Sort responses by timestamp
    messages.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return dateA - dateB;
    });
    
    // Add initial message at the beginning
    messages.unshift({
      type: 'user',
      message: ticket.description,
      timestamp: ticket.created_date,
      isInitial: true
    });
    
    return messages;
  };

  const getAverageRating = () => {
    const ratedTickets = tickets.filter(t => t.support_rating && (t.status === 'resolved' || t.status === 'closed'));
    if (ratedTickets.length === 0) return "N/A";
    const sum = ratedTickets.reduce((acc, t) => acc + t.support_rating, 0);
    return (sum / ratedTickets.length).toFixed(1);
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = !searchTerm || 
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.ticket_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.user_email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;
    const matchesCategory = categoryFilter === "all" || ticket.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const getStatusIcon = (status) => {
    switch(status) {
      case 'open': return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'in_progress': return <Clock className="w-5 h-5 text-blue-600" />;
      case 'resolved': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'closed': return <XCircle className="w-5 h-5 text-gray-600" />;
      default: return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'low': return 'bg-gray-100 text-gray-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      technical: 'bg-purple-100 text-purple-800',
      billing: 'bg-green-100 text-green-800',
      product: 'bg-blue-100 text-blue-800',
      account: 'bg-yellow-100 text-yellow-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.other;
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <LifeBuoy className="w-12 h-12 text-orange-600 animate-spin" />
    </div>;
  }

  const averageRating = getAverageRating();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <LifeBuoy className="w-8 h-8 text-orange-600" />
            Support Tickets
          </h1>
          <p className="text-gray-600 mt-2">Manage and respond to customer support requests</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-5 gap-4 mb-6"> {/* Changed to 5 columns */}
          <Card className="border-2 border-red-200">
            <CardContent className="p-4">
              <div className="text-sm text-gray-600">Open Tickets</div>
              <div className="text-2xl font-bold text-red-600">
                {tickets.filter(t => t.status === 'open').length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-blue-200">
            <CardContent className="p-4">
              <div className="text-sm text-gray-600">In Progress</div>
              <div className="text-2xl font-bold text-blue-600">
                {tickets.filter(t => t.status === 'in_progress').length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-green-200">
            <CardContent className="p-4">
              <div className="text-sm text-gray-600">Resolved</div>
              <div className="text-2xl font-bold text-green-600">
                {tickets.filter(t => t.status === 'resolved').length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-orange-200">
            <CardContent className="p-4">
              <div className="text-sm text-gray-600">Urgent</div>
              <div className="text-2xl font-bold text-orange-600">
                {tickets.filter(t => t.priority === 'urgent').length}
              </div>
            </CardContent>
          </Card>
          {/* New Avg Rating Card */}
          <Card className="border-2 border-yellow-200">
            <CardContent className="p-4">
              <div className="text-sm text-gray-600">Avg Rating</div>
              <div className="flex items-center gap-1">
                <div className="text-2xl font-bold text-yellow-600">{averageRating}</div>
                {averageRating !== "N/A" && <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {tickets.filter(t => t.support_rating && (t.status === 'resolved' || t.status === 'closed')).length} ratings
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-2 border-orange-100 mb-6">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="billing">Billing</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="account">Account</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tickets Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Tickets List */}
          <div className="space-y-4">
            {filteredTickets.length === 0 ? (
              <Card className="border-2 border-orange-100">
                <CardContent className="p-12 text-center">
                  <LifeBuoy className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">No tickets found</h3>
                  <p className="text-gray-600">Try adjusting your filters</p>
                </CardContent>
              </Card>
            ) : (
              filteredTickets.map(ticket => {
                const user = users[ticket.user_email];
                return (
                  <Card 
                    key={ticket.id} 
                    className={`border-2 cursor-pointer transition-all ${
                      selectedTicket?.id === ticket.id 
                        ? 'border-orange-500 bg-orange-50' 
                        : 'border-orange-100 hover:border-orange-300'
                    }`}
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(ticket.status)}
                          <div>
                            <h3 className="font-bold text-gray-900">{ticket.subject}</h3>
                            <p className="text-sm text-gray-500">{ticket.ticket_number}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge className={getStatusColor(ticket.status)}>
                            {ticket.status.replace(/_/g, ' ')}
                          </Badge>
                          {ticket.support_rating && (
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i}
                                  className={`w-3 h-3 ${i < ticket.support_rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-3 line-clamp-2">{ticket.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <UserIcon className="w-4 h-4" />
                          {user?.full_name || ticket.user_email}
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getPriorityColor(ticket.priority)}>
                            {formatLabel(ticket.priority)}
                          </Badge>
                          <Badge className={getCategoryColor(ticket.category)}>
                            {formatLabel(ticket.category)}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        {new Date(ticket.created_date).toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>

          {/* Ticket Detail */}
          {selectedTicket && (
            <div className="lg:sticky lg:top-6 space-y-4">
              <Card className="border-2 border-orange-200">
                <CardHeader className="bg-orange-50">
                  <CardTitle className="flex items-center gap-2">
                    {getStatusIcon(selectedTicket.status)}
                    Ticket Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="font-bold text-xl text-gray-900 mb-2">{selectedTicket.subject}</h3>
                    <p className="text-sm text-gray-500 mb-4">{selectedTicket.ticket_number}</p>
                  </div>

                  {/* User Rating Display */}
                  {selectedTicket.support_rating !== undefined && (selectedTicket.status === 'resolved' || selectedTicket.status === 'closed') && (
                    <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-900">User Rating:</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star 
                              key={star}
                              className={`w-5 h-5 ${star <= selectedTicket.support_rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="font-bold text-yellow-700">{selectedTicket.support_rating}/5</span>
                      </div>
                      <div className="text-sm text-gray-700 mb-1">
                        <span className="font-medium">Issue Resolved:</span> {selectedTicket.issue_resolved ? 'Yes ✓' : 'No ✗'}
                      </div>
                      {selectedTicket.closing_feedback && (
                        <div className="mt-2 pt-2 border-t border-yellow-300">
                          <span className="font-medium text-sm text-gray-700">User Feedback:</span>
                          <p className="text-sm text-gray-600 mt-1">{selectedTicket.closing_feedback}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <label className="text-sm text-gray-600">Status</label>
                      <Select 
                        value={selectedTicket.status} 
                        onValueChange={(value) => updateTicketStatus(selectedTicket.id, value)}
                        disabled={updating}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Priority</label>
                      <Select 
                        value={selectedTicket.priority} 
                        onValueChange={(value) => updateTicketPriority(selectedTicket.id, value)}
                        disabled={updating}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 mb-2">
                      <UserIcon className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">
                        {users[selectedTicket.user_email]?.full_name || selectedTicket.user_email}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{selectedTicket.user_email}</p>
                  </div>

                  {selectedTicket.attachments && selectedTicket.attachments.length > 0 && (
                    <div className="pt-4 border-t">
                      <h4 className="font-semibold text-gray-900 mb-2">Attachments</h4>
                      <div className="space-y-2">
                        {selectedTicket.attachments.map((url, idx) => (
                          <a 
                            key={idx}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-sm text-blue-600 hover:underline"
                          >
                            Attachment {idx + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Conversation Thread */}
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Conversation
                    </h4>
                    <div className="space-y-3 max-h-96 overflow-y-auto mb-4 p-3 bg-gray-50 rounded-lg">
                      {getAllMessages(selectedTicket).map((msg, idx) => (
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
                                    : (users[selectedTicket.user_email]?.full_name || 'User')}
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
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-semibold text-gray-900 mb-3">Add Response</h4>
                    <Textarea
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      placeholder="Type your response..."
                      rows={4}
                      className="mb-3"
                    />
                    <Button
                      onClick={addResponse}
                      disabled={!response.trim() || updating}
                      className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Send Response
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
