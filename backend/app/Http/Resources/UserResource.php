<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'name' => $this->name,
            'email' => $this->email,
            'avatarId' => $this->avatar_id,
            'role' => $this->role,
            'team' => $this->team,
            'status' => $this->status ?? ($this->is_active ? 'Active' : 'Suspended'),
            'organisation' => $this->whenLoaded('organisation', fn() => [
                'id' => (string) $this->organisation->id,
                'name' => $this->organisation->name,
                'category' => $this->organisation->category,
                'level' => $this->organisation->level,
                'status' => $this->organisation->status,
            ]),
            'profilePicture' => $this->profile_picture,
            'phoneNumber' => $this->phone_number,
            'lastLogin' => $this->last_login?->toISOString(),
            'createdAt' => $this->created_at->toISOString(),
            'updatedAt' => $this->updated_at->toISOString(),
        ];
    }
}
