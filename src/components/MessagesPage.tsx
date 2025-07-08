import React, { useState } from 'react';
import {
  Send,
  Search,
  MoreVertical,
  Shield,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Phone,
  Video
} from 'lucide-react';

// Mock conversations data
const mockConversations = [
  {
    id: 1,
    name: 'فاطمة أحمد',
    lastMessage: 'شكراً لك على الرسالة الجميلة',
    timestamp: 'منذ 5 دقائق',
    unread: 2,
    online: true,
    verified: true,
    avatar: null, // No photos for Islamic compliance
    status: 'approved' // approved, pending, blocked
  },
  {
    id: 2,
    name: 'مريم سالم',
    lastMessage: 'أتطلع للتحدث معك أكثر',
    timestamp: 'منذ ساعة',
    unread: 0,
    online: false,
    verified: true,
    avatar: null,
    status: 'approved'
  },
  {
    id: 3,
    name: 'نورا محمد',
    lastMessage: 'هل يمكن إشراك الأهل في المحادثة؟',
    timestamp: 'منذ 3 ساعات',
    unread: 1,
    online: false,
    verified: true,
    avatar: null,
    status: 'pending'
  }
];

// Mock messages for active conversation
const mockMessages = [
  {
    id: 1,
    senderId: 2,
    senderName: 'فاطمة أحمد',
    content: 'السلام عليكم ورحمة الله وبركاته',
    timestamp: '10:30 ص',
    status: 'approved',
    type: 'text'
  },
  {
    id: 2,
    senderId: 1,
    senderName: 'أنت',
    content: 'وعليكم السلام ورحمة الله وبركاته، أهلاً وسهلاً',
    timestamp: '10:32 ص',
    status: 'approved',
    type: 'text'
  },
  {
    id: 3,
    senderId: 2,
    senderName: 'فاطمة أحمد',
    content: 'سعدت بقراءة ملفك الشخصي، أعجبني التزامك بالقيم الإسلامية',
    timestamp: '10:35 ص',
    status: 'approved',
    type: 'text'
  },
  {
    id: 4,
    senderId: 1,
    senderName: 'أنت',
    content: 'بارك الله فيك، أنا أيضاً معجب بملفك الشخصي',
    timestamp: '10:37 ص',
    status: 'pending',
    type: 'text'
  }
];

const MessagesPage: React.FC = () => {
  const [activeConversation, setActiveConversation] = useState(mockConversations[0]);
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFamilyInvite, setShowFamilyInvite] = useState(false);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        senderId: 1,
        senderName: 'أنت',
        content: newMessage,
        timestamp: new Date().toLocaleTimeString('ar-SA', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }),
        status: 'pending' as const,
        type: 'text' as const
      };
      
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = mockConversations.filter(conv =>
    conv.name.includes(searchTerm)
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'blocked':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
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
          <div className="grid grid-cols-1 lg:grid-cols-3 h-[600px]">
            {/* Conversations Sidebar */}
            <div className="lg:col-span-1 border-l border-slate-200">
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
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setActiveConversation(conversation)}
                    className={`p-4 border-b border-slate-100 cursor-pointer transition-colors hover:bg-slate-50 ${
                      activeConversation.id === conversation.id ? 'bg-primary-50 border-primary-200' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        {conversation.online && (
                          <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>

                      {/* Conversation Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-slate-800 truncate">
                            {conversation.name}
                          </h3>
                          {conversation.verified && (
                            <Shield className="w-4 h-4 text-emerald-600" />
                          )}
                          {getStatusIcon(conversation.status)}
                        </div>
                        <p className="text-sm text-slate-600 truncate">
                          {conversation.lastMessage}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {conversation.timestamp}
                        </p>
                      </div>

                      {/* Unread Badge */}
                      {conversation.unread > 0 && (
                        <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {conversation.unread}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-2 flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-200 bg-white/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-slate-800">
                          {activeConversation.name}
                        </h3>
                        {activeConversation.verified && (
                          <Shield className="w-4 h-4 text-emerald-600" />
                        )}
                      </div>
                      <p className="text-sm text-slate-600">
                        {activeConversation.online ? 'متصل الآن' : 'غير متصل'}
                      </p>
                    </div>
                  </div>

                  {/* Chat Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowFamilyInvite(true)}
                      className="p-2 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="إشراك الأهل"
                    >
                      <Users className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                      <Phone className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                      <Video className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === 1 ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                        message.senderId === 1
                          ? 'bg-gradient-to-r from-primary-600 to-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className={`text-xs ${
                          message.senderId === 1 ? 'text-white/80' : 'text-slate-500'
                        }`}>
                          {message.timestamp}
                        </p>
                        {message.senderId === 1 && (
                          <div className="flex items-center gap-1">
                            {getStatusIcon(message.status)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-slate-200 bg-white/50">
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
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      rows={2}
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="p-3 bg-gradient-to-r from-primary-600 to-emerald-600 text-white rounded-xl hover:from-primary-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
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
                    placeholder="father@example.com"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-2">
                    رسالة اختيارية
                  </label>
                  <textarea
                    placeholder="رسالة للولي..."
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowFamilyInvite(false)}
                  className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => {
                    setShowFamilyInvite(false);
                    alert('تم إرسال الدعوة بنجاح');
                  }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-600 to-emerald-600 text-white rounded-xl hover:from-primary-700 hover:to-emerald-700 transition-all duration-300"
                >
                  إرسال الدعوة
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
