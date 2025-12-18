<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Notification Model
 * 
 * Database table: notifications
 * 
 * CREATE TABLE IF NOT EXISTS notifications (
 *     id INT AUTO_INCREMENT PRIMARY KEY,
 *     user_id INT NOT NULL,
 *     type VARCHAR(50) NOT NULL,
 *     title VARCHAR(255) NOT NULL,
 *     message TEXT NOT NULL,
 *     metadata JSON NULL,
 *     read BOOLEAN DEFAULT FALSE,
 *     read_at DATETIME NULL,
 *     created_at DATETIME NOT NULL,
 *     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
 *     INDEX idx_user_read (user_id, read),
 *     INDEX idx_created_at (created_at)
 * ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
 * 
 * Notification Types:
 * - form_submission: New form submission received
 * - sheet_connection: Sheet connection status change
 * - form_status: Form activated/deactivated
 * - api_limit: API rate limit warning
 * - spam_detected: Spam submission blocked
 * - system: System announcements
 */
class Notification extends Model
{
    protected $table = 'notifications';

    protected $fillable = [
        'user_id',
        'type',
        'title',
        'message',
        'metadata',
        'read',
        'read_at',
        'created_at'
    ];

    protected $casts = [
        'metadata' => 'array',
        'read' => 'boolean',
        'read_at' => 'datetime',
        'created_at' => 'datetime'
    ];

    public $timestamps = false;

    /**
     * Get the user that owns the notification
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope to get only unread notifications
     */
    public function scopeUnread($query)
    {
        return $query->where('read', false);
    }

    /**
     * Scope to get notifications by type
     */
    public function scopeOfType($query, string $type)
    {
        return $query->where('type', $type);
    }
}
