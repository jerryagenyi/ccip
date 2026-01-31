import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from '@/services/api';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  order: number;
  role: string;
  target_element?: string;
  content?: string;
  is_active: boolean;
}

interface OnboardingProgress {
  completed_steps: number[];
  skipped_steps: number[];
  total_steps: number;
  progress_percentage: number;
}

export const useOnboardingStore = defineStore('onboarding', () => {
  // State
  const steps = ref<OnboardingStep[]>([]);
  const progress = ref<OnboardingProgress | null>(null);
  const loading = ref(false);

  // Actions
  async function fetchSteps() {
    loading.value = true;
    try {
      const response = await api.get('/onboarding/steps');
      steps.value = response.data.data || response.data;
      return steps.value;
    } finally {
      loading.value = false;
    }
  }

  async function completeStep(stepId: number, skipped: boolean = false) {
    await api.put(`/onboarding/steps/${stepId}/complete`, { skipped });
    if (progress.value) {
      if (skipped) {
        progress.value.skipped_steps.push(stepId);
      } else {
        progress.value.completed_steps.push(stepId);
      }
      progress.value.progress_percentage =
        (progress.value.completed_steps.length / progress.value.total_steps) * 100;
    }
  }

  async function fetchProgress() {
    loading.value = true;
    try {
      const response = await api.get('/onboarding/progress');
      progress.value = response.data.data || response.data;
      return progress.value;
    } finally {
      loading.value = false;
    }
  }

  async function resetProgress() {
    loading.value = true;
    try {
      await api.post('/onboarding/reset');
      progress.value = null;
      await fetchProgress();
    } finally {
      loading.value = false;
    }
  }

  return {
    // State
    steps,
    progress,
    loading,
    // Actions
    fetchSteps,
    completeStep,
    fetchProgress,
    resetProgress,
  };
});

