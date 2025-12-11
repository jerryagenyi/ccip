<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use AppHttpResourcesActivityResource;use AppHttpResourcesActivityAttachmentResource;
use App\Models\ActivityAttachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ActivityController extends Controller
{
    public function index(Request $request)
    {
        $query = Activity::with(['organisation', 'creator', 'attachments']);

        // Apply filters
        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->has('status')) {
            $query->whereIn('status', (array) $request->status);
        }

        if ($request->has('type')) {
            $query->whereIn('type', (array) $request->type);
        }

        if ($request->has('organisation')) {
            $query->whereIn('organisation_id', (array) $request->organisation);
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        $activities = $query->latest()->paginate($perPage);

        $data = $activities->getCollection()->transform(fn($activity) => ActivityResource::make($activity));        $activities->setCollection($data);        return $this->paginated($activities, 'Activities retrieved successfully');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'type' => 'required|in:campaign,workshop,training,outreach,research,other',
            'organisation_id' => 'required|exists:organisations,id',
            'location' => 'nullable|array',
            'target_context' => 'nullable|array',
            'planned_message' => 'nullable|array',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'budget' => 'nullable|numeric|min:0',
            'target_audience' => 'nullable|integer|min:0',
            'priority' => 'nullable|in:low,medium,high,urgent',
            'tags' => 'nullable|array',
        ]);

        $validated['created_by'] = $request->user()->id;
        $validated['status'] = 'draft';

        $activity = Activity::create($validated);

        return $this->success($activity->load(['organisation', 'creator']), 'Activity created successfully', 201);
    }

    public function show($id)
    {
        $activity = Activity::with([
            'organisation',
            'creator',
            'reviewer',
            'attachments',
            'statusHistory.changedBy',
            'engagementMetrics',
        ])->findOrFail($id);

        return $this->success(ActivityResource::make($activity), 'Activity retrieved successfully');
    }

    public function update(Request $request, $id)
    {
        $activity = Activity::findOrFail($id);

        // Check permissions
        if ($activity->created_by !== $request->user()->id && !in_array($request->user()->role, ['admin', 'super_admin'])) {
            return $this->error('You do not have permission to update this activity', 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'type' => 'sometimes|in:campaign,workshop,training,outreach,research,other',
            'status' => 'sometimes|in:draft,submitted,approved,rejected,in_progress,completed,cancelled',
            'location' => 'nullable|array',
            'target_context' => 'nullable|array',
            'planned_message' => 'nullable|array',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'budget' => 'nullable|numeric|min:0',
            'target_audience' => 'nullable|integer|min:0',
            'priority' => 'nullable|in:low,medium,high,urgent',
            'tags' => 'nullable|array',
        ]);

        $activity->update($validated);

        return $this->success($activity->load(['organisation', 'creator']), 'Activity updated successfully');
    }

    public function destroy($id)
    {
        $activity = Activity::findOrFail($id);
        $activity->delete();

        return $this->success(null, 'Activity deleted successfully');
    }

    public function submit(Request $request, $id)
    {
        $activity = Activity::findOrFail($id);
        $activity->update(['status' => 'submitted']);

        // Record status history
        $activity->statusHistory()->create([
            'status' => 'submitted',
            'previous_status' => $activity->getOriginal('status'),
            'changed_by' => $request->user()->id,
        ]);

        return $this->success($activity, 'Activity submitted successfully');
    }

    public function approve(Request $request, $id)
    {
        $activity = Activity::findOrFail($id);
        $activity->update([
            'status' => 'approved',
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        return $this->success($activity, 'Activity approved successfully');
    }

    public function reject(Request $request, $id)
    {
        $request->validate(['notes' => 'required|string']);

        $activity = Activity::findOrFail($id);
        $activity->update([
            'status' => 'rejected',
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
            'review_notes' => $request->notes,
        ]);

        return $this->success($activity, 'Activity rejected');
    }

    public function complete(Request $request, $id)
    {
        $activity = Activity::findOrFail($id);
        $activity->update(['status' => 'completed']);

        return $this->success($activity, 'Activity marked as completed');
    }

    public function duplicate(Request $request, $id)
    {
        $original = Activity::findOrFail($id);
        $duplicate = $original->replicate();
        $duplicate->title = $original->title . ' (Copy)';
        $duplicate->status = 'draft';
        $duplicate->created_by = $request->user()->id;
        $duplicate->save();

        return $this->success($duplicate, 'Activity duplicated successfully', 201);
    }

    public function uploadFiles(Request $request, $id)
    {
        $request->validate([
            'files.*' => 'required|file|max:10240', // 10MB max
        ]);

        $activity = Activity::findOrFail($id);
        $uploadedFiles = [];

        foreach ($request->file('files') as $file) {
            $path = $file->store('activities/' . $id, 's3');
            
$attachment = ActivityAttachment::create([                'activity_id' => $id,                'name' => $file->getClientOriginalName(), // Frontend expects 'name'                'file_name' => $file->getClientOriginalName(), // Keep for backward compatibility                'file_path' => $path,                'type' => $file->getClientOriginalExtension(), // Frontend expects 'type'                'file_type' => $file->getClientOriginalExtension(), // Keep for backward compatibility                'size' => $file->getSize(), // Frontend expects 'size'                'file_size' => $file->getSize(), // Keep for backward compatibility                'mime_type' => $file->getMimeType(),                'uploaded_by' => $request->user()->id,            ]);            // Prepare response with frontend-compatible format            $uploadedFiles[] = [                'id' => $attachment->id,                'name' => $attachment->name,                'type' => $attachment->type,                'size' => $attachment->size,                'url' => Storage::disk('s3')->url($attachment->file_path),                'uploadedAt' => $attachment->created_at->toISOString(),                'uploadedBy' => $attachment->uploaded_by,            ];

            $uploadedFiles[] = $attachment;
        }

        return $this->success($uploadedFiles, 'Files uploaded successfully', 201);
    }

    public function deleteFile(Request $request, $id, $fileId)
    {
        $attachment = ActivityAttachment::where('activity_id', $id)
            ->where('id', $fileId)
            ->firstOrFail();

        Storage::disk('s3')->delete($attachment->file_path);
        $attachment->delete();

        return $this->success(null, 'File deleted successfully');
    }
}

