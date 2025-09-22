<?php
/**
 * إرسال إيميل باستخدام قالب مع إعدادات SMTP محددة
 * Template-based Email Sending with Custom SMTP Settings
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle CORS preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit();
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON input']);
    exit();
}

// Validate required fields
$requiredFields = ['to', 'subject', 'html', 'smtpConfig'];
foreach ($requiredFields as $field) {
    if (!isset($input[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => "Missing required field: $field"]);
        exit();
    }
}

$to = $input['to'];
$subject = $input['subject'];
$html = $input['html'];
$text = $input['text'] ?? strip_tags($html);
$smtpConfig = $input['smtpConfig'];

// Validate email
if (!filter_var($to, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid email address']);
    exit();
}

// Validate SMTP config
$requiredSMTPFields = ['host', 'port', 'auth'];
foreach ($requiredSMTPFields as $field) {
    if (!isset($smtpConfig[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => "Missing SMTP config field: $field"]);
        exit();
    }
}

try {
    // Log email attempt
    logEmailAttempt($to, $subject, false, 'Starting template SMTP attempt');

    // Check for PHPMailer
    if (!class_exists('PHPMailer\PHPMailer\PHPMailer')) {
        // Try to load PHPMailer via Composer
        if (file_exists(__DIR__ . '/../../vendor/autoload.php')) {
            require_once __DIR__ . '/../../vendor/autoload.php';
        } elseif (file_exists(__DIR__ . '/../vendor/autoload.php')) {
            require_once __DIR__ . '/../vendor/autoload.php';
        } else {
            // Use simple mail() function as fallback
            $fallbackResult = sendWithMailFunction($to, $subject, $html, $smtpConfig);
            logEmailAttempt($to, $subject, $fallbackResult['success'], $fallbackResult['error'] ?? 'mail() fallback');
            echo json_encode($fallbackResult);
            exit();
        }
    }

    // Use PHPMailer
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\SMTP;
    use PHPMailer\PHPMailer\Exception;

    $mail = new PHPMailer(true);

    // SMTP settings from template
    $mail->isSMTP();
    $mail->Host = $smtpConfig['host'];
    $mail->SMTPAuth = true;
    $mail->Username = $smtpConfig['auth']['user'];
    $mail->Password = $smtpConfig['auth']['pass'];
    $mail->SMTPSecure = $smtpConfig['secure'] ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = $smtpConfig['port'];

    // Email settings from template
    $fromName = $smtpConfig['from']['name'] ?? 'رزقي - منصة الزواج الإسلامي';
    $fromEmail = $smtpConfig['from']['email'] ?? $smtpConfig['auth']['user'];
    $replyTo = $smtpConfig['replyTo'] ?? $fromEmail;
    
    // Log SMTP config for debugging
    error_log("Template SMTP Config: " . json_encode([
        'host' => $smtpConfig['host'],
        'port' => $smtpConfig['port'],
        'from_name' => $fromName,
        'from_email' => $fromEmail,
        'reply_to' => $replyTo
    ]));

    $mail->setFrom($fromEmail, $fromName);
    $mail->addReplyTo($replyTo);
    $mail->addAddress($to);
    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body = $html;
    $mail->AltBody = $text;
    $mail->CharSet = 'UTF-8';

    // Send email
    $mail->send();

    // Log success
    logEmailAttempt($to, $subject, true, 'Template SMTP success');

    echo json_encode([
        'success' => true,
        'message' => 'Email sent successfully using template SMTP settings',
        'method' => 'Template SMTP',
        'smtp_host' => $smtpConfig['host'],
        'smtp_port' => $smtpConfig['port'],
        'from_email' => $fromEmail,
        'from_name' => $fromName
    ]);

} catch (Exception $e) {
    // Log failure
    logEmailAttempt($to, $subject, false, 'Template SMTP failed: ' . $e->getMessage());

    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to send email: ' . $e->getMessage(),
        'method' => 'Template SMTP'
    ]);
}

/**
 * Log email attempt
 */
function logEmailAttempt($to, $subject, $success, $message) {
    $logEntry = [
        'timestamp' => date('Y-m-d H:i:s'),
        'to' => $to,
        'subject' => $subject,
        'success' => $success ? 'true' : 'false',
        'message' => $message
    ];
    
    // Log to file
    $logFile = __DIR__ . '/../../logs/template-email.log';
    $logDir = dirname($logFile);
    if (!is_dir($logDir)) {
        mkdir($logDir, 0755, true);
    }
    
    file_put_contents($logFile, json_encode($logEntry) . "\n", FILE_APPEND | LOCK_EX);
    
    // Also log to error log for debugging
    error_log("Template Email: " . json_encode($logEntry));
}

/**
 * Send email using simple mail() function as fallback
 */
function sendWithMailFunction($to, $subject, $html, $smtpConfig) {
    try {
        $fromName = $smtpConfig['from']['name'] ?? 'رزقي';
        $fromEmail = $smtpConfig['from']['email'] ?? $smtpConfig['auth']['user'];
        $replyTo = $smtpConfig['replyTo'] ?? $fromEmail;
        
        $headers = [
            'MIME-Version: 1.0',
            'Content-type: text/html; charset=UTF-8',
            'From: ' . $fromName . ' <' . $fromEmail . '>',
            'Reply-To: ' . $replyTo
        ];
        
        $result = mail($to, $subject, $html, implode("\r\n", $headers));
        
        return [
            'success' => $result,
            'message' => $result ? 'Email sent via mail() function' : 'Failed to send via mail() function',
            'method' => 'mail() fallback'
        ];
    } catch (Exception $e) {
        return [
            'success' => false,
            'error' => 'mail() function failed: ' . $e->getMessage(),
            'method' => 'mail() fallback'
        ];
    }
}
?>
