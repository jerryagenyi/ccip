<template>
  <div class="pdf-export-button">
    <q-btn-dropdown
      :color="color"
      :label="label"
      :icon="icon"
      :loading="loading"
      :disable="disable"
      split
      @click="handleDefaultExport"
    >
      <q-list>
        <q-item
          v-for="option in exportOptions"
          :key="option.value"
          clickable
          @click="handleExport(option)"
          v-close-popup
        >
          <q-item-section avatar>
            <q-icon :name="option.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ option.label }}</q-item-label>
            <q-item-label caption>{{ option.description }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>

    <!-- Progress Dialog -->
    <q-dialog v-model="showProgress" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center">
          <q-spinner-dots size="2rem" color="primary" />
          <div class="col q-ml-md">
            <div class="text-h6">{{ progressTitle }}</div>
            <div class="text-caption text-grey-6">{{ progressMessage }}</div>
          </div>
        </q-card-section>

        <q-linear-progress
          v-if="showProgressBar"
          :value="progressValue"
          color="primary"
          size="4px"
          class="q-mt-md"
        />
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { pdfExportService, downloadPDF } from '@/services/pdfExport';
import type { Report, Activity } from '@/types';

interface ExportOption {
  value: string;
  label: string;
  description: string;
  icon: string;
  options?: Record<string, any>;
}

interface Props {
  data: Report | Activity;
  label?: string;
  icon?: string;
  color?: string;
  defaultFormat?: 'summary' | 'detailed';
  disable?: boolean;
  customOptions?: ExportOption[];
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Export PDF',
  icon: 'download',
  color: 'primary',
  defaultFormat: 'summary',
});

const $q = useQuasar();

const loading = ref(false);
const showProgress = ref(false);
const showProgressBar = ref(true);
const progressTitle = ref('Exporting PDF');
const progressMessage = ref('Preparing your document...');
const progressValue = ref(0);

// Default export options
const defaultReportOptions: ExportOption[] = [
  {
    value: 'full',
    label: 'Full Report',
    description: 'Complete report with all sections',
    icon: 'description',
    options: {
      includeExecutiveSummary: true,
      includeVisualizations: true,
      includeRawData: false,
    },
  },
  {
    value: 'summary',
    label: 'Summary Only',
    description: 'Executive summary and key findings',
    icon: 'summarize',
    options: {
      includeExecutiveSummary: true,
      includeVisualizations: false,
      includeRawData: false,
    },
  },
  {
    value: 'with-visualizations',
    label: 'With Charts',
    description: 'Include all visualizations and charts',
    icon: 'bar_chart',
    options: {
      includeExecutiveSummary: true,
      includeVisualizations: true,
      includeRawData: true,
    },
  },
  {
    value: 'raw-data',
    label: 'With Raw Data',
    description: 'Complete report including raw data appendices',
    icon: 'data_array',
    options: {
      includeExecutiveSummary: true,
      includeVisualizations: true,
      includeRawData: true,
    },
  },
];

const defaultActivityOptions: ExportOption[] = [
  {
    value: 'summary',
    label: 'Summary',
    description: 'Activity overview and key details',
    icon: 'summarize',
    options: {
      format: 'summary',
      includeSemioticAnalysis: false,
      includeAttachments: false,
    },
  },
  {
    value: 'detailed',
    label: 'Detailed',
    description: 'Complete activity report with analysis',
    icon: 'description',
    options: {
      format: 'detailed',
      includeSemioticAnalysis: true,
      includeAttachments: false,
    },
  },
  {
    value: 'with-attachments',
    label: 'With Attachments',
    description: 'Complete report including attachments list',
    icon: 'attach_file',
    options: {
      format: 'detailed',
      includeSemioticAnalysis: true,
      includeAttachments: true,
    },
  },
];

const exportOptions = computed(() => {
  if (props.customOptions) return props.customOptions;

  return isReport(props.data) ? defaultReportOptions : defaultActivityOptions;
});

function isReport(data: Report | Activity): data is Report {
  return (data as Report).sections !== undefined;
}

function getFilename(data: Report | Activity, format: string): string {
  if (isReport(data)) {
    return generateReportFilename(data, format);
  } else {
    return generateActivityFilename(data as Activity, format);
  }
}

function generateReportFilename(report: Report, format: string = 'pdf'): string {
  const sanitizedTitle = report.title.replace(/[^a-zA-Z0-9]/g, '_');
  const date = new Date().toISOString().split('T')[0];
  return `${sanitizedTitle}_report_${date}.${format}`;
}

function generateActivityFilename(activity: Activity, format: string = 'pdf'): string {
  const sanitizedTitle = activity.title.replace(/[^a-zA-Z0-9]/g, '_');
  const date = new Date().toISOString().split('T')[0];
  return `${sanitizedTitle}_activity_${date}.${format}`;
}

async function handleDefaultExport() {
  const defaultOption =
    exportOptions.value.find(
      opt =>
        opt.value === props.defaultFormat ||
        (props.defaultFormat === 'detailed' && opt.value === 'detailed')
    ) || exportOptions.value[0];

  await handleExport(defaultOption);
}

async function handleExport(option: ExportOption) {
  loading.value = true;
  showProgress.value = true;
  progressTitle.value = `Generating ${option.label}`;
  progressMessage.value = option.description;
  progressValue.value = 0;

  try {
    let pdfBlob: Blob;
    let filename: string;

    // Simulate progress
    const progressInterval = setInterval(() => {
      if (progressValue.value < 90) {
        progressValue.value += 10;
      }
    }, 200);

    if (isReport(props.data)) {
      const report = props.data as Report;
      pdfBlob = await pdfExportService.generateReportPDF(report, option.options);
      filename = generateReportFilename(report);
    } else {
      const activity = props.data as Activity;
      pdfBlob = await pdfExportService.generateActivityPDF(activity, option.options);
      filename = generateActivityFilename(activity);
    }

    clearInterval(progressInterval);
    progressValue.value = 100;
    progressMessage.value = 'Finalizing document...';

    // Small delay for UI feedback
    await new Promise(resolve => setTimeout(resolve, 500));

    // Download the PDF
    await downloadPDF(pdfBlob, filename);

    $q.notify({
      type: 'positive',
      message: `${option.label} exported successfully`,
      position: 'top',
    });
  } catch (error) {
    console.error('PDF export error:', error);
    $q.notify({
      type: 'negative',
      message: 'Failed to export PDF',
      position: 'top',
    });
  } finally {
    loading.value = false;
    showProgress.value = false;
    progressValue.value = 0;
  }
}

// Expose methods for parent components
defineExpose({
  exportPDF: handleExport,
});
</script>

<style scoped lang="scss">
.pdf-export-button {
  display: inline-block;
}
</style>
