<?php

namespace App\Helpers;

use App\Models\User;
use App\Models\Notification;
use App\Services\EmailService;

/**
 * NotificationHelper
 * 
 * Helper functions for creating and sending notifications
 */
class NotificationHelper
{
    /**
     * Create a notification and optionally send email
     * 
     * @param int $userId User ID to notify
     * @param string $type Notification type (form_submission, sheet_connection, etc.)
     * @param string $title Notification title
     * @param string $message Notification message
     * @param array|null $metadata Additional data
     * @param bool $sendEmail Whether to send email notification (default: true)
     * @return Notification|null
     */
    public static function create(
        int $userId,
        string $type,
        string $title,
        string $message,
        ?array $metadata = null,
        bool $sendEmail = true
    ): ?Notification {
        try {
            // Create notification in database
            $notification = Notification::create([
                'user_id' => $userId,
                'type' => $type,
                'title' => $title,
                'message' => $message,
                'metadata' => $metadata,
                'read' => false,
                'created_at' => new \DateTime()
            ]);

            // Send email if enabled
            if ($sendEmail && $notification) {
                self::sendEmailNotification($notification);
            }

            return $notification;
        } catch (\Exception $e) {
            error_log("[NotificationHelper] Failed to create notification: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Send email notification for an existing notification
     * 
     * @param Notification $notification
     * @return bool
     */
    public static function sendEmailNotification(Notification $notification): bool
    {
        try {
            $user = User::find($notification->user_id);
            if (!$user) {
                return false;
            }

            $emailService = new EmailService();
            return $emailService->sendNotificationEmail($user, $notification);
        } catch (\Exception $e) {
            error_log("[NotificationHelper] Failed to send email: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Create notification for new form submission
     */
    public static function notifyFormSubmission(
        int $userId,
        int $formId,
        string $formTitle,
        int $submissionId,
        ?string $submitterName = null
    ): ?Notification {
        $message = $submitterName
            ? "Your form \"{$formTitle}\" received a new submission from {$submitterName}"
            : "Your form \"{$formTitle}\" received a new submission";

        return self::create(
            $userId,
            'form_submission',
            'New Form Submission',
            $message,
            [
                'form_id' => $formId,
                'submission_id' => $submissionId,
                'submitter' => $submitterName
            ]
        );
    }

    /**
     * Create notification for sheet connection issue
     */
    public static function notifySheetConnection(
        int $userId,
        int $sheetId,
        string $sheetName,
        string $status,
        ?string $error = null
    ): ?Notification {
        $title = $status === 'success'
            ? 'Sheet Connection Refreshed'
            : 'Connection Issue';

        $message = $status === 'success'
            ? "Google Sheets connection for \"{$sheetName}\" was successfully refreshed"
            : "Failed to connect to Google Sheets \"{$sheetName}\"" . ($error ? " - {$error}" : "");

        return self::create(
            $userId,
            'sheet_connection',
            $title,
            $message,
            [
                'sheet_id' => $sheetId,
                'status' => $status,
                'error' => $error
            ]
        );
    }

    /**
     * Create notification for form status change
     */
    public static function notifyFormStatus(
        int $userId,
        int $formId,
        string $formTitle,
        string $newStatus,
        string $previousStatus
    ): ?Notification {
        $statusText = $newStatus === 'active' ? 'Activated' : 'Deactivated';
        $message = "Your form \"{$formTitle}\" is now {$newStatus}";

        if ($newStatus === 'active') {
            $message .= " and accepting submissions";
        }

        return self::create(
            $userId,
            'form_status',
            "Form {$statusText}",
            $message,
            [
                'form_id' => $formId,
                'new_status' => $newStatus,
                'previous_status' => $previousStatus
            ]
        );
    }

    /**
     * Create notification for spam detection
     */
    public static function notifySpamDetected(
        int $userId,
        int $formId,
        string $formTitle,
        int $spamCount,
        array $blockedIps = []
    ): ?Notification {
        $message = "{$spamCount} spam submissions were blocked on {$formTitle} in the last hour";

        return self::create(
            $userId,
            'spam_detected',
            'Spam Submissions Blocked',
            $message,
            [
                'form_id' => $formId,
                'spam_count' => $spamCount,
                'blocked_ips' => $blockedIps
            ]
        );
    }

    /**
     * Create notification for API limit warning
     */
    public static function notifyApiLimit(
        int $userId,
        int $currentUsage,
        int $totalLimit,
        int $percentage
    ): ?Notification {
        $message = "You have used {$percentage}% of your monthly API quota ({$currentUsage}/{$totalLimit} requests)";

        return self::create(
            $userId,
            'api_limit',
            'API Usage Warning',
            $message,
            [
                'current_usage' => $currentUsage,
                'total_limit' => $totalLimit,
                'percentage' => $percentage
            ]
        );
    }

    /**
     * Create system notification
     */
    public static function notifySystem(
        int $userId,
        string $title,
        string $message,
        ?array $metadata = null
    ): ?Notification {
        return self::create(
            $userId,
            'system',
            $title,
            $message,
            $metadata
        );
    }
}
