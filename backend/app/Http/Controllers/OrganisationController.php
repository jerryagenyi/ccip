<?php

namespace App\Http\Controllers;

use App\Models\Organisation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class OrganisationController extends Controller
{
    public function index(Request $request)
    {
        $query = Organisation::with(['parent', 'users']);

        // Apply filters
        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%'.$request->search.'%')
                    ->orWhere('description', 'like', '%'.$request->search.'%');
            });
        }

        if ($request->has('administrative_level')) {
            $query->whereIn('administrative_level', (array) $request->administrative_level);
        }

        if ($request->has('parent_id')) {
            $query->where('parent_id', $request->parent_id);
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->is_active === 'true');
        }

        $perPage = $request->get('per_page', 15);
        $organisations = $query->latest()->paginate($perPage);

        return $this->paginated($organisations, 'Organisations retrieved successfully');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'logo' => 'nullable|image|max:2048',
            'website' => 'nullable|url',
            'email' => 'nullable|email',
            'phone' => 'nullable|string|max:20',
            'administrative_level' => 'required|in:national,regional,district,local,community',
            'parent_id' => 'nullable|exists:organisations,id',
            'location' => 'nullable|array',
            'metadata' => 'nullable|array',
        ]);

        // Generate slug
        $validated['slug'] = Str::slug($validated['name']);

        // Handle logo upload
        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('organisations', 's3');
        }

        $organisation = Organisation::create($validated);

        return $this->success($organisation->load(['parent', 'children']), 'Organisation created successfully', 201);
    }

    public function show($id)
    {
        $organisation = Organisation::with([
            'parent',
            'children',
            'users',
            'activities' => function ($query) {
                $query->latest()->limit(10);
            },
        ])->findOrFail($id);

        return $this->success($organisation, 'Organisation retrieved successfully');
    }

    public function update(Request $request, $id)
    {
        $organisation = Organisation::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'logo' => 'nullable|image|max:2048',
            'website' => 'nullable|url',
            'email' => 'nullable|email',
            'phone' => 'nullable|string|max:20',
            'administrative_level' => 'sometimes|in:national,regional,district,local,community',
            'parent_id' => 'nullable|exists:organisations,id',
            'location' => 'nullable|array',
            'metadata' => 'nullable|array',
            'is_active' => 'sometimes|boolean',
        ]);

        // Update slug if name changed
        if (isset($validated['name']) && $validated['name'] !== $organisation->name) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        // Handle logo upload
        if ($request->hasFile('logo')) {
            // Delete old logo
            if ($organisation->logo) {
                Storage::disk('s3')->delete($organisation->logo);
            }
            $validated['logo'] = $request->file('logo')->store('organisations', 's3');
        }

        $organisation->update($validated);

        return $this->success($organisation->load(['parent', 'children']), 'Organisation updated successfully');
    }

    public function destroy($id)
    {
        $organisation = Organisation::findOrFail($id);
        $organisation->delete();

        return $this->success(null, 'Organisation deleted successfully');
    }

    public function members(Request $request, $id)
    {
        $organisation = Organisation::findOrFail($id);
        $members = $organisation->users()->with('organisation')->get();

        return $this->success($members, 'Members retrieved successfully');
    }

    public function inviteMembers(Request $request, $id)
    {
        $request->validate([
            'emails' => 'required|array',
            'emails.*' => 'required|email',
            'role' => 'required|in:user,sub_admin',
            'message' => 'nullable|string',
        ]);

        $organisation = Organisation::findOrFail($id);
        $invited = [];

        foreach ($request->emails as $email) {
            // Check if user exists
            $user = User::where('email', $email)->first();

            if ($user) {
                // Add to organisation
                $user->update(['organisation_id' => $id]);
            } else {
                // TODO: Send invitation email
                // For now, just track
                $invited[] = $email;
            }
        }

        return $this->success([
            'invited' => $invited,
        ], 'Invitations sent successfully');
    }

    public function activities(Request $request, $id)
    {
        $organisation = Organisation::findOrFail($id);
        $perPage = $request->get('per_page', 15);

        $activities = $organisation->activities()
            ->with(['creator', 'reviewer'])
            ->latest()
            ->paginate($perPage);

        return $this->paginated($activities, 'Activities retrieved successfully');
    }
}
