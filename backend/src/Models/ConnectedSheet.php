<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $user_id
 * @property string $spreadsheet_id
 * @property string $spreadsheet_name
 * @property string $sheet_name
 * @property string $connection_type
 * @property \DateTime $created_at
 * @property \DateTime $updated_at
 * @property-read User $user
 * @property-read \Illuminate\Database\Eloquent\Collection<Form> $forms
 */
class ConnectedSheet extends Model
{
    protected $fillable = [
        'user_id',
        'spreadsheet_id',
        'spreadsheet_name',
        'sheet_name',
        'connection_type'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function forms()
    {
        return $this->hasMany(Form::class);
    }
}
