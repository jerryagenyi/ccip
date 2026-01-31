import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from '@/services/api';

interface ReportTemplate {
  id: number;
  name: string;
  description?: string;
  fields: Array<{
    name: string;
    type: string;
    required: boolean;
    options?: string[];
  }>;
}

export const useTemplateStore = defineStore('template', () => {
  // State
  const templates = ref<ReportTemplate[]>([]);
  const currentTemplate = ref<ReportTemplate | null>(null);
  const loading = ref(false);

  // Actions
  async function fetchTemplates() {
    loading.value = true;
    try {
      const response = await api.get('/templates');
      templates.value = response.data.data || response.data;
      return templates.value;
    } finally {
      loading.value = false;
    }
  }

  async function fetchTemplate(id: number) {
    loading.value = true;
    try {
      const response = await api.get(`/templates/${id}`);
      currentTemplate.value = response.data;
      return response.data;
    } finally {
      loading.value = false;
    }
  }

  return {
    // State
    templates,
    currentTemplate,
    loading,
    // Actions
    fetchTemplates,
    fetchTemplate,
  };
});
