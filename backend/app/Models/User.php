<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone_number',
        'profile_picture',
        'role',
        'organisation_id',
        'is_active',
        'preferences',
        'team',
        'avatar_id',
        'last_login',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'preferences' => 'array',
        'is_active' => 'boolean',
        'last_login' => 'datetime',
        'status' => 'string',
    ];

    // Append attributes for frontend compatibility
    protected $appends = [
        'avatarId',
        'profilePicture',
        'phoneNumber',
        'createdAt',
        'updatedAt',
    ];

    // Accessors for frontend compatibility
    public function getAvatarIdAttribute()
    {
        return $this->attributes['avatar_id'] ?? null;
    }

    public function getProfilePictureAttribute()
    {
        return $this->attributes['profile_picture'] ?? null;
    }

    public function getPhoneNumberAttribute()
    {
        return $this->attributes['phone_number'] ?? null;
    }

    public function getCreatedAtAttribute()
    {
        return $this->attributes['created_at'] ?? now()->toISOString();
    }

    public function getUpdatedAtAttribute()
    {
        return $this->attributes['updated_at'] ?? now()->toISOString();
    }

    // Mutators
    public function setAvatarIdAttribute($value)
    {
        $this->attributes['avatar_id'] = $value;
    }

    public function setPhoneNumberAttribute($value)
    {
        $this->attributes['phone_number'] = $value;
    }

    // Relationships
    public function organisation()
    {
        return $this->belongsTo(Organisation::class);
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_roles')
            ->withPivot('assigned_by', 'assigned_at')
            ->withTimestamps();
    }

    public function hasRole(string $roleName): bool
    {
        return $this->roles()->where('name', $roleName)->exists() ||
               $this->role === $roleName;
    }

    public function activities()
    {
        return $this->hasMany(Activity::class, 'created_by');
    }

    public function sentMessages()
    {
        return $this->hasMany(Message::class, 'from_user_id');
    }

    public function receivedMessages()
    {
        return $this->hasMany(Message::class, 'to_user_id');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function notificationPreferences()
    {
        return $this->hasOne(NotificationPreference::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByRole($query, $role)
    {
        return $query->where('role', $role);
    }

    public function scopeByOrganisation($query, $organisationId)
    {
        return $query->where('organisation_id', $organisationId);
    }
}
