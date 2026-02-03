import React, { useState, useEffect } from "react";
import { Message } from "@/api/entities";
import { User, UserEntity } from "@/api/entities";
import { useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  MessageSquare, 
  Send, 
  Inbox, 
  Mail, 
  Search,
  ArrowLeft,
  X
} from "lucide-react";

export default function MessagesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const recipientEmail = urlParams.get('to');

  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState({});
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversationMessages, setConversationMessages] = useState([]);
  const [showCompose, setShowCompose] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const loadingRef = React.useRef(false);

  const [composeForm, setComposeForm] = useState({
    recipient_email: recipientEmail || "",
    subject: "",
    message: ""
  });

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    if (recipientEmail && user) {
      setComposeForm(prev => ({ ...prev, recipient_email: recipientEmail }));
      setShowCompose(true);
    }
  }, [recipientEmail, user]);

  const loadMessages = async () => {
    // Prevent multiple simultaneous loads
    if (loadingRef.current) {
      console.log("Messages load already in progress, skipping");
      return;
    }

    loadingRef.current = true;
    setLoading(true);

    try {
      const userData = await User.me();
      setUser(userData);

      const [allMessages, allUsers] = await Promise.all([
        Message.list('-created_date'),
        UserEntity.list()
      ]);

      const userMessages = allMessages.filter(
        m => m.recipient_email === userData.email || m.sender_email === userData.email
      );
      setMessages(userMessages);

      // Create users map
      const usersMap = {};
      allUsers.forEach(u => {
        usersMap[u.email] = u;
      });
      setUsers(usersMap);

      // Group messages into conversations
      const convos = {};
      userMessages.forEach(msg => {
        const otherUser = msg.sender_email === userData.email 
          ? msg.recipient_email 
          : msg.sender_email;
        
        if (!convos[otherUser]) {
          convos[otherUser] = {
            email: otherUser,
            messages: [],
            lastMessage: null,
            unreadCount: 0
          };
        }
        
        convos[otherUser].messages.push(msg);
        
        // Set last message
        if (!convos[otherUser].lastMessage || 
            new Date(msg.created_date) > new Date(convos[otherUser].lastMessage.created_date)) {
          convos[otherUser].lastMessage = msg;
        }
        
        // Count unread
        if (msg.recipient_email === userData.email && !msg.is_read) {
          convos[otherUser].unreadCount++;
        }
      });

      const conversationsList = Object.values(convos).sort((a, b) => {
        const dateA = new Date(a.lastMessage.created_date);
        const dateB = new Date(b.lastMessage.created_date);
        return dateB - dateA;
      });

      setConversations(conversationsList);

      // Auto-select first conversation or recipient
      if (recipientEmail) {
        const convo = conversationsList.find(c => c.email === recipientEmail);
        if (convo) {
          selectConversation(convo);
        }
      } else if (conversationsList.length > 0 && !selectedConversation) {
        selectConversation(conversationsList[0]);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
      // Only redirect if authentication failed
      if (error.message?.includes('Authentication required') || error.message?.includes('not authenticated')) {
        navigate(createPageUrl("Marketplace"));
      }
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  const selectConversation = async (conversation) => {
    setSelectedConversation(conversation);
    setShowCompose(false);
    
    // Sort messages by date
    const sorted = [...conversation.messages].sort((a, b) => 
      new Date(a.created_date) - new Date(b.created_date)
    );
    setConversationMessages(sorted);

    // Mark unread messages as read
    const unreadMessages = sorted.filter(
      m => m.recipient_email === user.email && !m.is_read
    );
    
    for (const msg of unreadMessages) {
      await Message.update(msg.id, { is_read: true });
    }
    
    // Reload to update unread counts
    if (unreadMessages.length > 0) {
      await loadMessages();
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    await Message.create({
      sender_email: user.email,
      recipient_email: composeForm.recipient_email,
      subject: composeForm.subject || "No Subject",
      message: composeForm.message
    });
    
    setComposeForm({ recipient_email: "", subject: "", message: "" });
    setShowCompose(false);
    await loadMessages();
    
    // Select the conversation with the recipient
    setTimeout(() => {
      const convo = conversations.find(c => c.email === composeForm.recipient_email);
      if (convo) {
        selectConversation(convo);
      }
    }, 500);
  };

  const handleReply = () => {
    if (selectedConversation) {
      setComposeForm({
        recipient_email: selectedConversation.email,
        subject: selectedConversation.lastMessage.subject.startsWith('Re: ') 
          ? selectedConversation.lastMessage.subject 
          : `Re: ${selectedConversation.lastMessage.subject}`,
        message: ""
      });
      setShowCompose(true);
    }
  };

  const handleNewMessage = () => {
    setComposeForm({ recipient_email: "", subject: "", message: "" });
    setShowCompose(true);
    setSelectedConversation(null);
  };

  const getInitials = (email) => {
    const userObj = users[email];
    if (userObj?.full_name) {
      return userObj.full_name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return email.charAt(0).toUpperCase();
  };

  const getUserName = (email) => {
    return users[email]?.full_name || email;
  };

  const unreadCount = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  const filteredUsers = Object.values(users).filter(u => 
    u.email !== user?.email &&
    (u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     u.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
      <MessageSquare className="w-12 h-12 text-orange-600 animate-pulse" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-orange-600" />
              Messages
            </h1>
            {unreadCount > 0 && (
              <p className="text-gray-600 mt-2">{unreadCount} unread message{unreadCount !== 1 ? 's' : ''}</p>
            )}
          </div>
          <Button 
            onClick={handleNewMessage}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
          >
            <Send className="w-4 h-4 mr-2" />
            New Message
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <Card className="border-2 border-orange-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Inbox className="w-5 h-5" />
                  Conversations
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                  {conversations.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <Mail className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No conversations yet</p>
                      <Button 
                        onClick={handleNewMessage}
                        variant="outline"
                        className="mt-4"
                      >
                        Start Conversation
                      </Button>
                    </div>
                  ) : (
                    conversations.map(convo => (
                      <button
                        key={convo.email}
                        onClick={() => selectConversation(convo)}
                        className={`w-full p-4 text-left hover:bg-orange-50 transition-colors ${
                          selectedConversation?.email === convo.email ? 'bg-orange-50' : ''
                        } ${convo.unreadCount > 0 ? 'bg-blue-50' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-400">
                            <AvatarFallback className="text-white font-semibold">
                              {getInitials(convo.email)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className={`font-medium text-gray-900 truncate ${convo.unreadCount > 0 ? 'font-bold' : ''}`}>
                                {getUserName(convo.email)}
                              </span>
                              {convo.unreadCount > 0 && (
                                <Badge className="bg-blue-500 ml-2">{convo.unreadCount}</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 truncate">
                              {convo.lastMessage.subject}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(convo.lastMessage.created_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Message View / Compose */}
          <div className="lg:col-span-2">
            {showCompose ? (
              <Card className="border-2 border-orange-200">
                <CardHeader className="border-b border-orange-100">
                  <div className="flex items-center justify-between">
                    <CardTitle>New Message</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowCompose(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleSendMessage} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">To:</label>
                      {composeForm.recipient_email ? (
                        <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
                          <Avatar className="w-8 h-8 bg-gradient-to-br from-orange-400 to-amber-400">
                            <AvatarFallback className="text-white text-sm font-semibold">
                              {getInitials(composeForm.recipient_email)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="flex-1">{getUserName(composeForm.recipient_email)}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setComposeForm({...composeForm, recipient_email: ""})}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <div className="relative mb-2">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              placeholder="Search users..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                          {searchTerm && (
                            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg divide-y">
                              {filteredUsers.length === 0 ? (
                                <div className="p-4 text-center text-gray-500 text-sm">
                                  No users found
                                </div>
                              ) : (
                                filteredUsers.map(u => (
                                  <button
                                    key={u.email}
                                    type="button"
                                    onClick={() => {
                                      setComposeForm({...composeForm, recipient_email: u.email});
                                      setSearchTerm("");
                                    }}
                                    className="w-full p-3 hover:bg-orange-50 transition-colors flex items-center gap-3"
                                  >
                                    <Avatar className="w-8 h-8 bg-gradient-to-br from-orange-400 to-amber-400">
                                      <AvatarFallback className="text-white text-sm font-semibold">
                                        {getInitials(u.email)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="text-left">
                                      <div className="font-medium text-gray-900">{u.full_name || 'User'}</div>
                                      <div className="text-sm text-gray-500">{u.email}</div>
                                    </div>
                                  </button>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <Input
                      placeholder="Subject"
                      value={composeForm.subject}
                      onChange={(e) => setComposeForm({...composeForm, subject: e.target.value})}
                      required
                    />
                    <Textarea
                      placeholder="Type your message here..."
                      value={composeForm.message}
                      onChange={(e) => setComposeForm({...composeForm, message: e.target.value})}
                      rows={8}
                      required
                    />
                    <div className="flex gap-3">
                      <Button 
                        type="submit" 
                        disabled={!composeForm.recipient_email}
                        className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowCompose(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            ) : selectedConversation ? (
              <Card className="border-2 border-orange-100">
                <CardHeader className="border-b border-orange-100 bg-orange-50/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-400">
                        <AvatarFallback className="text-white font-semibold">
                          {getInitials(selectedConversation.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{getUserName(selectedConversation.email)}</CardTitle>
                        <p className="text-sm text-gray-500">{selectedConversation.email}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4 max-h-[400px] overflow-y-auto mb-6">
                    {conversationMessages.map(msg => {
                      const isSentByMe = msg.sender_email === user.email;
                      return (
                        <div 
                          key={msg.id} 
                          className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[70%] ${isSentByMe ? 'order-2' : 'order-1'}`}>
                            <div className={`p-4 rounded-lg ${
                              isSentByMe 
                                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white' 
                                : 'bg-gray-100 text-gray-900'
                            }`}>
                              <p className={`text-xs font-semibold mb-2 ${isSentByMe ? 'text-orange-100' : 'text-gray-600'}`}>
                                {msg.subject}
                              </p>
                              <p className="whitespace-pre-wrap">{msg.message}</p>
                            </div>
                            <p className={`text-xs text-gray-500 mt-1 ${isSentByMe ? 'text-right' : 'text-left'}`}>
                              {new Date(msg.created_date).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="border-t pt-4">
                    <Button 
                      onClick={handleReply}
                      className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Reply
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-2 border-orange-100">
                <CardContent className="p-12 text-center">
                  <MessageSquare className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No conversation selected</h3>
                  <p className="text-gray-600 mb-6">Select a conversation from the list or start a new one</p>
                  <Button 
                    onClick={handleNewMessage}
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    New Message
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}