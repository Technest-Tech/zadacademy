<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Teacher extends Model
{
    protected $fillable = [
        'slug', 'name', 'name_arabic', 'role', 'title', 'country', 'bio', 'image',
        'specialties', 'languages', 'tags', 'credentials',
        'is_female', 'years_experience', 'students_count',
        'rating', 'reviews_count', 'hourly_rate', 'currency',
        'elite', 'for_children', 'free_trial',
        'courses_given', 'teaching_hours',
        'quote', 'about', 'teaching_style', 'strengths',
        'featured', 'sort_order',
    ];

    protected $casts = [
        'specialties'      => 'array',
        'languages'        => 'array',
        'tags'             => 'array',
        'is_female'        => 'boolean',
        'featured'         => 'boolean',
        'elite'            => 'boolean',
        'for_children'     => 'boolean',
        'free_trial'       => 'boolean',
        'years_experience' => 'integer',
        'students_count'   => 'integer',
        'courses_given'    => 'integer',
        'teaching_hours'   => 'integer',
        'hourly_rate'      => 'integer',
        'reviews_count'    => 'integer',
        'rating'           => 'float',
    ];

    public function reviews(): HasMany
    {
        return $this->hasMany(TeacherReview::class)->orderBy('sort_order');
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
