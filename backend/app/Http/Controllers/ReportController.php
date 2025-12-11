<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\ReportTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ReportController extends Controller
{
    public function templates(Request $request)
    {
        $templates = ReportTemplate::where('is_active', true)->get();
        return $this->success($templates, 'Templates retrieved successfully');
    }

    public function index(Request $request)
    {
        $query = Report::with(['creator', 'template'])
            ->where('created_by', $request->user()->id);

        if ($request->has('status')) {
            $query->whereIn('status', (array) $request->status);
        }

        if ($request->has('type')) {
            $query->whereIn('type', (array) $request->type);
        }

        $perPage = $request->get('per_page', 15);
        $reports = $query->latest()->paginate($perPage);

        return $this->paginated($reports, 'Reports retrieved successfully');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:activity-summary,performance-analysis,impact-assessment,semiotic-analysis,stakeholder-update,research-findings,incident-report',
            'template_id' => 'nullable|exists:report_templates,id',
            'filters' => 'nullable|array',
        ]);

        $validated['created_by'] = $request->user()->id;
        $validated['status'] = 'draft';

        $report = Report::create($validated);

        return $this->success($report->load(['creator', 'template']), 'Report created successfully', 201);
    }

    public function generate(Request $request)
    {
        $request->validate([
            'template_id' => 'required|exists:report_templates,id',
            'title' => 'required|string|max:255',
            'filters' => 'required|array',
            'format' => 'required|in:pdf,excel,csv',
            'includeAI' => 'sometimes|boolean',
        ]);

        // TODO: Implement actual report generation
        // This would use ReportService to generate the report

        $report = Report::create([
            'title' => $request->title,
            'type' => ReportTemplate::find($request->template_id)->slug ?? 'activity-summary',
            'template_id' => $request->template_id,
            'filters' => $request->filters,
            'created_by' => $request->user()->id,
            'status' => 'generating',
            'file_format' => $request->format,
        ]);

        // TODO: Queue report generation job
        // dispatch(new GenerateReportJob($report));

        return $this->success($report, 'Report generation started', 202);
    }

    public function show($id)
    {
        $report = Report::with(['creator', 'template'])
            ->where('created_by', request()->user()->id)
            ->findOrFail($id);

        return $this->success($report, 'Report retrieved successfully');
    }

    public function update(Request $request, $id)
    {
        $report = Report::where('created_by', $request->user()->id)
            ->findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'filters' => 'nullable|array',
        ]);

        $report->update($validated);

        return $this->success($report->load(['creator', 'template']), 'Report updated successfully');
    }

    public function destroy($id)
    {
        $report = Report::where('created_by', request()->user()->id)
            ->findOrFail($id);

        // Delete file if exists
        if ($report->file_path) {
            Storage::disk('s3')->delete($report->file_path);
        }

        $report->delete();

        return $this->success(null, 'Report deleted successfully');
    }

    public function export(Request $request, $id, $format)
    {
        $report = Report::where('created_by', $request->user()->id)
            ->findOrFail($id);

        if ($report->status !== 'completed' || !$report->file_path) {
            return $this->error('Report not ready for export', 400);
        }

        $url = Storage::disk('s3')->temporaryUrl(
            $report->file_path,
            now()->addMinutes(30)
        );

        return $this->success([
            'download_url' => $url,
            'expires_at' => now()->addMinutes(30)->toIso8601String(),
        ], 'Export URL generated');
    }
}

