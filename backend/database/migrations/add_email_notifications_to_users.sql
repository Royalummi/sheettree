-- Add email notification preferences to users table
ALTER TABLE users 
ADD COLUMN email_notifications_enabled BOOLEAN DEFAULT TRUE COMMENT 'Master toggle for all email notifications',
ADD COLUMN notify_form_submission BOOLEAN DEFAULT TRUE COMMENT 'Email on new form submissions',
ADD COLUMN notify_sheet_connection BOOLEAN DEFAULT TRUE COMMENT 'Email on sheet connection issues',
ADD COLUMN notify_form_status BOOLEAN DEFAULT TRUE COMMENT 'Email on form status changes',
ADD COLUMN notify_spam_detected BOOLEAN DEFAULT TRUE COMMENT 'Email on spam detection',
ADD COLUMN notify_api_limit BOOLEAN DEFAULT TRUE COMMENT 'Email on API limit warnings',
ADD COLUMN notify_system BOOLEAN DEFAULT TRUE COMMENT 'Email on system announcements';

-- Update existing users to have notifications enabled
UPDATE users SET 
  email_notifications_enabled = TRUE,
  notify_form_submission = TRUE,
  notify_sheet_connection = TRUE,
  notify_form_status = TRUE,
  notify_spam_detected = TRUE,
  notify_api_limit = TRUE,
  notify_system = TRUE
WHERE email_notifications_enabled IS NULL;
