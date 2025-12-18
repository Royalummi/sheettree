-- Create form_templates table
-- This table stores pre-built form templates that users can select when creating forms

CREATE TABLE IF NOT EXISTS form_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    icon VARCHAR(50) DEFAULT '📝',
    fields JSON NOT NULL COMMENT 'Array of field configurations',
    settings JSON NULL COMMENT 'Default form settings',
    is_active BOOLEAN DEFAULT TRUE,
    usage_count INT DEFAULT 0 COMMENT 'Track template popularity',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_active (is_active),
    INDEX idx_usage (usage_count)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Form template categories:
-- 'contact' - Contact forms
-- 'registration' - Registration/signup forms
-- 'survey' - Surveys and feedback
-- 'event' - Event registration
-- 'business' - Business/professional forms
-- 'order' - Order/booking forms
-- 'application' - Application forms
-- 'general' - General purpose
