<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NotificationPreference extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'email_enabled',
        'in_app_enabled',
        'message_email',
        'message_in_app',
        'activity_email',
        'activity_in_app',
        'urgent_email',
        'urgent_in_app',
    ];

    protected $casts = [
        'email_enabled' => 'boolean',
        'in_app_enabled' => 'boolean',
        'message_email' => 'boolean',
        'message_in_app' => 'boolean',
        'activity_email' => 'boolean',
        'activity_in_app' => 'boolean',
        'urgent_email' => 'boolean',
        'urgent_in_app' => 'boolean',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
