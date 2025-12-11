<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\NotificationPreference;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $query = $user->notifications();

        if ($request->has('unread_only') && $request->unread_only) {
            $query->whereNull('read_at');
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        $limit = $request->get('limit', 20);
        $notifications = $query->latest()->limit($limit)->get();

        return $this->success($notifications, 'Notifications retrieved successfully');
    }

    public function unreadCount(Request $request)
    {
        $count = $request->user()->notifications()
            ->whereNull('read_at')
            ->count();

        return $this->success(['count' => $count], 'Unread count retrieved');
    }

    public function markAsRead(Request $request, $id)
    {
        $notification = $request->user()->notifications()->findOrFail($id);
        $notification->update(['read_at' => now()]);

        return $this->success($notification, 'Notification marked as read');
    }

    public function markAllAsRead(Request $request)
    {
        $request->user()->notifications()
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return $this->success(null, 'All notifications marked as read');
    }

    public function preferences(Request $request)
    {
        $preferences = $request->user()->notificationPreferences;

        if (!$preferences) {
            $preferences = NotificationPreference::create([
                'user_id' => $request->user()->id,
            ]);
        }

        return $this->success($preferences, 'Preferences retrieved successfully');
    }

    public function updatePreferences(Request $request)
    {
        $user = $request->user();
        $preferences = $user->notificationPreferences;

        $validated = $request->validate([
            'email_enabled' => 'sometimes|boolean',
            'in_app_enabled' => 'sometimes|boolean',
            'message_email' => 'sometimes|boolean',
            'message_in_app' => 'sometimes|boolean',
            'activity_email' => 'sometimes|boolean',
            'activity_in_app' => 'sometimes|boolean',
            'urgent_email' => 'sometimes|boolean',
            'urgent_in_app' => 'sometimes|boolean',
        ]);

        if (!$preferences) {
            $validated['user_id'] = $user->id;
            $preferences = NotificationPreference::create($validated);
        } else {
            $preferences->update($validated);
        }

        return $this->success($preferences, 'Preferences updated successfully');
    }
}

