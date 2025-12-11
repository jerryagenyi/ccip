<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class ActivityAttachment extends Model
{
    use HasFactory;

    protected $fillable = [
        'activity_id',
        'name',
        'type',
        'size',
        'file_path',
        'mime_type',
        'uploaded_by',
    ];

    protected $appends = ['url'];

    // Relationships
    public function activity()
    {
        return $this->belongsTo(Activity::class);
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    // Accessors
    public function getUrlAttribute()
    {
        return $this->file_path ? Storage::url($this->file_path) : null;
    }

    // Mutators
    public function setNameAttribute($value)
    {
        $this->attributes['name'] = $value;
        $this->attributes['file_name'] = $value; // Keep backward compatibility
    }

    public function setTypeAttribute($value)
    {
        $this->attributes['type'] = $value;
        $this->attributes['file_type'] = $value; // Keep backward compatibility
    }

    public function setSizeAttribute($value)
    {
        $this->attributes['size'] = $value;
        $this->attributes['file_size'] = $value; // Keep backward compatibility
    }

    // Scopes for frontend compatibility
    public function scopeWithUrl($query)
    {
        return $query->select('*')->addSelect([
            'url' => function ($query) {
                $query->selectRaw('CONCAT(?, file_path)', [config('app.url') . '/storage/']);
            }
        ]);
    }
}
