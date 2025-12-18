-- Notifications System Database Migration
-- Run this SQL in your database to create the notifications table

CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    type VARCHAR(50) NOT NULL COMMENT 'form_submission, sheet_connection, form_status, api_limit, spam_detected, system',
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    metadata JSON NULL COMMENT 'Additional data like form_id, sheet_id, etc.',
    `read` BOOLEAN DEFAULT FALSE,
    read_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_read (user_id, `read`),
    INDEX idx_created_at (created_at),
    INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample notifications for testing with actual data from database
INSERT INTO notifications (user_id, type, title, message, metadata, `read`, created_at) VALUES
(1, 'form_submission', 'New Form Submission', 'Your form "Test Contact Form" received a new submission from John Doe', '{"form_id":1,"submission_id":43,"submitter":"John Doe"}', 0, NOW()),
(1, 'form_submission', 'New Submission Received', 'Contact Form 2 received a new submission', '{"form_id":2,"submission_id":42}', 0, DATE_SUB(NOW(), INTERVAL 15 MINUTE)),
(1, 'spam_detected', 'Spam Submissions Blocked', '3 spam submissions were blocked on Test Contact Form in the last hour', '{"form_id":1,"spam_count":3,"blocked_ips":["192.168.1.1","10.0.0.5"]}', 0, DATE_SUB(NOW(), INTERVAL 1 HOUR)),
(1, 'sheet_connection', 'Sheet Connection Refreshed', 'Google Sheets connection for "Contact Form Submissions" was successfully refreshed', '{"sheet_id":1,"spreadsheet_id":"1LaWX5zLPOLDJQ_Zbjy2ydCMHzGiN2a8mT47ji22jHkc"}', 1, DATE_SUB(NOW(), INTERVAL 3 HOUR)),
(1, 'form_status', 'Form Activated', 'Your form "Test Contact Form" is now active and accepting submissions', '{"form_id":1,"previous_status":"inactive"}', 1, DATE_SUB(NOW(), INTERVAL 6 HOUR)),
(1, 'api_limit', 'API Usage Warning', 'You have used 78% of your monthly API quota (350/450 requests)', '{"current_usage":350,"total_limit":450,"percentage":78}', 1, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(1, 'sheet_connection', 'Connection Issue', 'Failed to write submission to Google Sheets - Token may have expired', '{"sheet_id":1,"error":"Token expired","form_id":1}', 0, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(1, 'system', 'Welcome to SheetTree', 'Thank you for signing up! Start by connecting your first Google Sheet and creating a form.', '{"onboarding":true}', 1, DATE_SUB(NOW(), INTERVAL 7 DAY));

-- Insert sample notifications for user_id 2 if exists
INSERT INTO notifications (user_id, type, title, message, metadata, `read`, created_at)
SELECT 2, 'form_submission', 'New Form Submission', 'Your form "My Dummy Form" received a new submission', '{"form_id":4,"submission_id":41}', 0, NOW()
WHERE EXISTS (SELECT 1 FROM users WHERE id = 2);

INSERT INTO notifications (user_id, type, title, message, metadata, `read`, created_at)
SELECT 2, 'system', 'Welcome to SheetTree', 'Get started by creating your first form and connecting it to Google Sheets', '{"onboarding":true}', 1, DATE_SUB(NOW(), INTERVAL 3 DAY)
WHERE EXISTS (SELECT 1 FROM users WHERE id = 2);

