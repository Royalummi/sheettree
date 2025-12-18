<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string|null $google_id
 * @property string $email
 * @property string $name
 * @property string|null $avatar
 * @property bool $is_admin
 * @property bool $email_notifications_enabled
 * @property bool $notify_form_submission
 * @property bool $notify_sheet_connection
 * @property bool $notify_form_status
 * @property bool $notify_spam_detected
 * @property bool $notify_api_limit
 * @property bool $notify_system
 * @property \DateTime|null $email_verified_at
 * @property \DateTime|null $last_login
 * @property \DateTime $created_at
 * @property \DateTime $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<OauthToken> $oauthTokens
 * @property-read \Illuminate\Database\Eloquent\Collection<ConnectedSheet> $connectedSheets
 * @property-read \Illuminate\Database\Eloquent\Collection<Form> $forms
 */
class User extends Model
{
    protected $fillable = [
        'google_id',
        'email',
        'name',
        'avatar',
        'is_admin',
        'email_verified_at',
        'last_login',
        'email_notifications_enabled',
        'notify_form_submission',
        'notify_sheet_connection',
        'notify_form_status',
        'notify_spam_detected',
        'notify_api_limit',
        'notify_system'
    ];

    protected $casts = [
        'is_admin' => 'boolean',
        'email_notifications_enabled' => 'boolean',
        'notify_form_submission' => 'boolean',
        'notify_sheet_connection' => 'boolean',
        'notify_form_status' => 'boolean',
        'notify_spam_detected' => 'boolean',
        'notify_api_limit' => 'boolean',
        'notify_system' => 'boolean',
        'email_verified_at' => 'datetime',
        'last_login' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function oauthTokens()
    {
        return $this->hasMany(OauthToken::class);
    }

    public function connectedSheets()
    {
        return $this->hasMany(ConnectedSheet::class);
    }

    public function forms()
    {
        return $this->hasMany(Form::class);
    }

    public function getCurrentToken()
    {
        return $this->oauthTokens()->latest()->first();
    }
}
