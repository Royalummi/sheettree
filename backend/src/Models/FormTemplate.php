<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * FormTemplate Model
 * 
 * Pre-built form templates that users can select when creating new forms
 * 
 * @property int $id
 * @property string $name
 * @property string $description
 * @property string $category
 * @property string $icon
 * @property array $fields
 * @property array|null $settings
 * @property bool $is_active
 * @property int $usage_count
 * @property \DateTime $created_at
 * @property \DateTime $updated_at
 */
class FormTemplate extends Model
{
    protected $table = 'form_templates';

    protected $fillable = [
        'name',
        'description',
        'category',
        'icon',
        'fields',
        'settings',
        'is_active',
        'usage_count'
    ];

    protected $casts = [
        'fields' => 'array',
        'settings' => 'array',
        'is_active' => 'boolean',
        'usage_count' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * Scope to get only active templates
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get templates by category
     */
    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope to get popular templates
     */
    public function scopePopular($query, int $limit = 5)
    {
        return $query->orderBy('usage_count', 'desc')->limit($limit);
    }

    /**
     * Increment usage count
     */
    public function incrementUsage(): void
    {
        $this->increment('usage_count');
    }
}
