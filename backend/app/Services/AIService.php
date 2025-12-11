<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AIService
{
    protected $apiKey;
    protected $apiUrl;
    protected $model;

    public function __construct()
    {
        $this->apiKey = config('services.openai.api_key');
        $this->apiUrl = config('services.openai.api_url', 'https://api.openai.com/v1');
        $this->model = config('services.openai.model', 'gpt-4');
    }

    public function analyzeSemiotics(array $data): array
    {
        $prompt = $this->buildSemioticPrompt($data);

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post($this->apiUrl . '/chat/completions', [
                'model' => $this->model,
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'You are an expert in semiotic analysis and risk communication. Analyze messages for cultural appropriateness and effectiveness.',
                    ],
                    [
                        'role' => 'user',
                        'content' => $prompt,
                    ],
                ],
                'temperature' => 0.7,
                'max_tokens' => 2000,
            ]);

            if ($response->successful()) {
                $result = $response->json();
                $analysis = json_decode($result['choices'][0]['message']['content'], true);

                return [
                    'risk_score' => $analysis['risk_score'] ?? 0,
                    'cultural_appropriateness' => $analysis['cultural_appropriateness'] ?? 'unknown',
                    'recommendations' => $analysis['recommendations'] ?? [],
                    'potential_issues' => $analysis['potential_issues'] ?? [],
                    'strengths' => $analysis['strengths'] ?? [],
                    'analyzed_at' => now()->toIso8601String(),
                ];
            }

            throw new \Exception('AI API request failed');
        } catch (\Exception $e) {
            Log::error('AI Semiotic Analysis failed', [
                'error' => $e->getMessage(),
                'data' => $data,
            ]);

            // Return mock data if AI fails
            return $this->getMockAnalysis();
        }
    }

    public function generateReport(array $data): array
    {
        // TODO: Implement AI report generation
        return [
            'status' => 'generating',
            'message' => 'Report generation started',
        ];
    }

    public function generateInsights(array $data): array
    {
        // TODO: Implement AI insights generation
        return [
            'insights' => [],
            'recommendations' => [],
        ];
    }

    private function buildSemioticPrompt(array $data): string
    {
        return "Analyze the following risk communication message for semiotic appropriateness:

Message Content: {$data['message_content']}
Message Type: {$data['message_type']}
Target Region: {$data['target_region']}
Target Language: {$data['target_language']}
Target Culture: {$data['target_culture']}
Channels: " . implode(', ', $data['channels']) . "
Messengers: " . implode(', ', $data['messengers']) . "

Please provide a JSON response with:
- risk_score (0-100)
- cultural_appropriateness (low/medium/high)
- recommendations (array of strings)
- potential_issues (array of strings)
- strengths (array of strings)";
    }

    private function getMockAnalysis(): array
    {
        return [
            'risk_score' => 50,
            'cultural_appropriateness' => 'medium',
            'recommendations' => [
                'Review message with cultural experts',
                'Test message with target audience',
            ],
            'potential_issues' => [],
            'strengths' => [
                'Clear and concise messaging',
            ],
            'analyzed_at' => now()->toIso8601String(),
            'note' => 'Mock analysis - AI service unavailable',
        ];
    }
}

