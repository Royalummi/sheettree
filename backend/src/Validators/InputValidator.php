<?php

namespace App\Validators;

use Respect\Validation\Validator as v;
use Respect\Validation\Exceptions\ValidationException;

/**
 * Input Validation Service
 * Centralized validation for all API endpoints
 */
class InputValidator
{
    /**
     * Validate form creation data
     */
    public static function validateFormCreation(array $data): array
    {
        $errors = [];

        // Title validation
        try {
            v::stringType()->notEmpty()->length(1, 255)->assert($data['title'] ?? '');
        } catch (ValidationException $e) {
            $errors['title'] = 'Title is required and must be between 1 and 255 characters';
        }

        // Description validation (optional)
        if (isset($data['description']) && !empty($data['description'])) {
            try {
                v::stringType()->length(null, 5000)->assert($data['description']);
            } catch (ValidationException $e) {
                $errors['description'] = 'Description must not exceed 5000 characters';
            }
        }

        // Fields validation
        if (!isset($data['fields']) || !is_array($data['fields'])) {
            $errors['fields'] = 'Fields must be an array';
        } else {
            foreach ($data['fields'] as $index => $field) {
                if (!isset($field['type']) || !isset($field['label'])) {
                    $errors["fields.{$index}"] = 'Each field must have a type and label';
                }

                // Validate field types
                $validTypes = ['text', 'email', 'tel', 'date', 'textarea', 'select', 'radio', 'checkbox', 'number'];
                if (isset($field['type']) && !in_array($field['type'], $validTypes)) {
                    $errors["fields.{$index}.type"] = "Invalid field type: {$field['type']}";
                }
            }
        }

        return $errors;
    }

    /**
     * Validate form update data
     */
    public static function validateFormUpdate(array $data): array
    {
        $errors = [];

        // Title validation (if provided)
        if (isset($data['title'])) {
            try {
                v::stringType()->notEmpty()->length(1, 255)->assert($data['title']);
            } catch (ValidationException $e) {
                $errors['title'] = 'Title must be between 1 and 255 characters';
            }
        }

        // Description validation (if provided)
        if (isset($data['description']) && !empty($data['description'])) {
            try {
                v::stringType()->length(null, 5000)->assert($data['description']);
            } catch (ValidationException $e) {
                $errors['description'] = 'Description must not exceed 5000 characters';
            }
        }

        // Fields validation (if provided)
        if (isset($data['fields'])) {
            if (!is_array($data['fields'])) {
                $errors['fields'] = 'Fields must be an array';
            } else {
                foreach ($data['fields'] as $index => $field) {
                    if (!isset($field['type']) || !isset($field['label'])) {
                        $errors["fields.{$index}"] = 'Each field must have a type and label';
                    }
                }
            }
        }

        return $errors;
    }

    /**
     * Validate form submission data
     */
    public static function validateFormSubmission(array $submissionData, array $formFields): array
    {
        $errors = [];

        foreach ($formFields as $field) {
            $fieldName = $field['name'] ?? $field['label'];
            $isRequired = $field['required'] ?? false;
            $fieldType = $field['type'] ?? 'text';
            $value = $submissionData[$fieldName] ?? null;

            // Check required fields
            if ($isRequired && empty($value)) {
                $errors[$fieldName] = "{$field['label']} is required";
                continue;
            }

            // Skip validation for empty optional fields
            if (empty($value)) {
                continue;
            }

            // Type-specific validation
            switch ($fieldType) {
                case 'email':
                    try {
                        v::email()->assert($value);
                    } catch (ValidationException $e) {
                        $errors[$fieldName] = "{$field['label']} must be a valid email address";
                    }
                    break;

                case 'tel':
                    try {
                        v::phone()->assert($value);
                    } catch (ValidationException $e) {
                        // More lenient phone validation
                        if (!preg_match('/^[0-9\s\-\+\(\)]+$/', $value)) {
                            $errors[$fieldName] = "{$field['label']} must be a valid phone number";
                        }
                    }
                    break;

                case 'number':
                    try {
                        v::numeric()->assert($value);
                    } catch (ValidationException $e) {
                        $errors[$fieldName] = "{$field['label']} must be a number";
                    }
                    break;

                case 'date':
                    try {
                        v::date()->assert($value);
                    } catch (ValidationException $e) {
                        $errors[$fieldName] = "{$field['label']} must be a valid date";
                    }
                    break;
            }

            // Length validation for text fields
            if (in_array($fieldType, ['text', 'textarea']) && strlen($value) > 5000) {
                $errors[$fieldName] = "{$field['label']} must not exceed 5000 characters";
            }
        }

        return $errors;
    }

    /**
     * Validate email addresses
     */
    public static function validateEmails(string $emailString): array
    {
        $errors = [];
        $emails = array_map('trim', explode(',', $emailString));

        foreach ($emails as $email) {
            try {
                v::email()->assert($email);
            } catch (ValidationException $e) {
                $errors[] = "Invalid email address: {$email}";
            }
        }

        return $errors;
    }

    /**
     * Validate webhook URL
     */
    public static function validateWebhookUrl(?string $url): ?string
    {
        if (empty($url)) {
            return null;
        }

        try {
            v::url()->assert($url);
        } catch (ValidationException $e) {
            return 'Invalid webhook URL';
        }

        return null;
    }

    /**
     * Validate notification settings
     */
    public static function validateNotificationSettings(array $data): array
    {
        $errors = [];

        // Type validation
        $validTypes = ['email', 'webhook', 'both'];
        if (!isset($data['type']) || !in_array($data['type'], $validTypes)) {
            $errors['type'] = 'Notification type must be one of: email, webhook, both';
        }

        // Email validation
        if (in_array($data['type'] ?? '', ['email', 'both'])) {
            if (empty($data['email_addresses'])) {
                $errors['email_addresses'] = 'Email addresses are required for email notifications';
            } else {
                $emailErrors = self::validateEmails($data['email_addresses']);
                if (!empty($emailErrors)) {
                    $errors['email_addresses'] = implode(', ', $emailErrors);
                }
            }
        }

        // Webhook validation
        if (in_array($data['type'] ?? '', ['webhook', 'both'])) {
            if (empty($data['webhook_url'])) {
                $errors['webhook_url'] = 'Webhook URL is required for webhook notifications';
            } else {
                $webhookError = self::validateWebhookUrl($data['webhook_url']);
                if ($webhookError) {
                    $errors['webhook_url'] = $webhookError;
                }
            }
        }

        return $errors;
    }

    /**
     * Sanitize input data
     */
    public static function sanitize(array $data): array
    {
        $sanitized = [];

        foreach ($data as $key => $value) {
            if (is_string($value)) {
                // Remove HTML tags and trim whitespace
                $sanitized[$key] = trim(strip_tags($value));
            } elseif (is_array($value)) {
                $sanitized[$key] = self::sanitize($value);
            } else {
                $sanitized[$key] = $value;
            }
        }

        return $sanitized;
    }
}
