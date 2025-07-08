import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import LikesService from '../lib/likesService';
import {
  Heart,
  MessageCircle,
  Clock,
  Check,
  X,
  Star,
  Send,
  Calendar,
  MapPin,
  GraduationCap,
  Shield,
  Loader2,
  Users,
  Mail,
  Phone
} from 'lucide-react';

interface TabType {
  id: 'received' | 'sent' | 'requests';
  name: string;
  icon: React.ReactNode;
}

const LikesPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'received' | 'sent' | 'requests'>('received');
  const [receivedLikes, setReceivedLikes] = useState<any[]>([]);
  const [sentLikes, setSentLikes] = useState<any[]>([]);
  const [contactRequests, setContactRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [contactMessage, setContactMessage] = useState('');
  const [contactType, setContactType] = useState<'direct' | 'through_family' | 'formal'>('direct');

  const tabs: TabType[] = [
    {
      id: 'received',
      name: 'الإعجابات المستلمة',
      icon: <Heart className="w-5 h-5" />
    },
    {
      id: 'sent',
      name: 'الإعجابات المرسلة',
      icon: <Send className="w-5 h-5" />
    },
    {
      id: 'requests',
      name: 'طلبات التواصل',
      icon: <MessageCircle className="w-5 h-5" />
    }
  ];

  useEffect(() => {
    if (userProfile?.id) {
      loadData();
    }
  }, [userProfile, activeTab]);

  const loadData = async () => {
    if (!userProfile?.id) return;
    
    setIsLoading(true);
    try {
      if (activeTab === 'received') {
        const { data } = await LikesService.getReceivedLikes(userProfile.id);
        setReceivedLikes(data);
      } else if (activeTab === 'sent') {
        const { data } = await LikesService.getSentLikes(userProfile.id);
        setSentLikes(data);
      } else if (activeTab === 'requests') {
        const { data } = await LikesService.getReceivedContactRequests(userProfile.id);
        setContactRequests(data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLikeResponse = async (likeId: string, response: 'accepted' | 'rejected') => {
    try {
      const { success } = await LikesService.respondToLike(likeId, response);
      if (success) {
        loadData(); // إعادة تحميل البيانات
      }
    } catch (error) {
      console.error('Error responding to like:', error);
    }
  };

  const handleContactRequestResponse = async (requestId: string, response: 'accepted' | 'rejected') => {
    try {
      const { success } = await LikesService.respondToContactRequest(requestId, response);
      if (success) {
        loadData(); // إعادة تحميل البيانات
      }
    } catch (error) {
      console.error('Error responding to contact request:', error);
    }
  };

  const handleSendContactRequest = async () => {
    if (!selectedUser || !contactMessage.trim() || !userProfile?.id) return;

    try {
      const { success } = await LikesService.sendContactRequest(
        userProfile.id,
        selectedUser.id,
        contactMessage,
        contactType
      );
      
      if (success) {
        setShowContactModal(false);
        setContactMessage('');
        setSelectedUser(null);
        // يمكن إضافة إشعار نجاح هنا
      }
    } catch (error) {
      console.error('Error sending contact request:', error);
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'منذ دقائق';
    if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `منذ ${diffInDays} يوم`;
  };

  const getLikeTypeIcon = (type: string) => {
    switch (type) {
      case 'super_like': return <Star className="w-4 h-4 text-yellow-500" />;
      case 'interest': return <Heart className="w-4 h-4 text-pink-500" />;
      default: return <Heart className="w-4 h-4 text-red-500" />;
    }
  };

  const getLikeTypeText = (type: string) => {
    switch (type) {
      case 'super_like': return 'إعجاب مميز';
      case 'interest': return 'اهتمام';
      default: return 'إعجاب';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">الإعجابات والتواصل</h1>
          <p className="text-slate-600">إدارة الإعجابات وطلبات التواصل</p>
        </div>

        {/* Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 mb-8">
          <div className="flex border-b border-slate-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                    : 'text-slate-600 hover:text-primary-600 hover:bg-slate-50'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'received' && (
              <div className="space-y-4">
                {receivedLikes.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">لا توجد إعجابات جديدة</h3>
                    <p className="text-slate-600">عندما يعجب أحد بملفك الشخصي، ستظهر هنا</p>
                  </div>
                ) : (
                  receivedLikes.map((like) => (
                    <div key={like.id} className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-full flex items-center justify-center">
                            <Shield className="w-8 h-8 text-white" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-slate-800">
                                {like.liker.first_name} {like.liker.last_name}
                              </h3>
                              {like.liker.verified && (
                                <Shield className="w-4 h-4 text-green-500" />
                              )}
                              <div className="flex items-center gap-1">
                                {getLikeTypeIcon(like.like_type)}
                                <span className="text-sm text-slate-600">{getLikeTypeText(like.like_type)}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{like.liker.age} سنة</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{like.liker.city}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <GraduationCap className="w-4 h-4" />
                                <span>{like.liker.education}</span>
                              </div>
                            </div>
                            
                            {like.message && (
                              <div className="bg-slate-50 rounded-lg p-3 mb-3">
                                <p className="text-slate-700 text-sm">{like.message}</p>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <Clock className="w-3 h-3" />
                              <span>{formatTimeAgo(like.created_at)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleLikeResponse(like.id, 'rejected')}
                            className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors"
                          >
                            <X className="w-5 h-5 text-slate-600" />
                          </button>
                          <button
                            onClick={() => handleLikeResponse(like.id, 'accepted')}
                            className="w-10 h-10 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center transition-colors"
                          >
                            <Check className="w-5 h-5 text-green-600" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(like.liker);
                              setShowContactModal(true);
                            }}
                            className="w-10 h-10 bg-primary-100 hover:bg-primary-200 rounded-full flex items-center justify-center transition-colors"
                          >
                            <MessageCircle className="w-5 h-5 text-primary-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'sent' && (
              <div className="space-y-4">
                {sentLikes.length === 0 ? (
                  <div className="text-center py-12">
                    <Send className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">لم ترسل أي إعجابات بعد</h3>
                    <p className="text-slate-600">ابدأ بتصفح المطابقات وأرسل إعجاباتك</p>
                  </div>
                ) : (
                  sentLikes.map((like) => (
                    <div key={like.id} className="bg-white rounded-xl p-6 border border-slate-200">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-full flex items-center justify-center">
                          <Shield className="w-8 h-8 text-white" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-slate-800">
                              {like.liked_user.first_name} {like.liked_user.last_name}
                            </h3>
                            {like.liked_user.verified && (
                              <Shield className="w-4 h-4 text-green-500" />
                            )}
                            <div className="flex items-center gap-1">
                              {getLikeTypeIcon(like.like_type)}
                              <span className="text-sm text-slate-600">{getLikeTypeText(like.like_type)}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{like.liked_user.age} سنة</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{like.liked_user.city}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <Clock className="w-3 h-3" />
                              <span>{formatTimeAgo(like.created_at)}</span>
                            </div>
                            
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                              like.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              like.status === 'accepted' ? 'bg-green-100 text-green-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {like.status === 'pending' ? 'في الانتظار' :
                               like.status === 'accepted' ? 'تم القبول' : 'تم الرفض'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'requests' && (
              <div className="space-y-4">
                {contactRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">لا توجد طلبات تواصل</h3>
                    <p className="text-slate-600">عندما يرسل أحد طلب تواصل، ستظهر هنا</p>
                  </div>
                ) : (
                  contactRequests.map((request) => (
                    <div key={request.id} className="bg-white rounded-xl p-6 border border-slate-200">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-full flex items-center justify-center">
                            <Shield className="w-8 h-8 text-white" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-slate-800">
                                {request.sender.first_name} {request.sender.last_name}
                              </h3>
                              {request.sender.verified && (
                                <Shield className="w-4 h-4 text-green-500" />
                              )}
                            </div>
                            
                            <div className="bg-slate-50 rounded-lg p-4 mb-3">
                              <p className="text-slate-700">{request.message}</p>
                            </div>
                            
                            {request.request_type === 'through_family' && (
                              <div className="bg-blue-50 rounded-lg p-3 mb-3">
                                <p className="text-blue-800 text-sm font-medium mb-1">طلب تواصل عبر الأهل</p>
                                {request.family_email && (
                                  <div className="flex items-center gap-2 text-sm text-blue-700">
                                    <Mail className="w-4 h-4" />
                                    <span>{request.family_email}</span>
                                  </div>
                                )}
                                {request.family_phone && (
                                  <div className="flex items-center gap-2 text-sm text-blue-700">
                                    <Phone className="w-4 h-4" />
                                    <span>{request.family_phone}</span>
                                  </div>
                                )}
                              </div>
                            )}
                            
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <Clock className="w-3 h-3" />
                              <span>{formatTimeAgo(request.created_at)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleContactRequestResponse(request.id, 'rejected')}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                          >
                            رفض
                          </button>
                          <button
                            onClick={() => handleContactRequestResponse(request.id, 'accepted')}
                            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                          >
                            قبول
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Request Modal */}
      {showContactModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              إرسال طلب تواصل إلى {selectedUser.first_name}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  نوع التواصل
                </label>
                <select
                  value={contactType}
                  onChange={(e) => setContactType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="direct">تواصل مباشر</option>
                  <option value="through_family">عبر الأهل</option>
                  <option value="formal">رسمي</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  رسالة التواصل
                </label>
                <textarea
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="اكتب رسالة مهذبة ومحترمة..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent h-24 resize-none"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setShowContactModal(false)}
                className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={handleSendContactRequest}
                disabled={!contactMessage.trim()}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                إرسال
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LikesPage;
