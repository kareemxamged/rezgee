<?php
/**
 * API endpoint لاختبار إرسال الإيميلات مع إعدادات SMTP المحددة في القوالب
 * Test Template Email API Endpoint
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// معالجة طلبات OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// التأكد من أن الطلب هو POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'error' => 'Method not allowed',
        'method' => 'API Validation'
    ]);
    exit();
}

try {
    // قراءة البيانات المرسلة
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        throw new Exception('Invalid JSON input');
    }
    
    // التحقق من البيانات المطلوبة
    $requiredFields = ['templateName', 'recipientEmail', 'templateData', 'language'];
    foreach ($requiredFields as $field) {
        if (!isset($input[$field])) {
            throw new Exception("Missing required field: $field");
        }
    }
    
    $templateName = $input['templateName'];
    $recipientEmail = $input['recipientEmail'];
    $templateData = $input['templateData'];
    $language = $input['language'] ?? 'ar';
    
    // محاكاة استدعاء UnifiedDatabaseEmailService
    $result = simulateTemplateEmailSending($templateName, $recipientEmail, $templateData, $language);
    
    // إرجاع النتيجة
    echo json_encode($result);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'method' => 'API Error'
    ]);
}

/**
 * محاكاة إرسال الإيميل باستخدام القالب
 */
function simulateTemplateEmailSending($templateName, $recipientEmail, $templateData, $language) {
    // محاكاة جلب القالب من قاعدة البيانات
    $template = getTemplateFromDatabase($templateName, $language);
    
    if (!$template) {
        return [
            'success' => false,
            'error' => "Template not found: $templateName",
            'method' => 'Template Lookup'
        ];
    }
    
    // محاكاة جلب إعدادات SMTP المحددة في القالب
    $smtpSettings = getSMTPForTemplate($template['id']);
    
    if (!$smtpSettings) {
        return [
            'success' => false,
            'error' => 'No SMTP settings found for template or default',
            'method' => 'SMTP Lookup'
        ];
    }
    
    // محاكاة معالجة القالب
    $processedTemplate = processTemplate($template, $templateData, $language);
    
    // محاكاة إرسال الإيميل
    $sendResult = simulateEmailSending($processedTemplate, $recipientEmail, $smtpSettings);
    
    return $sendResult;
}

/**
 * محاكاة جلب القالب من قاعدة البيانات
 */
function getTemplateFromDatabase($templateName, $language) {
    // محاكاة قاعدة البيانات
    $templates = [
        'login_success' => [
            'id' => '1f8d28f4-f98b-4322-a1d3-34cb6e5710ac',
            'name' => 'login_success',
            'name_ar' => 'تسجيل الدخول الناجح',
            'subject_ar' => 'تم تسجيل الدخول بنجاح - رزقي',
            'subject_en' => 'Login Successful - Rezge',
            'html_template_ar' => '<h1>مرحباً {{userName}}</h1><p>تم تسجيل الدخول بنجاح في {{timestamp}}</p>',
            'html_template_en' => '<h1>Hello {{userName}}</h1><p>Login successful at {{timestamp}}</p>',
            'smtp_settings_id' => '723ddbd8-bceb-4bdb-aafa-6160cedbe2da',
            'is_active' => true
        ],
        'welcome_new_user' => [
            'id' => '2a9e39g5-g99c-5433-b2e4-45dc7f6820bd',
            'name' => 'welcome_new_user',
            'name_ar' => 'ترحيب بالمستخدم الجديد',
            'subject_ar' => 'مرحباً بك في رزقي - منصة الزواج الإسلامي',
            'subject_en' => 'Welcome to Rezge - Islamic Marriage Platform',
            'html_template_ar' => '<h1>أهلاً وسهلاً {{userName}}</h1><p>نرحب بك في منصة رزقي للزواج الإسلامي</p>',
            'html_template_en' => '<h1>Welcome {{userName}}</h1><p>Welcome to Rezge Islamic Marriage Platform</p>',
            'smtp_settings_id' => '834eecf9-cdfc-5cec-bbfb-7271dfcef3eb',
            'is_active' => true
        ],
        'contact_form_message' => [
            'id' => '3b0f4ah6-h00d-6544-c3f5-56ed8g7931ce',
            'name' => 'contact_form_message',
            'name_ar' => 'رسالة التواصل',
            'subject_ar' => 'رسالة جديدة من {{senderName}} - رزقي',
            'subject_en' => 'New Message from {{senderName}} - Rezge',
            'html_template_ar' => '<h1>رسالة جديدة من {{senderName}}</h1><p>{{message}}</p>',
            'html_template_en' => '<h1>New Message from {{senderName}}</h1><p>{{message}}</p>',
            'contact_smtp_send_id' => '945ffdg0-defd-6dfd-ccgc-8382egdfg4fc',
            'contact_smtp_receive_id' => 'a56gggh1-efge-7ege-dded-9493fhgeh5gd',
            'is_active' => true
        ]
    ];
    
    return $templates[$templateName] ?? null;
}

/**
 * محاكاة جلب إعدادات SMTP للقالب
 */
function getSMTPForTemplate($templateId) {
    // محاكاة قاعدة البيانات
    $smtpSettings = [
        '723ddbd8-bceb-4bdb-aafa-6160cedbe2da' => [
            'id' => '723ddbd8-bceb-4bdb-aafa-6160cedbe2da',
            'smtp_host' => 'smtp.hostinger.com',
            'smtp_port' => 465,
            'smtp_username' => 'noreply@rezge.com',
            'smtp_password' => 'password123',
            'from_email' => 'noreply@rezge.com',
            'from_name_ar' => 'رزقي - منصة الزواج الإسلامي',
            'from_name_en' => 'Rezge - Islamic Marriage Platform',
            'reply_to' => 'support@rezge.com',
            'is_default' => false,
            'is_active' => true
        ],
        '834eecf9-cdfc-5cec-bbfb-7271dfcef3eb' => [
            'id' => '834eecf9-cdfc-5cec-bbfb-7271dfcef3eb',
            'smtp_host' => 'smtp.hostinger.com',
            'smtp_port' => 465,
            'smtp_username' => 'welcome@rezge.com',
            'smtp_password' => 'password456',
            'from_email' => 'welcome@rezge.com',
            'from_name_ar' => 'فريق الترحيب - رزقي',
            'from_name_en' => 'Welcome Team - Rezge',
            'reply_to' => 'welcome@rezge.com',
            'is_default' => false,
            'is_active' => true
        ],
        '945ffdg0-defd-6dfd-ccgc-8382egdfg4fc' => [
            'id' => '945ffdg0-defd-6dfd-ccgc-8382egdfg4fc',
            'smtp_host' => 'smtp.hostinger.com',
            'smtp_port' => 465,
            'smtp_username' => 'contact@rezge.com',
            'smtp_password' => 'password789',
            'from_email' => 'contact@rezge.com',
            'from_name_ar' => 'فريق التواصل - رزقي',
            'from_name_en' => 'Contact Team - Rezge',
            'reply_to' => 'contact@rezge.com',
            'is_default' => false,
            'is_active' => true
        ]
    ];
    
    return $smtpSettings[$templateId] ?? null;
}

/**
 * محاكاة معالجة القالب
 */
function processTemplate($template, $templateData, $language) {
    $subject = $language === 'ar' ? $template['subject_ar'] : $template['subject_en'];
    $htmlContent = $language === 'ar' ? $template['html_template_ar'] : $template['html_template_en'];
    
    // إضافة متغيرات افتراضية
    $defaultData = [
        'timestamp' => date('Y-m-d H:i:s'),
        'currentYear' => date('Y'),
        'platformName' => $language === 'ar' ? 'رزقي' : 'Rezge',
        'supportEmail' => 'support@rezge.com',
        'contactEmail' => 'contact@rezge.com',
        'baseUrl' => 'https://rezge.com',
        ...$templateData
    ];
    
    // استبدال المتغيرات
    foreach ($defaultData as $key => $value) {
        $subject = str_replace("{{$key}}", $value, $subject);
        $htmlContent = str_replace("{{$key}}", $value, $htmlContent);
    }
    
    return [
        'subject' => $subject,
        'htmlContent' => $htmlContent,
        'textContent' => strip_tags($htmlContent)
    ];
}

/**
 * محاكاة إرسال الإيميل
 */
function simulateEmailSending($template, $recipientEmail, $smtpSettings) {
    // محاكاة إرسال الإيميل
    $success = rand(0, 10) > 1; // 90% نجاح
    
    if ($success) {
        return [
            'success' => true,
            'method' => 'Template SMTP Simulation',
            'messageId' => 'msg_' . uniqid(),
            'smtpUsed' => [
                'host' => $smtpSettings['smtp_host'],
                'port' => $smtpSettings['smtp_port'],
                'from' => [
                    'email' => $smtpSettings['from_email'],
                    'name' => $smtpSettings['from_name_ar']
                ],
                'replyTo' => $smtpSettings['reply_to']
            ],
            'template' => [
                'subject' => $template['subject'],
                'recipient' => $recipientEmail
            ]
        ];
    } else {
        return [
            'success' => false,
            'error' => 'Simulated email sending failure',
            'method' => 'Template SMTP Simulation'
        ];
    }
}
?>


