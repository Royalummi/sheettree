<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $form_id
 * @property string $api_hash
 * @property string $api_key
 * @property string $api_name
 * @property string|null $description
 * @property bool $is_active
 * @property array|null $allowed_origins
 * @property bool $cors_enabled
 * @property bool $captcha_enabled
 * @property string|null $captcha_type
 * @property string|null $captcha_secret_key
 * @property string|null $honeypot_field_name
 * @property bool $validation_enabled
 * @property array|null $validation_rules
 * @property array|null $required_fields
 * @property string|null $response_type
 * @property string|null $success_message
 * @property string|null $redirect_url
 * @property array|null $custom_response_data
 * @property array|null $field_mapping
 * @property \DateTime $created_at
 * @property \DateTime $updated_at
 * @property-read Form $form
 * @property-read \Illuminate\Database\Eloquent\Collection<ApiSubmission> $submissions
 * @property-read \Illuminate\Database\Eloquent\Collection<ApiUsageLog> $usageLogs
 */
class FormApiConfig extends Model
{
    protected $table = 'form_api_configs';

    protected $fillable = [
        'form_id',
        'api_hash',
        'api_key',
        'api_name',
        'description',
        'is_active',
        'allowed_origins',
        'cors_enabled',
        'captcha_enabled',
        'captcha_type',
        'captcha_secret_key',
        'honeypot_field_name',
        'validation_enabled',
        'validation_rules',
        'required_fields',
        'response_type',
        'success_message',
        'redirect_url',
        'custom_response_data',
        'field_mapping'
    ];

    protected $casts = [
        'allowed_origins' => 'array',
        'cors_enabled' => 'boolean',
        'captcha_enabled' => 'boolean',
        'validation_enabled' => 'boolean',
        'validation_rules' => 'array',
        'required_fields' => 'array',
        'custom_response_data' => 'array',
        'field_mapping' => 'array',
        'is_active' => 'boolean'
    ];

    /**
     * Get the form that owns this API config
     */
    public function form()
    {
        return $this->belongsTo(Form::class);
    }

    /**
     * Get API submissions for this config
     */
    public function submissions()
    {
        return $this->hasMany(ApiSubmission::class);
    }

    /**
     * Get usage logs for this API
     */
    public function usageLogs()
    {
        return $this->hasMany(ApiUsageLog::class);
    }

    /**
     * Generate a unique API hash
     */
    public static function generateApiHash($formId)
    {
        return hash('sha256', $formId . uniqid() . time());
    }

    /**
     * Generate a unique API key
     */
    public static function generateApiKey()
    {
        return 'st_' . bin2hex(random_bytes(32)); // st_ prefix for SheetTree
    }

    /**
     * Check if origin is allowed for CORS
     */
    public function isOriginAllowed($origin)
    {
        if (!$this->cors_enabled || !$this->allowed_origins) {
            return false;
        }

        foreach ($this->allowed_origins as $allowedOrigin) {
            // Support wildcard subdomains
            if (str_starts_with($allowedOrigin, '*.')) {
                $domain = substr($allowedOrigin, 2);
                if (str_ends_with($origin, $domain)) {
                    return true;
                }
            } elseif ($origin === $allowedOrigin) {
                return true;
            }
        }

        return false;
    }

    /**
     * Get validation rules in Laravel format
     */
    public function getLaravelValidationRules()
    {
        if (!$this->validation_enabled || !$this->validation_rules) {
            return [];
        }

        $rules = [];
        foreach ($this->validation_rules as $field => $fieldRules) {
            $rules[$field] = $fieldRules;
        }

        // Add required fields
        if ($this->required_fields) {
            foreach ($this->required_fields as $field) {
                if (!isset($rules[$field])) {
                    $rules[$field] = 'required';
                } else {
                    $rules[$field] = 'required|' . $rules[$field];
                }
            }
        }

        return $rules;
    }
}
