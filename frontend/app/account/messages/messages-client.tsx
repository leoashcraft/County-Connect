'use client';

import { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  Plus,
  X,
  Search,
  ChevronLeft,
  User,
  Reply,
  Mail,
  MailOpen,
} from 'lucide-react';

interface Message {
  id: number;
  content: string;
  subject: string | null;
  isRead: boolean;
  createdAt: string;
  sender: {
    id: number;
    username: string;
    email: string;
  } | null;
  recipient: {
    id: number;
    username: string;
    email: string;
  } | null;
  relatedListingType: string | null;
  relatedListingId: string | null;
}

interface UserInfo {
  id: number;
  username: string;
  email: string;
}

interface Conversation {
  otherUser: UserInfo;
  messages: Message[];
  lastMessage: Message;
  unreadCount: number;
}

interface MessagesClientProps {
  initialMessages: Message[];
  currentUserId: number;
  strapiToken: string;
  users: UserInfo[];
}

export default function MessagesClient({
  initialMessages,
  currentUserId,
  strapiToken,
  users,
}: MessagesClientProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [replySubject, setReplySubject] = useState('');
  const [showReplySubject, setShowReplySubject] = useState(false);
  const [sending, setSending] = useState(false);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [newMessageRecipient, setNewMessageRecipient] = useState<UserInfo | null>(null);
  const [newMessageContent, setNewMessageContent] = useState('');
  const [newMessageSubject, setNewMessageSubject] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileShowThread, setMobileShowThread] = useState(false);
  const [replyingToMessage, setReplyingToMessage] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const replyInputRef = useRef<HTMLTextAreaElement>(null);

  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

  // Group messages into conversations
  const conversations: Conversation[] = (() => {
    const conversationMap = new Map<number, Conversation>();

    messages.forEach((msg) => {
      const otherUser =
        msg.sender?.id === currentUserId ? msg.recipient : msg.sender;

      if (!otherUser) return;

      if (!conversationMap.has(otherUser.id)) {
        conversationMap.set(otherUser.id, {
          otherUser,
          messages: [],
          lastMessage: msg,
          unreadCount: 0,
        });
      }

      const conv = conversationMap.get(otherUser.id)!;
      conv.messages.push(msg);

      // Update last message if this one is newer
      if (new Date(msg.createdAt) > new Date(conv.lastMessage.createdAt)) {
        conv.lastMessage = msg;
      }

      // Count unread messages (received and not read)
      if (msg.recipient?.id === currentUserId && !msg.isRead) {
        conv.unreadCount++;
      }
    });

    // Sort conversations by last message date
    return Array.from(conversationMap.values()).sort(
      (a, b) =>
        new Date(b.lastMessage.createdAt).getTime() -
        new Date(a.lastMessage.createdAt).getTime()
    );
  })();

  // Filter conversations by search query
  const filteredConversations = conversations.filter((conv) =>
    conv.otherUser.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.otherUser.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter users for new message modal
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversation?.messages]);

  // Mark messages as read when opening conversation
  useEffect(() => {
    if (!selectedConversation) return;

    const unreadMessages = selectedConversation.messages.filter(
      (msg) => msg.recipient?.id === currentUserId && !msg.isRead
    );

    unreadMessages.forEach(async (msg) => {
      try {
        await fetch(`${STRAPI_URL}/api/messages/${msg.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${strapiToken}`,
          },
          body: JSON.stringify({ data: { isRead: true } }),
        });

        // Update local state
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, isRead: true } : m))
        );
      } catch (error) {
        console.error('Failed to mark message as read:', error);
      }
    });
  }, [selectedConversation, currentUserId, STRAPI_URL, strapiToken]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || sending) return;

    setSending(true);

    try {
      const subjectToSend = showReplySubject && replySubject.trim() ? replySubject.trim() : null;

      const res = await fetch(`${STRAPI_URL}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${strapiToken}`,
        },
        body: JSON.stringify({
          data: {
            content: newMessage.trim(),
            subject: subjectToSend,
            sender: currentUserId,
            recipient: selectedConversation.otherUser.id,
            isRead: false,
          },
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to send message');
      }

      const result = await res.json();

      // Add new message to local state
      const newMsg: Message = {
        id: result.data.id,
        content: newMessage.trim(),
        subject: subjectToSend,
        isRead: false,
        createdAt: new Date().toISOString(),
        sender: { id: currentUserId, username: 'You', email: '' },
        recipient: selectedConversation.otherUser,
        relatedListingType: null,
        relatedListingId: null,
      };

      setMessages((prev) => [newMsg, ...prev]);
      setNewMessage('');
      setReplySubject('');
      setShowReplySubject(false);
      setReplyingToMessage(null);
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleSendNewMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageContent.trim() || !newMessageRecipient || sending) return;

    setSending(true);

    try {
      const res = await fetch(`${STRAPI_URL}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${strapiToken}`,
        },
        body: JSON.stringify({
          data: {
            content: newMessageContent.trim(),
            subject: newMessageSubject.trim() || null,
            sender: currentUserId,
            recipient: newMessageRecipient.id,
            isRead: false,
          },
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to send message');
      }

      const result = await res.json();

      // Add new message to local state
      const newMsg: Message = {
        id: result.data.id,
        content: newMessageContent.trim(),
        subject: newMessageSubject.trim() || null,
        isRead: false,
        createdAt: new Date().toISOString(),
        sender: { id: currentUserId, username: 'You', email: '' },
        recipient: newMessageRecipient,
        relatedListingType: null,
        relatedListingId: null,
      };

      setMessages((prev) => [newMsg, ...prev]);
      setShowNewMessageModal(false);
      setNewMessageRecipient(null);
      setNewMessageContent('');
      setNewMessageSubject('');

      // Select the conversation with this user
      const existingConv = conversations.find(
        (c) => c.otherUser.id === newMessageRecipient.id
      );
      if (existingConv) {
        setSelectedConversation({
          ...existingConv,
          messages: [newMsg, ...existingConv.messages],
          lastMessage: newMsg,
        });
      } else {
        setSelectedConversation({
          otherUser: newMessageRecipient,
          messages: [newMsg],
          lastMessage: newMsg,
          unreadCount: 0,
        });
      }
      setMobileShowThread(true);
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    } else if (diffInHours < 168) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const formatFullTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const handleReplyToMessage = (msg: Message) => {
    setReplyingToMessage(msg);
    setShowReplySubject(true);

    // Pre-fill subject with "Re: [original subject]" if there was a subject
    if (msg.subject) {
      const replyPrefix = msg.subject.startsWith('Re: ') ? '' : 'Re: ';
      setReplySubject(`${replyPrefix}${msg.subject}`);
    } else {
      setReplySubject('');
    }

    // Focus the reply input
    setTimeout(() => {
      replyInputRef.current?.focus();
    }, 100);
  };

  const cancelReply = () => {
    setReplyingToMessage(null);
    setShowReplySubject(false);
    setReplySubject('');
  };

  // Update selected conversation when messages change
  useEffect(() => {
    if (selectedConversation) {
      const updatedConv = conversations.find(
        (c) => c.otherUser.id === selectedConversation.otherUser.id
      );
      if (updatedConv) {
        setSelectedConversation(updatedConv);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  // Calculate total unread count
  const totalUnreadCount = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  return (
    <div className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-900">Messages</h1>
          {totalUnreadCount > 0 && (
            <span className="px-2.5 py-0.5 bg-brand-600 text-white text-xs font-semibold rounded-full">
              {totalUnreadCount} unread
            </span>
          )}
        </div>
        <button
          onClick={() => setShowNewMessageModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Message
        </button>
      </div>

      <div className="flex h-[600px]">
        {/* Conversation List */}
        <div
          className={`w-full md:w-80 border-r border-gray-200 flex flex-col ${
            mobileShowThread ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Search */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conv) => (
                <button
                  key={conv.otherUser.id}
                  onClick={() => {
                    setSelectedConversation(conv);
                    setMobileShowThread(true);
                  }}
                  className={`w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors text-left border-l-4 ${
                    selectedConversation?.otherUser.id === conv.otherUser.id
                      ? 'bg-brand-50 border-l-brand-600'
                      : conv.unreadCount > 0
                        ? 'border-l-brand-400 bg-brand-50/50'
                        : 'border-l-transparent'
                  }`}
                >
                  {/* Avatar with unread indicator */}
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-400 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {conv.otherUser.username?.charAt(0).toUpperCase() ||
                          conv.otherUser.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-600 border-2 border-white rounded-full" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`truncate ${
                          conv.unreadCount > 0 ? 'font-bold text-gray-900' : 'font-medium text-gray-700'
                        }`}
                      >
                        {conv.otherUser.username || conv.otherUser.email}
                      </span>
                      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                        {formatTimestamp(conv.lastMessage.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <p
                        className={`text-sm truncate flex-1 ${
                          conv.unreadCount > 0
                            ? 'text-gray-900 font-medium'
                            : 'text-gray-500'
                        }`}
                      >
                        {conv.lastMessage.sender?.id === currentUserId && (
                          <span className="text-gray-400">You: </span>
                        )}
                        {conv.lastMessage.content}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span className="w-5 h-5 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center flex-shrink-0">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <MessageSquare className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-gray-500 text-sm">
                  {searchQuery
                    ? 'No conversations found'
                    : 'No messages yet. Start a conversation!'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Message Thread */}
        <div
          className={`flex-1 flex flex-col ${
            mobileShowThread ? 'flex' : 'hidden md:flex'
          }`}
        >
          {selectedConversation ? (
            <>
              {/* Thread Header */}
              <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-3">
                <button
                  onClick={() => setMobileShowThread(false)}
                  className="md:hidden p-1 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-400 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {selectedConversation.otherUser.username?.charAt(0).toUpperCase() ||
                      selectedConversation.otherUser.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {selectedConversation.otherUser.username ||
                      selectedConversation.otherUser.email}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedConversation.otherUser.email}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {[...selectedConversation.messages]
                  .sort(
                    (a, b) =>
                      new Date(a.createdAt).getTime() -
                      new Date(b.createdAt).getTime()
                  )
                  .map((msg) => {
                    const isOwn = msg.sender?.id === currentUserId;
                    const isUnread = !isOwn && !msg.isRead;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group`}
                      >
                        <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                          <div
                            className={`max-w-[75%] ${
                              isOwn
                                ? 'bg-brand-600 text-white rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl'
                                : isUnread
                                  ? 'bg-brand-50 border-2 border-brand-200 text-gray-900 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl'
                                  : 'bg-gray-100 text-gray-900 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl'
                            } px-4 py-2.5`}
                          >
                            {msg.subject && (
                              <p
                                className={`text-xs font-semibold mb-1 ${
                                  isOwn ? 'text-brand-100' : 'text-gray-600'
                                }`}
                              >
                                {msg.subject}
                              </p>
                            )}
                            <p className="text-sm whitespace-pre-wrap break-words">
                              {msg.content}
                            </p>
                            <div className={`flex items-center gap-2 mt-1 ${isOwn ? 'justify-end' : ''}`}>
                              <span
                                className={`text-xs ${
                                  isOwn ? 'text-brand-200' : 'text-gray-500'
                                }`}
                              >
                                {formatFullTimestamp(msg.createdAt)}
                              </span>
                              {isOwn && (
                                <span title={msg.isRead ? 'Read' : 'Delivered'}>
                                  {msg.isRead ? (
                                    <MailOpen className="w-3 h-3 text-brand-200" />
                                  ) : (
                                    <Mail className="w-3 h-3 text-brand-300" />
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                          {/* Reply button for received messages */}
                          {!isOwn && (
                            <button
                              onClick={() => handleReplyToMessage(msg)}
                              className="mt-1 flex items-center gap-1 text-xs text-gray-400 hover:text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Reply className="w-3 h-3" />
                              Reply
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply Input */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-gray-200"
              >
                {/* Reply context banner */}
                {replyingToMessage && (
                  <div className="mb-3 p-2 bg-gray-50 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <Reply className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-500">
                        Replying to:{' '}
                        <span className="font-medium text-gray-700">
                          {replyingToMessage.subject || 'message'}
                        </span>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={cancelReply}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                )}

                {/* Subject input (expandable) */}
                {showReplySubject && (
                  <div className="mb-2">
                    <input
                      type="text"
                      value={replySubject}
                      onChange={(e) => setReplySubject(e.target.value)}
                      placeholder="Subject (optional)"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                  </div>
                )}

                <div className="flex items-end gap-2">
                  <div className="flex-1 flex flex-col gap-1">
                    {!showReplySubject && (
                      <button
                        type="button"
                        onClick={() => setShowReplySubject(true)}
                        className="self-start text-xs text-gray-400 hover:text-brand-600 transition-colors"
                      >
                        + Add subject
                      </button>
                    )}
                    <textarea
                      ref={replyInputRef}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                      placeholder="Type a message..."
                      rows={1}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="p-2.5 bg-brand-600 text-white rounded-xl hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Select a conversation
              </h3>
              <p className="text-gray-500 text-sm max-w-xs">
                Choose a conversation from the list or start a new one
              </p>
            </div>
          )}
        </div>
      </div>

      {/* New Message Modal */}
      {showNewMessageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">New Message</h2>
              <button
                onClick={() => {
                  setShowNewMessageModal(false);
                  setNewMessageRecipient(null);
                  setNewMessageContent('');
                  setNewMessageSubject('');
                  setSearchQuery('');
                }}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              {!newMessageRecipient ? (
                <>
                  {/* Select Recipient */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select recipient
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => {
                            setNewMessageRecipient(user);
                            setSearchQuery('');
                          }}
                          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-100 last:border-b-0"
                        >
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-400 flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {user.username?.charAt(0).toUpperCase() ||
                                user.email?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {user.username || user.email}
                            </p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="p-6 text-center text-gray-500">
                        <User className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">No users found</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Compose Message */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      To
                    </label>
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-400 flex items-center justify-center">
                        <span className="text-white font-semibold text-xs">
                          {newMessageRecipient.username?.charAt(0).toUpperCase() ||
                            newMessageRecipient.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">
                        {newMessageRecipient.username || newMessageRecipient.email}
                      </span>
                      <button
                        onClick={() => setNewMessageRecipient(null)}
                        className="ml-auto p-1 hover:bg-gray-200 rounded"
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleSendNewMessage}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject (optional)
                      </label>
                      <input
                        type="text"
                        value={newMessageSubject}
                        onChange={(e) => setNewMessageSubject(e.target.value)}
                        placeholder="Enter subject..."
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message
                      </label>
                      <textarea
                        value={newMessageContent}
                        onChange={(e) => setNewMessageContent(e.target.value)}
                        placeholder="Type your message..."
                        rows={4}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      />
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowNewMessageModal(false);
                          setNewMessageRecipient(null);
                          setNewMessageContent('');
                          setNewMessageSubject('');
                        }}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={!newMessageContent.trim() || sending}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Send className="w-4 h-4" />
                        {sending ? 'Sending...' : 'Send Message'}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
