import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
        showError('خطأ في التحميل', 'حدث خطأ أثناء تحميل المحادثات. يرجى المحاولة مرة أخرى.');
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
      showError('خطأ غير متوقع', 'حدث خطأ غير متوقع أثناء تحميل المحادثات. يرجى إعادة تحميل الصفحة.');
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
        showError('خطأ في تحميل الرسائل', 'لا يمكن تحميل رسائل هذه المحادثة. يرجى المحاولة مرة أخرى.');
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
      showError('خطأ غير متوقع', 'حدث خطأ غير متوقع أثناء تحميل الرسائل. يرجى إعادة المحاولة.');
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
        showError('فشل إرسال الرسالة', 'لا يمكن إرسال الرسالة في الوقت الحالي. يرجى المحاولة مرة أخرى.');
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
        showSuccess('تم الإرسال', 'تم إرسال رسالتك بنجاح');
      }

      setNewMessage('');
    } catch (error) {
      console.error('Unexpected error sending message:', error);
      showError('خطأ غير متوقع', 'حدث خطأ غير متوقع أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.');
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
      showWarning('بيانات ناقصة', 'يرجى إدخال بريد إلكتروني صحيح للأهل');
      return;
    }

    if (!activeConversation?.id) {
      showError('خطأ', 'لا توجد محادثة نشطة');
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
        showError('فشل إشراك الأهل', 'حدث خطأ أثناء إشراك الأهل. يرجى المحاولة مرة أخرى.');
        return;
      }

      // Send notification email to family (this would be implemented later)
      console.log('Family invited:', familyEmail);
      showSuccess('تم إشراك الأهل', 'تم إرسال دعوة للأهل بنجاح. سيتم إشعارهم عبر البريد الإلكتروني.');
      setShowFamilyInvite(false);
      setFamilyEmail('');
    } catch (error) {
      console.error('Unexpected error involving family:', error);
      showError('خطأ غير متوقع', 'حدث خطأ غير متوقع أثناء إشراك الأهل');
    }
  };

  // Handle blocking user
  const handleBlockUser = async () => {
    console.log('handleBlockUser called');
    if (!activeConversation?.id || !userProfile?.id) {
      showError('خطأ', 'لا توجد محادثة نشطة أو مستخدم غير مسجل');
      return;
    }

    const otherUser = getOtherUser(activeConversation);
    if (!otherUser) {
      showError('خطأ', 'لا يمكن العثور على بيانات المستخدم');
      return;
    }

    try {
      console.log('Blocking conversation:', activeConversation.id);

      // Show processing notification
      showInfo('جاري المعالجة', 'جاري حظر المستخدم، يرجى الانتظار...');

      const { success, error } = await blockService.blockUserInConversation(
        activeConversation.id,
        userProfile.id,
        otherUser.id
      );

      if (!success || error) {
        console.error('Error blocking user:', error);
        showError('فشل حظر المستخدم', 'حدث خطأ أثناء حظر المستخدم. يرجى المحاولة مرة أخرى.');
        return;
      }

      // Enhanced success notification with detailed information
      showSuccess(
        'تم حظر المستخدم بنجاح',
        `تم حظر ${otherUser.first_name} ${otherUser.last_name} بنجاح. لن يتمكن من إرسال رسائل إليك أو رؤية ملفك الشخصي. يمكنك إلغاء الحظر في أي وقت من نفس القائمة.`
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
      showError('خطأ غير متوقع', 'حدث خطأ غير متوقع أثناء حظر المستخدم');
    }
  };

  // Handle unblocking user
  const handleUnblockUser = async () => {
    console.log('handleUnblockUser called');
    if (!activeConversation?.id || !userProfile?.id) {
      showError('خطأ', 'لا توجد محادثة نشطة أو مستخدم غير مسجل');
      return;
    }

    const otherUser = getOtherUser(activeConversation);
    if (!otherUser) {
      showError('خطأ', 'لا يمكن العثور على بيانات المستخدم');
      return;
    }

    try {
      console.log('Unblocking conversation:', activeConversation.id);

      // Show processing notification
      showInfo('جاري المعالجة', 'جاري إلغاء حظر المستخدم، يرجى الانتظار...');

      const { success, error } = await blockService.unblockUserInConversation(activeConversation.id);

      if (!success || error) {
        console.error('Error unblocking user:', error);
        showError('فشل إلغاء حظر المستخدم', 'حدث خطأ أثناء إلغاء حظر المستخدم. يرجى المحاولة مرة أخرى.');
        return;
      }

      // Enhanced success notification
      showSuccess(
        'تم إلغاء حظر المستخدم بنجاح',
        `تم إلغاء حظر ${otherUser.first_name} ${otherUser.last_name} بنجاح. يمكنكما الآن التواصل مرة أخرى.`
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
      showError('خطأ غير متوقع', 'حدث خطأ غير متوقع أثناء إلغاء حظر المستخدم');
    }
  };

  // Handle reporting user
  const handleReportUser = async (reason: string) => {
    console.log('🚩 handleReportUser called with reason:', reason);

    // Validate conversation and user
    if (!activeConversation || !userProfile?.id) {
      console.error('❌ No active conversation or user not logged in');
      showError('خطأ في النظام', 'حدث خطأ، يرجى المحاولة مرة أخرى');
      return;
    }

    const otherUser = getOtherUser(activeConversation);
    if (!otherUser) {
      console.error('❌ Cannot find other user data');
      showError('خطأ في البيانات', 'لم يتم العثور على بيانات المستخدم');
      return;
    }

    // Validate reason
    if (!reason?.trim()) {
      showError('سبب الإبلاغ مطلوب', 'يجب كتابة سبب الإبلاغ');
      return;
    }

    if (reason.trim().length < 10) {
      showError('سبب الإبلاغ قصير', 'يجب أن يكون على الأقل 10 أحرف');
      return;
    }

    // Show processing message
    showInfo('جاري المعالجة', 'يتم إرسال البلاغ، يرجى الانتظار...');

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
        if (error.includes('24 ساعة')) {
          showWarning('تم الإبلاغ مسبقاً', error);
        } else if (error.includes('معاملات غير صحيحة')) {
          showError('خطأ في البيانات', 'البيانات المرسلة غير صحيحة. يرجى المحاولة مرة أخرى.');
        } else if (error.includes('لا يمكن للمستخدم الإبلاغ عن نفسه')) {
          showError('خطأ في العملية', 'لا يمكن الإبلاغ عن نفسك.');
        } else {
          showError('فشل إرسال البلاغ', error || 'حدث خطأ أثناء إرسال البلاغ. يرجى المحاولة مرة أخرى.');
        }
        return;
      }

      if (!data) {
        console.error('❌ No data returned from report creation');
        showError('فشل إرسال البلاغ', 'لم يتم إرسال البلاغ بنجاح. يرجى المحاولة مرة أخرى.');
        return;
      }

      console.log('✅ Report created successfully:', data);

      // Show success message with report details
      const reportId = data.id || 'غير محدد';
      showSuccess(
        'تم إرسال البلاغ بنجاح',
        `تم إرسال البلاغ بنجاح ورقم البلاغ هو: ${reportId}. سيتم مراجعة البلاغ خلال 24 ساعة.`
      );

      // Close modal
      setShowReportModal(false);
      setShowMoreMenu(false);
    } catch (error) {
      console.error('💥 Unexpected error reporting user:', error);
      showError('خطأ غير متوقع', 'حدث خطأ غير متوقع أثناء إرسال البلاغ. يرجى المحاولة مرة أخرى لاحقاً.');
    }
  };

  // Handle deleting conversation
  const handleDeleteConversation = async () => {
    console.log('handleDeleteConversation called');
    if (!activeConversation?.id || !userProfile?.id) {
      showError('خطأ', 'لا توجد محادثة نشطة أو مستخدم غير مسجل');
      return;
    }

    try {
      console.log('Deleting conversation:', activeConversation.id);

      const result = await deleteService.deleteConversationCompletely(activeConversation.id);

      if (!result.success || result.error) {
        console.error('Error deleting conversation:', result.error);
        showError('فشل الحذف', 'حدث خطأ أثناء حذف المحادثة. يرجى المحاولة مرة أخرى.');
        return;
      }

      showSuccess('تم الحذف', 'تم حذف المحادثة وجميع الرسائل نهائياً من النظام.');
      setActiveConversation(null);
      setMessages([]);
      setShowDeleteModal(false);
      setShowMoreMenu(false);
      // Reload conversations to reflect the change
      loadConversations();
    } catch (error) {
      console.error('Unexpected error deleting conversation:', error);
      showError('خطأ غير متوقع', 'حدث خطأ غير متوقع أثناء حذف المحادثة');
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
      return 'منذ دقائق';
    } else if (diffInHours < 24) {
      return `منذ ${Math.floor(diffInHours)} ساعة`;
    } else {
      return date.toLocaleDateString('ar-EG', {
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-emerald-50" dir="rtl">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 md:top-20 right-10 md:right-20 w-32 h-32 md:w-64 md:h-64 bg-primary-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 md:bottom-20 left-10 md:left-20 w-48 h-48 md:w-96 md:h-96 bg-emerald-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 relative">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-3 md:mb-4 font-display">
            المراسلات
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-slate-600 px-4">
            تواصل مع الأعضاء بطريقة محترمة وآمنة
          </p>
        </div>

        {/* Messages Interface */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 h-[calc(100vh-120px)] min-h-[700px] max-h-[900px]">
            {/* Conversations Sidebar */}
            <div className={`lg:col-span-1 border-l border-slate-200 ${showChatView ? 'hidden lg:block' : 'block'}`}>
              {/* Header for mobile/tablet */}
              <div className="lg:hidden p-4 border-b border-slate-200 bg-slate-50">
                <h2 className="text-lg font-semibold text-slate-800">المحادثات</h2>
              </div>

              {/* Search */}
              <div className="p-4 border-b border-slate-200">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="البحث في المحادثات..."
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
                      <p className="text-slate-600">جاري تحميل المحادثات...</p>
                    </div>
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="text-center py-8 px-4">
                    <User className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">لا توجد محادثات</h3>
                    <p className="text-slate-600 mb-4">ابدأ محادثة جديدة من صفحة البحث</p>
                    <Link
                      to="/search"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-emerald-600 text-white py-2 px-4 rounded-xl font-medium hover:from-primary-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <Search className="w-4 h-4" />
                      البحث عن أعضاء
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
                                title="عرض الملف الشخصي"
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
                                      <span className="text-slate-500">أنت: </span>
                                    )}
                                    {conversation.last_message}
                                  </>
                                ) : (
                                  'لا توجد رسائل بعد'
                                )}
                              </p>
                              {/* Read status icons - only show for messages sent by current user */}
                              <div className="flex items-center gap-1 ml-2">
                                {conversation.last_message && conversation.last_message_sender_id === userProfile?.id && (
                                  conversation.last_message_read ? (
                                    <div title="تم قراءة الرسالة">
                                      <CheckCheck className="w-4 h-4 text-blue-500" />
                                    </div>
                                  ) : (
                                    <div title="تم إرسال الرسالة">
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
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">اختر محادثة</h3>
                    <p className="text-slate-600">اختر محادثة من القائمة لبدء المراسلة</p>
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
                          title="العودة للمحادثات"
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
                              title="عرض الملف الشخصي"
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
                            عضو في الموقع
                          </p>
                        </div>
                      </div>

                  {/* Chat Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowFamilyInvite(true)}
                      className="p-2 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="إشراك الأهل في المحادثة"
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
                        title="المزيد من الخيارات"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      {/* More Menu Dropdown */}
                      {showMoreMenu && (
                        <div
                          className="absolute left-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50"
                          style={{ zIndex: 9999 }}
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
                            className="w-full px-4 py-2 text-right text-slate-700 hover:bg-slate-50 flex items-center gap-3 border-none bg-transparent cursor-pointer"
                          >
                            <Flag className="w-4 h-4 text-amber-500" />
                            الإبلاغ عن المستخدم
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
                              className="w-full px-4 py-2 text-right text-slate-700 hover:bg-slate-50 flex items-center gap-3 border-none bg-transparent cursor-pointer"
                            >
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              إلغاء حظر المستخدم
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
                              className="w-full px-4 py-2 text-right text-slate-700 hover:bg-slate-50 flex items-center gap-3 border-none bg-transparent cursor-pointer"
                            >
                              <UserX className="w-4 h-4 text-red-500" />
                              حظر المستخدم
                            </button>
                          )}
                          <div className="border-t border-slate-200 my-1"></div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log('Delete conversation clicked');
                              setShowDeleteModal(true);
                              setShowMoreMenu(false);
                            }}
                            className="w-full px-4 py-2 text-right text-red-600 hover:bg-red-50 flex items-center gap-3 border-none bg-transparent cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                            حذف المحادثة
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
                      <p className="text-slate-600">جاري تحميل الرسائل...</p>
                    </div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Send className="w-8 h-8 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">لا توجد رسائل</h3>
                      <p className="text-slate-600">ابدأ المحادثة بإرسال رسالة أدناه</p>
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
                              {new Date(message.created_at).toLocaleTimeString('ar-EG', {
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
                      جميع الرسائل تخضع للمراجعة للتأكد من الالتزام بالآداب الإسلامية
                    </p>
                  </div>
                </div>

                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="اكتب رسالتك هنا..."
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
                  إشراك الأهل
                </h3>
                <p className="text-slate-600">
                  يمكنك دعوة أحد أفراد الأسرة للمشاركة في هذه المحادثة
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-slate-700 font-medium mb-2">
                    البريد الإلكتروني لولي الأمر
                  </label>
                  <input
                    type="email"
                    value={familyEmail}
                    onChange={(e) => setFamilyEmail(e.target.value)}
                    placeholder="father@example.com"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800 mb-1">ضوابط إشراك الأهل</h4>
                      <p className="text-sm text-blue-700">
                        سيتم إرسال دعوة لولي الأمر للاطلاع على المحادثة وفقاً للضوابط الشرعية.
                        هذا يساعد في ضمان سير التعارف بطريقة محترمة ومناسبة.
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
                  إلغاء
                </button>
                <button
                  onClick={handleFamilyInvite}
                  disabled={!familyEmail.trim()}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-600 to-emerald-600 text-white rounded-xl hover:from-primary-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  إرسال الدعوة
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
          title="تأكيد حظر المستخدم"
          message={`هل أنت متأكد من حظر ${getOtherUser(activeConversation)?.first_name || 'هذا المستخدم'}؟

سيتم حظر هذا المستخدم بشكل كامل، مما يعني:
• لن يتمكن من إرسال رسائل إليك
• لن يتمكن من رؤية ملفك الشخصي في البحث
• لن يتمكن من التفاعل معك في أي مكان بالموقع
• يمكنك إلغاء الحظر في أي وقت من نفس القائمة

هذا حظر شامل وليس فقط من المراسلة.`}
          type="warning"
          confirmText="حظر المستخدم نهائياً"
          cancelText="إلغاء"
        />

        {/* Unblock User Modal */}
        <ConfirmModal
          isOpen={showUnblockModal}
          onClose={() => setShowUnblockModal(false)}
          onConfirm={handleUnblockUser}
          title="تأكيد إلغاء حظر المستخدم"
          message={`هل أنت متأكد من إلغاء حظر ${getOtherUser(activeConversation)?.first_name || 'هذا المستخدم'}؟`}
          type="info"
          confirmText="إلغاء الحظر"
          cancelText="إبقاء الحظر"
        />

        {/* Report User Modal */}
        <ConfirmModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          onConfirm={(reason) => handleReportUser(reason || '')}
          title="الإبلاغ عن المستخدم"
          message={`يرجى ذكر سبب الإبلاغ عن ${getOtherUser(activeConversation)?.first_name || 'هذا المستخدم'}.

سيتم مراجعة البلاغ من قبل الإدارة خلال 24 ساعة.`}
          type="warning"
          confirmText="إرسال البلاغ"
          cancelText="إلغاء"
          inputType="textarea"
          inputPlaceholder="اذكر سبب الإبلاغ بالتفصيل (على الأقل 10 أحرف)..."
          inputRequired={true}
          inputMaxLength={500}
        />

        {/* Delete Conversation Modal */}
        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConversation}
          title="تأكيد حذف المحادثة"
          message="سيتم حذف المحادثة وجميع الرسائل نهائياً من النظام لكلا الطرفين. هذا الإجراء لا يمكن التراجع عنه."
          type="error"
          confirmText="حذف المحادثة"
          cancelText="إلغاء"
        />
      </div>
    </div>
  );
};

export default MessagesPage;
