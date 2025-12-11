<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ActivityResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'status' => ucfirst($this->status),
            'type' => ucfirst($this->type),
            'organization' => $this->organisation?->name,
            'organisationId' => (string) $this->organisation_id,
            'location' => $this->location,
            'state' => $this->state,
            'lga' => $this->lga,
            'dateCreated' => $this->created_at->toISOString(),
            'lastModified' => $this->updated_at->toISOString(),
            'startDate' => $this->start_date?->toISOString(),
            'endDate' => $this->end_date?->toISOString(),
            'targetContext' => $this->target_context,
            'plannedMessage' => $this->planned_message,
            'semioticRiskScore' => $this->semiotic_risk_score,
            'semioticAssessment' => $this->semiotic_assessment,
            'communicationEffectiveness' => $this->communication_effectiveness,
            'semioticValidation' => $this->semiotic_validation,
            'humanReviewCompleted' => $this->human_review_completed,
            'reviewedBy' => $this->reviewed_by,
            'reviewedAt' => $this->reviewed_at?->toISOString(),
            'tags' => $this->tags ?? [],
            'attachments' => ActivityAttachmentResource::collection($this->whenLoaded('attachments')),
            'budget' => $this->budget ? (float) $this->budget : null,
            'actualCost' => $this->actual_cost ? (float) $this->actual_cost : null,
            'targetAudience' => $this->target_audience ?? 0,
            'actualReach' => $this->actual_reach,
            'priority' => ucfirst($this->priority ?? 'medium'),
            'assignees' => $this->assignees ?? [],
            'createdBy' => (string) $this->created_by,
            'updatedBy' => $this->updated_by ? (string) $this->updated_by : null,
        ];
    }
}
