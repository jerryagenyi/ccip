import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { api, API_ENDPOINTS } from '@/services/api';
import type {
  Activity,
  ActivityFilters,
  ActivityStatus,
  ActivityType,
  PaginatedResponse,
  ApiResponse,
  CreateActivityRequest,
  UpdateActivityRequest,
  SemioticAssessment,
  ActivityAttachment,
} from '@/types';

export const useActivityStore = defineStore('activity', () => {
  // State
  const activities = ref<Activity[]>([]);
  const currentActivity = ref<Activity | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const total = ref(0);
  const currentPage = ref(1);
  const perPage = ref(10);
  const filters = ref<ActivityFilters>({});
  const selectedActivities = ref<string[]>([]);

  // Computed
  const totalPages = computed(() => Math.ceil(total.value / perPage.value));
  const hasNextPage = computed(() => currentPage.value < totalPages.value);
  const hasPreviousPage = computed(() => currentPage.value > 1);
  const filteredActivities = computed(() => {
    if (!filters.value.search) return activities.value;

    const search = filters.value.search.toLowerCase();
    return activities.value.filter(
      activity =>
        activity.title.toLowerCase().includes(search) ||
        activity.description.toLowerCase().includes(search) ||
        activity.organization.toLowerCase().includes(search) ||
        activity.location.toLowerCase().includes(search)
    );
  });

  // Actions
  async function fetchActivities(params?: {
    page?: number;
    perPage?: number;
    filters?: ActivityFilters;
    reset?: boolean;
  }) {
    loading.value = true;
    error.value = null;

    try {
      // Reset if requested
      if (params?.reset) {
        activities.value = [];
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
      if (queryParams.organisation) queryParams.organisation = queryParams.organisation.join(',');
      if (queryParams.priority) queryParams.priority = queryParams.priority.join(',');
      if (queryParams.assignee) queryParams.assignee = queryParams.assignee.join(',');
      if (queryParams.tags) queryParams.tags = queryParams.tags.join(',');

      const response = await api.get<PaginatedResponse<Activity>>(API_ENDPOINTS.ACTIVITIES.LIST, {
        params: queryParams,
      });

      activities.value = response.data.data;
      total.value = response.data.meta.total;

      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch activities';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchActivity(id: string, forceRefresh = false) {
    // Return cached activity if already loaded and not forcing refresh
    if (!forceRefresh && currentActivity.value?.id === id) {
      return currentActivity.value;
    }

    loading.value = true;
    error.value = null;

    try {
      const response = await api.get<ApiResponse<Activity>>(API_ENDPOINTS.ACTIVITIES.DETAIL(id));

      currentActivity.value = response.data.data;
      return response.data.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch activity';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createActivity(data: CreateActivityRequest) {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.post<ApiResponse<Activity>>(API_ENDPOINTS.ACTIVITIES.CREATE, data);

      const newActivity = response.data.data;
      activities.value.unshift(newActivity);
      total.value += 1;

      return newActivity;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create activity';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateActivity(id: string, data: UpdateActivityRequest) {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.put<ApiResponse<Activity>>(
        API_ENDPOINTS.ACTIVITIES.UPDATE(id),
        data
      );

      const updatedActivity = response.data.data;

      // Update in activities list
      const index = activities.value.findIndex(activity => activity.id === id);
      if (index !== -1) {
        activities.value[index] = updatedActivity;
      }

      // Update current activity if it matches
      if (currentActivity.value?.id === id) {
        currentActivity.value = updatedActivity;
      }

      return updatedActivity;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update activity';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteActivity(id: string) {
    loading.value = true;
    error.value = null;

    try {
      await api.delete(API_ENDPOINTS.ACTIVITIES.DELETE(id));

      // Remove from activities list
      activities.value = activities.value.filter(activity => activity.id !== id);
      total.value -= 1;

      // Clear current activity if it matches
      if (currentActivity.value?.id === id) {
        currentActivity.value = null;
      }

      // Remove from selection
      selectedActivities.value = selectedActivities.value.filter(selectedId => selectedId !== id);

      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete activity';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function submitActivity(id: string) {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.post<ApiResponse<Activity>>(API_ENDPOINTS.ACTIVITIES.SUBMIT(id));

      const updatedActivity = response.data.data;

      // Update in activities list
      const index = activities.value.findIndex(activity => activity.id === id);
      if (index !== -1) {
        activities.value[index] = updatedActivity;
      }

      // Update current activity if it matches
      if (currentActivity.value?.id === id) {
        currentActivity.value = updatedActivity;
      }

      return updatedActivity;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to submit activity';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function approveActivity(id: string) {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.post<ApiResponse<Activity>>(API_ENDPOINTS.ACTIVITIES.APPROVE(id));

      const updatedActivity = response.data.data;

      // Update in activities list
      const index = activities.value.findIndex(activity => activity.id === id);
      if (index !== -1) {
        activities.value[index] = updatedActivity;
      }

      // Update current activity if it matches
      if (currentActivity.value?.id === id) {
        currentActivity.value = updatedActivity;
      }

      return updatedActivity;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to approve activity';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function rejectActivity(id: string, reason?: string) {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.post<ApiResponse<Activity>>(API_ENDPOINTS.ACTIVITIES.REJECT(id), {
        reason,
      });

      const updatedActivity = response.data.data;

      // Update in activities list
      const index = activities.value.findIndex(activity => activity.id === id);
      if (index !== -1) {
        activities.value[index] = updatedActivity;
      }

      // Update current activity if it matches
      if (currentActivity.value?.id === id) {
        currentActivity.value = updatedActivity;
      }

      return updatedActivity;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to reject activity';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function completeActivity(id: string) {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.post<ApiResponse<Activity>>(API_ENDPOINTS.ACTIVITIES.COMPLETE(id));

      const updatedActivity = response.data.data;

      // Update in activities list
      const index = activities.value.findIndex(activity => activity.id === id);
      if (index !== -1) {
        activities.value[index] = updatedActivity;
      }

      // Update current activity if it matches
      if (currentActivity.value?.id === id) {
        currentActivity.value = updatedActivity;
      }

      return updatedActivity;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to complete activity';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function duplicateActivity(id: string) {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.post<ApiResponse<Activity>>(
        API_ENDPOINTS.ACTIVITIES.DUPLICATE(id)
      );

      const duplicatedActivity = response.data.data;
      activities.value.unshift(duplicatedActivity);
      total.value += 1;

      return duplicatedActivity;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to duplicate activity';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // File operations
  async function uploadFiles(id: string, files: File[]) {
    loading.value = true;
    error.value = null;

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files[]', file);
      });

      const response = await api.post<ApiResponse<ActivityAttachment[]>>(
        API_ENDPOINTS.ACTIVITIES.UPLOAD_FILES(id),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const uploadedFiles = response.data.data;

      // Update current activity with new attachments
      if (currentActivity.value?.id === id) {
        currentActivity.value.attachments = [
          ...(currentActivity.value.attachments || []),
          ...uploadedFiles,
        ];
      }

      return uploadedFiles;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to upload files';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteFile(activityId: string, fileId: string) {
    loading.value = true;
    error.value = null;

    try {
      await api.delete(API_ENDPOINTS.ACTIVITIES.DELETE_FILE(activityId, fileId));

      // Update current activity by removing the deleted file
      if (currentActivity.value?.id === activityId) {
        currentActivity.value.attachments = currentActivity.value.attachments?.filter(
          file => file.id !== fileId
        );
      }

      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete file';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // AI Semiotic Analysis
  async function runSemioticAnalysis(id: string) {
    loading.value = true;
    error.value = null;

    try {
      const response = await api.post<ApiResponse<SemioticAssessment>>(
        API_ENDPOINTS.AI.SEMIOTIC_ANALYZE,
        { activityId: id }
      );

      const assessment = response.data.data;

      // Update current activity with assessment
      if (currentActivity.value?.id === id) {
        currentActivity.value.semioticAssessment = assessment;
        currentActivity.value.semioticRiskScore = assessment.riskScore;
      }

      return assessment;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to run semiotic analysis';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Selection management
  function toggleActivitySelection(id: string) {
    const index = selectedActivities.value.indexOf(id);
    if (index > -1) {
      selectedActivities.value.splice(index, 1);
    } else {
      selectedActivities.value.push(id);
    }
  }

  function selectAllActivities() {
    selectedActivities.value = activities.value.map(activity => activity.id);
  }

  function clearSelection() {
    selectedActivities.value = [];
  }

  function deleteSelectedActivities() {
    return Promise.all(selectedActivities.value.map(id => deleteActivity(id)));
  }

  // Pagination
  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
      fetchActivities({ page });
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
  function setFilters(newFilters: Partial<ActivityFilters>) {
    fetchActivities({
      page: 1,
      filters: { ...filters.value, ...newFilters },
    });
  }

  function clearFilters() {
    filters.value = {};
    fetchActivities({ page: 1, reset: true });
  }

  function applySearch(search: string) {
    setFilters({ search });
  }

  function setStatusFilter(status: ActivityStatus[]) {
    setFilters({ status });
  }

  function setTypeFilter(type: ActivityType[]) {
    setFilters({ type });
  }

  return {
    // State
    activities,
    currentActivity,
    loading,
    error,
    total,
    currentPage,
    perPage,
    filters,
    selectedActivities,

    // Computed
    totalPages,
    hasNextPage,
    hasPreviousPage,
    filteredActivities,

    // Actions
    fetchActivities,
    fetchActivity,
    createActivity,
    updateActivity,
    deleteActivity,
    submitActivity,
    approveActivity,
    rejectActivity,
    completeActivity,
    duplicateActivity,
    uploadFiles,
    deleteFile,
    runSemioticAnalysis,

    // Selection
    toggleActivitySelection,
    selectAllActivities,
    clearSelection,
    deleteSelectedActivities,

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
