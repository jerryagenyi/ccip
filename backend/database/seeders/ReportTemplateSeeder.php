<?php

namespace Database\Seeders;

use App\Models\ReportTemplate;
use Illuminate\Database\Seeder;

class ReportTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $templates = [
            [
                'name' => 'Activity Summary Report',
                'slug' => 'activity-summary',
                'description' => 'Comprehensive summary of activities with key metrics',
                'structure' => [
                    'sections' => ['overview', 'activities', 'metrics', 'recommendations'],
                ],
                'is_default' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Performance Analysis Report',
                'slug' => 'performance-analysis',
                'description' => 'Detailed performance analysis with trends and comparisons',
                'structure' => [
                    'sections' => ['performance_metrics', 'trends', 'comparisons', 'insights'],
                ],
                'is_default' => false,
                'is_active' => true,
            ],
            [
                'name' => 'Impact Assessment Report',
                'slug' => 'impact-assessment',
                'description' => 'Assessment of impact and outcomes',
                'structure' => [
                    'sections' => ['impact_metrics', 'outcomes', 'stakeholder_feedback', 'lessons_learned'],
                ],
                'is_default' => false,
                'is_active' => true,
            ],
            [
                'name' => 'Semiotic Analysis Report',
                'slug' => 'semiotic-analysis',
                'description' => 'AI-powered semiotic analysis of communication messages',
                'structure' => [
                    'sections' => ['analysis', 'risk_assessment', 'cultural_appropriateness', 'recommendations'],
                ],
                'is_default' => false,
                'is_active' => true,
            ],
            [
                'name' => 'Stakeholder Update Report',
                'slug' => 'stakeholder-update',
                'description' => 'Executive summary for stakeholders',
                'structure' => [
                    'sections' => ['executive_summary', 'key_highlights', 'progress', 'next_steps'],
                ],
                'is_default' => false,
                'is_active' => true,
            ],
            [
                'name' => 'Research Findings Report',
                'slug' => 'research-findings',
                'description' => 'Research findings and data analysis',
                'structure' => [
                    'sections' => ['research_objectives', 'methodology', 'findings', 'conclusions'],
                ],
                'is_default' => false,
                'is_active' => true,
            ],
            [
                'name' => 'Incident Report',
                'slug' => 'incident-report',
                'description' => 'Incident reporting and analysis',
                'structure' => [
                    'sections' => ['incident_details', 'timeline', 'impact', 'response', 'prevention'],
                ],
                'is_default' => false,
                'is_active' => true,
            ],
        ];

        foreach ($templates as $template) {
            ReportTemplate::create($template);
        }
    }
}
