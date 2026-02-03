import React, { useState, useEffect, useRef } from "react";
import { ChatChannel, ChatMessage, ChatRole, User, Town } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import MetaTags from "@/components/seo/MetaTags";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  MessageSquare,
  Send,
  Hash,
  Pin,
  Trash2,
  Shield,
  Star,
  Building2,
  Users,
  Clock,
  AlertCircle,
  MapPin,
  Globe
} from "lucide-react";

export default function TownSquare() {
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userTown, setUserTown] = useState(null);
  const [towns, setTowns] = useState([]);
  const [allChannels, setAllChannels] = useState([]);
  const [selectedTown, setSelectedTown] = useState("all");
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const pollingInterval = useRef(null);

  useEffect(() => {
    loadTownSquare();
    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    if (selectedChannel) {
      loadMessages();
      // Poll for new messages every 3 seconds
      pollingInterval.current = setInterval(loadMessages, 3000);
      return () => {
        if (pollingInterval.current) {
          clearInterval(pollingInterval.current);
        }
      };
    }
  }, [selectedChannel]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadTownSquare = async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      // Load all towns
      let allTowns = await Town.list('name');

      // Ensure "County-wide" town exists
      let countyWideTown = allTowns.find(t => t.name === "County-wide");
      if (!countyWideTown) {
        countyWideTown = await Town.create({
          name: "County-wide",
          county: "All",
          state: "",
          is_active: true
        });
        console.log("Created County-wide town");
        allTowns = await Town.list('name');
      }

      setTowns(allTowns);

      // Load user's preferred town or default to County-wide
      if (userData?.preferred_town_id) {
        const town = await Town.get(userData.preferred_town_id);
        setUserTown(town);
        setSelectedTown(userData.preferred_town_id);
      } else {
        setUserTown(countyWideTown);
        setSelectedTown(countyWideTown.id);
      }

      // Load or create user's chat role
      let role = await ChatRole.filter({ user_email: userData.email });
      if (role.length === 0) {
        // Create default role
        role = await ChatRole.create({
          user_email: userData.email,
          role: "resident",
          verified: false,
          badge: null,
          business_promo_count: 0
        });
        setUserRole(role);
      } else {
        setUserRole(role[0]);
      }

      // Load channels
      await loadChannels(allTowns);
    } catch (error) {
      console.error("Error loading town square:", error);
      // Try to login if not authenticated
      try {
        await User.login();
      } catch (loginError) {
        console.error("Login failed:", loginError);
      }
    }
    setLoading(false);
  };

  const loadChannels = async (townsData) => {
    try {
      let channels = await ChatChannel.list('order');

      // Clean up deprecated channel types (lost-found and trading)
      const deprecatedTypes = ['lost-found', 'trading'];
      const channelsToDelete = channels.filter(ch => deprecatedTypes.includes(ch.type));

      for (const channel of channelsToDelete) {
        try {
          await ChatChannel.delete(channel.id);
          console.log(`Deleted deprecated channel: ${channel.name}`);
        } catch (deleteError) {
          console.error(`Error deleting channel ${channel.name}:`, deleteError);
        }
      }

      // Reload channels after cleanup
      if (channelsToDelete.length > 0) {
        channels = await ChatChannel.list('order');
      }

      // Ensure all towns have all required channels
      if (townsData && townsData.length > 0) {
        await ensureChannelsForAllTowns(townsData, channels);
        channels = await ChatChannel.list('order');
      }

      setAllChannels(channels);
    } catch (error) {
      console.error("Error loading channels:", error);
    }
  };

  const ensureChannelsForAllTowns = async (townsData, existingChannels) => {
    const channelTemplates = [
      {
        name: "Announcements",
        slug: "announcements",
        description: "Official announcements from moderators and town officials",
        type: "announcements",
        is_read_only: true,
        order: 1,
        rules: "Read-only channel for official announcements"
      },
      {
        name: "Today",
        slug: "today",
        description: "Daily chat for general conversations",
        type: "daily",
        is_read_only: false,
        order: 2,
        rules: "Be civil. No politics, personal attacks, or adult content."
      },
      {
        name: "Road & Utility",
        slug: "road-utility",
        description: "Report road closures, boil-water notices, and outages",
        type: "utility",
        is_read_only: false,
        order: 3,
        rules: "Post only utility and infrastructure updates"
      },
      {
        name: "Events Live",
        slug: "events-live",
        description: "Discuss upcoming and ongoing community events",
        type: "events",
        is_read_only: false,
        order: 4,
        rules: "Community events and gatherings"
      },
      {
        name: "Help a Neighbor",
        slug: "help-a-neighbor",
        description: "Request or offer help with rides, meals, and quick favors",
        type: "help",
        is_read_only: false,
        order: 5,
        rules: "Be kind and helpful"
      }
    ];

    // For each town, check if all channel types exist
    for (const town of townsData) {
      for (const template of channelTemplates) {
        const expectedSlug = `${template.slug}-${town.name.toLowerCase().replace(/\s+/g, '-')}`;

        // Check if this channel already exists
        const channelExists = existingChannels.some(ch =>
          ch.town_id === town.id && ch.type === template.type
        );

        if (!channelExists) {
          try {
            await ChatChannel.create({
              ...template,
              name: `${template.name} - ${town.name}`,
              slug: expectedSlug,
              town_id: town.id
            });
            console.log(`Created channel: ${template.name} - ${town.name}`);
          } catch (createError) {
            console.error(`Error creating channel for ${town.name}:`, createError);
          }
        }
      }
    }
  };

  const initializeDefaultChannels = async (townsData) => {
    const channelTemplates = [
      {
        name: "Announcements",
        slug: "announcements",
        description: "Official announcements from moderators and town officials",
        type: "announcements",
        is_read_only: true,
        order: 1,
        rules: "Read-only channel for official announcements"
      },
      {
        name: "Today",
        slug: "today",
        description: "Daily chat for general conversations",
        type: "daily",
        is_read_only: false,
        order: 2,
        rules: "Be civil. No politics, personal attacks, or adult content."
      },
      {
        name: "Road & Utility",
        slug: "road-utility",
        description: "Report road closures, boil-water notices, and outages",
        type: "utility",
        is_read_only: false,
        order: 3,
        rules: "Post only utility and infrastructure updates"
      },
      {
        name: "Events Live",
        slug: "events-live",
        description: "Discuss upcoming and ongoing community events",
        type: "events",
        is_read_only: false,
        order: 4,
        rules: "Community events and gatherings"
      },
      {
        name: "Help a Neighbor",
        slug: "help-a-neighbor",
        description: "Request or offer help with rides, meals, and quick favors",
        type: "help",
        is_read_only: false,
        order: 5,
        rules: "Be kind and helpful"
      }
    ];

    // Create channels for each town
    for (const town of townsData) {
      for (const template of channelTemplates) {
        await ChatChannel.create({
          ...template,
          name: `${template.name} - ${town.name}`,
          slug: `${template.slug}-${town.name.toLowerCase().replace(/\s+/g, '-')}`,
          town_id: town.id
        });
      }
    }
  };

  const loadMessages = async () => {
    if (!selectedChannel) return;

    try {
      const channelMessages = await ChatMessage.filter(
        { channel_id: selectedChannel.id, is_deleted: false },
        'created_date'
      );
      setMessages(channelMessages);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChannel) return;

    // Check if channel is read-only
    if (selectedChannel.is_read_only && userRole?.role !== "moderator") {
      alert("This channel is read-only. Only moderators can post.");
      return;
    }

    setSending(true);
    try {
      await ChatMessage.create({
        channel_id: selectedChannel.id,
        user_email: user.email,
        user_name: user.full_name || user.email,
        content: newMessage.trim(),
        is_pinned: false,
        is_deleted: false
      });

      setNewMessage("");
      await loadMessages();
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    }
    setSending(false);
  };

  const handlePinMessage = async (messageId) => {
    if (userRole?.role !== "moderator") return;

    try {
      const message = messages.find(m => m.id === messageId);
      await ChatMessage.update(messageId, { is_pinned: !message.is_pinned });
      await loadMessages();
    } catch (error) {
      console.error("Error pinning message:", error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (userRole?.role !== "moderator") return;

    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      await ChatMessage.update(messageId, { is_deleted: true });
      await loadMessages();
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleToggleLocation = () => {
    const countyWideTown = towns.find(t => t.name === "County-wide");

    if (selectedTown === countyWideTown?.id) {
      // Switch to My Town
      if (userTown?.id && userTown.name !== "County-wide") {
        setSelectedTown(userTown.id);
      }
    } else {
      // Switch to County-wide
      if (countyWideTown) {
        setSelectedTown(countyWideTown.id);
      }
    }
  };

  // Filter channels based on selected town
  const filteredChannels = allChannels.filter(channel => {
    return channel.town_id === selectedTown;
  });

  // Auto-select first channel when filters change
  useEffect(() => {
    if (filteredChannels.length > 0 && (!selectedChannel || !filteredChannels.find(c => c.id === selectedChannel.id))) {
      setSelectedChannel(filteredChannels[0]);
    }
  }, [filteredChannels, selectedChannel]);

  const getRoleBadge = (role, badge) => {
    if (role === "moderator") {
      return <Badge className="bg-purple-100 text-purple-800 text-xs"><Shield className="w-3 h-3 mr-1" />Moderator</Badge>;
    }
    if (role === "business") {
      return <Badge className="bg-blue-100 text-blue-800 text-xs"><Building2 className="w-3 h-3 mr-1" />Business</Badge>;
    }
    if (badge === "good_neighbor") {
      return <Badge className="bg-green-100 text-green-800 text-xs"><Star className="w-3 h-3 mr-1" />Good Neighbor</Badge>;
    }
    return null;
  };

  const getChannelIcon = (type) => {
    switch (type) {
      case "announcements":
        return <AlertCircle className="w-4 h-4" />;
      case "daily":
        return <MessageSquare className="w-4 h-4" />;
      case "utility":
        return <AlertCircle className="w-4 h-4" />;
      case "lost-found":
        return <MessageSquare className="w-4 h-4" />;
      case "events":
        return <Clock className="w-4 h-4" />;
      case "trading":
        return <MessageSquare className="w-4 h-4" />;
      case "help":
        return <Users className="w-4 h-4" />;
      default:
        return <Hash className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <>
        <MetaTags
          title={`Town Square - ${settings.county_name || 'Navarro'} County Community`}
          description={`Join the ${settings.county_name || 'Navarro'} County community discussion. Connect with neighbors and stay informed about local happenings.`}
        />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
          <MessageSquare className="w-12 h-12 text-orange-600 animate-pulse" />
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <MetaTags
          title={`Town Square - ${settings.county_name || 'Navarro'} County Community`}
          description={`Join the ${settings.county_name || 'Navarro'} County community discussion. Connect with neighbors and stay informed about local happenings.`}
        />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-6">
          <Card className="max-w-md">
            <CardContent className="p-8 text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
              <p className="text-gray-600 mb-4">
                You need to be logged in to access Town Square
              </p>
              <Button
                onClick={() => User.login()}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
              >
                Login to Continue
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <MetaTags
        title={`Town Square - ${settings.county_name || 'Navarro'} County Community`}
        description={`Join the ${settings.county_name || 'Navarro'} County community discussion. Connect with neighbors and stay informed about local happenings.`}
      />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-orange-600" />
            Town Square
          </h1>
          <p className="text-gray-600 mt-2">
            Connect with your neighbors in real-time
          </p>
        </div>

        {/* Location Filter */}
        <Card className="border-2 border-orange-100 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4">
              {/* Left side - Town info */}
              <div className="flex items-center gap-3 flex-1">
                {(() => {
                  const currentTown = towns.find(t => t.id === selectedTown);
                  const isCountyWide = currentTown?.name === "County-wide";

                  return isCountyWide ? (
                    <>
                      <Globe className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="font-semibold text-gray-900">County-wide</p>
                        <p className="text-sm text-gray-600">Showing county-wide chat threads</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <MapPin className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {currentTown?.name || "Selected Town"}
                        </p>
                        <p className="text-sm text-gray-600">Showing chat threads in your town</p>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Right side - Toggle button and dropdown */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggleLocation}
                  className="border-orange-200 hover:bg-orange-50"
                >
                  {(() => {
                    const countyWideTown = towns.find(t => t.name === "County-wide");
                    return selectedTown === countyWideTown?.id ? (
                      <>
                        <MapPin className="w-4 h-4 mr-2" />
                        My Town
                      </>
                    ) : (
                      <>
                        <Globe className="w-4 h-4 mr-2" />
                        County-wide
                      </>
                    );
                  })()}
                </Button>

                <Select value={selectedTown} onValueChange={setSelectedTown}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(() => {
                      const countyWideTown = towns.find(t => t.name === "County-wide");
                      const otherTowns = towns.filter(t => t.name !== "County-wide");

                      return (
                        <>
                          {countyWideTown && (
                            <>
                              <SelectItem key={countyWideTown.id} value={countyWideTown.id}>
                                {countyWideTown.name}
                              </SelectItem>
                              <SelectItem value="divider" disabled>───────────</SelectItem>
                            </>
                          )}
                          {otherTowns.map(town => (
                            <SelectItem key={town.id} value={town.id}>{town.name}</SelectItem>
                          ))}
                        </>
                      );
                    })()}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Chat Interface */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Channels Sidebar */}
          <Card className="border-2 border-orange-200 lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Channels</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="space-y-1 p-4">
                  {filteredChannels.map((channel) => (
                    <button
                      key={channel.id}
                      onClick={() => setSelectedChannel(channel)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                        selectedChannel?.id === channel.id
                          ? "bg-orange-100 text-orange-900 font-semibold"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      {getChannelIcon(channel.type)}
                      <span className="text-sm text-ellipsis overflow-hidden">{channel.name}</span>
                      {channel.is_read_only && (
                        <Badge variant="outline" className="ml-auto text-xs">
                          Read-only
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="border-2 border-orange-200 lg:col-span-3">
            {selectedChannel ? (
              <>
                <CardHeader className="border-b">
                  <div>
                    <div className="flex items-center gap-2">
                      {getChannelIcon(selectedChannel.type)}
                      <CardTitle>{selectedChannel.name}</CardTitle>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedChannel.description}
                    </p>
                    {selectedChannel.rules && (
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Rules: {selectedChannel.rules}
                      </p>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  {/* Messages */}
                  <ScrollArea className="h-[450px] p-4">
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-500 py-12">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No messages yet. Be the first to post!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`p-3 rounded-lg ${
                              message.is_pinned
                                ? "bg-yellow-50 border-2 border-yellow-200"
                                : "bg-white border border-gray-200"
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-gray-900">
                                    {message.user_name}
                                  </span>
                                  {getRoleBadge(
                                    messages.find(m => m.user_email === message.user_email)?.role,
                                    messages.find(m => m.user_email === message.user_email)?.badge
                                  )}
                                  <span className="text-xs text-gray-500">
                                    {new Date(message.created_date).toLocaleString()}
                                  </span>
                                  {message.is_pinned && (
                                    <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                                      <Pin className="w-3 h-3 mr-1" />
                                      Pinned
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-gray-700 whitespace-pre-wrap">
                                  {message.content}
                                </p>
                              </div>

                              {userRole?.role === "moderator" && (
                                <div className="flex gap-1 ml-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handlePinMessage(message.id)}
                                    title={message.is_pinned ? "Unpin message" : "Pin message"}
                                  >
                                    <Pin className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDeleteMessage(message.id)}
                                    title="Delete message"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </ScrollArea>

                  {/* Message Input */}
                  <div className="border-t p-4">
                    {selectedChannel.is_read_only && userRole?.role !== "moderator" ? (
                      <div className="text-center text-gray-500 py-4">
                        <AlertCircle className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm">This channel is read-only</p>
                      </div>
                    ) : (
                      <form onSubmit={handleSendMessage} className="flex gap-2">
                        <Textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder={`Message ${selectedChannel.name}...`}
                          className="min-h-[60px] resize-none"
                          disabled={sending}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage(e);
                            }
                          }}
                        />
                        <Button
                          type="submit"
                          disabled={!newMessage.trim() || sending}
                          className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </form>
                    )}
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="p-12 text-center">
                <MessageSquare className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                <p className="text-gray-600">Select a channel to start chatting</p>
              </CardContent>
            )}
          </Card>
        </div>

        {/* Chat Guidelines */}
        <Card className="border-2 border-orange-100 mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Town Square Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-orange-600">•</span>
                <span><strong>Be civil:</strong> No politics, personal attacks, or adult content</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600">•</span>
                <span><strong>Businesses:</strong> Promotions only in #announcements once per week</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600">•</span>
                <span><strong>Stay on topic:</strong> Use appropriate channels for different types of posts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600">•</span>
                <span><strong>Be helpful:</strong> Earn a "Good Neighbor" badge by helping resolve community issues</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        </div>
      </div>
    </>
  );
}
