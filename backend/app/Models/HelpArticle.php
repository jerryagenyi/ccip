<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HelpArticle extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'content',
        'excerpt',
        'category',
        'role_access',
        'views',
        'is_published',
    ];

    protected $casts = [
        'role_access' => 'array',
        'views' => 'integer',
        'is_published' => 'boolean',
    ];
}
