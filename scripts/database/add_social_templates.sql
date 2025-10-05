-- =====================================================
-- إضافة القوالب الاجتماعية (Social Templates)
-- =====================================================

-- 1. إضافة نوع إشعار الإعجاب
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
  'like_notification',
  'إشعار الإعجاب',
  'Like Notification',
  'إشعار يتم إرساله عند إعجاب شخص بالمستخدم',
  'Notification sent when someone likes the user',
  true,
  NOW(),
  NOW()
);

-- 2. إضافة نوع إشعار الرسالة الجديدة
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
  'new_message_notification',
  'إشعار الرسالة الجديدة',
  'New Message Notification',
  'إشعار يتم إرساله عند وصول رسالة جديدة للمستخدم',
  'Notification sent when a new message arrives for the user',
  true,
  NOW(),
  NOW()
);

-- 3. إضافة نوع إشعار المطابقة الجديدة
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
  'match_notification',
  'إشعار المطابقة الجديدة',
  'Match Notification',
  'إشعار يتم إرساله عند حدوث مطابقة جديدة بين المستخدمين',
  'Notification sent when a new match occurs between users',
  true,
  NOW(),
  NOW()
);

-- 4. إضافة قالب الإعجاب (العربية)
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
  'like_notification',
  'إشعار الإعجاب',
  'Like Notification',
  '💖 شخص جديد أعجب بك - رزقي',
  '💖 Someone New Liked You - Rezge',
  '💖 شخص جديد أعجب بك - رزقي

مرحباً {{userName}}،

شخص جديد أعجب بك في منصة رزقي!

معلومات المعجب:
- الاسم: {{likerName}}
- المدينة: {{likerCity}}
- العمر: {{likerAge}} سنة
- وقت الإعجاب: {{timestamp}}

هذا يعني أن شخصاً مهتماً بك ويريد التعرف عليك. يمكنك الآن مراجعة ملفه الشخصي والبدء في التواصل معه.

مع تحيات فريق رزقي',
  '💖 Someone New Liked You - Rezge

Hello {{userName}},

Someone new liked you on Rezge platform!

Liker Information:
- Name: {{likerName}}
- City: {{likerCity}}
- Age: {{likerAge}} years
- Like Time: {{timestamp}}

This means someone is interested in you and wants to get to know you. You can now review their profile and start communicating with them.

Best regards,
Rezge Team',
  '<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>شخص جديد أعجب بك - رزقي</title>
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
            background: linear-gradient(135deg, #e91e63 0%, #c2185b 100%);
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
        .alert-info {
            background-color: #fce4ec;
            border-color: #e91e63;
            color: #c2185b;
        }
        .liker-box {
            background-color: #fce4ec;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-right: 4px solid #e91e63;
        }
        .liker-box h3 {
            color: #c2185b;
            margin-top: 0;
        }
        .liker-box ul {
            margin: 10px 0;
            padding-right: 20px;
        }
        .liker-box li {
            margin: 10px 0;
            padding: 8px;
            background: white;
            border-radius: 6px;
            border-right: 3px solid #e91e63;
            color: #495057;
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
        .action-button {
            display: inline-block;
            background: linear-gradient(135deg, #e91e63 0%, #c2185b 100%);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 10px;
            font-weight: bold;
            font-size: 16px;
            box-shadow: 0 4px 15px rgba(233, 30, 99, 0.3);
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>💖 شخص جديد أعجب بك!</h1>
            <p>إشعار من منصة رزقي</p>
        </div>
        
        <div class="content">
            <p>مرحباً <strong>{{userName}}</strong>،</p>
            
            <div class="alert alert-info">
                <strong>شخص جديد أعجب بك في منصة رزقي!</strong>
            </div>
            
            <div class="liker-box">
                <h3>💖 معلومات المعجب:</h3>
                <ul>
                    <li><strong>👤 الاسم:</strong> {{likerName}}</li>
                    <li><strong>📍 المدينة:</strong> {{likerCity}}</li>
                    <li><strong>🎂 العمر:</strong> {{likerAge}} سنة</li>
                    <li><strong>🕐 وقت الإعجاب:</strong> {{timestamp}}</li>
                </ul>
            </div>
            
            <div style="text-align: center;">
                <a href="{{profileUrl}}" class="action-button">👀 مراجعة الملف الشخصي</a>
            </div>
            
            <p style="text-align: center; color: #6c757d; font-style: italic;">
                هذا يعني أن شخصاً مهتماً بك ويريد التعرف عليك. يمكنك الآن مراجعة ملفه الشخصي والبدء في التواصل معه.
            </p>
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
    <title>Someone New Liked You - Rezge</title>
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
            background: linear-gradient(135deg, #e91e63 0%, #c2185b 100%);
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
        .alert-info {
            background-color: #fce4ec;
            border-color: #e91e63;
            color: #c2185b;
        }
        .liker-box {
            background-color: #fce4ec;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #e91e63;
        }
        .liker-box h3 {
            color: #c2185b;
            margin-top: 0;
        }
        .liker-box ul {
            margin: 10px 0;
            padding-left: 20px;
        }
        .liker-box li {
            margin: 10px 0;
            padding: 8px;
            background: white;
            border-radius: 6px;
            border-left: 3px solid #e91e63;
            color: #495057;
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
        .action-button {
            display: inline-block;
            background: linear-gradient(135deg, #e91e63 0%, #c2185b 100%);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 10px;
            font-weight: bold;
            font-size: 16px;
            box-shadow: 0 4px 15px rgba(233, 30, 99, 0.3);
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>💖 Someone New Liked You!</h1>
            <p>Notification from Rezge platform</p>
        </div>
        
        <div class="content">
            <p>Hello <strong>{{userName}}</strong>,</p>
            
            <div class="alert alert-info">
                <strong>Someone new liked you on Rezge platform!</strong>
            </div>
            
            <div class="liker-box">
                <h3>💖 Liker Information:</h3>
                <ul>
                    <li><strong>👤 Name:</strong> {{likerName}}</li>
                    <li><strong>📍 City:</strong> {{likerCity}}</li>
                    <li><strong>🎂 Age:</strong> {{likerAge}} years</li>
                    <li><strong>🕐 Like Time:</strong> {{timestamp}}</li>
                </ul>
            </div>
            
            <div style="text-align: center;">
                <a href="{{profileUrl}}" class="action-button">👀 View Profile</a>
            </div>
            
            <p style="text-align: center; color: #6c757d; font-style: italic;">
                This means someone is interested in you and wants to get to know you. You can now review their profile and start communicating with them.
            </p>
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

-- 5. إضافة قالب الرسالة الجديدة (العربية)
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
  'new_message_notification',
  'إشعار الرسالة الجديدة',
  'New Message Notification',
  '💬 رسالة جديدة من {{senderName}} - رزقي',
  '💬 New Message from {{senderName}} - Rezge',
  '💬 رسالة جديدة من {{senderName}} - رزقي

مرحباً {{userName}}،

وصلتك رسالة جديدة في منصة رزقي!

معلومات المرسل:
- الاسم: {{senderName}}
- المدينة: {{senderCity}}
- العمر: {{senderAge}} سنة
- وقت الإرسال: {{timestamp}}

{{#if messagePreview}}
معاينة الرسالة:
"{{messagePreview}}"
{{/if}}

يمكنك الآن قراءة الرسالة الكاملة والرد عليها.

مع تحيات فريق رزقي',
  '💬 New Message from {{senderName}} - Rezge

Hello {{userName}},

You have a new message on Rezge platform!

Sender Information:
- Name: {{senderName}}
- City: {{senderCity}}
- Age: {{senderAge}} years
- Send Time: {{timestamp}}

{{#if messagePreview}}
Message Preview:
"{{messagePreview}}"
{{/if}}

You can now read the full message and reply to it.

Best regards,
Rezge Team',
  '<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>رسالة جديدة - رزقي</title>
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
            background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
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
        .alert-info {
            background-color: #e3f2fd;
            border-color: #2196f3;
            color: #1565c0;
        }
        .sender-box {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-right: 4px solid #6c757d;
        }
        .sender-box h3 {
            color: #495057;
            margin-top: 0;
        }
        .sender-box ul {
            margin: 10px 0;
            padding-right: 20px;
        }
        .sender-box li {
            margin: 10px 0;
            padding: 8px;
            background: white;
            border-radius: 6px;
            border-right: 3px solid #6c757d;
            color: #495057;
        }
        .message-preview {
            background-color: #e3f2fd;
            padding: 15px;
            border-radius: 6px;
            border-right: 4px solid #2196f3;
            margin: 20px 0;
        }
        .message-preview h4 {
            color: #1565c0;
            margin-top: 0;
        }
        .message-preview p {
            font-style: italic;
            margin: 0;
            color: #495057;
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
        .action-button {
            display: inline-block;
            background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 10px;
            font-weight: bold;
            font-size: 16px;
            box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3);
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>💬 رسالة جديدة</h1>
            <p>إشعار من منصة رزقي</p>
        </div>
        
        <div class="content">
            <p>مرحباً <strong>{{userName}}</strong>،</p>
            
            <div class="alert alert-info">
                <strong>وصلتك رسالة جديدة من {{senderName}}</strong>
            </div>
            
            <div class="sender-box">
                <h3>📨 معلومات المرسل:</h3>
                <ul>
                    <li><strong>📝 الاسم:</strong> {{senderName}}</li>
                    <li><strong>📍 المدينة:</strong> {{senderCity}}</li>
                    <li><strong>🎂 العمر:</strong> {{senderAge}} سنة</li>
                    <li><strong>📅 وقت الإرسال:</strong> {{timestamp}}</li>
                </ul>
            </div>
            
            {{#if messagePreview}}
            <div class="message-preview">
                <h4>📝 معاينة الرسالة:</h4>
                <p>"{{messagePreview}}"</p>
            </div>
            {{/if}}
            
            <div style="text-align: center;">
                <a href="{{messagesUrl}}" class="action-button">💬 قراءة الرسالة</a>
            </div>
            
            <p style="text-align: center; color: #6c757d; font-style: italic;">
                يمكنك الآن قراءة الرسالة الكاملة والرد عليها.
            </p>
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
    <title>New Message - Rezge</title>
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
            background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
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
        .alert-info {
            background-color: #e3f2fd;
            border-color: #2196f3;
            color: #1565c0;
        }
        .sender-box {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #6c757d;
        }
        .sender-box h3 {
            color: #495057;
            margin-top: 0;
        }
        .sender-box ul {
            margin: 10px 0;
            padding-left: 20px;
        }
        .sender-box li {
            margin: 10px 0;
            padding: 8px;
            background: white;
            border-radius: 6px;
            border-left: 3px solid #6c757d;
            color: #495057;
        }
        .message-preview {
            background-color: #e3f2fd;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #2196f3;
            margin: 20px 0;
        }
        .message-preview h4 {
            color: #1565c0;
            margin-top: 0;
        }
        .message-preview p {
            font-style: italic;
            margin: 0;
            color: #495057;
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
        .action-button {
            display: inline-block;
            background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 10px;
            font-weight: bold;
            font-size: 16px;
            box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3);
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>💬 New Message</h1>
            <p>Notification from Rezge platform</p>
        </div>
        
        <div class="content">
            <p>Hello <strong>{{userName}}</strong>,</p>
            
            <div class="alert alert-info">
                <strong>You have a new message from {{senderName}}</strong>
            </div>
            
            <div class="sender-box">
                <h3>📨 Sender Information:</h3>
                <ul>
                    <li><strong>📝 Name:</strong> {{senderName}}</li>
                    <li><strong>📍 City:</strong> {{senderCity}}</li>
                    <li><strong>🎂 Age:</strong> {{senderAge}} years</li>
                    <li><strong>📅 Send Time:</strong> {{timestamp}}</li>
                </ul>
            </div>
            
            {{#if messagePreview}}
            <div class="message-preview">
                <h4>📝 Message Preview:</h4>
                <p>"{{messagePreview}}"</p>
            </div>
            {{/if}}
            
            <div style="text-align: center;">
                <a href="{{messagesUrl}}" class="action-button">💬 Read Message</a>
            </div>
            
            <p style="text-align: center; color: #6c757d; font-style: italic;">
                You can now read the full message and reply to it.
            </p>
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

-- 6. إضافة قالب المطابقة الجديدة (العربية)
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
  'match_notification',
  'إشعار المطابقة الجديدة',
  'Match Notification',
  '✨ مطابقة جديدة! - رزقي',
  '✨ New Match! - Rezge',
  '✨ مطابقة جديدة! - رزقي

مرحباً {{userName}}،

تهانينا! لديك مطابقة جديدة في منصة رزقي!

معلومات المطابقة:
- الاسم: {{matchName}}
- المدينة: {{matchCity}}
- العمر: {{matchAge}} سنة
- وقت المطابقة: {{timestamp}}

هذا يعني أن كلاكما أعجب بالآخر! يمكنك الآن البدء في التواصل معه.

مع تحيات فريق رزقي',
  '✨ New Match! - Rezge

Hello {{userName}},

Congratulations! You have a new match on Rezge platform!

Match Information:
- Name: {{matchName}}
- City: {{matchCity}}
- Age: {{matchAge}} years
- Match Time: {{timestamp}}

This means you both liked each other! You can now start communicating with them.

Best regards,
Rezge Team',
  '<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>مطابقة جديدة - رزقي</title>
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
            background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
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
            background-color: #e8f5e8;
            border-color: #4caf50;
            color: #2e7d32;
        }
        .match-box {
            background-color: #e8f5e8;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-right: 4px solid #4caf50;
        }
        .match-box h3 {
            color: #2e7d32;
            margin-top: 0;
        }
        .match-box ul {
            margin: 10px 0;
            padding-right: 20px;
        }
        .match-box li {
            margin: 10px 0;
            padding: 8px;
            background: white;
            border-radius: 6px;
            border-right: 3px solid #4caf50;
            color: #495057;
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
        .action-button {
            display: inline-block;
            background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 10px;
            font-weight: bold;
            font-size: 16px;
            box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✨ مطابقة جديدة!</h1>
            <p>تهانينا من منصة رزقي</p>
        </div>
        
        <div class="content">
            <p>مرحباً <strong>{{userName}}</strong>،</p>
            
            <div class="alert alert-success">
                <strong>تهانينا! لديك مطابقة جديدة في منصة رزقي!</strong>
            </div>
            
            <div class="match-box">
                <h3>✨ معلومات المطابقة:</h3>
                <ul>
                    <li><strong>👤 الاسم:</strong> {{matchName}}</li>
                    <li><strong>📍 المدينة:</strong> {{matchCity}}</li>
                    <li><strong>🎂 العمر:</strong> {{matchAge}} سنة</li>
                    <li><strong>🕐 وقت المطابقة:</strong> {{timestamp}}</li>
                </ul>
            </div>
            
            <div style="text-align: center;">
                <a href="{{profileUrl}}" class="action-button">💬 بدء المحادثة</a>
            </div>
            
            <p style="text-align: center; color: #6c757d; font-style: italic;">
                هذا يعني أن كلاكما أعجب بالآخر! يمكنك الآن البدء في التواصل معه.
            </p>
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
    <title>New Match - Rezge</title>
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
            background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
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
            background-color: #e8f5e8;
            border-color: #4caf50;
            color: #2e7d32;
        }
        .match-box {
            background-color: #e8f5e8;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #4caf50;
        }
        .match-box h3 {
            color: #2e7d32;
            margin-top: 0;
        }
        .match-box ul {
            margin: 10px 0;
            padding-left: 20px;
        }
        .match-box li {
            margin: 10px 0;
            padding: 8px;
            background: white;
            border-radius: 6px;
            border-left: 3px solid #4caf50;
            color: #495057;
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
        .action-button {
            display: inline-block;
            background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 10px;
            font-weight: bold;
            font-size: 16px;
            box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✨ New Match!</h1>
            <p>Congratulations from Rezge platform</p>
        </div>
        
        <div class="content">
            <p>Hello <strong>{{userName}}</strong>,</p>
            
            <div class="alert alert-success">
                <strong>Congratulations! You have a new match on Rezge platform!</strong>
            </div>
            
            <div class="match-box">
                <h3>✨ Match Information:</h3>
                <ul>
                    <li><strong>👤 Name:</strong> {{matchName}}</li>
                    <li><strong>📍 City:</strong> {{matchCity}}</li>
                    <li><strong>🎂 Age:</strong> {{matchAge}} years</li>
                    <li><strong>🕐 Match Time:</strong> {{timestamp}}</li>
                </ul>
            </div>
            
            <div style="text-align: center;">
                <a href="{{profileUrl}}" class="action-button">💬 Start Conversation</a>
            </div>
            
            <p style="text-align: center; color: #6c757d; font-style: italic;">
                This means you both liked each other! You can now start communicating with them.
            </p>
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
  'تم إدراج ثلاثة أنواع إشعارات اجتماعية:' as message,
  'like_notification' as type1,
  'new_message_notification' as type2,
  'match_notification' as type3;

SELECT 
  'تم إدراج ثلاثة قوالب اجتماعية:' as message,
  'like_notification' as template1,
  'new_message_notification' as template2,
  'match_notification' as template3;







