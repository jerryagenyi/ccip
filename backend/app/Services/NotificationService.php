<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\NotificationPreference;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class NotificationService
{
    /**
     * Send a notification to a user
     */
    public function sendNotification(User $user, string $type, string $title, string $body, ?string $link = null): Notification
    {
        $preferences = $user->notificationPreferences;

        // Create in-app notification
        if (! $preferences || $preferences->in_app_enabled) {
            $notification = Notification::create([
                'user_id' => $user->id,
                'type' => $type,
                'title' => $title,
                'body' => $body,
                'link' => $link,
            ]);

            // Send email if enabled
            if ($this->shouldSendEmail($preferences, $type)) {
                $this->sendEmail($user, $title, $body, $link);
            }

            return $notification;
        }

        // If in-app is disabled, still create notification but don't send email
        return Notification::create([
            'user_id' => $user->id,
            'type' => $type,
            'title' => $title,
            'body' => $body,
            'link' => $link,
        ]);
    }

    /**
     * Send notification to multiple users
     */
    public function sendBulkNotification(array $userIds, string $type, string $title, string $body, ?string $link = null): array
    {
        $notifications = [];
        $users = User::whereIn('id', $userIds)->get();

        foreach ($users as $user) {
            $notifications[] = $this->sendNotification($user, $type, $title, $body, $link);
        }

        return $notifications;
    }

    /**
     * Check if email should be sent based on preferences
     */
    protected function shouldSendEmail(?NotificationPreference $preferences, string $type): bool
    {
        if (! $preferences || ! $preferences->email_enabled) {
            return false;
        }

        return match ($type) {
            'message' => $preferences->message_email,
            'activity' => $preferences->activity_email,
            'urgent' => $preferences->urgent_email,
            default => true, // System notifications default to email enabled
        };
    }

    /**
     * Send email notification
     */
    protected function sendEmail(User $user, string $title, string $body, ?string $link = null): void
    {
        try {
            // TODO: Create email template
            // For now, use simple text email
            Mail::raw($body, function ($message) use ($user, $title) {
                $message->to($user->email, $user->name)
                    ->subject($title);
            });
        } catch (\Exception $e) {
            Log::error('Failed to send notification email', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Notify user about activity status change
     */
    public function notifyActivityStatusChange(User $user, string $activityTitle, string $status, ?string $link = null): void
    {
        $title = "Activity Status Changed: {$activityTitle}";
        $body = "The activity '{$activityTitle}' status has been changed to {$status}.";

        $this->sendNotification($user, 'activity', $title, $body, $link);
    }

    /**
     * Notify user about new message
     */
    public function notifyNewMessage(User $user, string $fromUserName, string $subject, ?string $link = null): void
    {
        $title = "New message from {$fromUserName}";
        $body = "You have received a new message: {$subject}";

        $this->sendNotification($user, 'message', $title, $body, $link);
    }

    /**
     * Notify user about urgent system alert
     */
    public function notifyUrgent(User $user, string $title, string $body, ?string $link = null): void
    {
        $this->sendNotification($user, 'urgent', $title, $body, $link);
    }
}
