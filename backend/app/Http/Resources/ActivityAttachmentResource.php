<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ActivityAttachmentResource extends JsonResource
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
            'name' => $this->name ?? $this->file_name,
            'type' => $this->type ?? $this->file_type,
            'size' => $this->size ?? $this->file_size ?? 0,
            'url' => $this->getUrlAttribute(),
            'uploadedAt' => $this->created_at->toISOString(),
            'uploadedBy' => (string) $this->uploaded_by,
        ];
    }
}
