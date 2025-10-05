-- إدراج قالب فورم "اتصل بنا" في قاعدة البيانات
-- هذا القالب يستخدمه النظام عند إرسال رسالة من فورم التواصل

BEGIN;

-- إدراج نوع الإشعار أولاً
INSERT INTO email_notification_types (name, name_ar, name_en, description_ar, description_en, is_active, created_at, updated_at)
VALUES (
    'contact_form',
    'فورم اتصل بنا',
    'Contact Form',
    'إشعار إرسال عند استلام رسالة من فورم اتصل بنا',
    'Notification sent when contact form message is received',
    true,
    NOW(),
    NOW()
);

-- إدراج قالب فورم "اتصل بنا" - النسخة العربية
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
    'contact_form',
    'فورم اتصل بنا',
    'Contact Form',
    'رسالة تواصل جديدة من {{senderName}} - {{subject}}',
    'New Contact Message from {{senderName}} - {{subject}}',
    'رسالة تواصل جديدة من موقع رزقي

تم استلام رسالة تواصل جديدة من موقع رزقي للزواج الإسلامي.

تفاصيل المرسل:
- الاسم: {{senderName}}
- البريد الإلكتروني: {{senderEmail}}
- رقم الهاتف: {{senderPhone}}
- الموضوع: {{subject}}

الرسالة:
{{message}}

تاريخ الإرسال : {{timestamp}}
المصدر: موقع رزقي - نموذج اتصل بنا
للرد: يمكنك الرد مباشرة على {{senderEmail}}

---
فريق رزقي - موقع الزواج الإسلامي الشرعي',
    'New Contact Message from Rezge Website

A new contact message has been received from Rezge Islamic marriage website.

Sender Details:
- Name: {{senderName}}
- Email: {{senderEmail}}
- Phone: {{senderPhone}}
- Subject: {{subject}}

Message:
{{message}}

Sent Date : {{timestamp}}
Source: Rezge Website - Contact Form
Reply To: You can reply directly to {{senderEmail}}

---
Rezge Team - Islamic Marriage Platform',
    '<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>رسالة تواصل جديدة - رزقي</title>
    <style>
        @import url(''https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap'');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            margin: 0; padding: 0; font-family: ''Amiri'', serif;
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            padding: 40px 20px; min-height: 100vh; line-height: 1.6;
        }
        .container {
            max-width: 600px; margin: 0 auto; background: white;
            border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden; border: 1px solid rgba(0,0,0,0.05);
        }
        .header {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            padding: 40px 30px; text-align: center; color: white;
        }
        .logo { font-size: 32px; font-weight: bold; margin: 0; }
        .tagline { font-size: 16px; margin: 10px 0 0 0; opacity: 0.9; }
        .content { padding: 40px 30px; }
        .content h2 { color: #2563eb; font-size: 24px; margin: 0 0 20px 0; text-align: center; }
        .content p { color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0; }
        .alert-info {
            background: #dbeafe; border-radius: 10px; padding: 20px;
            margin: 20px 0; border-right: 4px solid #2563eb;
        }
        .alert-info h3 { color: #1e40af; font-size: 18px; margin: 0 0 15px 0; }
        .alert-info p { color: #1e40af; line-height: 1.8; font-size: 15px; margin: 8px 0; }
        .sender-details {
            background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0;
        }
        .sender-details h3 { color: #374151; font-size: 18px; margin: 0 0 15px 0; }
        .sender-details ul { color: #6b7280; line-height: 1.8; }
        .sender-details li { margin-bottom: 8px; }
        .message-content {
            background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0;
        }
        .message-content h3 { color: #374151; font-size: 18px; margin: 0 0 15px 0; }
        .message-box {
            background-color: #ffffff; padding: 15px; border-radius: 6px;
            border-right: 4px solid #2563eb; margin-top: 10px;
            color: #374151; line-height: 1.8;
        }
        .message-info {
            background-color: #e3f2fd; padding: 20px; border-radius: 6px; margin: 20px 0;
        }
        .message-info p { color: #1e40af; margin: 8px 0; }
        .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #6b7280; font-size: 14px; }
        .footer .small { font-size: 12px; margin: 5px 0 0 0; opacity: 0.8; }
        @media (max-width: 600px) {
            .container { margin: 10px; border-radius: 15px; }
            .header, .content, .footer { padding: 20px; }
            .content h2 { font-size: 20px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="logo">📬 رزقي</h1>
            <p class="tagline">رسالة تواصل جديدة</p>
        </div>
        <div class="content">
            <h2>📬 رسالة تواصل جديدة</h2>
            <div class="alert-info">
                <h3>تم استلام رسالة تواصل جديدة من موقع رزقي</h3>
                <p>تم استلام رسالة جديدة من فورم "اتصل بنا" في موقع رزقي للزواج الإسلامي</p>
            </div>
            <div class="sender-details">
                <h3>📋 تفاصيل المرسل:</h3>
                <ul>
                    <li><strong>الاسم:</strong> {{senderName}}</li>
                    <li><strong>البريد الإلكتروني:</strong> {{senderEmail}}</li>
                    <li><strong>رقم الهاتف:</strong> {{senderPhone}}</li>
                    <li><strong>الموضوع:</strong> {{subject}}</li>
                </ul>
            </div>
            <div class="message-content">
                <h3>💬 الرسالة:</h3>
                <div class="message-box">
                    {{message}}
                </div>
            </div>
            <div class="message-info">
                <p><strong>📅 تاريخ الإرسال :</strong> {{timestamp}}</p>
                <p><strong>📧 للرد:</strong> يمكنك الرد مباشرة على {{senderEmail}}</p>
                <p><strong>🌐 المصدر:</strong> موقع رزقي - نموذج اتصل بنا</p>
            </div>
        </div>
        <div class="footer">
            <p>فريق رزقي - موقع الزواج الإسلامي الشرعي</p>
            <p class="small">هذا إيميل تلقائي، يرجى عدم الرد عليه مباشرة</p>
        </div>
    </div>
</body>
</html>',
    '<!DOCTYPE html>
<html dir="ltr" lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Message - Rezge</title>
    <style>
        @import url(''https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap'');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            margin: 0; padding: 0; font-family: ''Inter'', sans-serif;
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            padding: 40px 20px; min-height: 100vh; line-height: 1.6;
        }
        .container {
            max-width: 600px; margin: 0 auto; background: white;
            border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden; border: 1px solid rgba(0,0,0,0.05);
        }
        .header {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            padding: 40px 30px; text-align: center; color: white;
        }
        .logo { font-size: 32px; font-weight: bold; margin: 0; }
        .tagline { font-size: 16px; margin: 10px 0 0 0; opacity: 0.9; }
        .content { padding: 40px 30px; }
        .content h2 { color: #2563eb; font-size: 24px; margin: 0 0 20px 0; text-align: center; }
        .content p { color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0; }
        .alert-info {
            background: #dbeafe; border-radius: 10px; padding: 20px;
            margin: 20px 0; border-left: 4px solid #2563eb;
        }
        .alert-info h3 { color: #1e40af; font-size: 18px; margin: 0 0 15px 0; }
        .alert-info p { color: #1e40af; line-height: 1.8; font-size: 15px; margin: 8px 0; }
        .sender-details {
            background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0;
        }
        .sender-details h3 { color: #374151; font-size: 18px; margin: 0 0 15px 0; }
        .sender-details ul { color: #6b7280; line-height: 1.8; }
        .sender-details li { margin-bottom: 8px; }
        .message-content {
            background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0;
        }
        .message-content h3 { color: #374151; font-size: 18px; margin: 0 0 15px 0; }
        .message-box {
            background-color: #ffffff; padding: 15px; border-radius: 6px;
            border-left: 4px solid #2563eb; margin-top: 10px;
            color: #374151; line-height: 1.8;
        }
        .message-info {
            background-color: #e3f2fd; padding: 20px; border-radius: 6px; margin: 20px 0;
        }
        .message-info p { color: #1e40af; margin: 8px 0; }
        .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #6b7280; font-size: 14px; }
        .footer .small { font-size: 12px; margin: 5px 0 0 0; opacity: 0.8; }
        @media (max-width: 600px) {
            .container { margin: 10px; border-radius: 15px; }
            .header, .content, .footer { padding: 20px; }
            .content h2 { font-size: 20px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="logo">📬 Rezge</h1>
            <p class="tagline">New Contact Message</p>
        </div>
        <div class="content">
            <h2>📬 New Contact Message</h2>
            <div class="alert-info">
                <h3>New contact message received from Rezge website</h3>
                <p>A new message has been received from the contact form on Rezge Islamic marriage website</p>
            </div>
            <div class="sender-details">
                <h3>📋 Sender Details:</h3>
                <ul>
                    <li><strong>Name:</strong> {{senderName}}</li>
                    <li><strong>Email:</strong> {{senderEmail}}</li>
                    <li><strong>Phone:</strong> {{senderPhone}}</li>
                    <li><strong>Subject:</strong> {{subject}}</li>
                </ul>
            </div>
            <div class="message-content">
                <h3>💬 Message:</h3>
                <div class="message-box">
                    {{message}}
                </div>
            </div>
            <div class="message-info">
                <p><strong>📅 Sent Date :</strong> {{timestamp}}</p>
                <p><strong>📧 Reply To:</strong> You can reply directly to {{senderEmail}}</p>
                <p><strong>🌐 Source:</strong> Rezge Website - Contact Form</p>
            </div>
        </div>
        <div class="footer">
            <p>Rezge Team - Islamic Marriage Platform</p>
            <p class="small">This is an automated email, please do not reply directly</p>
        </div>
    </div>
</body>
</html>',
    true,
    NOW(),
    NOW()
);

-- عرض النتائج
SELECT 
    'تم إدراج قالب فورم "اتصل بنا" بنجاح' as status;

SELECT 
    name,
    name_ar,
    name_en,
    subject_ar,
    subject_en,
    is_active,
    created_at
FROM email_templates 
WHERE name = 'contact_form';

SELECT 
    name,
    name_ar,
    name_en,
    description_ar,
    description_en,
    is_active,
    created_at
FROM email_notification_types 
WHERE name = 'contact_form';

COMMIT;







