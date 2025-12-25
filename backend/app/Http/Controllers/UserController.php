<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    public function me(Request $request)
    {
        $user = $request->user()->load('organisation', 'notificationPreferences');

        return $this->success($user, 'User retrieved successfully');
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'phone_number' => 'nullable|string|max:20',
            'bio' => 'nullable|string|max:1000',
            'preferences' => 'nullable|array',
        ]);

        $user->update($validated);

        return $this->success($user->load('organisation'), 'Profile updated successfully');
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (! Hash::check($request->current_password, $user->password)) {
            return $this->error('Current password is incorrect', 422);
        }

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return $this->success(null, 'Password changed successfully');
    }

    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|max:2048', // 2MB max
        ]);

        $user = $request->user();

        // Delete old avatar if exists
        if ($user->profile_picture) {
            Storage::disk('s3')->delete($user->profile_picture);
        }

        $path = $request->file('avatar')->store('avatars', 's3');
        $user->update(['profile_picture' => $path]);

        return $this->success([
            'profile_picture' => $path,
        ], 'Avatar uploaded successfully');
    }
}
