import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Copy, Mail, ExternalLink } from 'lucide-react';

const VerificationLinkPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [copied, setCopied] = useState(false);
  
  const email = searchParams.get('email');
  const token = searchParams.get('token');
  const verificationUrl = token ? `${window.location.origin}/verify-email?token=${token}` : '';

  const copyToClipboard = async () => {
    if (verificationUrl) {
      try {
        await navigator.clipboard.writeText(verificationUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('فشل في نسخ الرابط:', error);
      }
    }
  };

  const openVerificationLink = () => {
    if (verificationUrl) {
      window.open(verificationUrl, '_blank');
    }
  };

  if (!email || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-2xl shadow-lg border border-red-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-2">رابط غير صحيح</h2>
          <p className="text-slate-600 mb-6">لم يتم العثور على معلومات التحقق</p>
          <Link
            to="/register"
            className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors inline-block"
          >
            العودة للتسجيل
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-primary-50 flex items-center justify-center py-12" dir="rtl">
      <div className="max-w-lg w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Mail className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2 font-display">
              رابط التحقق جاهز
            </h1>
            <p className="text-slate-600 mb-4">
              تم إنشاء رابط التحقق بنجاح للبريد الإلكتروني:
            </p>
            <div className="text-sm text-slate-500 bg-slate-50 rounded-lg p-3 font-mono">
              {email}
            </div>
          </div>

          {/* Verification Link */}
          <div className="mb-8">
            <label className="block text-slate-700 font-medium mb-3">
              رابط التحقق:
            </label>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="text-sm text-slate-600 break-all mb-4 font-mono">
                {verificationUrl}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={copyToClipboard}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? 'تم النسخ!' : 'نسخ الرابط'}
                </button>
                <button
                  onClick={openVerificationLink}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  فتح الرابط
                </button>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-emerald-800 font-medium text-sm mb-2">
                  خطوات إكمال التسجيل:
                </h3>
                <ol className="text-emerald-700 text-sm space-y-1 list-decimal list-inside">
                  <li>انسخ الرابط أعلاه أو اضغط على "فتح الرابط"</li>
                  <li>ستنتقل لصفحة تعيين كلمة المرور</li>
                  <li>أدخل كلمة مرور قوية وأكدها</li>
                  <li>اضغط على "تأكيد الحساب"</li>
                  <li>ستتمكن من تسجيل الدخول بعد ذلك</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Note about email */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-amber-800 text-sm">
              <strong>ملاحظة:</strong> نظام إرسال الإيميلات قيد التطوير حالياً. 
              يمكنك استخدام الرابط أعلاه مباشرة لتأكيد حسابك.
            </p>
          </div>

          {/* Back to home */}
          <div className="text-center">
            <Link
              to="/"
              className="text-slate-600 hover:text-slate-800 font-medium transition-colors"
            >
              العودة للصفحة الرئيسية
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationLinkPage;
