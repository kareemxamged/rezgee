import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

const VerifyEmailChangePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [message, setMessage] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');

  useEffect(() => {
    const verifyEmailChange = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setMessage('رابط التحقق غير صالح');
        return;
      }

      try {
        // البحث عن طلب تحديث البريد الإلكتروني
        const { data: request, error: fetchError } = await supabase
          .from('email_change_requests')
          .select('*')
          .eq('verification_token', token)
          .eq('verified', false)
          .single();

        if (fetchError || !request) {
          setStatus('error');
          setMessage('رابط التحقق غير صالح أو منتهي الصلاحية');
          return;
        }

        // التحقق من انتهاء الصلاحية
        const expiresAt = new Date(request.expires_at);
        const now = new Date();
        
        if (now > expiresAt) {
          setStatus('expired');
          setMessage('انتهت صلاحية رابط التحقق. يرجى طلب رابط جديد.');
          return;
        }

        // تحديث البريد الإلكتروني ورقم الهاتف في جدول المستخدمين
        const updateData: any = {
          email: request.new_email,
          updated_at: new Date().toISOString()
        };

        // إضافة رقم الهاتف إذا كان موجوداً في الطلب
        if (request.new_phone) {
          updateData.phone = request.new_phone;
        }

        const { error: updateError } = await supabase
          .from('users')
          .update(updateData)
          .eq('id', request.user_id);

        if (updateError) {
          console.error('Error updating user email:', updateError);
          setStatus('error');
          setMessage('حدث خطأ أثناء تحديث البريد الإلكتروني');
          return;
        }

        // تحديث حالة الطلب إلى مؤكد
        const { error: verifyError } = await supabase
          .from('email_change_requests')
          .update({
            verified: true,
            updated_at: new Date().toISOString()
          })
          .eq('verification_token', token);

        if (verifyError) {
          console.error('Error marking request as verified:', verifyError);
        }

        setNewEmail(request.new_email);
        setNewPhone(request.new_phone || '');
        setStatus('success');

        // تحديد الرسالة بناءً على ما تم تحديثه
        if (request.new_phone) {
          setMessage('تم تحديث البريد الإلكتروني ورقم الهاتف بنجاح!');
        } else {
          setMessage('تم تحديث البريد الإلكتروني بنجاح!');
        }

        // إعادة توجيه إلى صفحة الإعدادات بعد 3 ثوان
        setTimeout(() => {
          const successMessage = request.new_phone
            ? 'تم تحديث البريد الإلكتروني ورقم الهاتف بنجاح!'
            : 'تم تحديث البريد الإلكتروني بنجاح!';

          navigate('/security', {
            state: { message: successMessage }
          });
        }, 3000);

      } catch (error) {
        console.error('Error verifying email change:', error);
        setStatus('error');
        setMessage('حدث خطأ أثناء التحقق من البريد الإلكتروني');
      }
    };

    verifyEmailChange();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">جاري التحقق...</h2>
              <p className="text-slate-600">يرجى الانتظار أثناء التحقق من البريد الإلكتروني</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-800 mb-2">تم التحديث بنجاح!</h2>
              <p className="text-slate-600 mb-4">{message}</p>
              {(newEmail || newPhone) && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4">
                  {newEmail && (
                    <p className="text-emerald-800 text-sm mb-1">
                      البريد الإلكتروني الجديد: <strong>{newEmail}</strong>
                    </p>
                  )}
                  {newPhone && (
                    <p className="text-emerald-800 text-sm">
                      رقم الهاتف الجديد: <strong>{newPhone}</strong>
                    </p>
                  )}
                </div>
              )}
              <p className="text-slate-500 text-sm">سيتم إعادة توجيهك إلى صفحة الإعدادات خلال ثوان...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-800 mb-2">حدث خطأ</h2>
              <p className="text-slate-600 mb-6">{message}</p>
              <button
                onClick={() => navigate('/security')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
              >
                العودة إلى الإعدادات
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {status === 'expired' && (
            <>
              <AlertTriangle className="w-16 h-16 text-amber-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-800 mb-2">انتهت الصلاحية</h2>
              <p className="text-slate-600 mb-6">{message}</p>
              <button
                onClick={() => navigate('/security')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
              >
                العودة إلى الإعدادات
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailChangePage;
