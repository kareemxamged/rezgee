-- =====================================================
-- إضافة قوالب البلاغات (Reports)
-- =====================================================

-- 1. إضافة نوع إشعار استلام البلاغ
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
  'report_received',
  'إشعار استلام البلاغ',
  'Report Received Notification',
  'إشعار يتم إرساله للمستخدم عند استلام بلاغ ضده',
  'Notification sent to user when a report is received against them',
  true,
  NOW(),
  NOW()
);

-- 2. إضافة نوع إشعار حالة البلاغ (قبول/رفض)
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
  'report_status_update',
  'إشعار تحديث حالة البلاغ',
  'Report Status Update Notification',
  'إشعار يتم إرساله للمبلغ عند تحديث حالة البلاغ (قبول/رفض)',
  'Notification sent to reporter when report status is updated (accepted/rejected)',
  true,
  NOW(),
  NOW()
);

-- 3. إضافة قالب استلام البلاغ (العربية)
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
  'report_received',
  'إشعار استلام البلاغ',
  'Report Received Notification',
  '⚠️ تم استلام بلاغ ضدك - رزقي',
  '⚠️ Report Received Against You - Rezge',
  '⚠️ تم استلام بلاغ ضدك - رزقي

مرحباً {{userName}}،

تم استلام بلاغ ضدك في منصة رزقي للزواج الإسلامي.

تفاصيل البلاغ:
- نوع البلاغ: {{reportType}}
- وقت الاستلام: {{timestamp}}
- حالة البلاغ: قيد المراجعة

تنبيه مهم:
سيتم مراجعة هذا البلاغ من قبل فريق الإدارة. يرجى الالتزام بقوانين المنصة والآداب الإسلامية.

إذا كان لديك أي استفسارات أو تريد تقديم توضيحات، يمكنك التواصل مع فريق الدعم.

مع تحيات فريق رزقي',
  '⚠️ Report Received Against You - Rezge

Hello {{userName}},

A report has been received against you on Rezge Islamic marriage platform.

Report Details:
- Report Type: {{reportType}}
- Received Time: {{timestamp}}
- Report Status: Under Review

Important Notice:
This report will be reviewed by the management team. Please adhere to platform rules and Islamic etiquette.

If you have any questions or want to provide clarifications, you can contact the support team.

Best regards,
Rezge Team',
  '<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تم استلام بلاغ ضدك - رزقي</title>
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
            background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
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
            background-color: #fff3e0;
            border-color: #ff9800;
            color: #f57c00;
        }
        .alert-danger {
            background-color: #ffebee;
            border-color: #f44336;
            color: #d32f2f;
        }
        .details-box {
            background-color: #fff3e0;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-right: 4px solid #ff9800;
        }
        .details-box h3 {
            color: #f57c00;
            margin-top: 0;
        }
        .details-box ul {
            margin: 10px 0;
            padding-right: 20px;
        }
        .details-box li {
            margin: 10px 0;
            padding: 8px;
            background: white;
            border-radius: 6px;
            border-right: 3px solid #ff9800;
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
        .support-button {
            display: inline-block;
            background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 10px;
            font-weight: bold;
            font-size: 16px;
            box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⚠️ تم استلام بلاغ ضدك</h1>
            <p>إشعار من منصة رزقي</p>
        </div>
        
        <div class="content">
            <p>مرحباً <strong>{{userName}}</strong>،</p>
            
            <div class="alert alert-warning">
                <strong>تم استلام بلاغ ضدك في منصة رزقي</strong>
            </div>
            
            <div class="details-box">
                <h3>📋 تفاصيل البلاغ:</h3>
                <ul>
                    <li><strong>📝 نوع البلاغ:</strong> {{reportType}}</li>
                    <li><strong>🕐 وقت الاستلام:</strong> {{timestamp}}</li>
                    <li><strong>📊 حالة البلاغ:</strong> قيد المراجعة</li>
                </ul>
            </div>
            
            <div class="alert alert-danger">
                <h4>⚠️ تنبيه مهم:</h4>
                <p>سيتم مراجعة هذا البلاغ من قبل فريق الإدارة. يرجى الالتزام بقوانين المنصة والآداب الإسلامية.</p>
            </div>
            
            <div class="contact-info">
                <p><strong>📞 للدعم والمساعدة:</strong></p>
                <p>إذا كان لديك أي استفسارات أو تريد تقديم توضيحات</p>
                <a href="{{supportUrl}}" class="support-button">📞 التواصل مع الدعم</a>
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
    <title>Report Received Against You - Rezge</title>
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
            background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
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
            background-color: #fff3e0;
            border-color: #ff9800;
            color: #f57c00;
        }
        .alert-danger {
            background-color: #ffebee;
            border-color: #f44336;
            color: #d32f2f;
        }
        .details-box {
            background-color: #fff3e0;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #ff9800;
        }
        .details-box h3 {
            color: #f57c00;
            margin-top: 0;
        }
        .details-box ul {
            margin: 10px 0;
            padding-left: 20px;
        }
        .details-box li {
            margin: 10px 0;
            padding: 8px;
            background: white;
            border-radius: 6px;
            border-left: 3px solid #ff9800;
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
        .support-button {
            display: inline-block;
            background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 10px;
            font-weight: bold;
            font-size: 16px;
            box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⚠️ Report Received Against You</h1>
            <p>Notification from Rezge platform</p>
        </div>
        
        <div class="content">
            <p>Hello <strong>{{userName}}</strong>,</p>
            
            <div class="alert alert-warning">
                <strong>A report has been received against you on Rezge platform</strong>
            </div>
            
            <div class="details-box">
                <h3>📋 Report Details:</h3>
                <ul>
                    <li><strong>📝 Report Type:</strong> {{reportType}}</li>
                    <li><strong>🕐 Received Time:</strong> {{timestamp}}</li>
                    <li><strong>📊 Report Status:</strong> Under Review</li>
                </ul>
            </div>
            
            <div class="alert alert-danger">
                <h4>⚠️ Important Notice:</h4>
                <p>This report will be reviewed by the management team. Please adhere to platform rules and Islamic etiquette.</p>
            </div>
            
            <div class="contact-info">
                <p><strong>📞 For support and assistance:</strong></p>
                <p>If you have any questions or want to provide clarifications</p>
                <a href="{{supportUrl}}" class="support-button">📞 Contact Support</a>
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

-- 4. إضافة قالب تحديث حالة البلاغ (العربية)
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
  'report_status_update',
  'إشعار تحديث حالة البلاغ',
  'Report Status Update Notification',
  'تم تحديث حالة البلاغ - رزقي',
  'Report Status Updated - Rezge',
  'تم تحديث حالة البلاغ - رزقي

مرحباً {{userName}}،

تم تحديث حالة البلاغ الذي أرسلته في منصة رزقي.

تفاصيل البلاغ:
- نوع البلاغ: {{reportType}}
- الحالة الجديدة: {{status}}
- وقت القرار: {{timestamp}}

{{#if isAccepted}}
تم قبول البلاغ واتخاذ الإجراء المناسب. شكراً لك على مساهمتك في الحفاظ على بيئة آمنة.
{{else}}
بعد المراجعة، لم يتم اتخاذ إجراء على هذا البلاغ. إذا كان لديك مخاوف أخرى، يرجى التواصل معنا.
{{/if}}

مع تحيات فريق رزقي',
  'Report Status Updated - Rezge

Hello {{userName}},

The status of the report you submitted on Rezge platform has been updated.

Report Details:
- Report Type: {{reportType}}
- New Status: {{status}}
- Decision Time: {{timestamp}}

{{#if isAccepted}}
The report has been accepted and appropriate action has been taken. Thank you for your contribution to maintaining a safe environment.
{{else}}
After review, no action was taken on this report. If you have other concerns, please contact us.
{{/if}}

Best regards,
Rezge Team',
  '<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تم تحديث حالة البلاغ - رزقي</title>
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
        .header.rejected {
            background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
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
        .alert-danger {
            background-color: #ffebee;
            border-color: #f44336;
            color: #d32f2f;
        }
        .alert-info {
            background-color: #e3f2fd;
            border-color: #2196f3;
            color: #1565c0;
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
            margin: 10px 0;
            padding: 8px;
            background: white;
            border-radius: 6px;
            border-right: 3px solid #6c757d;
            color: #495057;
        }
        .status-box {
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-right: 4px solid;
        }
        .status-box.accepted {
            background-color: #e8f5e8;
            border-color: #4caf50;
        }
        .status-box.rejected {
            background-color: #f3e5f5;
            border-color: #9c27b0;
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
        <div class="header {{#if isAccepted}}accepted{{else}}rejected{{/if}}">
            <h1>{{#if isAccepted}}✅ تم قبول البلاغ{{else}}❌ تم رفض البلاغ{{/if}}</h1>
            <p>تحديث من منصة رزقي</p>
        </div>
        
        <div class="content">
            <p>مرحباً <strong>{{userName}}</strong>،</p>
            
            <div class="alert {{#if isAccepted}}alert-success{{else}}alert-danger{{/if}}">
                <strong>{{#if isAccepted}}تم قبول البلاغ واتخاذ الإجراء المناسب{{else}}تم رفض البلاغ بعد المراجعة{{/if}}</strong>
            </div>
            
            <div class="details-box">
                <h3>📋 تفاصيل البلاغ:</h3>
                <ul>
                    <li><strong>📝 نوع البلاغ:</strong> {{reportType}}</li>
                    <li><strong>📊 الحالة:</strong> {{status}}</li>
                    <li><strong>🕐 وقت القرار:</strong> {{timestamp}}</li>
                </ul>
            </div>
            
            <div class="status-box {{#if isAccepted}}accepted{{else}}rejected{{/if}}">
                <h4>{{#if isAccepted}}✅ تم اتخاذ إجراء{{else}}❌ لم يتم اتخاذ إجراء{{/if}}</h4>
                <p>
                    {{#if isAccepted}}
                    تم قبول البلاغ واتخاذ الإجراء المناسب. شكراً لك على مساهمتك في الحفاظ على بيئة آمنة.
                    {{else}}
                    بعد المراجعة، لم يتم اتخاذ إجراء على هذا البلاغ. إذا كان لديك مخاوف أخرى، يرجى التواصل معنا.
                    {{/if}}
                </p>
            </div>
            
            <div class="contact-info">
                <p><strong>📞 للدعم والمساعدة:</strong></p>
                <p>إذا كان لديك أي استفسارات إضافية</p>
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
    <title>Report Status Updated - Rezge</title>
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
        .header.rejected {
            background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
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
        .alert-danger {
            background-color: #ffebee;
            border-color: #f44336;
            color: #d32f2f;
        }
        .alert-info {
            background-color: #e3f2fd;
            border-color: #2196f3;
            color: #1565c0;
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
            margin: 10px 0;
            padding: 8px;
            background: white;
            border-radius: 6px;
            border-left: 3px solid #6c757d;
            color: #495057;
        }
        .status-box {
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid;
        }
        .status-box.accepted {
            background-color: #e8f5e8;
            border-color: #4caf50;
        }
        .status-box.rejected {
            background-color: #f3e5f5;
            border-color: #9c27b0;
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
        <div class="header {{#if isAccepted}}accepted{{else}}rejected{{/if}}">
            <h1>{{#if isAccepted}}✅ Report Accepted{{else}}❌ Report Rejected{{/if}}</h1>
            <p>Update from Rezge platform</p>
        </div>
        
        <div class="content">
            <p>Hello <strong>{{userName}}</strong>,</p>
            
            <div class="alert {{#if isAccepted}}alert-success{{else}}alert-danger{{/if}}">
                <strong>{{#if isAccepted}}Report accepted and appropriate action taken{{else}}Report rejected after review{{/if}}</strong>
            </div>
            
            <div class="details-box">
                <h3>📋 Report Details:</h3>
                <ul>
                    <li><strong>📝 Report Type:</strong> {{reportType}}</li>
                    <li><strong>📊 Status:</strong> {{status}}</li>
                    <li><strong>🕐 Decision Time:</strong> {{timestamp}}</li>
                </ul>
            </div>
            
            <div class="status-box {{#if isAccepted}}accepted{{else}}rejected{{/if}}">
                <h4>{{#if isAccepted}}✅ Action Taken{{else}}❌ No Action Taken{{/if}}</h4>
                <p>
                    {{#if isAccepted}}
                    The report has been accepted and appropriate action has been taken. Thank you for your contribution to maintaining a safe environment.
                    {{else}}
                    After review, no action was taken on this report. If you have other concerns, please contact us.
                    {{/if}}
                </p>
            </div>
            
            <div class="contact-info">
                <p><strong>📞 For support and assistance:</strong></p>
                <p>If you have any additional questions</p>
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

-- =====================================================
-- ملخص الإدراج
-- =====================================================
SELECT 
  'تم إدراج نوعي إشعار البلاغات:' as message,
  'report_received' as type1,
  'report_status_update' as type2;

SELECT 
  'تم إدراج قالبين للبلاغات:' as message,
  'report_received' as template1,
  'report_status_update' as template2;





