<template>
  <q-card class="ai-report-generator" flat bordered>
    <q-card-section class="bg-primary text-white">
      <div class="text-h6 flex items-center">
        <q-icon name="auto_awesome" class="q-mr-sm" />
        AI Report Generator
      </div>
      <div class="text-caption">Generate comprehensive reports powered by AI analysis</div>
    </q-card-section>

    <q-card-section v-if="!report && !generating">
      <q-form ref="formRef" @submit="generateReport" class="q-gutter-md">
        <!-- Report Title -->
        <q-input
          v-model="formData.title"
          label="Report Title"
          outlined
          dense
          :rules="[val => !!val || 'Title is required']"
          hint="Enter a descriptive title for the report"
        />

        <!-- Report Description -->
        <q-input
          v-model="formData.description"
          label="Report Description"
          type="textarea"
          outlined
          rows="3"
          :rules="[val => !!val || 'Description is required']"
          hint="Briefly describe what this report should cover"
        />

        <!-- Report Type -->
        <q-select
          v-model="formData.type"
          :options="reportTypeOptions"
          label="Report Type"
          outlined
          dense
          emit-value
          map-options
          :rules="[val => !!val || 'Report type is required']"
          hint="Select the type of report to generate"
        />

        <!-- Activities Selection -->
        <div v-if="activities.length > 0">
          <div class="text-subtitle2 q-mb-sm">Select Activities to Include</div>
          <q-select
            v-model="formData.activityIds"
            :options="activityOptions"
            label="Activities"
            outlined
            dense
            multiple
            emit-value
            map-options
            use-chips
            clearable
            :rules="[val => (val && val.length > 0) || 'At least one activity must be selected']"
            hint="Choose activities to include in the report"
          />
        </div>

        <!-- AI Configuration -->
        <q-expansion-item
          icon="settings"
          label="AI Configuration"
          caption="Customize AI generation settings"
          class="q-mt-md"
        >
          <q-card flat class="q-mt-sm">
            <q-card-section class="q-gutter-md">
              <!-- Tone -->
              <q-select
                v-model="formData.tone"
                :options="toneOptions"
                label="Report Tone"
                outlined
                dense
                emit-value
                map-options
                hint="Choose the writing style for the report"
              />

              <!-- Audience -->
              <q-input
                v-model="formData.audience"
                label="Target Audience"
                outlined
                dense
                hint="Describe the primary audience for this report"
              />

              <!-- Include Recommendations -->
              <q-checkbox
                v-model="formData.includeRecommendations"
                label="Include AI-generated recommendations"
                color="primary"
              />

              <!-- Include Visualizations -->
              <q-checkbox
                v-model="formData.includeVisualizations"
                label="Include data visualizations and charts"
                color="primary"
              />

              <!-- Custom Instructions -->
              <q-input
                v-model="formData.customInstructions"
                label="Custom Instructions (Optional)"
                type="textarea"
                outlined
                rows="3"
                hint="Any specific requirements or focus areas for the report"
              />
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <!-- Generation Options -->
        <q-card flat bordered class="q-mt-md">
          <q-card-section class="bg-grey-2">
            <div class="text-subtitle2">Generation Options</div>
          </q-card-section>
          <q-card-section class="q-gutter-sm">
            <q-option-group
              v-model="generationOptions"
              :options="generationOptionList"
              color="primary"
            />
          </q-card-section>
        </q-card>

        <!-- Generate Button -->
        <div class="row q-mt-lg">
          <q-space />
          <q-btn
            type="submit"
            color="primary"
            label="Generate Report"
            icon="auto_awesome"
            :loading="generating"
            class="q-ml-sm"
          />
        </div>
      </q-form>
    </q-card-section>

    <!-- Generation Progress -->
    <q-card-section v-if="generating" class="q-pa-lg">
      <div class="text-center">
        <q-spinner-dots size="3rem" color="primary" />
        <p class="text-h6 q-mt-md">Generating Report...</p>
        <div class="text-body2 text-grey-6 q-mb-lg">
          Our AI is analyzing the selected activities and creating a comprehensive report
        </div>

        <!-- Progress Steps -->
        <q-stepper v-model="generationStep" vertical color="primary" animated flat>
          <q-step
            :name="1"
            title="Analyzing Activities"
            icon="analytics"
            :done="generationStep > 1"
          />
          <q-step :name="2" title="Processing Data" icon="data_usage" :done="generationStep > 2" />
          <q-step
            :name="3"
            title="Generating Insights"
            icon="psychology"
            :done="generationStep > 3"
          />
          <q-step :name="4" title="Creating Report" icon="description" :done="generationStep > 4" />
          <q-step :name="5" title="Finalizing" icon="check_circle" :done="generationStep > 5" />
        </q-stepper>

        <!-- Estimated Time -->
        <div class="text-caption text-grey-6 q-mt-md">
          Estimated time remaining: {{ estimatedTime }} seconds
        </div>
      </div>
    </q-card-section>

    <!-- Generated Report Preview -->
    <q-card-section v-if="report" class="report-preview">
      <div class="row items-center q-mb-md">
        <div class="col">
          <div class="text-h6">Report Generated Successfully</div>
          <div class="text-caption text-grey-6">Created on {{ formatDate(report.createdAt) }}</div>
        </div>
        <div class="col-auto">
          <q-btn flat round icon="close" @click="clearReport" />
        </div>
      </div>

      <!-- Report Summary -->
      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="text-subtitle2 q-mb-sm">Report Summary</div>
          <p class="q-mb-none">{{ report.summary }}</p>
        </q-card-section>
      </q-card>

      <!-- Key Insights -->
      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="text-subtitle2 q-mb-sm">Key Insights</div>
          <q-list>
            <q-item v-for="(insight, index) in report.insights" :key="index" dense>
              <q-item-section avatar>
                <q-icon name="lightbulb" color="info" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ insight }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>

      <!-- Action Buttons -->
      <div class="row q-mt-lg q-gutter-sm">
        <q-btn color="primary" label="View Full Report" icon="visibility" @click="viewReport" />
        <q-btn color="secondary" label="Download PDF" icon="download" @click="downloadReport" />
        <q-btn color="info" label="Edit Report" icon="edit" @click="editReport" />
        <q-space />
        <q-btn flat color="primary" label="Generate Another" icon="refresh" @click="resetForm" />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useReportStore } from '@/stores/useReportStore';
import { useActivityStore } from '@/stores/useActivityStore';
import type { Report, Activity } from '@/types';

const router = useRouter();
const $q = useQuasar();
const reportStore = useReportStore();
const activityStore = useActivityStore();

const formRef = ref();
const generating = ref(false);
const generationStep = ref(1);
const estimatedTime = ref(30);
const report = ref<Report | null>(null);

const activities = ref<Activity[]>([]);

const formData = ref({
  title: '',
  description: '',
  type: '',
  activityIds: [] as string[],
  tone: 'professional' as 'professional' | 'casual' | 'academic',
  audience: '',
  includeRecommendations: true,
  includeVisualizations: true,
  customInstructions: '',
});

const generationOptions = ref([
  'executive-summary',
  'data-visualization',
  'comparative-analysis',
  'trend-analysis',
]);

const reportTypeOptions = [
  { label: 'Activity Summary', value: 'activity-summary' },
  { label: 'Performance Analysis', value: 'performance-analysis' },
  { label: 'Impact Assessment', value: 'impact-assessment' },
  { label: 'Semiotic Analysis', value: 'semiotic-analysis' },
  { label: 'Stakeholder Update', value: 'stakeholder-update' },
  { label: 'Research Findings', value: 'research-findings' },
  { label: 'Incident Report', value: 'incident-report' },
];

const toneOptions = [
  { label: 'Professional', value: 'professional' },
  { label: 'Casual', value: 'casual' },
  { label: 'Academic', value: 'academic' },
];

const generationOptionList = [
  {
    label: 'Include executive summary',
    value: 'executive-summary',
  },
  {
    label: 'Generate data visualizations',
    value: 'data-visualization',
  },
  {
    label: 'Perform comparative analysis',
    value: 'comparative-analysis',
  },
  {
    label: 'Include trend analysis',
    value: 'trend-analysis',
  },
];

const activityOptions = computed(() =>
  activities.value.map(activity => ({
    label: `${activity.title} (${activity.type})`,
    value: activity.id,
    caption: activity.description,
  }))
);

// Simulate generation progress
function simulateGenerationProgress() {
  const steps = 5;
  const stepDuration = 3000; // 3 seconds per step

  for (let i = 1; i <= steps; i++) {
    setTimeout(() => {
      generationStep.value = i;
      if (i < steps) {
        estimatedTime.value = Math.max(1, (steps - i) * 3);
      }
    }, i * stepDuration);
  }
}

async function generateReport() {
  const isValid = await formRef.value.validate();
  if (!isValid) return;

  generating.value = true;
  generationStep.value = 1;
  estimatedTime.value = 15;

  try {
    // Start progress simulation
    simulateGenerationProgress();

    // Call AI generation
    const generatedReport = await reportStore.generateAIReport({
      title: formData.value.title,
      description: formData.value.description,
      activityIds: formData.value.activityIds,
      type: formData.value.type as any,
      tone: formData.value.tone,
      audience: formData.value.audience,
      includeRecommendations: formData.value.includeRecommendations,
      includeVisualizations: formData.value.includeVisualizations,
      customInstructions: formData.value.customInstructions,
    });

    // Simulate delay for demo
    await new Promise(resolve => setTimeout(resolve, 15000));

    report.value = generatedReport;
    generationStep.value = 5;

    $q.notify({
      type: 'positive',
      message: 'Report generated successfully',
      position: 'top',
    });
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to generate report',
      position: 'top',
    });
    console.error('Report generation error:', error);
  } finally {
    generating.value = false;
  }
}

function viewReport() {
  if (report.value) {
    router.push(`/reports/${report.value.id}`);
  }
}

async function downloadReport() {
  if (report.value) {
    try {
      await reportStore.downloadReport(report.value.id, 'pdf');
      $q.notify({
        type: 'positive',
        message: 'Report downloaded successfully',
        position: 'top',
      });
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Failed to download report',
        position: 'top',
      });
    }
  }
}

function editReport() {
  if (report.value) {
    router.push(`/reports/${report.value.id}/edit`);
  }
}

function clearReport() {
  report.value = null;
}

function resetForm() {
  clearReport();
  formData.value = {
    title: '',
    description: '',
    type: '',
    activityIds: [],
    tone: 'professional',
    audience: '',
    includeRecommendations: true,
    includeVisualizations: true,
    customInstructions: '',
  };
  generationStep.value = 1;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString();
}

// Load activities on mount
onMounted(async () => {
  try {
    await activityStore.fetchActivities({ perPage: 100 });
    activities.value = activityStore.activities;
  } catch (error) {
    console.error('Failed to load activities:', error);
  }
});
</script>

<style scoped lang="scss">
.ai-report-generator {
  .q-stepper {
    :deep(.q-stepper__step) {
      padding: 8px 16px;
    }
  }

  .report-preview {
    .q-card {
      :deep(.q-card__section) {
        padding: 16px;
      }
    }
  }
}
</style>
