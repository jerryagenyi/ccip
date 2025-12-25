<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Services\AIService;
use Illuminate\Http\Request;

class AIController extends Controller
{
    protected $aiService;

    public function __construct(AIService $aiService)
    {
        $this->aiService = $aiService;
    }

    public function semioticAnalyze(Request $request)
    {
        $request->validate([
            'activity_id' => 'required|exists:activities,id',
            'message_type' => 'required|string',
            'target_audience' => 'required|array',
            'target_audience.region' => 'required|string',
            'target_audience.language' => 'required|string',
            'target_audience.culture' => 'required|string',
            'planned_message' => 'required|array',
            'planned_message.content' => 'required|string',
            'planned_message.channels' => 'required|array',
            'planned_message.messengers' => 'required|array',
        ]);

        $activity = Activity::findOrFail($request->activity_id);

        try {
            $analysis = $this->aiService->analyzeSemiotics([
                'message_content' => $request->planned_message['content'],
                'message_type' => $request->message_type,
                'target_region' => $request->target_audience['region'],
                'target_language' => $request->target_audience['language'],
                'target_culture' => $request->target_audience['culture'],
                'channels' => $request->planned_message['channels'],
                'messengers' => $request->planned_message['messengers'],
            ]);

            // Save analysis to activity
            $activity->update([
                'semiotic_assessment' => $analysis,
                'human_review_completed' => false,
            ]);

            return $this->success($analysis, 'Semiotic analysis completed');
        } catch (\Exception $e) {
            return $this->error('AI analysis failed: '.$e->getMessage(), 500);
        }
    }

    public function generateReport(Request $request)
    {
        $request->validate([
            'template_id' => 'required|exists:report_templates,id',
            'title' => 'required|string|max:255',
            'filters' => 'required|array',
            'format' => 'required|in:pdf,excel,csv',
        ]);

        try {
            $report = $this->aiService->generateReport([
                'template_id' => $request->template_id,
                'title' => $request->title,
                'filters' => $request->filters,
                'format' => $request->format,
            ]);

            return $this->success($report, 'AI report generated successfully', 201);
        } catch (\Exception $e) {
            return $this->error('AI report generation failed: '.$e->getMessage(), 500);
        }
    }

    public function insights(Request $request)
    {
        $request->validate([
            'activity_id' => 'nullable|exists:activities,id',
            'organisation_id' => 'nullable|exists:organisations,id',
        ]);

        try {
            $insights = $this->aiService->generateInsights([
                'activity_id' => $request->activity_id,
                'organisation_id' => $request->organisation_id,
            ]);

            return $this->success($insights, 'Insights generated successfully');
        } catch (\Exception $e) {
            return $this->error('Insights generation failed: '.$e->getMessage(), 500);
        }
    }
}
