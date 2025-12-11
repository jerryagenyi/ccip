<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\EngagementMetric;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function statusBreakdown(Request $request)
    {
        $query = Activity::query();

        if ($request->has('organisation_id')) {
            $query->where('organisation_id', $request->organisation_id);
        }

        if ($request->has('start_date')) {
            $query->where('created_at', '>=', $request->start_date);
        }

        if ($request->has('end_date')) {
            $query->where('created_at', '<=', $request->end_date);
        }

        $breakdown = $query->select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        // Ensure all statuses are present
        $statuses = ['draft', 'submitted', 'approved', 'rejected', 'in_progress', 'completed', 'cancelled'];
        $result = [];
        foreach ($statuses as $status) {
            $result[$status] = $breakdown[$status] ?? 0;
        }

        return $this->success($result, 'Status breakdown retrieved');
    }

    public function heatmap(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        $query = Activity::whereBetween('created_at', [
            $request->start_date,
            $request->end_date,
        ]);

        if ($request->has('organisation_id')) {
            $query->where('organisation_id', $request->organisation_id);
        }

        $heatmap = $query->select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('count(*) as count')
        )
            ->groupBy('date')
            ->pluck('count', 'date')
            ->toArray();

        return $this->success($heatmap, 'Heatmap data retrieved');
    }

    public function engagement(Request $request)
    {
        $query = EngagementMetric::with(['activity', 'recordedBy']);

        if ($request->has('start_date')) {
            $query->where('recorded_at', '>=', $request->start_date);
        }

        if ($request->has('end_date')) {
            $query->where('recorded_at', '<=', $request->end_date);
        }

        if ($request->has('organisation_id')) {
            $query->whereHas('activity', function ($q) use ($request) {
                $q->where('organisation_id', $request->organisation_id);
            });
        }

        $metrics = $query->latest('recorded_at')->get();

        // Aggregate metrics
        $aggregated = $metrics->groupBy('metric_type')->map(function ($group) {
            return [
                'total' => $group->sum('value'),
                'average' => $group->avg('value'),
                'count' => $group->count(),
            ];
        });

        return $this->success([
            'metrics' => $metrics,
            'aggregated' => $aggregated,
        ], 'Engagement metrics retrieved');
    }

    public function engagementTrends(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        $trends = EngagementMetric::whereBetween('recorded_at', [
            $request->start_date,
            $request->end_date,
        ])
            ->select(
                DB::raw('DATE(recorded_at) as date'),
                DB::raw('AVG(value) as average'),
                DB::raw('SUM(value) as total')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => $item->date,
                    'average' => (float) $item->average,
                    'total' => (float) $item->total,
                ];
            });

        return $this->success($trends, 'Engagement trends retrieved');
    }

    public function organisationComparison(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        $comparison = Activity::whereBetween('created_at', [
            $request->start_date,
            $request->end_date,
        ])
            ->with('organisation')
            ->select('organisation_id', DB::raw('count(*) as activity_count'))
            ->groupBy('organisation_id')
            ->get()
            ->map(function ($item) {
                return [
                    'organisation_id' => $item->organisation_id,
                    'organisation_name' => $item->organisation->name ?? 'Unknown',
                    'activity_count' => $item->activity_count,
                ];
            });

        return $this->success($comparison, 'Organisation comparison retrieved');
    }
}

