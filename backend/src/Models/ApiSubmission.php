<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $form_api_config_id
 * @property array $submission_data
 * @property array $raw_payload
 * @property string|null $ip_address
 * @property string|null $user_agent
 * @property string|null $origin
 * @property bool $is_spam
 * @property string|null $spam_reason
 * @property bool $sheet_written
 * @property string|null $sheet_error
 * @property \DateTime $created_at
 * @property \DateTime $updated_at
 * @property-read FormApiConfig $formApiConfig
 */
class ApiSubmission extends Model
{
    protected $table = 'api_submissions';

    protected $fillable = [
        'form_api_config_id',
        'submission_data',
        'raw_payload',
        'ip_address',
        'user_agent',
        'origin',
        'is_spam',
        'spam_reason',
        'sheet_written',
        'sheet_error'
    ];

    protected $casts = [
        'submission_data' => 'array',
        'raw_payload' => 'array',
        'is_spam' => 'boolean',
        'sheet_written' => 'boolean'
    ];

    /**
     * Get the API config that owns this submission
     */
    public function apiConfig()
    {
        return $this->belongsTo(FormApiConfig::class, 'form_api_config_id');
    }

    /**
     * Mark as spam
     */
    public function markAsSpam($reason = null)
    {
        $this->update([
            'is_spam' => true,
            'spam_reason' => $reason
        ]);
    }

    /**
     * Mark as successfully written to sheet
     */
    public function markSheetWritten()
    {
        $this->update(['sheet_written' => true]);
    }

    /**
     * Mark sheet writing error
     */
    public function markSheetError($error)
    {
        $this->update([
            'sheet_written' => false,
            'sheet_error' => $error
        ]);
    }
}
