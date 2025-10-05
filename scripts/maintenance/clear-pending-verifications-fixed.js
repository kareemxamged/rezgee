/**
 * سكريبت حذف جميع طلبات التحقق المعلقة للحسابات الجديدة - إصدار مصحح
 * تاريخ الإنشاء: 09-08-2025
 * الغرض: حل مشكلة "يوجد طلب تحقق معلق" عند التسجيل
 */

import {
    createClient
} from '@supabase/supabase-js';

// إعدادات Supabase
const supabaseUrl = 'https://sbtzngewizgeqzfbhfjy.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNidHpuZ2V3aXpnZXF6ZmJoZmp5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTEzNzkxMywiZXhwIjoyMDY2NzEzOTEzfQ.HhFFZyYcaYlrsllR5VZ0ppix8lOYGsso5IWCPsjP-3g';

// إنشاء عميل Supabase مع Service Role Key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

/**
 * فحص شامل لجميع الطلبات المعلقة
 */
async function checkAllPendingRequests() {
    try {
        console.log('🔍 فحص شامل لجميع الطلبات المعلقة...');

        // فحص طلبات التحقق من البريد الإلكتروني
        const {
            data: emailVerifications,
            error: emailError
        } = await supabase
            .from('email_verifications')
            .select('id, email, status, created_at')
            .eq('status', 'pending');

        // فحص طلبات التوثيق
        const {
            data: verificationRequests,
            error: verificationError
        } = await supabase
            .from('verification_requests')
            .select('id, user_id, status, created_at')
            .in('status', ['pending', 'under_review']);

        // فحص كلمات المرور المؤقتة
        const {
            data: tempPasswords,
            error: tempPasswordError
        } = await supabase
            .from('temporary_passwords')
            .select('id, email, is_used, created_at')
            .eq('is_used', false);

        // فحص طلبات إعادة تعيين كلمة المرور
        const {
            data: passwordResets,
            error: passwordResetError
        } = await supabase
            .from('password_reset_requests')
            .select('id, user_id, email, created_at');

        console.log('📊 ملخص الطلبات المعلقة:');
        console.log(`   - طلبات تحقق البريد الإلكتروني: ${emailVerifications ? emailVerifications.length : 0}`);
        console.log(`   - طلبات التوثيق: ${verificationRequests ? verificationRequests.length : 0}`);
        console.log(`   - كلمات المرور المؤقتة غير المستخدمة: ${tempPasswords ? tempPasswords.length : 0}`);
        console.log(`   - طلبات إعادة تعيين كلمة المرور: ${passwordResets ? passwordResets.length : 0}`);

        const totalPending = (emailVerifications ? emailVerifications.length : 0) +
            (verificationRequests ? verificationRequests.length : 0) +
            (tempPasswords ? tempPasswords.length : 0) +
            (passwordResets ? passwordResets.length : 0);

        console.log(`📈 إجمالي الطلبات المعلقة: ${totalPending}`);

        return {
            emailVerifications: emailVerifications ? emailVerifications.length : 0,
            verificationRequests: verificationRequests ? verificationRequests.length : 0,
            tempPasswords: tempPasswords ? tempPasswords.length : 0,
            passwordResets: passwordResets ? passwordResets.length : 0,
            total: totalPending
        };

    } catch (error) {
        console.error('❌ خطأ في الفحص الشامل:', error.message);
        return null;
    }
}

/**
 * حذف جميع طلبات التحقق من البريد الإلكتروني المعلقة
 */
async function clearPendingEmailVerifications() {
    try {
        console.log('🗑️ حذف طلبات التحقق من البريد الإلكتروني المعلقة...');

        // حذف جميع الطلبات المعلقة
        const {
            data: deletedVerifications,
            error: deleteError
        } = await supabase
            .from('email_verifications')
            .delete()
            .eq('status', 'pending')
            .select();

        if (deleteError) {
            console.error('❌ خطأ في حذف طلبات التحقق:', deleteError.message);
            return {
                success: false,
                count: 0
            };
        }

        console.log(`✅ تم حذف ${deletedVerifications ? deletedVerifications.length : 0} طلب تحقق من البريد الإلكتروني`);
        return {
            success: true,
            count: deletedVerifications ? deletedVerifications.length : 0
        };

    } catch (error) {
        console.error('❌ خطأ في حذف طلبات التحقق من البريد الإلكتروني:', error.message);
        return {
            success: false,
            count: 0
        };
    }
}

/**
 * حذف جميع طلبات التوثيق المعلقة
 */
async function clearPendingVerificationRequests() {
    try {
        console.log('🗑️ حذف طلبات التوثيق المعلقة...');

        // حذف جميع الطلبات المعلقة
        const {
            data: deletedRequests,
            error: deleteError
        } = await supabase
            .from('verification_requests')
            .delete()
            .in('status', ['pending', 'under_review'])
            .select();

        if (deleteError) {
            console.error('❌ خطأ في حذف طلبات التوثيق:', deleteError.message);
            return {
                success: false,
                count: 0
            };
        }

        console.log(`✅ تم حذف ${deletedRequests ? deletedRequests.length : 0} طلب توثيق`);
        return {
            success: true,
            count: deletedRequests ? deletedRequests.length : 0
        };

    } catch (error) {
        console.error('❌ خطأ في حذف طلبات التوثيق:', error.message);
        return {
            success: false,
            count: 0
        };
    }
}

/**
 * حذف جميع كلمات المرور المؤقتة غير المستخدمة
 */
async function clearUnusedTemporaryPasswords() {
    try {
        console.log('🗑️ حذف كلمات المرور المؤقتة غير المستخدمة...');

        // حذف جميع كلمات المرور المؤقتة غير المستخدمة
        const {
            data: deletedPasswords,
            error: deleteError
        } = await supabase
            .from('temporary_passwords')
            .delete()
            .eq('is_used', false)
            .select();

        if (deleteError) {
            console.error('❌ خطأ في حذف كلمات المرور المؤقتة:', deleteError.message);
            return {
                success: false,
                count: 0
            };
        }

        console.log(`✅ تم حذف ${deletedPasswords ? deletedPasswords.length : 0} كلمة مرور مؤقتة`);
        return {
            success: true,
            count: deletedPasswords ? deletedPasswords.length : 0
        };

    } catch (error) {
        console.error('❌ خطأ في حذف كلمات المرور المؤقتة:', error.message);
        return {
            success: false,
            count: 0
        };
    }
}

/**
 * حذف جميع طلبات إعادة تعيين كلمة المرور المعلقة
 */
async function clearPendingPasswordResetRequests() {
    try {
        console.log('🗑️ حذف طلبات إعادة تعيين كلمة المرور المعلقة...');

        // حذف جميع الطلبات
        const {
            data: deletedRequests,
            error: deleteError
        } = await supabase
            .from('password_reset_requests')
            .delete()
            .select();

        if (deleteError) {
            console.error('❌ خطأ في حذف طلبات إعادة تعيين كلمة المرور:', deleteError.message);
            return {
                success: false,
                count: 0
            };
        }

        console.log(`✅ تم حذف ${deletedRequests ? deletedRequests.length : 0} طلب إعادة تعيين كلمة مرور`);
        return {
            success: true,
            count: deletedRequests ? deletedRequests.length : 0
        };

    } catch (error) {
        console.error('❌ خطأ في حذف طلبات إعادة تعيين كلمة المرور:', error.message);
        return {
            success: false,
            count: 0
        };
    }
}

/**
 * البحث عن أسباب أخرى محتملة للمشكلة
 */
async function investigateAlternativeCauses() {
    try {
        console.log('🔍 البحث عن أسباب أخرى محتملة للمشكلة...');

        // فحص جدول users للبحث عن حسابات معلقة
        const {
            data: inactiveUsers,
            error: usersError
        } = await supabase
            .from('users')
            .select('id, email, status, created_at')
            .in('status', ['pending', 'inactive', 'suspended']);

        if (!usersError && inactiveUsers && inactiveUsers.length > 0) {
            console.log(`⚠️ تم العثور على ${inactiveUsers.length} مستخدم بحالة غير نشطة:`);
            inactiveUsers.slice(0, 5).forEach((user, index) => {
                console.log(`   ${index + 1}. ${user.email} - Status: ${user.status} - ${user.created_at}`);
            });
        }

        // فحص جدول auth.users للبحث عن حسابات غير مؤكدة
        const {
            data: unconfirmedAuth,
            error: authError
        } = await supabase.auth.admin.listUsers();

        if (!authError && unconfirmedAuth && unconfirmedAuth.users) {
            const unconfirmedUsers = unconfirmedAuth.users.filter(user => !user.email_confirmed_at);
            if (unconfirmedUsers.length > 0) {
                console.log(`⚠️ تم العثور على ${unconfirmedUsers.length} مستخدم غير مؤكد في auth.users:`);
                unconfirmedUsers.slice(0, 5).forEach((user, index) => {
                    console.log(`   ${index + 1}. ${user.email} - Created: ${user.created_at}`);
                });
            }
        }

        // فحص جدول admin_users للبحث عن حسابات إدارة معلقة
        const {
            data: adminUsers,
            error: adminError
        } = await supabase
            .from('admin_users')
            .select('id, user_id, is_active, created_at');

        if (!adminError && adminUsers && adminUsers.length > 0) {
            const inactiveAdmins = adminUsers.filter(admin => !admin.is_active);
            if (inactiveAdmins.length > 0) {
                console.log(`⚠️ تم العثور على ${inactiveAdmins.length} مشرف غير نشط:`);
                inactiveAdmins.slice(0, 5).forEach((admin, index) => {
                    console.log(`   ${index + 1}. Admin ID: ${admin.id} - User ID: ${admin.user_id} - ${admin.created_at}`);
                });
            }
        }

        return {
            inactiveUsers: inactiveUsers ? inactiveUsers.length : 0,
            unconfirmedAuth: unconfirmedAuth ? unconfirmedAuth.users.filter(u => !u.email_confirmed_at).length : 0,
            inactiveAdmins: adminUsers ? adminUsers.filter(a => !a.is_active).length : 0
        };

    } catch (error) {
        console.error('❌ خطأ في البحث عن الأسباب البديلة:', error.message);
        return null;
    }
}

/**
 * الدالة الرئيسية
 */
async function main() {
    console.log('🚀 بدء التحقيق في مشكلة طلبات التحقق المعلقة...');
    console.log('🎯 الهدف: العثور على جميع الأسباب المحتملة للمشكلة');
    console.log('='.repeat(70));

    try {
        // 1. فحص شامل للطلبات المعلقة
        console.log('📋 الخطوة 1: فحص شامل للطلبات المعلقة');
        const initialCheck = await checkAllPendingRequests();

        if (!initialCheck) {
            console.error('❌ فشل في الفحص الشامل');
            return;
        }

        console.log('='.repeat(70));

        // 2. البحث عن أسباب أخرى محتملة
        console.log('📋 الخطوة 2: البحث عن أسباب أخرى محتملة');
        const alternativeCauses = await investigateAlternativeCauses();

        console.log('='.repeat(70));

        // 3. حذف جميع الطلبات المعلقة
        console.log('📋 الخطوة 3: حذف جميع الطلبات المعلقة');

        const emailResult = await clearPendingEmailVerifications();
        const verificationResult = await clearPendingVerificationRequests();
        const tempPasswordResult = await clearUnusedTemporaryPasswords();
        const passwordResetResult = await clearPendingPasswordResetRequests();

        console.log('='.repeat(70));

        // 4. فحص نهائي
        console.log('📋 الخطوة 4: فحص نهائي');
        const finalCheck = await checkAllPendingRequests();

        console.log('='.repeat(70));
        console.log('📊 ملخص النتائج:');
        console.log(`✅ طلبات تحقق البريد الإلكتروني المحذوفة: ${emailResult.count}`);
        console.log(`✅ طلبات التوثيق المحذوفة: ${verificationResult.count}`);
        console.log(`✅ كلمات المرور المؤقتة المحذوفة: ${tempPasswordResult.count}`);
        console.log(`✅ طلبات إعادة تعيين كلمة المرور المحذوفة: ${passwordResetResult.count}`);

        const totalDeleted = emailResult.count + verificationResult.count +
            tempPasswordResult.count + passwordResetResult.count;

        console.log(`📈 إجمالي الطلبات المحذوفة: ${totalDeleted}`);

        if (alternativeCauses) {
            console.log('🔍 أسباب أخرى محتملة:');
            console.log(`   - مستخدمون غير نشطين: ${alternativeCauses.inactiveUsers}`);
            console.log(`   - حسابات غير مؤكدة في auth: ${alternativeCauses.unconfirmedAuth}`);
            console.log(`   - مشرفون غير نشطين: ${alternativeCauses.inactiveAdmins}`);
        }

        if (finalCheck && finalCheck.total === 0) {
            console.log('🎉 تم حذف جميع الطلبات المعلقة بنجاح!');
            console.log('✅ يمكن الآن إنشاء حسابات جديدة بدون مشاكل');
        } else {
            console.log('⚠️ لا تزال هناك بعض الطلبات المعلقة');
            console.log('💡 قد تكون المشكلة في مكان آخر في النظام');
        }

    } catch (error) {
        console.error('❌ خطأ في العملية الرئيسية:', error.message);
    }
}

// تشغيل السكريبت
main().catch(console.error);

export {
    clearPendingEmailVerifications,
    clearPendingVerificationRequests,
    clearUnusedTemporaryPasswords,
    clearPendingPasswordResetRequests,
    checkAllPendingRequests,
    investigateAlternativeCauses

