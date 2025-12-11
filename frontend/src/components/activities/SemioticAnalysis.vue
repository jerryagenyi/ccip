<template>
  <q-card class="semiotic-analysis-card" flat bordered>
    <q-card-section class="bg-primary text-white">
      <div class="text-h6">
        <q-icon name="psychology" class="q-mr-sm" />
        AI Semiotic Analysis
      </div>
      <div class="text-caption">
        Analyze the semiotic effectiveness of your activity message
      </div>
    </q-card-section>

    <q-card-section v-if="!loading && !analysis">
      <div class="text-center q-pa-lg">
        <q-icon name="psychology" size="4rem" color="primary" class="q-mb-md" />
        <p class="text-body1">
          Run an AI-powered semiotic analysis to evaluate your message's effectiveness across different cultural contexts, languages, and demographic groups.
        </p>
        <q-btn
          color="primary"
          label="Run Analysis"
          icon="auto_awesome"
          :loading="loading"
          @click="runAnalysis"
        />
      </div>
    </q-card-section>

    <q-card-section v-if="loading" class="q-pa-lg">
      <div class="text-center">
        <q-spinner-dots size="3rem" color="primary" />
        <p class="text-body1 q-mt-md">
          Analyzing semiotic patterns...
        </p>
        <div class="text-caption text-grey-6">
          This may take a few moments as our AI evaluates cultural appropriateness, linguistic effectiveness, and visual communication strategies.
        </div>
      </div>
    </q-card-section>

    <q-card-section v-if="analysis" class="analysis-results">
      <!-- Overall Risk Score -->
      <q-card flat bordered class="q-mb-md">
        <q-card-section class="bg-grey-2">
          <div class="text-h6 text-weight-medium">
            Overall Risk Score
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row items-center q-gutter-md">
            <div class="col-auto">
              <q-circular-progress
                show-value
                font-size="1.5rem"
                :value="analysis.riskScore"
                size="5rem"
                :thickness="0.2"
                :color="getRiskColor(analysis.riskScore)"
                track-color="grey-3"
              >
                <div class="text-weight-bold" :class="`text-${getRiskColor(analysis.riskScore)}`">
                  {{ analysis.riskScore }}%
                </div>
              </q-circular-progress>
            </div>
            <div class="col">
              <div class="text-subtitle2 q-mt-sm">
                Risk Level: <span class="text-weight-bold" :class="`text-${getRiskColor(analysis.riskScore)}`">
                  {{ getRiskLevel(analysis.riskScore) }}
                </span>
              </div>
              <div class="text-caption text-grey-6">
                {{ getRiskDescription(analysis.riskScore) }}
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Cultural Appropriateness -->
      <q-card flat bordered class="q-mb-md">
        <q-card-section class="bg-grey-2">
          <div class="text-h6 text-weight-medium flex items-center">
            <q-icon name="diversity_3" class="q-mr-sm" />
            Cultural Appropriateness
          </div>
        </q-card-section>
        <q-card-section>
          <q-linear-progress
            :value="analysis.culturalAppropriateness.score / 100"
            :color="getScoreColor(analysis.culturalAppropriateness.score)"
            size="8px"
            rounded
            class="q-mb-sm"
          />
          <div class="text-subtitle2 q-mt-sm">
            Score: {{ analysis.culturalAppropriateness.score }}/100
          </div>
          <q-list>
            <q-item v-for="(item, index) in analysis.culturalAppropriateness.issues" :key="index">
              <q-item-section avatar>
                <q-icon :name="item.severity === 'high' ? 'warning' : item.severity === 'medium' ? 'error' : 'info'"
                         :color="item.severity === 'high' ? 'negative' : item.severity === 'medium' ? 'warning' : 'info'" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ item.message }}</q-item-label>
                <q-item-label caption>{{ item.recommendation }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>

      <!-- Linguistic Effectiveness -->
      <q-card flat bordered class="q-mb-md">
        <q-card-section class="bg-grey-2">
          <div class="text-h6 text-weight-medium flex items-center">
            <q-icon name="translate" class="q-mr-sm" />
            Linguistic Effectiveness
          </div>
        </q-card-section>
        <q-card-section>
          <q-linear-progress
            :value="analysis.linguisticEffectiveness.score / 100"
            :color="getScoreColor(analysis.linguisticEffectiveness.score)"
            size="8px"
            rounded
            class="q-mb-sm"
          />
          <div class="text-subtitle2 q-mt-sm">
            Score: {{ analysis.linguisticEffectiveness.score }}/100
          </div>
          <q-chip
            v-for="suggestion in analysis.linguisticEffectiveness.suggestions"
            :key="suggestion"
            icon="lightbulb"
            color="info"
            text-color="white"
            class="q-ma-sm"
          >
            {{ suggestion }}
          </q-chip>
        </q-card-section>
      </q-card>

      <!-- Visual Communication -->
      <q-card flat bordered class="q-mb-md">
        <q-card-section class="bg-grey-2">
          <div class="text-h6 text-weight-medium flex items-center">
            <q-icon name="image" class="q-mr-sm" />
            Visual Communication
          </div>
        </q-card-section>
        <q-card-section>
          <q-linear-progress
            :value="analysis.visualCommunication.score / 100"
            :color="getScoreColor(analysis.visualCommunication.score)"
            size="8px"
            rounded
            class="q-mb-sm"
          />
          <div class="text-subtitle2 q-mt-sm">
            Score: {{ analysis.visualCommunication.score }}/100
          </div>
          <q-expansion-item
            v-for="(item, index) in analysis.visualCommunication.recommendations"
            :key="index"
            :label="item.category"
            icon="tips_and_updates"
            class="q-ma-sm"
          >
            <q-card>
              <q-card-section>
                <p class="q-mb-none">{{ item.description }}</p>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-card-section>
      </q-card>

      <!-- Action Buttons -->
      <div class="row q-mt-lg q-gutter-sm">
        <q-btn
          flat
          color="primary"
          label="Download Report"
          icon="download"
          @click="downloadReport"
        />
        <q-btn
          flat
          color="primary"
          label="Re-run Analysis"
          icon="refresh"
          @click="runAnalysis"
        />
        <q-space />
        <q-btn
          flat
          color="negative"
          label="Clear Results"
          icon="clear"
          @click="clearAnalysis"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useActivityStore } from '@/stores/useActivityStore';
import type { SemioticAssessment } from '@/types';

const props = defineProps<{
  activityId?: string;
  activityData?: any;
}>();

const $q = useQuasar();
const activityStore = useActivityStore();

const loading = ref(false);
const analysis = ref<SemioticAssessment | null>(null);

async function runAnalysis() {
  loading.value = true;
  try {
    let result: SemioticAssessment;

    if (props.activityId) {
      // Analyze existing activity
      result = await activityStore.runSemioticAnalysis(props.activityId);
    } else if (props.activityData) {
      // Simulate analysis for new activity data
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate API call
      result = generateMockAnalysis(props.activityData);
    } else {
      throw new Error('No activity data provided for analysis');
    }

    analysis.value = result;

    $q.notify({
      type: 'positive',
      message: 'Analysis completed successfully',
      position: 'top'
    });
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to run analysis',
      position: 'top'
    });
    console.error('Semiotic analysis error:', error);
  } finally {
    loading.value = false;
  }
}

function generateMockAnalysis(activityData: any): SemioticAssessment {
  // Generate mock analysis based on activity data
  const baseScore = Math.floor(Math.random() * 30) + 50; // 50-80

  return {
    riskScore: Math.floor(Math.random() * 30) + 20, // 20-50
    culturalAppropriateness: {
      score: baseScore + Math.floor(Math.random() * 20),
      issues: [
        {
          severity: 'medium',
          message: 'Message may need adaptation for rural audiences',
          recommendation: 'Consider using local proverbs or examples to improve resonance'
        },
        {
          severity: 'low',
          message: 'Language is generally appropriate',
          recommendation: 'Minor adjustments may improve clarity'
        }
      ]
    },
    linguisticEffectiveness: {
      score: baseScore + Math.floor(Math.random() * 15),
      suggestions: [
        'Use simpler vocabulary for broader audience comprehension',
        'Consider adding visual aids to reinforce key messages',
        'Incorporate local idioms or phrases for better engagement'
      ]
    },
    visualCommunication: {
      score: baseScore + Math.floor(Math.random() * 10),
      recommendations: [
        {
          category: 'Color Psychology',
          description: 'Consider using colors that resonate with local cultural significance. Avoid colors that may have negative connotations in target regions.'
        },
        {
          category: 'Symbol Selection',
          description: 'Ensure symbols and imagery are culturally appropriate and easily recognizable by the target demographic.'
        }
      ]
    },
    recommendations: [
      'Conduct pilot testing with sample audience',
      'Include feedback mechanisms for continuous improvement',
      'Consider multiple language versions for diverse audiences'
    ],
    generatedAt: new Date().toISOString()
  };
}

function getRiskColor(score: number): string {
  if (score < 30) return 'positive';
  if (score < 50) return 'warning';
  return 'negative';
}

function getRiskLevel(score: number): string {
  if (score < 30) return 'Low Risk';
  if (score < 50) return 'Medium Risk';
  return 'High Risk';
}

function getRiskDescription(score: number): string {
  if (score < 30) return 'Message is well-culturally adapted and ready for deployment';
  if (score < 50) return 'Minor adjustments recommended before deployment';
  return 'Significant revisions required before deployment';
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'positive';
  if (score >= 60) return 'info';
  if (score >= 40) return 'warning';
  return 'negative';
}

function downloadReport() {
  if (!analysis.value) return;

  // Generate PDF report
  const reportData = {
    activity: props.activityData,
    analysis: analysis.value,
    generatedAt: new Date().toISOString()
  };

  // Create a blob and download
  const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `semiotic-analysis-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);

  $q.notify({
    type: 'positive',
    message: 'Analysis report downloaded',
    position: 'top'
  });
}

function clearAnalysis() {
  analysis.value = null;
}
</script>

<style scoped lang="scss">
.semiotic-analysis-card {
  .analysis-results {
    :deep(.q-linear-progress) {
      .q-linear-progress__track {
        background-color: rgba(0, 0, 0, 0.1);
      }
    }

    .q-circular-progress {
      .q-circular-progress__text {
        font-size: 1.2rem;
      }
    }
  }
}
</style>