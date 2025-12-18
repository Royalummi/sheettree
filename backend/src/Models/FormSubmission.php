<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FormSubmission extends Model
{
    protected $fillable = [
        'form_id',
        'submission_data',
        'ip_address',
        'user_agent'
    ];

    protected $casts = [
        'submission_data' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function form()
    {
        return $this->belongsTo(Form::class);
    }
}
