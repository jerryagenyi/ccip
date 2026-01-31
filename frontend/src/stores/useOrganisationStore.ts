import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from '@/services/api';

interface Organisation {
  id: number;
  name: string;
  type: 'federal' | 'state' | 'local';
  parent_id?: number;
  description?: string;
  children?: Organisation[];
}

interface CreateOrganisationData {
  name: string;
  type: 'federal' | 'state' | 'local';
  parent_id?: number;
  description?: string;
}

export const useOrganisationStore = defineStore('organisation', () => {
  // State
  const organisations = ref<Organisation[]>([]);
  const currentOrganisation = ref<Organisation | null>(null);
  const loading = ref(false);

  // Actions
  async function fetchOrganisations(filters?: { parent_id?: number; type?: string }) {
    loading.value = true;
    try {
      const response = await api.get('/organisations', { params: filters });
      organisations.value = response.data.data || response.data;
      return organisations.value;
    } finally {
      loading.value = false;
    }
  }

  async function fetchOrganisation(id: number) {
    loading.value = true;
    try {
      const response = await api.get(`/organisations/${id}`);
      currentOrganisation.value = response.data;
      return response.data;
    } finally {
      loading.value = false;
    }
  }

  async function createOrganisation(data: CreateOrganisationData) {
    loading.value = true;
    try {
      const response = await api.post('/organisations', data);
      organisations.value.push(response.data);
      return response.data;
    } finally {
      loading.value = false;
    }
  }

  async function updateOrganisation(id: number, data: Partial<CreateOrganisationData>) {
    loading.value = true;
    try {
      const response = await api.put(`/organisations/${id}`, data);
      const index = organisations.value.findIndex(org => org.id === id);
      if (index !== -1) {
        organisations.value[index] = response.data;
      }
      return response.data;
    } finally {
      loading.value = false;
    }
  }

  async function fetchOrganisationUsers(id: number) {
    loading.value = true;
    try {
      const response = await api.get(`/organisations/${id}/users`);
      return response.data;
    } finally {
      loading.value = false;
    }
  }

  return {
    // State
    organisations,
    currentOrganisation,
    loading,
    // Actions
    fetchOrganisations,
    fetchOrganisation,
    createOrganisation,
    updateOrganisation,
    fetchOrganisationUsers,
  };
});
