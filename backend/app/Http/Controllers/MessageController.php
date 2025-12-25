<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Message::with(['fromUser', 'toUser', 'parent'])
            ->where(function ($q) use ($user) {
                $q->where('from_user_id', $user->id)
                    ->orWhere('to_user_id', $user->id);
            });

        // Filter by type
        if ($request->has('type')) {
            if ($request->type === 'sent') {
                $query->where('from_user_id', $user->id);
            } elseif ($request->type === 'received') {
                $query->where('to_user_id', $user->id);
            } elseif ($request->type === 'unread') {
                $query->where('to_user_id', $user->id)
                    ->where('is_read', false);
            }
        }

        $perPage = $request->get('per_page', 20);
        $messages = $query->latest()->paginate($perPage);

        return $this->paginated($messages, 'Messages retrieved successfully');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'to_user_id' => 'required|exists:users,id',
            'subject' => 'required|string|max:255',
            'body' => 'required|string',
            'parent_message_id' => 'nullable|exists:messages,id',
            'attachments' => 'nullable|array',
        ]);

        $validated['from_user_id'] = $request->user()->id;

        $message = Message::create($validated);

        // Create notification for recipient
        $message->toUser->notifications()->create([
            'type' => 'message',
            'title' => 'New message from '.$request->user()->name,
            'body' => $message->subject,
            'link' => '/messages/'.$message->id,
        ]);

        return $this->success($message->load(['fromUser', 'toUser']), 'Message sent successfully', 201);
    }

    public function show($id)
    {
        $user = $request->user();
        $message = Message::with(['fromUser', 'toUser', 'parent', 'replies.fromUser', 'replies.toUser'])
            ->where(function ($q) use ($user) {
                $q->where('from_user_id', $user->id)
                    ->orWhere('to_user_id', $user->id);
            })
            ->findOrFail($id);

        // Mark as read if recipient
        if ($message->to_user_id === $user->id && ! $message->is_read) {
            $message->update([
                'is_read' => true,
                'read_at' => now(),
            ]);
        }

        return $this->success($message, 'Message retrieved successfully');
    }

    public function markAsRead(Request $request, $id)
    {
        $message = Message::where('to_user_id', $request->user()->id)
            ->findOrFail($id);

        $message->update([
            'is_read' => true,
            'read_at' => now(),
        ]);

        return $this->success($message, 'Message marked as read');
    }

    public function reply(Request $request, $id)
    {
        $parent = Message::findOrFail($id);
        $user = $request->user();

        // Determine recipient
        $recipientId = $parent->from_user_id === $user->id
            ? $parent->to_user_id
            : $parent->from_user_id;

        $validated = $request->validate([
            'body' => 'required|string',
        ]);

        $message = Message::create([
            'from_user_id' => $user->id,
            'to_user_id' => $recipientId,
            'subject' => 'Re: '.$parent->subject,
            'body' => $validated['body'],
            'parent_message_id' => $id,
        ]);

        // Create notification
        $message->toUser->notifications()->create([
            'type' => 'message',
            'title' => 'New reply from '.$user->name,
            'body' => $message->subject,
            'link' => '/messages/'.$message->id,
        ]);

        return $this->success($message->load(['fromUser', 'toUser']), 'Reply sent successfully', 201);
    }

    public function destroy($id)
    {
        $message = Message::findOrFail($id);
        $message->delete();

        return $this->success(null, 'Message deleted successfully');
    }
}
