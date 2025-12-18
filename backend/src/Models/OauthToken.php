<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $user_id
 * @property string|null $refresh_token
 * @property string|null $access_token
 * @property \DateTime|null $token_expires_at
 * @property array|string $scopes
 * @property \DateTime $created_at
 * @property \DateTime $updated_at
 * @property-read User $user
 */
class OauthToken extends Model
{
    protected $fillable = [
        'user_id',
        'refresh_token',
        'access_token',
        'token_expires_at',
        'scopes'
    ];

    protected $casts = [
        'token_expires_at' => 'datetime',
        'scopes' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function isExpired()
    {
        return $this->token_expires_at && $this->token_expires_at < new \DateTime();
    }
}
