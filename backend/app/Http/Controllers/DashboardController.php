<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\Message;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function roleBased(Request $request, $role)
    {
        $user = $request->user();
        $data = [];

        switch ($role) {
            case 'super_admin':
            case 'admin':
                $data = $this->adminDashboard($user);
                break;
            case 'sub_admin':
                $data = $this->subAdminDashboard($user);
                break;
            default:
                $data = $this->userDashboard($user);
        }

        return $this->success($data, 'Dashboard data retrieved');
    }

    public function summary(Request $request)
    {
        $user = $request->user();

        $summary = [
            'total_activities' => Activity::count(),
            'my_activities' => Activity::where('created_by', $user->id)->count(),
            'pending_approval' => Activity::where('status', 'submitted')->count(),
            'unread_messages' => Message::where('to_user_id', $user->id)
                ->where('is_read', false)
                ->count(),
            'unread_notifications' => Notification::where('user_id', $user->id)
                ->whereNull('read_at')
                ->count(),
            'recent_activities' => Activity::with(['organisation', 'creator'])
                ->latest()
                ->limit(5)
                ->get(),
        ];

        return $this->success($summary, 'Dashboard summary retrieved');
    }

    private function adminDashboard($user)
    {
        return [
            'metrics' => [
                'total_activities' => Activity::count(),
                'total_organisations' => DB::table('organisations')->count(),
                'total_users' => DB::table('users')->count(),
                'pending_approvals' => Activity::where('status', 'submitted')->count(),
            ],
            'recent_activities' => Activity::with(['organisation', 'creator'])
                ->latest()
                ->limit(10)
                ->get(),
            'status_breakdown' => Activity::select('status', DB::raw('count(*) as count'))
                ->groupBy('status')
                ->pluck('count', 'status')
                ->toArray(),
        ];
    }

    private function subAdminDashboard($user)
    {
        $organisationId = $user->organisation_id;

        return [
            'metrics' => [
                'organisation_activities' => Activity::where('organisation_id', $organisationId)->count(),
                'my_activities' => Activity::where('created_by', $user->id)->count(),
                'pending_approval' => Activity::where('organisation_id', $organisationId)
                    ->where('status', 'submitted')
                    ->count(),
            ],
            'recent_activities' => Activity::where('organisation_id', $organisationId)
                ->with(['organisation', 'creator'])
                ->latest()
                ->limit(10)
                ->get(),
        ];
    }

    private function userDashboard($user)
    {
        return [
            'metrics' => [
                'my_activities' => Activity::where('created_by', $user->id)->count(),
                'draft_activities' => Activity::where('created_by', $user->id)
                    ->where('status', 'draft')
                    ->count(),
                'completed_activities' => Activity::where('created_by', $user->id)
                    ->where('status', 'completed')
                    ->count(),
            ],
            'my_activities' => Activity::where('created_by', $user->id)
                ->with(['organisation'])
                ->latest()
                ->limit(10)
                ->get(),
        ];
    }
}

