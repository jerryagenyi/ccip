import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from '@/services/api';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  organisation?: {
    id: number;
    name: string;
  };
  profile_picture?: string;
}

interface UpdateProfileData {
  name?: string;
  profile_picture?: File;
}

interface ChangePasswordData {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export const useUserStore = defineStore('user', () => {
  // State
  const currentUser = ref<User | null>(null);
  const loading = ref(false);

  // Actions
  async function fetchProfile() {
    loading.value = true;
    try {
      const response = await api.get('/users/me');
      currentUser.value = response.data;
      return response.data;
    } finally {
      loading.value = false;
    }
  }

  async function updateProfile(data: UpdateProfileData) {
    loading.value = true;
    try {
      const formData = new FormData();
      if (data.name) formData.append('name', data.name);
      if (data.profile_picture) formData.append('profile_picture', data.profile_picture);

      const response = await api.put('/users/me', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      currentUser.value = response.data;
      return response.data;
    } finally {
      loading.value = false;
    }
  }

  async function changePassword(data: ChangePasswordData) {
    loading.value = true;
    try {
      await api.put('/users/me/password', data);
    } finally {
      loading.value = false;
    }
  }

  return {
    // State
    currentUser,
    loading,
    // Actions
    fetchProfile,
    updateProfile,
    changePassword,
  };
});
