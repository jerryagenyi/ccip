import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from '@/services/api';

interface StatusBreakdown {
  draft: number;
  submitted: number;
  approved: number;
  rejected: number;
}

interface HeatmapData {
  [date: string]: number;
}

interface EngagementMetric {
  activity_id: number;
  metric_type: string;
  value: number;
  unit?: string;
  recorded_at: string;
}

interface EngagementTrend {
  date: string;
  average: number;
  total: number;
}

export const useAnalyticsStore = defineStore('analytics', () => {
  // State
  const statusBreakdown = ref<StatusBreakdown | null>(null);
  const heatmapData = ref<HeatmapData>({});
  const engagementMetrics = ref<EngagementMetric[]>([]);
  const engagementTrends = ref<EngagementTrend[]>([]);
  const loading = ref(false);

  // Actions
  async function fetchStatusBreakdown(filters?: {
    organisation_id?: number;
    start_date?: string;
    end_date?: string;
  }) {
    loading.value = true;
    try {
      const response = await api.get('/analytics/activities/status', { params: filters });
      statusBreakdown.value = response.data.data || response.data;
      return statusBreakdown.value;
    } finally {
      loading.value = false;
    }
  }

  async function fetchHeatmapData(filters: {
    start_date: string;
    end_date: string;
    organisation_id?: number;
    type?: string;
  }) {
    loading.value = true;
    try {
      const response = await api.get('/analytics/activities/heatmap', { params: filters });
      heatmapData.value = response.data.data || response.data;
      return heatmapData.value;
    } finally {
      loading.value = false;
    }
  }

  async function fetchEngagementMetrics(filters?: {
    start_date?: string;
    end_date?: string;
    organisation_id?: number;
  }) {
    loading.value = true;
    try {
      const response = await api.get('/analytics/engagement', { params: filters });
      engagementMetrics.value = response.data.data?.metrics || [];
      return response.data.data;
    } finally {
      loading.value = false;
    }
  }

  async function fetchEngagementTrends(filters: { start_date: string; end_date: string }) {
    loading.value = true;
    try {
      const response = await api.get('/analytics/engagement/trends', { params: filters });
      engagementTrends.value = response.data.data || [];
      return engagementTrends.value;
    } finally {
      loading.value = false;
    }
  }

  return {
    // State
    statusBreakdown,
    heatmapData,
    engagementMetrics,
    engagementTrends,
    loading,
    // Actions
    fetchStatusBreakdown,
    fetchHeatmapData,
    fetchEngagementMetrics,
    fetchEngagementTrends,
  };
});
