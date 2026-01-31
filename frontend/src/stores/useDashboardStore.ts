import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from '@/services/api';

interface DashboardSummary {
  total_activities: number;
  by_status: {
    draft: number;
    submitted: number;
    approved: number;
    rejected: number;
  };
  by_type: Record<string, number>;
  recent_activities: Array<{
    id: number;
    title: string;
    date: string;
    status: string;
  }>;
}

export const useDashboardStore = defineStore('dashboard', () => {
  // State
  const summary = ref<DashboardSummary | null>(null);
  const loading = ref(false);

  // Actions
  async function fetchDashboard(role: string) {
    loading.value = true;
    try {
      const response = await api.get(`/dashboard/${role}`);
      summary.value = response.data.data || response.data;
      return summary.value;
    } finally {
      loading.value = false;
    }
  }

  async function fetchSummary() {
    loading.value = true;
    try {
      const response = await api.get('/dashboard/summary');
      summary.value = response.data.data || response.data;
      return summary.value;
    } finally {
      loading.value = false;
    }
  }

  return {
    // State
    summary,
    loading,
    // Actions
    fetchDashboard,
    fetchSummary,
  };
});
