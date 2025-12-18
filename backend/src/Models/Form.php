<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $user_id
 * @property int|null $connected_sheet_id
 * @property string $title
 * @property string|null $description
 * @property array $fields
 * @property bool $is_active
 * @property bool $is_public
 * @property \DateTime $created_at
 * @property \DateTime $updated_at
 * @property-read User $user
 * @property-read ConnectedSheet|null $connectedSheet
 * @property-read \Illuminate\Database\Eloquent\Collection<FormSubmission> $submissions
 */
class Form extends Model
{
    protected $fillable = [
        'user_id',
        'connected_sheet_id',
        'title',
        'description',
        'fields',
        'is_active',
        'is_public'
    ];

    protected $casts = [
        'fields' => 'array',
        'is_active' => 'boolean',
        'is_public' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function connectedSheet()
    {
        return $this->belongsTo(ConnectedSheet::class);
    }

    public function submissions()
    {
        return $this->hasMany(FormSubmission::class);
    }

    public function apiConfigs()
    {
        return $this->hasMany(FormApiConfig::class, 'form_id');
    }
}
