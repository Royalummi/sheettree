<?php

namespace App\Services;

use App\Models\User;
use App\Models\Notification;

/**
 * EmailService
 * 
 * Handles sending email notifications to users
 * Uses PHP's mail() function or can be extended to use PHPMailer, SendGrid, etc.
 */
class EmailService
{
    private $fromEmail;
    private $fromName;
    private $appUrl;

    public function __construct()
    {
        $this->fromEmail = getenv('MAIL_FROM_ADDRESS') ?: 'noreply@sheettree.com';
        $this->fromName = getenv('MAIL_FROM_NAME') ?: 'SheetTree';
        $this->appUrl = getenv('APP_URL') ?: 'http://localhost:8000';
    }

    /**
     * Send notification email to user
     * 
     * @param User $user The user to send email to
     * @param Notification $notification The notification data
     * @return bool Success status
     */
    public function sendNotificationEmail(User $user, Notification $notification): bool
    {
        // Check if user has email notifications enabled
        if (!$user->email_notifications_enabled) {
            return false;
        }

        // Check specific notification type preference
        $notificationTypeEnabled = $this->isNotificationTypeEnabled($user, $notification->type);
        if (!$notificationTypeEnabled) {
            return false;
        }

        $subject = $this->getEmailSubject($notification);
        $body = $this->getEmailBody($notification, $user);

        return $this->sendEmail($user->email, $user->name, $subject, $body);
    }

    /**
     * Check if specific notification type is enabled for user
     */
    private function isNotificationTypeEnabled(User $user, string $type): bool
    {
        $typeMap = [
            'form_submission' => 'notify_form_submission',
            'sheet_connection' => 'notify_sheet_connection',
            'form_status' => 'notify_form_status',
            'spam_detected' => 'notify_spam_detected',
            'api_limit' => 'notify_api_limit',
            'system' => 'notify_system'
        ];

        $field = $typeMap[$type] ?? null;
        if (!$field) {
            return false;
        }

        return (bool) $user->$field;
    }

    /**
     * Get email subject based on notification type
     */
    private function getEmailSubject(Notification $notification): string
    {
        $subjects = [
            'form_submission' => '📝 New Form Submission',
            'sheet_connection' => '🔗 Google Sheets Connection Update',
            'form_status' => '📋 Form Status Changed',
            'spam_detected' => '🚫 Spam Activity Detected',
            'api_limit' => '⚠️ API Usage Warning',
            'system' => '🔔 SheetTree Notification'
        ];

        $prefix = $subjects[$notification->type] ?? '🔔 SheetTree Notification';
        return $prefix . ': ' . $notification->title;
    }

    /**
     * Generate HTML email body
     */
    private function getEmailBody(Notification $notification, User $user): string
    {
        $frontendUrl = getenv('FRONTEND_URL') ?: 'http://localhost:5173';
        $notificationUrl = $frontendUrl . '/notifications';

        $metadata = $notification->metadata;
        $additionalInfo = $this->getAdditionalInfo($notification->type, $metadata);

        $userName = htmlspecialchars($user->name);
        $notificationType = htmlspecialchars($notification->type);
        $notificationTitle = htmlspecialchars($notification->title);
        $notificationMessage = htmlspecialchars($notification->message);

        $template = file_get_contents(__DIR__ . '/../Templates/email_notification.html');

        // If template file doesn't exist, use inline HTML
        if ($template === false) {
            $template = $this->getEmailTemplate();
        }

        $html = str_replace(
            ['{{userName}}', '{{notificationType}}', '{{notificationTitle}}', '{{notificationMessage}}', '{{additionalInfo}}', '{{notificationUrl}}', '{{frontendUrl}}'],
            [$userName, $notificationType, $notificationTitle, $notificationMessage, $additionalInfo, $notificationUrl, $frontendUrl],
            $template
        );

        return $html;
    }

    /**
     * Get email template HTML
     */
    private function getEmailTemplate(): string
    {
        return <<<'HTML'
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .content {
            padding: 30px 20px;
        }
        .notification-box {
            background-color: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 15px 20px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .notification-title {
            font-size: 18px;
            font-weight: 600;
            color: #1a202c;
            margin: 0 0 10px 0;
        }
        .notification-message {
            color: #4a5568;
            margin: 0;
        }
        .additional-info {
            background-color: #fff;
            border: 1px solid #e2e8f0;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .additional-info h3 {
            margin: 0 0 10px 0;
            font-size: 14px;
            color: #718096;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .button {
            display: inline-block;
            padding: 12px 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #718096;
            font-size: 14px;
        }
        .footer a {
            color: #667eea;
            text-decoration: none;
        }
        .badge {
            display: inline-block;
            padding: 4px 12px;
            background-color: #667eea;
            color: white;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌳 SheetTree</h1>
        </div>
        <div class="content">
            <p>Hi {{userName}},</p>
            
            <div class="notification-box">
                <div class="notification-title">
                    <span class="badge">{{notificationType}}</span><br>
                    {{notificationTitle}}
                </div>
                <p class="notification-message">{{notificationMessage}}</p>
            </div>

            {{additionalInfo}}
            
            <center>
                <a href="{{notificationUrl}}" class="button">View All Notifications</a>
            </center>
            
            <p style="color: #718096; font-size: 14px; margin-top: 30px;">
                This is an automated notification from SheetTree. 
                You can manage your notification preferences in your 
                <a href="{{frontendUrl}}/profile" style="color: #667eea;">profile settings</a>.
            </p>
        </div>
        <div class="footer">
            <p>
                © 2025 SheetTree. All rights reserved.<br>
                <a href="{{frontendUrl}}/profile">Notification Settings</a> | 
                <a href="{{frontendUrl}}">Dashboard</a>
            </p>
        </div>
    </div>
</body>
</html>
HTML;
    }

    /**
     * Get additional information based on notification type
     */
    private function getAdditionalInfo(string $type, ?array $metadata): string
    {
        if (!$metadata) {
            return '';
        }

        $html = '<div class="additional-info"><h3>Details</h3>';

        switch ($type) {
            case 'form_submission':
                if (isset($metadata['form_id'])) {
                    $html .= '<p><strong>Form ID:</strong> ' . htmlspecialchars($metadata['form_id']) . '</p>';
                }
                if (isset($metadata['submitter'])) {
                    $html .= '<p><strong>Submitter:</strong> ' . htmlspecialchars($metadata['submitter']) . '</p>';
                }
                if (isset($metadata['submission_id'])) {
                    $html .= '<p><strong>Submission ID:</strong> ' . htmlspecialchars($metadata['submission_id']) . '</p>';
                }
                break;

            case 'spam_detected':
                if (isset($metadata['spam_count'])) {
                    $html .= '<p><strong>Blocked Submissions:</strong> ' . htmlspecialchars($metadata['spam_count']) . '</p>';
                }
                if (isset($metadata['blocked_ips'])) {
                    $html .= '<p><strong>Blocked IPs:</strong> ' . htmlspecialchars(implode(', ', $metadata['blocked_ips'])) . '</p>';
                }
                break;

            case 'api_limit':
                if (isset($metadata['current_usage']) && isset($metadata['total_limit'])) {
                    $html .= '<p><strong>Usage:</strong> ' . htmlspecialchars($metadata['current_usage']) . ' / ' . htmlspecialchars($metadata['total_limit']) . '</p>';
                }
                if (isset($metadata['percentage'])) {
                    $html .= '<p><strong>Percentage Used:</strong> ' . htmlspecialchars($metadata['percentage']) . '%</p>';
                }
                break;

            case 'sheet_connection':
                if (isset($metadata['spreadsheet_id'])) {
                    $html .= '<p><strong>Spreadsheet ID:</strong> ' . htmlspecialchars($metadata['spreadsheet_id']) . '</p>';
                }
                if (isset($metadata['error'])) {
                    $html .= '<p><strong>Error:</strong> ' . htmlspecialchars($metadata['error']) . '</p>';
                }
                break;

            case 'form_status':
                if (isset($metadata['previous_status'])) {
                    $html .= '<p><strong>Previous Status:</strong> ' . htmlspecialchars($metadata['previous_status']) . '</p>';
                }
                break;
        }

        $html .= '</div>';
        return $html;
    }

    /**
     * Send email using PHP mail() function
     * Can be replaced with PHPMailer, SendGrid, etc.
     */
    private function sendEmail(string $to, string $toName, string $subject, string $htmlBody): bool
    {
        $headers = [
            'MIME-Version: 1.0',
            'Content-Type: text/html; charset=UTF-8',
            "From: {$this->fromName} <{$this->fromEmail}>",
            "Reply-To: {$this->fromEmail}",
            'X-Mailer: PHP/' . phpversion()
        ];

        $headersString = implode("\r\n", $headers);

        try {
            // In production, use a proper email service like SendGrid, AWS SES, etc.
            // For development, this will use PHP's mail() which requires a mail server
            $success = mail($to, $subject, $htmlBody, $headersString);

            // Log email sending attempt
            error_log(sprintf(
                "[EmailService] Sent email to %s (%s): %s - %s",
                $toName,
                $to,
                $subject,
                $success ? 'SUCCESS' : 'FAILED'
            ));

            return $success;
        } catch (\Exception $e) {
            error_log("[EmailService] Failed to send email: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Send a test email
     */
    public function sendTestEmail(string $to, string $name): bool
    {
        $subject = "🌳 SheetTree - Test Email";
        $escapedName = htmlspecialchars($name);

        $template = <<<'HTML'
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 20px auto; padding: 20px; background: #f5f5f5; }
        .content { background: white; padding: 30px; border-radius: 8px; }
        h1 { color: #667eea; }
    </style>
</head>
<body>
    <div class="container">
        <div class="content">
            <h1>✅ Email Notifications Are Working!</h1>
            <p>Hi {{userName}},</p>
            <p>This is a test email to confirm that your email notifications are working properly.</p>
            <p>You will now receive notifications for:</p>
            <ul>
                <li>📝 New form submissions</li>
                <li>🔗 Sheet connection updates</li>
                <li>📋 Form status changes</li>
                <li>🚫 Spam detection alerts</li>
                <li>⚠️ API usage warnings</li>
                <li>🔔 System announcements</li>
            </ul>
            <p>You can manage your notification preferences anytime in your profile settings.</p>
            <p>Best regards,<br>The SheetTree Team</p>
        </div>
    </div>
</body>
</html>
HTML;

        $body = str_replace('{{userName}}', $escapedName, $template);

        return $this->sendEmail($to, $name, $subject, $body);
    }
}
