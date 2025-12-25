<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Activity extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'type',
        'status',
        'priority',
        'organisation_id',
        'created_by',
        'updated_by',
        'location',
        'state',
        'lga',
        'target_context',
        'planned_message',
        'start_date',
        'end_date',
        'budget',
        'actual_cost',
        'target_audience',
        'actual_reach',
        'tags',
        'assignees',
        'human_review_completed',
        'reviewed_at',
        'reviewed_by',
        'review_notes',
        'semiotic_assessment',
        'semiotic_risk_score',
        'communication_effectiveness',
        'semiotic_validation',
        'metadata',
    ];

    protected $casts = [
        'location' => 'string',
        'state' => 'string',
        'lga' => 'string',
        'target_context' => 'array',
        'planned_message' => 'array',
        'tags' => 'array',
        'assignees' => 'array',
        'semiotic_assessment' => 'array',
        'semiotic_risk_score' => 'float',
        'communication_effectiveness' => 'array',
        'semiotic_validation' => 'array',
        'metadata' => 'array',
        'start_date' => 'date',
        'end_date' => 'date',
        'reviewed_at' => 'datetime',
        'budget' => 'decimal:2',
        'actual_cost' => 'decimal:2',
        'target_audience' => 'integer',
        'actual_reach' => 'integer',
        'human_review_completed' => 'boolean',
    ];

    // Append attributes for frontend compatibility
    protected $appends = [
        'organization',
        'organisationId',
        'dateCreated',
        'lastModified',
        'semioticRiskScore',
    ];

    // Accessors for frontend compatibility
    public function getOrganizationAttribute()
    {
        return $this->organisation?->name ?? null;
    }

    public function getOrganisationIdAttribute()
    {
        return $this->attributes['organisation_id'];
    }

    public function getDateCreatedAttribute()
    {
        return $this->created_at->toISOString();
    }

    public function getLastModifiedAttribute()
    {
        return $this->updated_at->toISOString();
    }

    public function getSemioticRiskScoreAttribute()
    {
        return $this->attributes['semiotic_risk_score'];
    }

    // Relationships
    public function organisation()
    {
        return $this->belongsTo(Organisation::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function attachments()
    {
        return $this->hasMany(ActivityAttachment::class);
    }

    public function statusHistory()
    {
        return $this->hasMany(ActivityStatusHistory::class);
    }

    public function engagementMetrics()
    {
        return $this->hasMany(EngagementMetric::class);
    }

    // Scopes
    public function scopeByStatus($query, $status)
    {
        if (is_array($status)) {
            return $query->whereIn('status', $status);
        }

        return $query->where('status', $status);
    }

    public function scopeByType($query, $type)
    {
        if (is_array($type)) {
            return $query->whereIn('type', $type);
        }

        return $query->where('type', $type);
    }

    public function scopeByOrganisation($query, $organisationIds)
    {
        if (is_array($organisationIds)) {
            return $query->whereIn('organisation_id', $organisationIds);
        }

        return $query->where('organisation_id', $organisationIds);
    }

    public function scopeByPriority($query, $priority)
    {
        if (is_array($priority)) {
            return $query->whereIn('priority', $priority);
        }

        return $query->where('priority', $priority);
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('title', 'like', '%'.$search.'%')
                ->orWhere('description', 'like', '%'.$search.'%')
                ->orWhere('tags', 'like', '%'.$search.'%');
        });
    }

    // Methods for frontend compatibility
    public function addAttachment($file, $uploadedBy)
    {
        $path = $file->store('activities/'.$this->id, 'public');

        return $this->attachments()->create([
            'name' => $file->getClientOriginalName(),
            'type' => $file->getClientOriginalExtension(),
            'size' => $file->getSize(),
            'file_path' => $path,
            'mime_type' => $file->getMimeType(),
            'uploaded_by' => $uploadedBy,
        ]);
    }

    public function updateStatus($status, $notes = null, $reviewedBy = null)
    {
        $this->update([
            'status' => $status,
            'review_notes' => $notes,
            'reviewed_by' => $reviewedBy,
            'reviewed_at' => now(),
            'human_review_completed' => true,
        ]);

        // Log status change
        $this->statusHistory()->create([
            'status' => $status,
            'changed_by' => $reviewedBy,
            'notes' => $notes,
        ]);

        return $this;
    }
}
