import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { api, API_ENDPOINTS } from '@/services/api';
import type {
  Report,
  ReportTemplate,
  ReportFilters,
  ReportStatus,
  ReportType,
  PaginatedResponse,
  ApiResponse,
  CreateReportRequest,
  UpdateReportRequest,
  ReportSection,
  ReportGeneration,
  ReportSchedule,
} from '@/types';

export const useReportStore = defineStore('report', () => {
  // State
  const reports = ref<Report[]>([]);
  const currentReport = ref<Report | null>(null);
  const templates = ref<ReportTemplate[]>([]);
  const loading = ref(false);
  const loadingTemplates = ref(false);
  const generating = ref(false);
  const error = ref<string | null>(null);
  const total = ref(0);
  const currentPage = ref(1);
  const perPage = ref(10);
  const filters = ref<ReportFilters>({});
  const selectedReports = ref<string[]>([]);

  // Computed
  const totalPages = computed(() => Math.ceil(total.value / perPage.value));
  const hasNextPage = computed(() => currentPage.value < totalPages.value);
  const hasPreviousPage = computed(() => currentPage.value > 1);
  const filteredReports = computed(() => {
    if (!filters.value.search) return reports.value;

    const search = filters.value.search.toLowerCase();
    return reports.value.filter(
      report =>
        report.title.toLowerCase().includes(search) ||
        report.description.toLowerCase().includes(search) ||
        report.type.toLowerCase().includes(search) ||
        report.status.toLowerCase().includes(search)
    );
  });

  // Actions
  async function fetchReports(params?: {
    page?: number;
    perPage?: number;
    filters?: ReportFilters;
    reset?: boolean;
  }) {
    loading.value = true;
    error.value = null;

    try {
      // Reset if requested
      if (params?.reset) {
        reports.value = [];
        currentPage.value = 1;
      }

      // Update page and filters
      if (params?.page) currentPage.value = params.page;
      if (params?.perPage) perPage.value = params.perPage;
      if (params?.filters) filters.value = { ...filters.value, ...params.filters };

      // Build query parameters
      const queryParams: any = {
        page: currentPage.value,
        perPage: perPage.value,
        ...filters.value,
      };

      // Convert arrays to strings
      if (queryParams.status) queryParams.status = queryParams.status.join(',');
      if (queryParams.type) queryParams.type = queryParams.type.join(',');
      if (queryParams.period) queryParams.period = queryParams.period.join(',');
      if (queryParams.tags) queryParams.tags = queryParams.tags.join(',');

      const response = await api.get<PaginatedResponse<Report>>(API_ENDPOINTS.REPORTS.LIST, {
        params: queryParams,
      });

      reports.value = response.data.data;
      total.value = response.data.meta.total;

      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch reports';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchReport(id: string, forceRefresh = false) {
    // Return cached report if already loaded and not forcing refresh
    if (!forceRefresh && currentReport.value?.id === id) {
      return currentReport.value;
    }

    loading.value = true;
    error.value = null;

    try {
      const response = await api.get<ApiResponse<Report>>(API_ENDPOINTS.REPORTS.DETAIL(id));

      currentReport.value = response.data.data;
      return response.data.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch report';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createReport(data: CreateReportRequest) {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.post<ApiResponse<Report>>(API_ENDPOINTS.REPORTS.CREATE, data);

      const newReport = response.data.data;
      reports.value.unshift(newReport);
      total.value += 1;

      return newReport;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create report';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateReport(id: string, data: UpdateReportRequest) {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.put<ApiResponse<Report>>(API_ENDPOINTS.REPORTS.UPDATE(id), data);

      const updatedReport = response.data.data;

      // Update in reports list
      const index = reports.value.findIndex(report => report.id === id);
      if (index !== -1) {
        reports.value[index] = updatedReport;
      }

      // Update current report if it matches
      if (currentReport.value?.id === id) {
        currentReport.value = updatedReport;
      }

      return updatedReport;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update report';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteReport(id: string) {
    loading.value = true;
    error.value = null;

    try {
      await api.delete(API_ENDPOINTS.REPORTS.DELETE(id));

      // Remove from reports list
      reports.value = reports.value.filter(report => report.id !== id);
      total.value -= 1;

      // Clear current report if it matches
      if (currentReport.value?.id === id) {
        currentReport.value = null;
      }

      // Remove from selection
      selectedReports.value = selectedReports.value.filter(selectedId => selectedId !== id);

      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete report';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function generateReport(data: {
    templateId: string;
    activityIds?: string[];
    parameters?: Record<string, any>;
    includeVisualizations?: boolean;
    format?: 'pdf' | 'html' | 'docx';
  }) {
    generating.value = true;
    error.value = null;

    try {
      const response = await api.post<ApiResponse<ReportGeneration>>(
        API_ENDPOINTS.REPORTS.GENERATE,
        data
      );

      return response.data.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to generate report';
      throw err;
    } finally {
      generating.value = false;
    }
  }

  async function downloadReport(id: string, format: 'pdf' | 'html' | 'docx' = 'pdf') {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.get(API_ENDPOINTS.REPORTS.DOWNLOAD(id), {
        params: { format },
        responseType: 'blob',
      });

      // Create download link
      const blob = new Blob([response.data], {
        type:
          format === 'pdf'
            ? 'application/pdf'
            : format === 'docx'
              ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
              : 'text/html',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `report-${id}-${Date.now()}.${format}`;
      link.click();
      URL.revokeObjectURL(url);

      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to download report';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Template operations
  async function fetchTemplates() {
    loadingTemplates.value = true;
    error.value = null;

    try {
      const response = await api.get<ApiResponse<ReportTemplate[]>>(
        API_ENDPOINTS.REPORTS.TEMPLATES
      );

      templates.value = response.data.data;
      return response.data.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch templates';
      throw err;
    } finally {
      loadingTemplates.value = false;
    }
  }

  async function createTemplate(data: Partial<ReportTemplate>) {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.post<ApiResponse<ReportTemplate>>(
        API_ENDPOINTS.REPORTS.CREATE_TEMPLATE,
        data
      );

      const newTemplate = response.data.data;
      templates.value.push(newTemplate);

      return newTemplate;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create template';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateTemplate(id: string, data: Partial<ReportTemplate>) {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.put<ApiResponse<ReportTemplate>>(
        API_ENDPOINTS.REPORTS.UPDATE_TEMPLATE(id),
        data
      );

      const updatedTemplate = response.data.data;

      // Update in templates list
      const index = templates.value.findIndex(template => template.id === id);
      if (index !== -1) {
        templates.value[index] = updatedTemplate;
      }

      return updatedTemplate;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update template';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteTemplate(id: string) {
    loading.value = true;
    error.value = null;

    try {
      await api.delete(API_ENDPOINTS.REPORTS.DELETE_TEMPLATE(id));

      // Remove from templates list
      templates.value = templates.value.filter(template => template.id !== id);

      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete template';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Schedule operations
  async function scheduleReport(data: Partial<ReportSchedule>) {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.post<ApiResponse<ReportSchedule>>(
        API_ENDPOINTS.REPORTS.SCHEDULE,
        data
      );

      return response.data.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to schedule report';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // AI-powered report generation
  async function generateAIReport(data: {
    title: string;
    description: string;
    activityIds: string[];
    type: ReportType;
    tone: 'professional' | 'casual' | 'academic';
    audience: string;
    includeRecommendations: boolean;
    includeVisualizations: boolean;
    customInstructions?: string;
  }) {
    generating.value = true;
    error.value = null;

    try {
      const response = await api.post<ApiResponse<Report>>(API_ENDPOINTS.REPORTS.GENERATE_AI, data);

      const aiReport = response.data.data;
      reports.value.unshift(aiReport);
      total.value += 1;

      return aiReport;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to generate AI report';
      throw err;
    } finally {
      generating.value = false;
    }
  }

  // Selection management
  function toggleReportSelection(id: string) {
    const index = selectedReports.value.indexOf(id);
    if (index > -1) {
      selectedReports.value.splice(index, 1);
    } else {
      selectedReports.value.push(id);
    }
  }

  function selectAllReports() {
    selectedReports.value = reports.value.map(report => report.id);
  }

  function clearSelection() {
    selectedReports.value = [];
  }

  function deleteSelectedReports() {
    return Promise.all(selectedReports.value.map(id => deleteReport(id)));
  }

  // Bulk operations
  async function bulkUpdateReports(ids: string[], data: Partial<Report>) {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.post<ApiResponse<Report[]>>(API_ENDPOINTS.REPORTS.BULK_UPDATE, {
        ids,
        data,
      });

      const updatedReports = response.data.data;

      // Update in reports list
      updatedReports.forEach(updatedReport => {
        const index = reports.value.findIndex(report => report.id === updatedReport.id);
        if (index !== -1) {
          reports.value[index] = updatedReport;
        }
      });

      return updatedReports;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update reports';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Pagination
  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
      fetchReports({ page });
    }
  }

  function nextPage() {
    if (hasNextPage.value) {
      goToPage(currentPage.value + 1);
    }
  }

  function previousPage() {
    if (hasPreviousPage.value) {
      goToPage(currentPage.value - 1);
    }
  }

  // Filter management
  function setFilters(newFilters: Partial<ReportFilters>) {
    fetchReports({
      page: 1,
      filters: { ...filters.value, ...newFilters },
    });
  }

  function clearFilters() {
    filters.value = {};
    fetchReports({ page: 1, reset: true });
  }

  function applySearch(search: string) {
    setFilters({ search });
  }

  function setStatusFilter(status: ReportStatus[]) {
    setFilters({ status });
  }

  function setTypeFilter(type: ReportType[]) {
    setFilters({ type });
  }

  return {
    // State
    reports,
    currentReport,
    templates,
    loading,
    loadingTemplates,
    generating,
    error,
    total,
    currentPage,
    perPage,
    filters,
    selectedReports,

    // Computed
    totalPages,
    hasNextPage,
    hasPreviousPage,
    filteredReports,

    // Actions
    fetchReports,
    fetchReport,
    createReport,
    updateReport,
    deleteReport,
    generateReport,
    downloadReport,

    // Templates
    fetchTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,

    // Scheduling
    scheduleReport,

    // AI Generation
    generateAIReport,

    // Selection
    toggleReportSelection,
    selectAllReports,
    clearSelection,
    deleteSelectedReports,

    // Bulk operations
    bulkUpdateReports,

    // Pagination
    goToPage,
    nextPage,
    previousPage,

    // Filters
    setFilters,
    clearFilters,
    applySearch,
    setStatusFilter,
    setTypeFilter,
  };
});
