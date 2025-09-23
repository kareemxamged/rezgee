-- =====================================================
-- إضافة قوالب المصادقة الثنائية والترحيب بالمستخدمين الجدد
-- =====================================================

-- 1. إضافة نوع إشعار تعطيل المصادقة الثنائية
INSERT INTO email_notification_types (
  name,
  name_ar,
  name_en,
  description_ar,
  description_en,
  is_active,
  created_at,
  updated_at
) VALUES (
  'two_factor_disable_notification',
  'إشعار تعطيل المصادقة الثنائية',
  'Two-Factor Authentication Disable Notification',
  'إشعار يتم إرساله عند تعطيل المصادقة الثنائية للمستخدم',
  'Notification sent when user disables two-factor authentication',
  true,
  NOW(),
  NOW()
);

-- 2. إضافة نوع إشعار الترحيب بالمستخدمين الجدد
INSERT INTO email_notification_types (
  name,
  name_ar,
  name_en,
  description_ar,
  description_en,
  is_active,
  created_at,
  updated_at
) VALUES (
  'welcome_new_user',
  'إشعار ترحيب المستخدمين الجدد',
  'Welcome New User Notification',
  'إشعار ترحيبي يتم إرساله للمستخدمين الجدد عند إنشاء حسابهم',
  'Welcome notification sent to new users when they create their account',
  true,
  NOW(),
  NOW()
);

-- 3. إضافة قالب تعطيل المصادقة الثنائية (العربية)
INSERT INTO email_templates (
  name,
  name_ar,
  name_en,
  subject_ar,
  subject_en,
  content_ar,
  content_en,
  html_template_ar,
  html_template_en,
  is_active,
  created_at,
  updated_at
) VALUES (
  'two_factor_disable_notification',
  'إشعار تعطيل المصادقة الثنائية',
  'Two-Factor Authentication Disable Notification',
  'تم تعطيل المصادقة الثنائية - رزقي',
  'Two-Factor Authentication Disabled - Rezge',
  'تم تعطيل المصادقة الثنائية - رزقي

مرحباً {{userName}}،

تم تعطيل المصادقة الثنائية لحسابك في موقع رزقي للزواج الإسلامي.

تفاصيل التعطيل:
- التاريخ والوقت : {{timestamp}}
- البريد الإلكتروني: {{userEmail}}
- مستوى الحماية: عادي (تم تقليله)

تحذير أمني:
تعطيل المصادقة الثنائية يقلل من مستوى أمان حسابك:
- لن تحتاج لكود تحقق عند تسجيل الدخول
- حسابك أصبح أقل حماية من الاختراق
- ننصح بإعادة تفعيل المصادقة الثنائية

إذا لم تقم بهذا الإجراء:
إذا لم تقم بتعطيل المصادقة الثنائية، يرجى:
- تغيير كلمة المرور فوراً
- إعادة تفعيل المصادقة الثنائية
- التواصل معنا على {{contactEmail}}

مع تحيات فريق رزقي',
  'Two-Factor Authentication Disabled - Rezge

Hello {{userName}},

Two-factor authentication has been disabled for your account on Rezge Islamic marriage platform.

Disable Details:
- Date and Time : {{timestamp}}
- Email: {{userEmail}}
- Security Level: Normal (reduced)

Security Warning:
Disabling two-factor authentication reduces your account security:
- You will not need verification code when logging in
- Your account is now less protected from hacking
- We recommend re-enabling two-factor authentication

If you did not perform this action:
If you did not disable two-factor authentication, please:
- Change your password immediately
- Re-enable two-factor authentication
- Contact us at {{contactEmail}}

Best regards,
Rezge Team',
  '<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تم تعطيل المصادقة الثنائية - رزقي</title>
    <style>
        body {
            font-family: ''Cairo'', ''Segoe UI'', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            direction: rtl;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
            padding: 30px;
            text-align: center;
            color: white;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
        }
        .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
            font-size: 16px;
        }
        .content {
            padding: 30px;
        }
        .alert {
            padding: 15px;
            margin: 20px 0;
            border-radius: 8px;
            border-right: 4px solid;
        }
        .alert-warning {
            background-color: #fff3cd;
            border-color: #ffc107;
            color: #856404;
        }
        .alert-danger {
            background-color: #f8d7da;
            border-color: #dc3545;
            color: #721c24;
        }
        .details-box {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-right: 4px solid #6c757d;
        }
        .details-box h3 {
            color: #495057;
            margin-top: 0;
        }
        .details-box ul {
            margin: 10px 0;
            padding-right: 20px;
        }
        .details-box li {
            margin: 8px 0;
            color: #6c757d;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #dee2e6;
        }
        .footer p {
            margin: 5px 0;
            color: #6c757d;
            font-size: 14px;
        }
        .contact-info {
            background-color: #e9ecef;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
        }
        .contact-info a {
            color: #007bff;
            text-decoration: none;
            font-weight: bold;
        }
        .contact-info a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔓 تم تعطيل المصادقة الثنائية</h1>
            <p>إشعار أمني من منصة رزقي</p>
        </div>
        
        <div class="content">
            <p>مرحباً <strong>{{userName}}</strong>،</p>
            
            <div class="alert alert-warning">
                <strong>تم تعطيل المصادقة الثنائية لحسابك</strong>
            </div>
            
            <div class="details-box">
                <h3>📋 تفاصيل التعطيل:</h3>
                <ul>
                    <li><strong>📅 التاريخ والوقت :</strong> {{timestamp}}</li>
                    <li><strong>📧 البريد الإلكتروني:</strong> {{userEmail}}</li>
                    <li><strong>🔒 مستوى الحماية:</strong> عادي (تم تقليله)</li>
                </ul>
            </div>
            
            <div class="alert alert-warning">
                <h3>⚠️ تحذير أمني</h3>
                <p>تعطيل المصادقة الثنائية يقلل من مستوى أمان حسابك:</p>
                <ul>
                    <li>لن تحتاج لكود تحقق عند تسجيل الدخول</li>
                    <li>حسابك أصبح أقل حماية من الاختراق</li>
                    <li>ننصح بإعادة تفعيل المصادقة الثنائية</li>
                </ul>
            </div>
            
            <div class="alert alert-danger">
                <h3>🚨 إذا لم تقم بهذا الإجراء</h3>
                <p>إذا لم تقم بتعطيل المصادقة الثنائية، يرجى:</p>
                <ul>
                    <li>تغيير كلمة المرور فوراً</li>
                    <li>إعادة تفعيل المصادقة الثنائية</li>
                    <li>التواصل معنا على {{contactEmail}}</li>
                </ul>
            </div>
            
            <div class="contact-info">
                <p><strong>📞 للدعم والمساعدة:</strong></p>
                <p>البريد الإلكتروني: <a href="mailto:{{contactEmail}}">{{contactEmail}}</a></p>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>فريق رزقي - منصة الزواج الإسلامي الشرعي</strong></p>
            <p>هذا إيميل تلقائي، يرجى عدم الرد عليه مباشرة</p>
        </div>
    </div>
</body>
</html>',
  '<!DOCTYPE html>
<html dir="ltr" lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Two-Factor Authentication Disabled - Rezge</title>
    <style>
        body {
            font-family: ''Inter'', ''Segoe UI'', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            direction: ltr;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
            padding: 30px;
            text-align: center;
            color: white;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
        }
        .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
            font-size: 16px;
        }
        .content {
            padding: 30px;
        }
        .alert {
            padding: 15px;
            margin: 20px 0;
            border-radius: 8px;
            border-left: 4px solid;
        }
        .alert-warning {
            background-color: #fff3cd;
            border-color: #ffc107;
            color: #856404;
        }
        .alert-danger {
            background-color: #f8d7da;
            border-color: #dc3545;
            color: #721c24;
        }
        .details-box {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #6c757d;
        }
        .details-box h3 {
            color: #495057;
            margin-top: 0;
        }
        .details-box ul {
            margin: 10px 0;
            padding-left: 20px;
        }
        .details-box li {
            margin: 8px 0;
            color: #6c757d;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #dee2e6;
        }
        .footer p {
            margin: 5px 0;
            color: #6c757d;
            font-size: 14px;
        }
        .contact-info {
            background-color: #e9ecef;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
        }
        .contact-info a {
            color: #007bff;
            text-decoration: none;
            font-weight: bold;
        }
        .contact-info a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔓 Two-Factor Authentication Disabled</h1>
            <p>Security notification from Rezge platform</p>
        </div>
        
        <div class="content">
            <p>Hello <strong>{{userName}}</strong>,</p>
            
            <div class="alert alert-warning">
                <strong>Two-factor authentication has been disabled for your account</strong>
            </div>
            
            <div class="details-box">
                <h3>📋 Disable Details:</h3>
                <ul>
                    <li><strong>📅 Date and Time :</strong> {{timestamp}}</li>
                    <li><strong>📧 Email:</strong> {{userEmail}}</li>
                    <li><strong>🔒 Security Level:</strong> Normal (reduced)</li>
                </ul>
            </div>
            
            <div class="alert alert-warning">
                <h3>⚠️ Security Warning</h3>
                <p>Disabling two-factor authentication reduces your account security:</p>
                <ul>
                    <li>You will not need verification code when logging in</li>
                    <li>Your account is now less protected from hacking</li>
                    <li>We recommend re-enabling two-factor authentication</li>
                </ul>
            </div>
            
            <div class="alert alert-danger">
                <h3>🚨 If you did not perform this action</h3>
                <p>If you did not disable two-factor authentication, please:</p>
                <ul>
                    <li>Change your password immediately</li>
                    <li>Re-enable two-factor authentication</li>
                    <li>Contact us at {{contactEmail}}</li>
                </ul>
            </div>
            
            <div class="contact-info">
                <p><strong>📞 For support and assistance:</strong></p>
                <p>Email: <a href="mailto:{{contactEmail}}">{{contactEmail}}</a></p>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>Rezge Team - Islamic Marriage Platform</strong></p>
            <p>This is an automated email, please do not reply directly</p>
        </div>
    </div>
</body>
</html>',
  true,
  NOW(),
  NOW()
);

-- 4. إضافة قالب الترحيب بالمستخدمين الجدد (العربية)
INSERT INTO email_templates (
  name,
  name_ar,
  name_en,
  subject_ar,
  subject_en,
  content_ar,
  content_en,
  html_template_ar,
  html_template_en,
  is_active,
  created_at,
  updated_at
) VALUES (
  'welcome_new_user',
  'إشعار ترحيب المستخدمين الجدد',
  'Welcome New User Notification',
  'مرحباً بك في رزقي - منصة التعارف الإسلامية',
  'Welcome to Rezge - Islamic Marriage Platform',
  'مرحباً بك في رزقي - منصة التعارف الإسلامية

مرحباً {{userName}}،

تم إنشاء حسابك بنجاح في منصة رزقي!

نرحب بك في منصة رزقي، المنصة الإسلامية الرائدة للتعارف والزواج الحلال المتوافق مع الشريعة الإسلامية.

الخطوات التالية لإكمال ملفك:
- إكمال البيانات الشخصية والدينية
- إضافة صورة شخصية محتشمة
- تحديد مواصفات شريك الحياة المطلوب
- البدء في البحث والتصفح
- كتابة نبذة تعريفية جذابة

قيمنا الإسلامية:
- الالتزام بالآداب الإسلامية في التعامل
- الهدف من التعارف هو الزواج الحلال
- احترام الخصوصية والحدود الشرعية
- التواصل المحترم والهادف

نصائح الأمان والخصوصية:
- فعّل المصادقة الثنائية لحماية إضافية
- استخدم كلمة مرور قوية ومعقدة
- لا تشارك معلوماتك الشخصية في البداية
- أبلغ عن أي سلوك مشبوه أو غير لائق
- تأكد من صحة المعلومات قبل اللقاء

الدعم والمساعدة:
فريق الدعم متاح لمساعدتك في أي وقت على {{contactEmail}}

بارك الله لك وبارك عليك، ونتمنى لك التوفيق في العثور على شريك حياتك

مع تحيات فريق رزقي',
  'Welcome to Rezge - Islamic Marriage Platform

Hello {{userName}},

Your account has been successfully created on Rezge!

Welcome to Rezge, the leading Islamic platform for halal marriage and relationships that comply with Islamic law.

Next steps to complete your profile:
- Complete personal and religious information
- Add a modest personal photo
- Specify desired life partner characteristics
- Start searching and browsing
- Write an attractive introductory biography

Our Islamic values:
- Commitment to Islamic etiquette in interaction
- The goal of acquaintance is halal marriage
- Respect for privacy and Sharia boundaries
- Respectful and purposeful communication

Security and privacy tips:
- Enable two-factor authentication for additional protection
- Use a strong and complex password
- Do not share your personal information initially
- Report any suspicious or inappropriate behavior
- Verify information before meeting

Support and assistance:
Our support team is available to help you anytime at {{contactEmail}}

May Allah bless you and grant you success in finding your life partner

Best regards,
Rezge Team',
  '<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>مرحباً بك في رزقي - منصة التعارف الإسلامية</title>
    <style>
        body {
            font-family: ''Cairo'', ''Segoe UI'', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            direction: rtl;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            padding: 30px;
            text-align: center;
            color: white;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
        }
        .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
            font-size: 16px;
        }
        .content {
            padding: 30px;
        }
        .alert {
            padding: 15px;
            margin: 20px 0;
            border-radius: 8px;
            border-right: 4px solid;
        }
        .alert-success {
            background-color: #d4edda;
            border-color: #28a745;
            color: #155724;
        }
        .alert-info {
            background-color: #d1ecf1;
            border-color: #17a2b8;
            color: #0c5460;
        }
        .steps-box {
            background-color: #e8f5e8;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-right: 4px solid #28a745;
        }
        .values-box {
            background-color: #fff3cd;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-right: 4px solid #ffc107;
        }
        .security-box {
            background-color: #d1ecf1;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-right: 4px solid #17a2b8;
        }
        .support-box {
            background-color: #e2e3e5;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-right: 4px solid #6c757d;
        }
        .blessing-box {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
            border: 2px solid #28a745;
        }
        .blessing-box p {
            font-size: 18px;
            color: #28a745;
            font-weight: bold;
            margin: 0;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #dee2e6;
        }
        .footer p {
            margin: 5px 0;
            color: #6c757d;
            font-size: 14px;
        }
        .contact-info {
            background-color: #e9ecef;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
        }
        .contact-info a {
            color: #007bff;
            text-decoration: none;
            font-weight: bold;
        }
        .contact-info a:hover {
            text-decoration: underline;
        }
        ul {
            margin: 10px 0;
            padding-right: 20px;
        }
        li {
            margin: 8px 0;
            color: #495057;
        }
        h3 {
            color: #495057;
            margin-top: 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌟 مرحباً بك في رزقي</h1>
            <p>منصة التعارف والزواج الإسلامي الشرعي</p>
        </div>
        
        <div class="content">
            <p>مرحباً <strong>{{userName}}</strong>،</p>
            
            <div class="alert alert-success">
                <strong>تم إنشاء حسابك بنجاح في منصة رزقي!</strong>
            </div>
            
            <p>نرحب بك في منصة رزقي، المنصة الإسلامية الرائدة للتعارف والزواج الحلال المتوافق مع الشريعة الإسلامية.</p>
            
            <div class="steps-box">
                <h3>🎯 الخطوات التالية لإكمال ملفك:</h3>
                <ul>
                    <li>✅ إكمال البيانات الشخصية والدينية</li>
                    <li>📸 إضافة صورة شخصية محتشمة</li>
                    <li>💍 تحديد مواصفات شريك الحياة المطلوب</li>
                    <li>🔍 البدء في البحث والتصفح</li>
                    <li>📝 كتابة نبذة تعريفية جذابة</li>
                </ul>
            </div>
            
            <div class="values-box">
                <h3>🕌 قيمنا الإسلامية:</h3>
                <ul>
                    <li>الالتزام بالآداب الإسلامية في التعامل</li>
                    <li>الهدف من التعارف هو الزواج الحلال</li>
                    <li>احترام الخصوصية والحدود الشرعية</li>
                    <li>التواصل المحترم والهادف</li>
                </ul>
            </div>
            
            <div class="security-box">
                <h3>🔒 نصائح الأمان والخصوصية:</h3>
                <ul>
                    <li>🔐 فعّل المصادقة الثنائية لحماية إضافية</li>
                    <li>🔑 استخدم كلمة مرور قوية ومعقدة</li>
                    <li>🚫 لا تشارك معلوماتك الشخصية في البداية</li>
                    <li>⚠️ أبلغ عن أي سلوك مشبوه أو غير لائق</li>
                    <li>📞 تأكد من صحة المعلومات قبل اللقاء</li>
                </ul>
            </div>
            
            <div class="support-box">
                <h3>📞 الدعم والمساعدة:</h3>
                <p>فريق الدعم متاح لمساعدتك في أي وقت:</p>
                <ul>
                    <li>📧 البريد الإلكتروني: {{contactEmail}}</li>
                    <li>💬 الدردشة المباشرة عبر الموقع</li>
                    <li>📚 مركز المساعدة والأسئلة الشائعة</li>
                </ul>
            </div>
            
            <div class="blessing-box">
                <p>🤲 بارك الله لك وبارك عليك، ونتمنى لك التوفيق في العثور على شريك حياتك</p>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>فريق رزقي - منصة الزواج الإسلامي الشرعي</strong></p>
            <p>هذا إيميل تلقائي، يرجى عدم الرد عليه مباشرة</p>
        </div>
    </div>
</body>
</html>',
  '<!DOCTYPE html>
<html dir="ltr" lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Rezge - Islamic Marriage Platform</title>
    <style>
        body {
            font-family: ''Inter'', ''Segoe UI'', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            direction: ltr;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            padding: 30px;
            text-align: center;
            color: white;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
        }
        .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
            font-size: 16px;
        }
        .content {
            padding: 30px;
        }
        .alert {
            padding: 15px;
            margin: 20px 0;
            border-radius: 8px;
            border-left: 4px solid;
        }
        .alert-success {
            background-color: #d4edda;
            border-color: #28a745;
            color: #155724;
        }
        .alert-info {
            background-color: #d1ecf1;
            border-color: #17a2b8;
            color: #0c5460;
        }
        .steps-box {
            background-color: #e8f5e8;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #28a745;
        }
        .values-box {
            background-color: #fff3cd;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #ffc107;
        }
        .security-box {
            background-color: #d1ecf1;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #17a2b8;
        }
        .support-box {
            background-color: #e2e3e5;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #6c757d;
        }
        .blessing-box {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
            border: 2px solid #28a745;
        }
        .blessing-box p {
            font-size: 18px;
            color: #28a745;
            font-weight: bold;
            margin: 0;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #dee2e6;
        }
        .footer p {
            margin: 5px 0;
            color: #6c757d;
            font-size: 14px;
        }
        .contact-info {
            background-color: #e9ecef;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
        }
        .contact-info a {
            color: #007bff;
            text-decoration: none;
            font-weight: bold;
        }
        .contact-info a:hover {
            text-decoration: underline;
        }
        ul {
            margin: 10px 0;
            padding-left: 20px;
        }
        li {
            margin: 8px 0;
            color: #495057;
        }
        h3 {
            color: #495057;
            margin-top: 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌟 Welcome to Rezge</h1>
            <p>Islamic Marriage and Relationship Platform</p>
        </div>
        
        <div class="content">
            <p>Hello <strong>{{userName}}</strong>,</p>
            
            <div class="alert alert-success">
                <strong>Your account has been successfully created on Rezge!</strong>
            </div>
            
            <p>Welcome to Rezge, the leading Islamic platform for halal marriage and relationships that comply with Islamic law.</p>
            
            <div class="steps-box">
                <h3>🎯 Next steps to complete your profile:</h3>
                <ul>
                    <li>✅ Complete personal and religious information</li>
                    <li>📸 Add a modest personal photo</li>
                    <li>💍 Specify desired life partner characteristics</li>
                    <li>🔍 Start searching and browsing</li>
                    <li>📝 Write an attractive introductory biography</li>
                </ul>
            </div>
            
            <div class="values-box">
                <h3>🕌 Our Islamic values:</h3>
                <ul>
                    <li>Commitment to Islamic etiquette in interaction</li>
                    <li>The goal of acquaintance is halal marriage</li>
                    <li>Respect for privacy and Sharia boundaries</li>
                    <li>Respectful and purposeful communication</li>
                </ul>
            </div>
            
            <div class="security-box">
                <h3>🔒 Security and privacy tips:</h3>
                <ul>
                    <li>🔐 Enable two-factor authentication for additional protection</li>
                    <li>🔑 Use a strong and complex password</li>
                    <li>🚫 Do not share your personal information initially</li>
                    <li>⚠️ Report any suspicious or inappropriate behavior</li>
                    <li>📞 Verify information before meeting</li>
                </ul>
            </div>
            
            <div class="support-box">
                <h3>📞 Support and assistance:</h3>
                <p>Our support team is available to help you anytime:</p>
                <ul>
                    <li>📧 Email: {{contactEmail}}</li>
                    <li>💬 Live chat through the website</li>
                    <li>📚 Help center and frequently asked questions</li>
                </ul>
            </div>
            
            <div class="blessing-box">
                <p>🤲 May Allah bless you and grant you success in finding your life partner</p>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>Rezge Team - Islamic Marriage Platform</strong></p>
            <p>This is an automated email, please do not reply directly</p>
        </div>
    </div>
</body>
</html>',
  true,
  NOW(),
  NOW()
);

-- =====================================================
-- ملخص الإدراج
-- =====================================================
SELECT 
  'تم إدراج نوعي إشعار جديدين:' as message,
  'two_factor_disable_notification' as type1,
  'welcome_new_user' as type2;

SELECT 
  'تم إدراج قالبين جديدين:' as message,
  'two_factor_disable_notification' as template1,
  'welcome_new_user' as template2;







