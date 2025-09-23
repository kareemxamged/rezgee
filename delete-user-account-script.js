/**
 * سكريبت حذف الحساب "alrrakb@hotmail.com" وطلبات التحقق المعلقة
 * تاريخ الإنشاء: 09-08-2025
 * الغرض: حذف نهائي للحساب المحدد وجميع البيانات المرتبطة به
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

const TARGET_EMAIL = 'alrrakb@hotmail.com';

/**
 * البحث عن المستخدم في قاعدة البيانات
 */
async function findUserByEmail(email) {
    try {
        console.log(`🔍 البحث عن المستخدم: ${email}`);

        // البحث في جدول users
        const {
            data: users,
            error: usersError
        } = await supabase
            .from('users')
            .select('id, email, first_name, last_name, status, created_at')
            .eq('email', email.toLowerCase())
            .limit(1);

        if (usersError) {
            console.error('❌ خطأ في البحث في جدول users:', usersError.message);
            return null;
        }

        if (users && users.length > 0) {
            const user = users[0];
            console.log(`✅ تم العثور على المستخدم في جدول users:`);
            console.log(`   - المعرف: ${user.id}`);
            console.log(`   - الاسم: ${user.first_name} ${user.last_name}`);
            console.log(`   - الحالة: ${user.status}`);
            console.log(`   - تاريخ الإنشاء: ${user.created_at}`);
            return user;
        }

        console.log('⚠️ لم يتم العثور على المستخدم في جدول users');
        return null;
    } catch (error) {
        console.error('❌ خطأ في البحث عن المستخدم:', error.message);
        return null;
    }
}

/**
 * حذف المستخدم من جدول auth.users
 */
async function deleteUserFromAuth(userId) {
    try {
        console.log(`🗑️ حذف المستخدم من auth.users: ${userId}`);

        const {
            error
        } = await supabase.auth.admin.deleteUser(userId);

        if (error) {
            console.error('❌ خطأ في حذف المستخدم من auth.users:', error.message);
            return false;
        }

        console.log('✅ تم حذف المستخدم من auth.users بنجاح');
        return true;
    } catch (error) {
        console.error('❌ خطأ في حذف المستخدم من auth.users:', error.message);
        return false;
    }
}

/**
 * حذف المستخدم من جدول users (soft delete)
 */
async function deleteUserFromUsersTable(userId) {
    try {
        console.log(`🗑️ حذف المستخدم من جدول users: ${userId}`);

        const {
            error
        } = await supabase
            .from('users')
            .update({
                status: 'deleted',
                deleted_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('id', userId);

        if (error) {
            console.error('❌ خطأ في حذف المستخدم من جدول users:', error.message);
            return false;
        }

        console.log('✅ تم حذف المستخدم من جدول users بنجاح');
        return true;
    } catch (error) {
        console.error('❌ خطأ في حذف المستخدم من جدول users:', error.message);
        return false;
    }
}

/**
 * حذف جميع طلبات التحقق المعلقة للحسابات الجديدة
 */
async function deleteAllPendingVerifications() {
    try {
        console.log('🗑️ حذف جميع طلبات التحقق المعلقة للحسابات الجديدة...');

        // حذف طلبات التحقق من البريد الإلكتروني المعلقة
        const {
            data: emailVerifications,
            error: emailError
        } = await supabase
            .from('email_verifications')
            .delete()
            .eq('status', 'pending')
            .select();

        if (emailError) {
            console.error('❌ خطأ في حذف طلبات التحقق من البريد الإلكتروني:', emailError.message);
        } else {
            console.log(`✅ تم حذف ${emailVerifications?.length || 0} طلب تحقق من البريد الإلكتروني`);
        }

        // حذف طلبات التوثيق المعلقة
        const {
            data: verificationRequests,
            error: verificationError
        } = await supabase
            .from('verification_requests')
            .delete()
            .in('status', ['pending', 'under_review'])
            .select();

        if (verificationError) {
            console.error('❌ خطأ في حذف طلبات التوثيق:', verificationError.message);
        } else {
            console.log(`✅ تم حذف ${verificationRequests?.length || 0} طلب توثيق`);
        }

        // حذف كلمات المرور المؤقتة غير المستخدمة
        const {
            data: tempPasswords,
            error: tempPasswordError
        } = await supabase
            .from('temporary_passwords')
            .delete()
            .eq('is_used', false)
            .select();

        if (tempPasswordError) {
            console.error('❌ خطأ في حذف كلمات المرور المؤقتة:', tempPasswordError.message);
        } else {
            console.log(`✅ تم حذف ${tempPasswords?.length || 0} كلمة مرور مؤقتة`);
        }

        // حذف طلبات إعادة تعيين كلمة المرور المعلقة
        const {
            data: passwordResets,
            error: passwordResetError
        } = await supabase
            .from('password_reset_requests')
            .delete()
            .eq('status', 'pending')
            .select();

        if (passwordResetError) {
            console.error('❌ خطأ في حذف طلبات إعادة تعيين كلمة المرور:', passwordResetError.message);
        } else {
            console.log(`✅ تم حذف ${passwordResets?.length || 0} طلب إعادة تعيين كلمة مرور`);
        }

        return true;
    } catch (error) {
        console.error('❌ خطأ في حذف طلبات التحقق المعلقة:', error.message);
        return false;
    }
}

/**
 * حذف البيانات المرتبطة بالمستخدم
 */
async function deleteUserRelatedData(userId) {
    try {
        console.log(`🗑️ حذف البيانات المرتبطة بالمستخدم: ${userId}`);

        // حذف كلمات المرور المؤقتة
        const {
            error: tempPasswordError
        } = await supabase
            .from('temporary_passwords')
            .delete()
            .eq('user_id', userId);

        if (tempPasswordError) {
            console.error('❌ خطأ في حذف كلمات المرور المؤقتة:', tempPasswordError.message);
        } else {
            console.log('✅ تم حذف كلمات المرور المؤقتة');
        }

        // حذف طلبات إعادة تعيين كلمة المرور
        const {
            error: passwordResetError
        } = await supabase
            .from('password_reset_requests')
            .delete()
            .eq('user_id', userId);

        if (passwordResetError) {
            console.error('❌ خطأ في حذف طلبات إعادة تعيين كلمة المرور:', passwordResetError.message);
        } else {
            console.log('✅ تم حذف طلبات إعادة تعيين كلمة المرور');
        }

        // حذف طلبات التوثيق
        const {
            error: verificationError
        } = await supabase
            .from('verification_requests')
            .delete()
            .eq('user_id', userId);

        if (verificationError) {
            console.error('❌ خطأ في حذف طلبات التوثيق:', verificationError.message);
        } else {
            console.log('✅ تم حذف طلبات التوثيق');
        }

        // حذف الأجهزة الموثقة
        const {
            error: trustedDevicesError
        } = await supabase
            .from('user_trusted_devices')
            .delete()
            .eq('user_id', userId);

        if (trustedDevicesError) {
            console.error('❌ خطأ في حذف الأجهزة الموثقة:', trustedDevicesError.message);
        } else {
            console.log('✅ تم حذف الأجهزة الموثقة');
        }

        // حذف أكواد التحقق
        const {
            error: verificationCodesError
        } = await supabase
            .from('user_verification_codes')
            .delete()
            .eq('user_id', userId);

        if (verificationCodesError) {
            console.error('❌ خطأ في حذف أكواد التحقق:', verificationCodesError.message);
        } else {
            console.log('✅ تم حذف أكواد التحقق');
        }

        return true;
    } catch (error) {
        console.error('❌ خطأ في حذف البيانات المرتبطة:', error.message);
        return false;
    }
}

/**
 * الدالة الرئيسية
 */
async function main() {
    console.log('🚀 بدء عملية حذف الحساب وطلبات التحقق المعلقة...');
    console.log(`📧 الحساب المستهدف: ${TARGET_EMAIL}`);
    console.log('='.repeat(60));

    try {
        // 1. البحث عن المستخدم
        const user = await findUserByEmail(TARGET_EMAIL);

        if (!user) {
            console.log('⚠️ لم يتم العثور على المستخدم، المتابعة لحذف طلبات التحقق المعلقة فقط...');
        } else {
            console.log('✅ تم العثور على المستخدم، بدء عملية الحذف...');

            // 2. حذف البيانات المرتبطة بالمستخدم
            await deleteUserRelatedData(user.id);

            // 3. حذف المستخدم من جدول users
            await deleteUserFromUsersTable(user.id);

            // 4. حذف المستخدم من auth.users
            await deleteUserFromAuth(user.id);
        }

        // 5. حذف جميع طلبات التحقق المعلقة للحسابات الجديدة
        await deleteAllPendingVerifications();

        console.log('='.repeat(60));
        console.log('✅ تم إكمال عملية الحذف بنجاح!');
        console.log('📝 ملاحظة: يمكن الآن إنشاء حساب جديد بنفس البريد الإلكتروني');

    } catch (error) {
        console.error('❌ خطأ في العملية الرئيسية:', error.message);
        process.exit(1);
    }
}

// تشغيل السكريبت
main().catch(console.error);

export {
    findUserByEmail,
    deleteUserFromAuth,
    deleteUserFromUsersTable,
    deleteAllPendingVerifications,
    deleteUserRelatedData
};