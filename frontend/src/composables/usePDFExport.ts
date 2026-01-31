import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { pdfExportService, downloadPDF } from '@/services/pdfExport';
import type { Report, Activity } from '@/types';

export interface ExportOptions {
  includeExecutiveSummary?: boolean;
  includeVisualizations?: boolean;
  includeRawData?: boolean;
  includeSemioticAnalysis?: boolean;
  includeAttachments?: boolean;
  format?: 'summary' | 'detailed';
  watermark?: string;
}

export interface ExportProgress {
  title: string;
  message: string;
  value: number;
  show: boolean;
}

export function usePDFExport() {
  const $q = useQuasar();

  const isExporting = ref(false);
  const progress = ref<ExportProgress>({
    title: '',
    message: '',
    value: 0,
    show: false,
  });

  // Export a report to PDF
  async function exportReport(
    report: Report,
    options: ExportOptions = {},
    filename?: string
  ): Promise<void> {
    isExporting.value = true;
    progress.value = {
      title: 'Exporting Report',
      message: 'Preparing your report document...',
      value: 0,
      show: true,
    };

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        if (progress.value.value < 90) {
          progress.value.value += 10;
        }
      }, 200);

      const pdfBlob = await pdfExportService.generateReportPDF(report, options);

      clearInterval(progressInterval);
      progress.value.value = 100;
      progress.value.message = 'Finalizing document...';

      // Small delay for UI feedback
      await new Promise(resolve => setTimeout(resolve, 500));

      const defaultFilename = generateReportFilename(report);
      await downloadPDF(pdfBlob, filename || defaultFilename);

      $q.notify({
        type: 'positive',
        message: 'Report exported successfully',
        position: 'top',
      });
    } catch (error) {
      console.error('Report export error:', error);
      $q.notify({
        type: 'negative',
        message: 'Failed to export report',
        position: 'top',
      });
      throw error;
    } finally {
      isExporting.value = false;
      progress.value.show = false;
      progress.value.value = 0;
    }
  }

  // Export an activity to PDF
  async function exportActivity(
    activity: Activity,
    options: ExportOptions = {},
    filename?: string
  ): Promise<void> {
    isExporting.value = true;
    progress.value = {
      title: 'Exporting Activity',
      message: 'Preparing your activity document...',
      value: 0,
      show: true,
    };

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        if (progress.value.value < 90) {
          progress.value.value += 10;
        }
      }, 200);

      const pdfBlob = await pdfExportService.generateActivityPDF(activity, options);

      clearInterval(progressInterval);
      progress.value.value = 100;
      progress.value.message = 'Finalizing document...';

      // Small delay for UI feedback
      await new Promise(resolve => setTimeout(resolve, 500));

      const defaultFilename = generateActivityFilename(activity);
      await downloadPDF(pdfBlob, filename || defaultFilename);

      $q.notify({
        type: 'positive',
        message: 'Activity exported successfully',
        position: 'top',
      });
    } catch (error) {
      console.error('Activity export error:', error);
      $q.notify({
        type: 'negative',
        message: 'Failed to export activity',
        position: 'top',
      });
      throw error;
    } finally {
      isExporting.value = false;
      progress.value.show = false;
      progress.value.value = 0;
    }
  }

  // Export multiple items to a single PDF
  async function exportBatch(
    items: (Report | Activity)[],
    options: ExportOptions = {},
    filename?: string
  ): Promise<void> {
    isExporting.value = true;
    progress.value = {
      title: 'Exporting Batch',
      message: `Processing ${items.length} items...`,
      value: 0,
      show: true,
    };

    try {
      const progressStep = 100 / items.length;
      let allContent: string[] = [];

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        progress.value.message = `Processing item ${i + 1} of ${items.length}...`;

        // Generate PDF for each item
        let pdfBlob: Blob;
        if ('sections' in item) {
          pdfBlob = await pdfExportService.generateReportPDF(item as Report, options);
        } else {
          pdfBlob = await pdfExportService.generateActivityPDF(item as Activity, options);
        }

        // In a real implementation, you would merge PDFs here
        // For now, we'll just download them individually
        const itemFilename = filename
          ? `${filename.replace('.pdf', '')}_part${i + 1}.pdf`
          : generateBatchItemFilename(item, i + 1);

        await downloadPDF(pdfBlob, itemFilename);
        progress.value.value = Math.min(100, (i + 1) * progressStep);
      }

      $q.notify({
        type: 'positive',
        message: `Successfully exported ${items.length} documents`,
        position: 'top',
      });
    } catch (error) {
      console.error('Batch export error:', error);
      $q.notify({
        type: 'negative',
        message: 'Failed to export some items',
        position: 'top',
      });
      throw error;
    } finally {
      isExporting.value = false;
      progress.value.show = false;
      progress.value.value = 0;
    }
  }

  // Export charts to PDF
  async function exportCharts(
    chartElements: HTMLElement[],
    title: string = 'Charts and Visualizations',
    filename?: string
  ): Promise<void> {
    isExporting.value = true;
    progress.value = {
      title: 'Exporting Charts',
      message: 'Rendering charts to PDF...',
      value: 0,
      show: true,
    };

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        if (progress.value.value < 90) {
          progress.value.value += 10;
        }
      }, 200);

      const pdfBlob = await pdfExportService.generateChartsPDF(chartElements, title);

      clearInterval(progressInterval);
      progress.value.value = 100;
      progress.value.message = 'Finalizing document...';

      // Small delay for UI feedback
      await new Promise(resolve => setTimeout(resolve, 500));

      const defaultFilename = `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      await downloadPDF(pdfBlob, filename || defaultFilename);

      $q.notify({
        type: 'positive',
        message: 'Charts exported successfully',
        position: 'top',
      });
    } catch (error) {
      console.error('Charts export error:', error);
      $q.notify({
        type: 'negative',
        message: 'Failed to export charts',
        position: 'top',
      });
      throw error;
    } finally {
      isExporting.value = false;
      progress.value.show = false;
      progress.value.value = 0;
    }
  }

  // Helper functions
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

  function generateBatchItemFilename(item: Report | Activity, index: number): string {
    const prefix = 'sections' in item ? 'report' : 'activity';
    const sanitizedTitle = item.title.replace(/[^a-zA-Z0-9]/g, '_');
    return `${sanitizedTitle}_${prefix}_${index}.pdf`;
  }

  // Utility: Create export configuration based on user preferences
  function createExportConfig(preset: 'minimal' | 'standard' | 'comprehensive'): ExportOptions {
    switch (preset) {
      case 'minimal':
        return {
          includeExecutiveSummary: true,
          includeVisualizations: false,
          includeRawData: false,
          includeSemioticAnalysis: false,
          includeAttachments: false,
          format: 'summary',
        };

      case 'standard':
        return {
          includeExecutiveSummary: true,
          includeVisualizations: true,
          includeRawData: false,
          includeSemioticAnalysis: true,
          includeAttachments: false,
          format: 'detailed',
        };

      case 'comprehensive':
        return {
          includeExecutiveSummary: true,
          includeVisualizations: true,
          includeRawData: true,
          includeSemioticAnalysis: true,
          includeAttachments: true,
          format: 'detailed',
        };

      default:
        return {};
    }
  }

  // Utility: Validate export options
  function validateExportOptions(options: ExportOptions): boolean {
    // Basic validation - can be extended
    return options !== null && typeof options === 'object';
  }

  // Utility: Check if browser supports PDF export
  function checkPDFSupport(): boolean {
    return typeof window !== 'undefined' && window.Blob && window.URL && window.URL.createObjectURL;
  }

  return {
    // State
    isExporting,
    progress,

    // Methods
    exportReport,
    exportActivity,
    exportBatch,
    exportCharts,

    // Utilities
    generateReportFilename,
    generateActivityFilename,
    createExportConfig,
    validateExportOptions,
    checkPDFSupport,
  };
}
