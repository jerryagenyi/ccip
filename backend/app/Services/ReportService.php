<?php

namespace App\Services;

use App\Models\Activity;
use App\Models\Report;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;

class ReportService
{
    /**
     * Generate PDF report
     */
    public function generatePdf(Report $report): string
    {
        try {
            $data = $this->prepareReportData($report);

            $pdf = Pdf::loadView('reports.template', [
                'report' => $report,
                'data' => $data,
            ]);

            $filename = 'reports/'.$report->id.'_'.time().'.pdf';
            $path = Storage::disk('s3')->put($filename, $pdf->output());

            $report->update([
                'file_path' => $filename,
                'file_format' => 'pdf',
                'status' => 'completed',
                'generated_at' => now(),
            ]);

            return $filename;
        } catch (\Exception $e) {
            Log::error('PDF generation failed', [
                'report_id' => $report->id,
                'error' => $e->getMessage(),
            ]);

            $report->update(['status' => 'failed']);
            throw $e;
        }
    }

    /**
     * Generate Excel report
     */
    public function generateExcel(Report $report): string
    {
        try {
            $data = $this->prepareReportData($report);

            $filename = 'reports/'.$report->id.'_'.time().'.xlsx';

            Excel::store(
                new \App\Exports\ReportExport($data, $report),
                $filename,
                's3'
            );

            $report->update([
                'file_path' => $filename,
                'file_format' => 'excel',
                'status' => 'completed',
                'generated_at' => now(),
            ]);

            return $filename;
        } catch (\Exception $e) {
            Log::error('Excel generation failed', [
                'report_id' => $report->id,
                'error' => $e->getMessage(),
            ]);

            $report->update(['status' => 'failed']);
            throw $e;
        }
    }

    /**
     * Generate CSV report
     */
    public function generateCsv(Report $report): string
    {
        try {
            $data = $this->prepareReportData($report);

            $filename = 'reports/'.$report->id.'_'.time().'.csv';
            $file = fopen('php://temp', 'r+');

            // Write headers
            if (! empty($data)) {
                fputcsv($file, array_keys($data[0]));

                // Write data
                foreach ($data as $row) {
                    fputcsv($file, $row);
                }
            }

            rewind($file);
            $content = stream_get_contents($file);
            fclose($file);

            Storage::disk('s3')->put($filename, $content);

            $report->update([
                'file_path' => $filename,
                'file_format' => 'csv',
                'status' => 'completed',
                'generated_at' => now(),
            ]);

            return $filename;
        } catch (\Exception $e) {
            Log::error('CSV generation failed', [
                'report_id' => $report->id,
                'error' => $e->getMessage(),
            ]);

            $report->update(['status' => 'failed']);
            throw $e;
        }
    }

    /**
     * Prepare report data based on filters
     */
    protected function prepareReportData(Report $report): array
    {
        $filters = $report->filters ?? [];
        $data = [];

        switch ($report->type) {
            case 'activity-summary':
                $data = $this->getActivitySummaryData($filters);
                break;
            case 'performance-analysis':
                $data = $this->getPerformanceAnalysisData($filters);
                break;
            case 'impact-assessment':
                $data = $this->getImpactAssessmentData($filters);
                break;
            default:
                $data = $this->getActivitySummaryData($filters);
        }

        return $data;
    }

    /**
     * Get activity summary data
     */
    protected function getActivitySummaryData(array $filters): array
    {
        $query = Activity::with(['organisation', 'creator']);

        if (isset($filters['dateRange'])) {
            $query->whereBetween('created_at', [
                $filters['dateRange']['start'],
                $filters['dateRange']['end'],
            ]);
        }

        if (isset($filters['organisations'])) {
            $query->whereIn('organisation_id', $filters['organisations']);
        }

        if (isset($filters['statuses'])) {
            $query->whereIn('status', $filters['statuses']);
        }

        $activities = $query->get();

        return $activities->map(function ($activity) {
            return [
                'id' => $activity->id,
                'title' => $activity->title,
                'type' => $activity->type,
                'status' => $activity->status,
                'organisation' => $activity->organisation->name ?? 'N/A',
                'created_by' => $activity->creator->name ?? 'N/A',
                'created_at' => $activity->created_at->format('Y-m-d H:i:s'),
            ];
        })->toArray();
    }

    /**
     * Get performance analysis data
     */
    protected function getPerformanceAnalysisData(array $filters): array
    {
        // TODO: Implement performance analysis data aggregation
        return $this->getActivitySummaryData($filters);
    }

    /**
     * Get impact assessment data
     */
    protected function getImpactAssessmentData(array $filters): array
    {
        // TODO: Implement impact assessment data aggregation
        return $this->getActivitySummaryData($filters);
    }
}
