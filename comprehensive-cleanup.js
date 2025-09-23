/**
 * سكريبت تنظيف شامل لجميع الطلبات المعلقة
 * تاريخ الإنشاء: 09-08-2025
 * الغرض: حل مشكلة "يوجد طلب تحقق معلق" نهائياً
 */

import {
    createClient
} from '@supabase/supabase-js';

const supabaseUrl = 'https://sbtzngewizgeqzfbhfjy.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNidHpuZ2V3aXpnZXF6ZmJoZmp5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTEzNzkxMywiZXhwIjoyMDY2NzEzOTEzfQ.HhFFZyYcaYlrsllR5VZ0ppix8lOYGsso5IWCPsjP-3g';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

/**
 * حذف جميع طلبات التحقق من البريد الإلكتروني
 */
async function clearAllEmailVerifications() {
    try {
        console.log('🗑️ حذف جميع طلبات التحقق من البريد الإلكتروني...');

        // حذف جميع الطلبات (بغض النظر عن الحالة)
        const {
            data: deletedVerifications,
            error: deleteError
        } = await supabase
            .from('email_verifications')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000') // حذف جميع الطلبات
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
 * حذف جميع طلبات التوثيق
 */
async function clearAllVerificationRequests() {
    try {
        console.log('🗑️ حذف جميع طلبات التوثيق...');

        // حذف جميع الطلبات
        const {
            data: deletedRequests,
            error: deleteError
        } = await supabase
            .from('verification_requests')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000') // حذف جميع الطلبات
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
 * حذف جميع كلمات المرور المؤقتة
 */
async function clearAllTemporaryPasswords() {
    try {
        console.log('🗑️ حذف جميع كلمات المرور المؤقتة...');

        // حذف جميع كلمات المرور المؤقتة
        const {
            data: deletedPasswords,
            error: deleteError
        } = await supabase
            .from('temporary_passwords')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000') // حذف جميع الطلبات
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
 * حذف جميع طلبات إعادة تعيين كلمة المرور
 */
async function clearAllPasswordResetRequests() {
    try {
        console.log('🗑️ حذف جميع طلبات إعادة تعيين كلمة المرور...');

        // حذف جميع الطلبات
        const {
            data: deletedRequests,
            error: deleteError
        } = await supabase
            .from('password_reset_requests')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000') // حذف جميع الطلبات
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
 * حذف جميع طلبات تغيير البريد الإلكتروني
 */
async function clearAllEmailChangeRequests() {
    try {
        console.log('🗑️ حذف جميع طلبات تغيير البريد الإلكتروني...');

        // حذف جميع الطلبات
        const {
            data: deletedRequests,
            error: deleteError
        } = await supabase
            .from('email_change_requests')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000') // حذف جميع الطلبات
            .select();

        if (deleteError) {
            console.error('❌ خطأ في حذف طلبات تغيير البريد الإلكتروني:', deleteError.message);
            return {
                success: false,
                count: 0
            };
        }

        console.log(`✅ تم حذف ${deletedRequests ? deletedRequests.length : 0} طلب تغيير بريد إلكتروني`);
        return {
            success: true,
            count: deletedRequests ? deletedRequests.length : 0
        };

    } catch (error) {
        console.error('❌ خطأ في حذف طلبات تغيير البريد الإلكتروني:', error.message);
        return {
            success: false,
            count: 0
        };
    }
}

/**
 * حذف جميع الأجهزة الموثقة
 */
async function clearAllTrustedDevices() {
    try {
        console.log('🗑️ حذف جميع الأجهزة الموثقة...');

        // حذف جميع الأجهزة الموثقة للمستخدمين
        const {
            data: deletedDevices,
            error: deleteError
        } = await supabase
            .from('user_trusted_devices')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000') // حذف جميع الطلبات
            .select();

        if (deleteError) {
            console.error('❌ خطأ في حذف الأجهزة الموثقة:', deleteError.message);
            return {
                success: false,
                count: 0
            };
        }

        console.log(`✅ تم حذف ${deletedDevices ? deletedDevices.length : 0} جهاز موثق`);
        return {
            success: true,
            count: deletedDevices ? deletedDevices.length : 0
        };

    } catch (error) {
        console.error('❌ خطأ في حذف الأجهزة الموثقة:', error.message);
        return {
            success: false,
            count: 0
        };
    }
}

/**
 * حذف جميع أكواد التحقق
 */
async function clearAllVerificationCodes() {
    try {
        console.log('🗑️ حذف جميع أكواد التحقق...');

        // حذف جميع أكواد التحقق
        const {
            data: deletedCodes,
            error: deleteError
        } = await supabase
            .from('user_verification_codes')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000') // حذف جميع الطلبات
            .select();

        if (deleteError) {
            console.error('❌ خطأ في حذف أكواد التحقق:', deleteError.message);
            return {
                success: false,
                count: 0
            };
        }

        console.log(`✅ تم حذف ${deletedCodes ? deletedCodes.length : 0} كود تحقق`);
        return {
            success: true,
            count: deletedCodes ? deletedCodes.length : 0
        };

    } catch (error) {
        console.error('❌ خطأ في حذف أكواد التحقق:', error.message);
        return {
            success: false,
            count: 0
        };
    }
}

/**
 * فحص شامل لجميع الجداول بعد التنظيف
 */
async function checkAllTablesAfterCleanup() {
    try {
        console.log('🔍 فحص شامل لجميع الجداول بعد التنظيف...');

        const tables = [
            'email_verifications',
            'verification_requests',
            'temporary_passwords',
            'password_reset_requests',
            'email_change_requests',
            'user_trusted_devices',
            'user_verification_codes'
        ];

        let totalRemaining = 0;

        for (const table of tables) {
            try {
                const {
                    data,
                    error
                } = await supabase
                    .from(table)
                    .select('id')
                    .limit(1);

                if (error) {
                    console.log(`   ${table}: ❌ خطأ - ${error.message}`);
                } else {
                    const count = data ? data.length : 0;
                    console.log(`   ${table}: ${count} سجل`);
                    totalRemaining += count;
                }
            } catch (err) {
                console.log(`   ${table}: ❌ خطأ في الفحص`);
            }
        }

        console.log(`📊 إجمالي السجلات المتبقية: ${totalRemaining}`);
        return totalRemaining === 0;

    } catch (error) {
        console.error('❌ خطأ في الفحص الشامل:', error.message);
        return false;
    }
}

/**
 * الدالة الرئيسية
 */
async function main() {
    console.log('🚀 بدء التنظيف الشامل لجميع الطلبات المعلقة...');
    console.log('🎯 الهدف: حل مشكلة "يوجد طلب تحقق معلق" نهائياً');
    console.log('⚠️ تحذير: هذا سيمسح جميع الطلبات المعلقة من جميع الجداول');
    console.log('='.repeat(80));

    try {
        // 1. حذف جميع طلبات التحقق من البريد الإلكتروني
        console.log('📋 الخطوة 1: حذف جميع طلبات التحقق من البريد الإلكتروني');
        const emailResult = await clearAllEmailVerifications();

        console.log('='.repeat(80));

        // 2. حذف جميع طلبات التوثيق
        console.log('📋 الخطوة 2: حذف جميع طلبات التوثيق');
        const verificationResult = await clearAllVerificationRequests();

        console.log('='.repeat(80));

        // 3. حذف جميع كلمات المرور المؤقتة
        console.log('📋 الخطوة 3: حذف جميع كلمات المرور المؤقتة');
        const tempPasswordResult = await clearAllTemporaryPasswords();

        console.log('='.repeat(80));

        // 4. حذف جميع طلبات إعادة تعيين كلمة المرور
        console.log('📋 الخطوة 4: حذف جميع طلبات إعادة تعيين كلمة المرور');
        const passwordResetResult = await clearAllPasswordResetRequests();

        console.log('='.repeat(80));

        // 5. حذف جميع طلبات تغيير البريد الإلكتروني
        console.log('📋 الخطوة 5: حذف جميع طلبات تغيير البريد الإلكتروني');
        const emailChangeResult = await clearAllEmailChangeRequests();

        console.log('='.repeat(80));

        // 6. حذف جميع الأجهزة الموثقة
        console.log('📋 الخطوة 6: حذف جميع الأجهزة الموثقة');
        const trustedDevicesResult = await clearAllTrustedDevices();

        console.log('='.repeat(80));

        // 7. حذف جميع أكواد التحقق
        console.log('📋 الخطوة 7: حذف جميع أكواد التحقق');
        const verificationCodesResult = await clearAllVerificationCodes();

        console.log('='.repeat(80));

        // 8. فحص نهائي شامل
        console.log('📋 الخطوة 8: فحص نهائي شامل');
        const isClean = await checkAllTablesAfterCleanup();

        console.log('='.repeat(80));
        console.log('📊 ملخص النتائج:');
        console.log(`✅ طلبات تحقق البريد الإلكتروني المحذوفة: ${emailResult.count}`);
        console.log(`✅ طلبات التوثيق المحذوفة: ${verificationResult.count}`);
        console.log(`✅ كلمات المرور المؤقتة المحذوفة: ${tempPasswordResult.count}`);
        console.log(`✅ طلبات إعادة تعيين كلمة المرور المحذوفة: ${passwordResetResult.count}`);
        console.log(`✅ طلبات تغيير البريد الإلكتروني المحذوفة: ${emailChangeResult.count}`);
        console.log(`✅ الأجهزة الموثقة المحذوفة: ${trustedDevicesResult.count}`);
        console.log(`✅ أكواد التحقق المحذوفة: ${verificationCodesResult.count}`);

        const totalDeleted = emailResult.count + verificationResult.count +
            tempPasswordResult.count + passwordResetResult.count +
            emailChangeResult.count + trustedDevicesResult.count +
            verificationCodesResult.count;

        console.log(`📈 إجمالي السجلات المحذوفة: ${totalDeleted}`);

        if (isClean) {
            console.log('🎉 تم التنظيف الشامل بنجاح!');
            console.log('✅ جميع الجداول نظيفة من الطلبات المعلقة');
            console.log('✅ يمكن الآن إنشاء حسابات جديدة بدون مشاكل');
        } else {
            console.log('⚠️ لا تزال هناك بعض السجلات المتبقية');
            console.log('💡 قد تكون هناك جداول أخرى تحتاج تنظيف');
        }

    } catch (error) {
        console.error('❌ خطأ في العملية الرئيسية:', error.message);
    }
}

// تشغيل السكريبت
main().catch(console.error);

export {
    clearAllEmailVerifications,
    clearAllVerificationRequests,
    clearAllTemporaryPasswords,
    clearAllPasswordResetRequests,
    clearAllEmailChangeRequests,
    clearAllTrustedDevices,
    clearAllVerificationCodes,
    checkAllTablesAfterCleanup

