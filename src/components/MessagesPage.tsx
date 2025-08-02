import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './ToastContainer';
import { messageService, reportService, blockService, deleteService } from '../lib/supabase';
import ConfirmModal from './ConfirmModal';
import {
  Send,
  Search,
  MoreVertical,
  Shield,
  Users,
  Clock,
  CheckCircle,
  User,
  XCircle,
  UserX,
  Flag,
  Trash2,
  ArrowLeft,
  Check,
  CheckCheck
} from 'lucide-react';

// Types for conversations and messages
interface Conversation {
  id: string;
  user1_id: string;
  user2_id: string;
  status?: string;
  family_involved?: boolean;
  family_email?: string;
  last_message?: string;
  last_message_at?: string;
  last_message_sender_id?: string;
  last_message_read?: boolean;
  created_at: string;
  updated_at: string;
  user1?: {
    id: string;
    first_name: string;
    last_name: string;
    verified?: boolean;
  };
  user2?: {
    id: string;
    first_name: string;
    last_name: string;
    verified?: boolean;
  };
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  moderation_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  sender?: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

const MessagesPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { userProfile } = useAuth();
  const { showSuccess, showError, showWarning, showInfo } = useToast();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFamilyInvite, setShowFamilyInvite] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [familyEmail, setFamilyEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [showChatView, setShowChatView] = useState(false); // For mobile/tablet view

  // Modal states
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showUnblockModal, setShowUnblockModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);


  // Debug logging
  console.log('MessagesPage rendered, showMoreMenu:', showMoreMenu, 'activeConversation:', activeConversation?.id);

  // Load conversations when component mounts
  useEffect(() => {
    if (userProfile?.id) {
      loadConversations();
    }
  }, [userProfile]);

  // Load messages when active conversation changes
  useEffect(() => {
    if (activeConversation?.id) {
      loadMessages(activeConversation.id);
    }
  }, [activeConversation]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showMoreMenu && !target.closest('.more-menu-container')) {
        setShowMoreMenu(false);
      }
    };

    if (showMoreMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMoreMenu]);

  const loadConversations = async () => {
    if (!userProfile?.id) return;

    setIsLoading(true);
    try {
      console.log('Loading conversations for user:', userProfile.id);
      const { data, error } = await messageService.getConversations(userProfile.id);

      if (error) {
        console.error('Error loading conversations:', error);
        showError(t('messages.errors.loadingError'), t('messages.errors.loadingConversationsError'));
        return;
      }

      console.log('Loaded conversations:', data);

      // Transform the data to match our interface
      const transformedData = (data || []).map((conv: any) => ({
        ...conv,
        user1: Array.isArray(conv.user1) ? conv.user1[0] : conv.user1,
        user2: Array.isArray(conv.user2) ? conv.user2[0] : conv.user2
      }));

      setConversations(transformedData);

      // Set first conversation as active if available
      if (transformedData && transformedData.length > 0) {
        setActiveConversation(transformedData[0]);
      }
    } catch (error) {
      console.error('Unexpected error loading conversations:', error);
      showError(t('messages.errors.unexpectedError'), t('messages.errors.unexpectedLoadingError'));
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    setIsLoadingMessages(true);
    try {
      console.log('Loading messages for conversation:', conversationId);
      const { data, error } = await messageService.getMessages(conversationId);

      if (error) {
        console.error('Error loading messages:', error);
        showError(t('messages.errors.loadingError'), t('messages.errors.loadingMessagesError'));
        return;
      }

      console.log('Loaded messages:', data);

      // Transform the data to match our interface
      const transformedMessages = (data || []).map((msg: any) => ({
        ...msg,
        sender: Array.isArray(msg.sender) ? msg.sender[0] : msg.sender
      }));

      setMessages(transformedMessages);
    } catch (error) {
      console.error('Unexpected error loading messages:', error);
      showError(t('messages.errors.unexpectedError'), t('messages.errors.unexpectedMessagesError'));
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversation?.id || !userProfile?.id) return;

    try {
      console.log('Sending message:', {
        conversationId: activeConversation.id,
        senderId: userProfile.id,
        content: newMessage.trim()
      });

      const { data, error } = await messageService.sendMessage(
        activeConversation.id,
        userProfile.id,
        newMessage.trim()
      );

      if (error) {
        console.error('Error sending message:', error);
        showError(t('messages.errors.sendingError'), t('messages.errors.sendingErrorDesc'));
        return;
      }

      console.log('Message sent successfully:', data);

      // Add the new message to the local state
      if (data) {
        const newMessageObj: Message = {
          ...data,
          sender: {
            id: userProfile.id,
            first_name: userProfile.first_name || '',
            last_name: userProfile.last_name || ''
          }
        };
        setMessages(prev => [...prev, newMessageObj]);
        // إزالة الإشعار عند إرسال رسالة جديدة
        // showSuccess(t('messages.success.messageSent'), t('messages.success.messageSentDesc'));
      }

      setNewMessage('');
    } catch (error) {
      console.error('Unexpected error sending message:', error);
      showError(t('messages.errors.unexpectedError'), t('messages.errors.unexpectedSendingError'));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Get the other user in the conversation
  const getOtherUser = (conversation: Conversation | null) => {
    if (!userProfile?.id || !conversation) return null;
    return conversation.user1_id === userProfile.id ? conversation.user2 : conversation.user1;
  };

  // Get the other user's full name
  const getOtherUserName = (conversation: Conversation | null) => {
    if (!conversation || !userProfile?.id) {
      return i18n.language === 'ar' ? 'هذا المستخدم' : 'this user';
    }

    // Determine which user is the "other" user
    let otherUser = null;

    if (conversation.user1_id === userProfile.id) {
      otherUser = conversation.user2;
    } else if (conversation.user2_id === userProfile.id) {
      otherUser = conversation.user1;
    }

    if (!otherUser) {
      return i18n.language === 'ar' ? 'هذا المستخدم' : 'this user';
    }

    // Handle case where user data might be an array (from Supabase join)
    const userData = Array.isArray(otherUser) ? otherUser[0] : otherUser;

    if (!userData) {
      return i18n.language === 'ar' ? 'هذا المستخدم' : 'this user';
    }

    const firstName = userData.first_name || '';
    const lastName = userData.last_name || '';
    const fullName = `${firstName} ${lastName}`.trim();

    return fullName || (i18n.language === 'ar' ? 'هذا المستخدم' : 'this user');
  };

  // Handle view profile
  const handleViewProfile = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  // Handle conversation selection (mobile/tablet)
  const handleConversationSelect = (conversation: Conversation) => {
    setActiveConversation(conversation);
    setShowChatView(true); // Show chat view on mobile/tablet
  };

  // Handle back to conversations list (mobile/tablet)
  const handleBackToConversations = () => {
    setShowChatView(false);
    setActiveConversation(null);
  };

  // Handle family involvement
  const handleFamilyInvite = async () => {
    if (!familyEmail.trim()) {
      showWarning(t('messages.errors.familyEmailRequired'), t('messages.errors.familyEmailRequiredDesc'));
      return;
    }

    if (!activeConversation?.id) {
      showError(t('messages.errors.noActiveConversation'), t('messages.errors.noActiveConversationDesc'));
      return;
    }

    try {
      // Update conversation to include family
      const { error } = await messageService.updateConversation(activeConversation.id, {
        family_involved: true,
        family_email: familyEmail.trim()
      });

      if (error) {
        console.error('Error involving family:', error);
        showError(t('messages.errors.familyInviteError'), t('messages.errors.familyInviteErrorDesc'));
        return;
      }

      // Send notification email to family (this would be implemented later)
      console.log('Family invited:', familyEmail);
      showSuccess(t('messages.success.familyInvited'), t('messages.success.familyInvitedDesc'));
      setShowFamilyInvite(false);
      setFamilyEmail('');
    } catch (error) {
      console.error('Unexpected error involving family:', error);
      showError(t('messages.errors.unexpectedError'), t('messages.errors.familyInviteErrorDesc'));
    }
  };

  // Handle blocking user
  const handleBlockUser = async () => {
    console.log('handleBlockUser called');
    if (!activeConversation?.id || !userProfile?.id) {
      showError(t('messages.errors.noActiveConversation'), t('messages.errors.noActiveConversationDesc'));
      return;
    }

    const otherUser = getOtherUser(activeConversation);
    if (!otherUser) {
      showError(t('messages.errors.noUserData'), t('messages.errors.noUserDataDesc'));
      return;
    }

    try {
      console.log('Blocking conversation:', activeConversation.id);

      // Show processing notification
      showInfo(t('messages.info.processing'), t('messages.info.blockingInProgress'));

      const { success, error } = await blockService.blockUserInConversation(
        activeConversation.id,
        userProfile.id,
        otherUser.id
      );

      if (!success || error) {
        console.error('Error blocking user:', error);
        showError(t('messages.errors.blockingError'), t('messages.errors.blockingErrorDesc'));
        return;
      }

      // Enhanced success notification with detailed information
      showSuccess(
        t('messages.success.userBlocked'),
        t('messages.success.userBlockedDesc', { name: `${otherUser.first_name} ${otherUser.last_name}` })
      );

      setShowBlockModal(false);
      setShowMoreMenu(false);

      // Reload conversations to reflect the change
      loadConversations();

      // Update the active conversation status locally for immediate UI update
      if (activeConversation) {
        setActiveConversation(prev => prev ? {
          ...prev,
          status: 'blocked'
        } : null);
      }
    } catch (error) {
      console.error('Unexpected error blocking user:', error);
      showError(t('messages.errors.unexpectedError'), t('messages.errors.blockingErrorDesc'));
    }
  };

  // Handle unblocking user
  const handleUnblockUser = async () => {
    console.log('handleUnblockUser called');
    if (!activeConversation?.id || !userProfile?.id) {
      showError(t('messages.errors.noActiveConversation'), t('messages.errors.noActiveConversationDesc'));
      return;
    }

    const otherUser = getOtherUser(activeConversation);
    if (!otherUser) {
      showError(t('messages.errors.noUserData'), t('messages.errors.noUserDataDesc'));
      return;
    }

    try {
      console.log('Unblocking conversation:', activeConversation.id);

      // Show processing notification
      showInfo(t('messages.info.processing'), t('messages.info.unblockingInProgress'));

      const { success, error } = await blockService.unblockUserInConversation(activeConversation.id);

      if (!success || error) {
        console.error('Error unblocking user:', error);
        showError(t('messages.errors.unblockingError'), t('messages.errors.unblockingErrorDesc'));
        return;
      }

      // Enhanced success notification
      showSuccess(
        t('messages.success.userUnblocked'),
        t('messages.success.userUnblockedDesc', { name: `${otherUser.first_name} ${otherUser.last_name}` })
      );

      setShowUnblockModal(false);
      setShowMoreMenu(false);

      // Reload conversations to reflect the change
      loadConversations();

      // Update the active conversation status locally for immediate UI update
      if (activeConversation) {
        setActiveConversation(prev => prev ? {
          ...prev,
          status: 'active'
        } : null);
      }
    } catch (error) {
      console.error('Unexpected error unblocking user:', error);
      showError(t('messages.errors.unexpectedError'), t('messages.errors.unblockingErrorDesc'));
    }
  };

  // Handle reporting user
  const handleReportUser = async (reason: string) => {
    console.log('🚩 handleReportUser called with reason:', reason);

    // Validate conversation and user
    if (!activeConversation || !userProfile?.id) {
      console.error('❌ No active conversation or user not logged in');
      showError(t('messages.errors.noActiveConversation'), t('messages.errors.noActiveConversationDesc'));
      return;
    }

    const otherUser = getOtherUser(activeConversation);
    if (!otherUser) {
      console.error('❌ Cannot find other user data');
      showError(t('messages.errors.noUserData'), t('messages.errors.noUserDataDesc'));
      return;
    }

    // Validate reason
    if (!reason?.trim()) {
      showError(t('messages.errors.reportReasonRequired'), t('messages.errors.reportReasonRequiredDesc'));
      return;
    }

    if (reason.trim().length < 10) {
      showError(t('messages.errors.reportReasonTooShort'), t('messages.errors.reportReasonTooShortDesc'));
      return;
    }

    // Show processing message
    showInfo(t('messages.info.processing'), t('messages.info.reportingInProgress'));

    try {
      const { data, error } = await reportService.createReport(
        otherUser.id,
        userProfile.id,
        'inappropriate_behavior',
        reason.trim(),
        'medium'
      );

      if (error) {
        console.error('❌ Error creating report:', error);

        // Show specific error messages based on error content
        if (error.includes('24 ساعة') || error.includes('24 hours')) {
          showWarning(t('messages.warnings.reportAlreadyExists'), t('messages.warnings.reportLimitReached'));
        } else if (error.includes('معاملات غير صحيحة') || error.includes('invalid')) {
          showError(t('messages.errors.reportInvalidData'), t('messages.errors.reportInvalidDataDesc'));
        } else if (error.includes('لا يمكن للمستخدم الإبلاغ عن نفسه') || error.includes('cannot report yourself')) {
          showError(t('messages.errors.reportSelfError'), t('messages.errors.reportSelfErrorDesc'));
        } else {
          showError(t('messages.errors.reportingError'), error || t('messages.errors.reportingErrorDesc'));
        }
        return;
      }

      if (!data) {
        console.error('❌ No data returned from report creation');
        showError(t('messages.errors.reportingError'), t('messages.errors.reportingErrorDesc'));
        return;
      }

      console.log('✅ Report created successfully:', data);

      // Show success message with report details
      const reportId = data.id || (i18n.language === 'ar' ? 'غير محدد' : 'N/A');
      showSuccess(
        t('messages.success.reportSent'),
        t('messages.success.reportSentDesc', { reportId })
      );

      // Close modal
      setShowReportModal(false);
      setShowMoreMenu(false);
    } catch (error) {
      console.error('💥 Unexpected error reporting user:', error);
      showError(t('messages.errors.unexpectedError'), t('messages.errors.reportingErrorDesc'));
    }
  };

  // Handle deleting conversation
  const handleDeleteConversation = async () => {
    console.log('handleDeleteConversation called');
    if (!activeConversation?.id || !userProfile?.id) {
      showError(t('messages.errors.noActiveConversation'), t('messages.errors.noActiveConversationDesc'));
      return;
    }

    try {
      console.log('Deleting conversation:', activeConversation.id);

      const result = await deleteService.deleteConversationCompletely(activeConversation.id);

      if (!result.success || result.error) {
        console.error('Error deleting conversation:', result.error);
        showError(t('messages.errors.deleteError'), t('messages.errors.deleteErrorDesc'));
        return;
      }

      showSuccess(t('messages.success.conversationDeleted'), t('messages.success.conversationDeletedDesc'));
      setActiveConversation(null);
      setMessages([]);
      setShowDeleteModal(false);
      setShowMoreMenu(false);
      // Reload conversations to reflect the change
      loadConversations();
    } catch (error) {
      console.error('Unexpected error deleting conversation:', error);
      showError(t('messages.errors.unexpectedError'), t('messages.errors.deleteErrorDesc'));
    }
  };

  // Filter conversations based on search term
  const filteredConversations = conversations.filter(conversation => {
    const otherUser = getOtherUser(conversation);
    if (!otherUser) return false;
    const fullName = `${otherUser.first_name} ${otherUser.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return t('messages.minutesAgo');
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} ${t('messages.hoursAgo')}`;
    } else {
      const locale = i18n.language === 'ar' ? 'ar-EG' : 'en-US';
      return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        calendar: 'gregory'
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-emerald-50" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 md:top-20 right-10 md:right-20 w-32 h-32 md:w-64 md:h-64 bg-primary-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 md:bottom-20 left-10 md:left-20 w-48 h-48 md:w-96 md:h-96 bg-emerald-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 relative">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-3 md:mb-4 font-display">
            {t('messages.messagesTitle')}
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-slate-600 px-4">
            {t('messages.subtitle')}
          </p>
        </div>

        {/* Messages Interface */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 h-[calc(100vh-120px)] min-h-[700px] max-h-[900px]">
            {/* Conversations Sidebar */}
            <div className={`lg:col-span-1 border-l border-slate-200 ${showChatView ? 'hidden lg:block' : 'block'}`}>
              {/* Header for mobile/tablet */}
              <div className="lg:hidden p-4 border-b border-slate-200 bg-slate-50">
                <h2 className="text-lg font-semibold text-slate-800">{t('messages.conversations')}</h2>
              </div>

              {/* Search */}
              <div className="p-4 border-b border-slate-200">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t('messages.searchConversations')}
                    className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Conversations List */}
              <div className="overflow-y-auto h-full">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
                      <p className="text-slate-600">{t('messages.loadingConversations')}</p>
                    </div>
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="text-center py-8 px-4">
                    <User className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">{t('messages.noConversations')}</h3>
                    <p className="text-slate-600 mb-4">{t('messages.noConversationsDesc')}</p>
                    <Link
                      to="/search"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-emerald-600 text-white py-2 px-4 rounded-xl font-medium hover:from-primary-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <Search className="w-4 h-4" />
                      {t('messages.searchMembers')}
                    </Link>
                  </div>
                ) : (
                  filteredConversations.map((conversation) => {
                    const otherUser = getOtherUser(conversation);
                    if (!otherUser) return null;

                    return (
                      <div
                        key={conversation.id}
                        onClick={() => handleConversationSelect(conversation)}
                        className={`p-4 border-b border-slate-100 cursor-pointer transition-colors hover:bg-slate-50 ${
                          activeConversation?.id === conversation.id ? 'bg-primary-50 border-primary-200' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Avatar */}
                          <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-full flex items-center justify-center">
                              <User className="w-6 h-6 text-white" />
                            </div>
                          </div>

                          {/* Conversation Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3
                                className="font-medium text-slate-800 truncate cursor-pointer hover:text-primary-600 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewProfile(otherUser.id);
                                }}
                                title={t('messages.viewProfile')}
                              >
                                {otherUser.first_name} {otherUser.last_name}
                              </h3>
                              {otherUser.verified && (
                                <Shield className="w-4 h-4 text-emerald-600" />
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-slate-600 truncate flex-1">
                                {conversation.last_message ? (
                                  <>
                                    {conversation.last_message_sender_id === userProfile?.id && (
                                      <span className="text-slate-500">{t('messages.you')}</span>
                                    )}
                                    {conversation.last_message}
                                  </>
                                ) : (
                                  t('messages.noMessagesYet')
                                )}
                              </p>
                              {/* Read status icons - only show for messages sent by current user */}
                              <div className="flex items-center gap-1 ml-2">
                                {conversation.last_message && conversation.last_message_sender_id === userProfile?.id && (
                                  conversation.last_message_read ? (
                                    <div title={t('messages.messageStatus.read')}>
                                      <CheckCheck className="w-4 h-4 text-blue-500" />
                                    </div>
                                  ) : (
                                    <div title={t('messages.messageStatus.sent')}>
                                      <Check className="w-4 h-4 text-slate-400" />
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                              {conversation.last_message && conversation.last_message_at ?
                                formatTimestamp(conversation.last_message_at) :
                                formatTimestamp(conversation.created_at)
                              }
                            </p>
                          </div>

                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className={`lg:col-span-2 flex flex-col h-full overflow-hidden ${!showChatView ? 'hidden lg:flex' : 'flex'}`}>
              {!activeConversation ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <User className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">{t('messages.selectConversation')}</h3>
                    <p className="text-slate-600">{t('messages.selectConversationDesc')}</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Chat Header */}
                  <div className="flex-shrink-0 p-4 border-b border-slate-200 bg-white/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* Back button for mobile/tablet */}
                        <button
                          onClick={handleBackToConversations}
                          className="lg:hidden p-2 hover:bg-slate-100 rounded-full transition-colors"
                          title={t('messages.backToConversations')}
                        >
                          <ArrowLeft className="w-5 h-5 text-slate-600" />
                        </button>
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3
                              className="font-medium text-slate-800 cursor-pointer hover:text-primary-600 transition-colors"
                              onClick={() => {
                                const otherUser = getOtherUser(activeConversation);
                                if (otherUser) {
                                  handleViewProfile(otherUser.id);
                                }
                              }}
                              title={t('messages.viewProfile')}
                            >
                              {(() => {
                                const otherUser = getOtherUser(activeConversation);
                                return otherUser ? `${otherUser.first_name} ${otherUser.last_name}` : 'مستخدم';
                              })()}
                            </h3>
                            {(() => {
                              const otherUser = getOtherUser(activeConversation);
                              return otherUser?.verified && (
                                <Shield className="w-4 h-4 text-emerald-600" />
                              );
                            })()}
                          </div>
                          <p className="text-sm text-slate-600">
                            {t('messages.member')}
                          </p>
                        </div>
                      </div>

                  {/* Chat Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowFamilyInvite(true)}
                      className="p-2 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title={t('messages.familyInvolvement.title')}
                    >
                      <Users className="w-5 h-5" />
                    </button>
                    <div className="relative more-menu-container">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('More menu clicked, current state:', showMoreMenu);
                          setShowMoreMenu(!showMoreMenu);
                        }}
                        className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
                        title={t('messages.moreOptions')}
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      {/* More Menu Dropdown */}
                      {showMoreMenu && (
                        <div
                          className={`absolute top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50 ${
                            i18n.language === 'ar' ? 'left-0 origin-top-left' : 'right-0 origin-top-right'
                          }`}
                          style={{
                            zIndex: 9999,
                            maxHeight: '300px',
                            overflowY: 'auto'
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log('Report user clicked');
                              setShowReportModal(true);
                              setShowMoreMenu(false);
                            }}
                            className={`w-full px-4 py-2 ${i18n.language === 'ar' ? 'text-right' : 'text-left'} text-slate-700 hover:bg-slate-50 flex items-center gap-3 border-none bg-transparent cursor-pointer`}
                          >
                            {i18n.language === 'ar' ? (
                              <>
                                <Flag className="w-4 h-4 text-amber-500" />
                                {t('messages.reportUser')}
                              </>
                            ) : (
                              <>
                                <Flag className="w-4 h-4 text-amber-500" />
                                {t('messages.reportUser')}
                              </>
                            )}
                          </button>
                          {/* Block/Unblock User Button - Dynamic based on conversation status */}
                          {activeConversation?.status === 'blocked' ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log('Unblock user clicked');
                                setShowUnblockModal(true);
                                setShowMoreMenu(false);
                              }}
                              className={`w-full px-4 py-2 ${i18n.language === 'ar' ? 'text-right' : 'text-left'} text-slate-700 hover:bg-slate-50 flex items-center gap-3 border-none bg-transparent cursor-pointer`}
                            >
                              {i18n.language === 'ar' ? (
                                <>
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                  {t('messages.unblockUser')}
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                  {t('messages.unblockUser')}
                                </>
                              )}
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log('Block user clicked');
                                setShowBlockModal(true);
                                setShowMoreMenu(false);
                              }}
                              className={`w-full px-4 py-2 ${i18n.language === 'ar' ? 'text-right' : 'text-left'} text-slate-700 hover:bg-slate-50 flex items-center gap-3 border-none bg-transparent cursor-pointer`}
                            >
                              {i18n.language === 'ar' ? (
                                <>
                                  <UserX className="w-4 h-4 text-red-500" />
                                  {t('messages.blockUser')}
                                </>
                              ) : (
                                <>
                                  <UserX className="w-4 h-4 text-red-500" />
                                  {t('messages.blockUser')}
                                </>
                              )}
                            </button>
                          )}
                          <div className="border-t border-slate-200 my-1"></div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log('Delete Chat clicked');
                              setShowDeleteModal(true);
                              setShowMoreMenu(false);
                            }}
                            className={`w-full px-4 py-2 ${i18n.language === 'ar' ? 'text-right' : 'text-left'} text-red-600 hover:bg-red-50 flex items-center gap-3 border-none bg-transparent cursor-pointer`}
                          >
                            {i18n.language === 'ar' ? (
                              <>
                                <Trash2 className="w-4 h-4" />
                                {t('messages.deleteConversation')}
                              </>
                            ) : (
                              <>
                                <Trash2 className="w-4 h-4" />
                                {t('messages.deleteConversation')}
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 max-h-[calc(100%-200px)]">
                {isLoadingMessages ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
                      <p className="text-slate-600">{t('messages.loadingMessages')}</p>
                    </div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Send className="w-8 h-8 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">{t('messages.noMessages')}</h3>
                      <p className="text-slate-600">{t('messages.startConversation')}</p>
                    </div>
                  </div>
                ) : (
                  messages.map((message) => {
                    const isMyMessage = message.sender_id === userProfile?.id;
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                            isMyMessage
                              ? 'bg-gradient-to-r from-primary-600 to-emerald-600 text-white'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          <div className="flex items-center justify-between mt-2">
                            <p className={`text-xs ${
                              isMyMessage ? 'text-white/80' : 'text-slate-500'
                            }`}>
                              {new Date(message.created_at).toLocaleTimeString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                                calendar: 'gregory'
                              })}
                            </p>
                            {isMyMessage && (
                              <div className="flex items-center gap-1">
                                {getStatusIcon(message.moderation_status)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Message Input */}
              <div className="flex-shrink-0 p-4 border-t border-slate-200 bg-white/50">
                {/* Content Monitoring Notice */}
                <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center gap-2 text-amber-800">
                    <Shield className="w-4 h-4" />
                    <p className="text-xs">
                      {t('messages.contentModeration')}
                    </p>
                  </div>
                </div>

                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={t('messages.typeMessage')}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none max-h-32"
                      rows={2}
                      style={{ minHeight: '60px' }}
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="flex-shrink-0 p-3 bg-gradient-to-r from-primary-600 to-emerald-600 text-white rounded-xl hover:from-primary-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Family Invite Modal */}
        {showFamilyInvite && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">
                  {t('messages.familyInvolvement.title')}
                </h3>
                <p className="text-slate-600">
                  {t('messages.familyInvolvement.description')}
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-slate-700 font-medium mb-2">
                    {t('messages.familyInvolvement.emailLabel')}
                  </label>
                  <input
                    type="email"
                    value={familyEmail}
                    onChange={(e) => setFamilyEmail(e.target.value)}
                    placeholder={t('messages.familyInvolvement.emailPlaceholder')}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800 mb-1">{t('messages.familyInvolvement.guidelines')}</h4>
                      <p className="text-sm text-blue-700">
                        {t('messages.familyInvolvement.guidelinesDesc')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowFamilyInvite(false);
                    setFamilyEmail('');
                  }}
                  className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  {t('messages.familyInvolvement.cancel')}
                </button>
                <button
                  onClick={handleFamilyInvite}
                  disabled={!familyEmail.trim()}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-600 to-emerald-600 text-white rounded-xl hover:from-primary-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('messages.familyInvolvement.sendInvitation')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Block User Modal */}
        <ConfirmModal
          isOpen={showBlockModal}
          onClose={() => setShowBlockModal(false)}
          onConfirm={handleBlockUser}
          title={t('messages.blockModal.title')}
          message={t('messages.blockModal.message').replace('{name}', getOtherUserName(activeConversation))}
          type="warning"
          confirmText={t('messages.blockModal.confirmButton')}
          cancelText={t('messages.blockModal.cancelButton')}
        />

        {/* Unblock User Modal */}
        <ConfirmModal
          isOpen={showUnblockModal}
          onClose={() => setShowUnblockModal(false)}
          onConfirm={handleUnblockUser}
          title={t('messages.unblockModal.title')}
          message={t('messages.unblockModal.message').replace('{name}', getOtherUserName(activeConversation))}
          type="info"
          confirmText={t('messages.unblockModal.confirmButton')}
          cancelText={t('messages.unblockModal.cancelButton')}
        />

        {/* Report User Modal */}
        <ConfirmModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          onConfirm={(reason) => handleReportUser(reason || '')}
          title={t('messages.reportModal.title')}
          message={t('messages.reportModal.message').replace('{name}', getOtherUserName(activeConversation))}
          type="warning"
          confirmText={t('messages.reportModal.confirmButton')}
          cancelText={t('messages.reportModal.cancelButton')}
          inputType="textarea"
          inputPlaceholder={t('messages.reportModal.placeholder')}
          inputRequired={true}
          inputMaxLength={500}
        />

        {/* Delete Chat Modal */}
        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConversation}
          title={t('messages.deleteModal.title')}
          message={t('messages.deleteModal.message')}
          type="error"
          confirmText={t('messages.deleteModal.confirmButton')}
          cancelText={t('messages.deleteModal.cancelButton')}
        />
      </div>
    </div>
  );
};

export default MessagesPage;
