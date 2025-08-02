import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const VerifyEmailChangePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [message, setMessage] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const hasProcessed = useRef(false); // منع التنفيذ المتكرر

  useEffect(() => {
    // منع التنفيذ المتكرر
    if (hasProcessed.current) {
      return;
    }

    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('رابط التحقق غير صالح');
      return;
    }

    hasProcessed.current = true;

    const verifyEmailChange = async () => {

      try {
        // البحث عن طلب تحديث البريد الإلكتروني
        const { data: request, error: fetchError } = await supabase
          .from('email_change_requests')
          .select('*')
          .eq('verification_token', token)
          .single();

        console.log('📧 Email change request found:', {
          hasRequest: !!request,
          verified: request?.verified,
          error: fetchError?.message
        });

        if (fetchError || !request) {
          setStatus('error');
          setMessage('رابط التحقق غير صالح أو منتهي الصلاحية');
          return;
        }

        // التحقق من أن الطلب لم يتم تأكيده من قبل
        if (request.verified) {
          console.log('✅ Request already verified, showing success');
          setNewEmail(request.new_email);
          setNewPhone(request.new_phone || '');
          setStatus('success');
          setMessage('تم تحديث البيانات مسبقاً!');

          // لا نعيد تحميل البيانات هنا لتجنب الحلقة اللا نهائية
          // البيانات محدثة بالفعل

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

        console.log('🔄 Updating user data:', {
          userId: request.user_id,
          updateData,
          currentEmail: request.current_email,
          newEmail: request.new_email
        });

        const { data: updateResult, error: updateError } = await supabase
          .from('users')
          .update(updateData)
          .eq('id', request.user_id)
          .select('id, email, phone, updated_at');

        if (updateError) {
          console.error('❌ Error updating user email:', updateError);
          setStatus('error');
          setMessage('حدث خطأ أثناء تحديث البريد الإلكتروني');
          return;
        }

        console.log('✅ User data updated successfully:', updateResult);

        // التحقق من أن التحديث تم بنجاح
        if (!updateResult || updateResult.length === 0) {
          console.error('❌ No rows were updated');
          setStatus('error');
          setMessage('فشل في تحديث البيانات');
          return;
        }

        // التحقق من أن البريد الإلكتروني تم تحديثه فعلاً
        const updatedEmail = updateResult[0]?.email;
        if (updatedEmail !== request.new_email) {
          console.error('❌ Email was not updated correctly:', {
            expected: request.new_email,
            actual: updatedEmail
          });
          setStatus('error');
          setMessage('فشل في تحديث البريد الإلكتروني');
          return;
        }

        console.log('✅ Email verification completed successfully:', {
          oldEmail: request.current_email,
          newEmail: updatedEmail
        });

        // تحديث البريد الإلكتروني في Supabase Auth أيضاً لضمان التطابق
        console.log('🔄 Updating email in Supabase Auth...');
        try {
          const { error: authUpdateError } = await supabase.auth.admin.updateUserById(
            request.user_id,
            {
              email: request.new_email,
              email_confirm: true
            }
          );

          if (authUpdateError) {
            console.error('❌ Error updating email in Supabase Auth:', authUpdateError);
            // لا نوقف العملية لأن التحديث في جدول users نجح
          } else {
            console.log('✅ Email updated in Supabase Auth successfully');
          }
        } catch (authError) {
          console.error('❌ Error updating auth email:', authError);
          // لا نوقف العملية
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

        // رسالة نجاح شاملة
        setMessage('تم تحديث البيانات بنجاح!');

        // إعادة تحميل بيانات المستخدم في AuthContext لتحديث الواجهة
        console.log('🔄 Refreshing user profile after email change verification...');
        try {
          await refreshProfile();
          console.log('✅ User profile refreshed successfully');
        } catch (refreshError) {
          console.error('❌ Error refreshing profile:', refreshError);
        }

        // إعادة توجيه إلى صفحة الإعدادات بعد 3 ثوان
        setTimeout(() => {
          navigate('/security', {
            state: { message: 'تم تحديث البيانات بنجاح!' },
            replace: true // استخدام replace لتجنب مشاكل التنقل
          });
        }, 3000);

      } catch (error) {
        console.error('Error verifying email change:', error);
        setStatus('error');
        setMessage('حدث خطأ أثناء التحقق من البريد الإلكتروني');
      }
    };

    verifyEmailChange();
  }, [searchParams, navigate]); // إزالة refreshProfile من dependencies

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
