<?php

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Models\Notification;

/**
 * NotificationController
 * 
 * Handles user notifications for various events:
 * - Form submissions
 * - Sheet connection status
 * - Form status changes
 * - API rate limits
 * - Spam detection
 * - System announcements
 * 
 * TODO: Implement this controller
 * 1. Create notifications table in database
 * 2. Add notification creation logic in relevant controllers
 * 3. Implement real-time notifications with WebSocket or polling
 */
class NotificationController
{
    /**
     * Get all notifications for the authenticated user
     * GET /notifications
     */
    public function getNotifications(Request $request, Response $response): Response
    {
        try {
            $userId = $request->getAttribute('user_id');
            $queryParams = $request->getQueryParams();

            // Pagination
            $page = isset($queryParams['page']) ? (int)$queryParams['page'] : 1;
            $limit = isset($queryParams['limit']) ? min((int)$queryParams['limit'], 100) : 50;
            $offset = ($page - 1) * $limit;

            // Filter by read/unread
            $filter = $queryParams['filter'] ?? 'all'; // all, unread, read

            $query = Notification::where('user_id', $userId)
                ->orderBy('created_at', 'desc');

            if ($filter === 'unread') {
                $query->where('read', false);
            } elseif ($filter === 'read') {
                $query->where('read', true);
            }

            $total = $query->count();
            $notifications = $query->skip($offset)->take($limit)->get();

            // Count unread
            $unreadCount = Notification::where('user_id', $userId)
                ->where('read', false)
                ->count();

            $response->getBody()->write(json_encode([
                'notifications' => $notifications,
                'unreadCount' => $unreadCount,
                'pagination' => [
                    'page' => $page,
                    'limit' => $limit,
                    'total' => $total,
                    'total_pages' => ceil($total / $limit)
                ]
            ]));

            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'error' => 'Failed to fetch notifications: ' . $e->getMessage()
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Mark a notification as read
     * PUT /notifications/{id}/read
     */
    public function markAsRead(Request $request, Response $response, array $args): Response
    {
        try {
            $userId = $request->getAttribute('user_id');
            $notificationId = $args['id'];

            $notification = Notification::where('id', $notificationId)
                ->where('user_id', $userId)
                ->first();

            if (!$notification) {
                $response->getBody()->write(json_encode([
                    'error' => 'Notification not found'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $notification->read = true;
            $notification->read_at = new \DateTime();
            $notification->save();

            $response->getBody()->write(json_encode([
                'message' => 'Notification marked as read',
                'notification' => $notification
            ]));

            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'error' => 'Failed to mark notification as read: ' . $e->getMessage()
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Mark all notifications as read
     * PUT /notifications/read-all
     */
    public function markAllAsRead(Request $request, Response $response): Response
    {
        try {
            $userId = $request->getAttribute('user_id');

            Notification::where('user_id', $userId)
                ->where('read', false)
                ->update([
                    'read' => true,
                    'read_at' => new \DateTime()
                ]);

            $response->getBody()->write(json_encode([
                'message' => 'All notifications marked as read'
            ]));

            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'error' => 'Failed to mark all as read: ' . $e->getMessage()
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Delete a notification
     * DELETE /notifications/{id}
     */
    public function deleteNotification(Request $request, Response $response, array $args): Response
    {
        try {
            $userId = $request->getAttribute('user_id');
            $notificationId = $args['id'];

            $notification = Notification::where('id', $notificationId)
                ->where('user_id', $userId)
                ->first();

            if (!$notification) {
                $response->getBody()->write(json_encode([
                    'error' => 'Notification not found'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $notification->delete();

            $response->getBody()->write(json_encode([
                'message' => 'Notification deleted successfully'
            ]));

            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'error' => 'Failed to delete notification: ' . $e->getMessage()
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Delete all notifications
     * DELETE /notifications
     */
    public function deleteAll(Request $request, Response $response): Response
    {
        try {
            $userId = $request->getAttribute('user_id');

            Notification::where('user_id', $userId)->delete();

            $response->getBody()->write(json_encode([
                'message' => 'All notifications deleted successfully'
            ]));

            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'error' => 'Failed to delete all notifications: ' . $e->getMessage()
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * Static method to create a notification
     * Can be called from other controllers
     */
    public static function createNotification(
        int $userId,
        string $type,
        string $title,
        string $message,
        ?array $metadata = null
    ): void {
        try {
            Notification::create([
                'user_id' => $userId,
                'type' => $type,
                'title' => $title,
                'message' => $message,
                'metadata' => $metadata ? json_encode($metadata) : null,
                'read' => false,
                'created_at' => new \DateTime()
            ]);
        } catch (\Exception $e) {
            error_log("Failed to create notification: " . $e->getMessage());
        }
    }
}
