import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from '@/services/api';

interface Message {
  id: number;
  subject: string;
  body: string;
  is_urgent: boolean;
  sender: {
    id: number;
    name: string;
    email: string;
  };
  recipients: Array<{
    user_id: number;
    user_name: string;
    read_at: string | null;
  }>;
  created_at: string;
}

interface SendMessageData {
  recipient_id?: number;
  organisation_id?: number;
  role?: string;
  subject: string;
  body: string;
  is_urgent?: boolean;
  parent_message_id?: number;
}

export const useMessageStore = defineStore('message', () => {
  // State
  const messages = ref<Message[]>([]);
  const currentMessage = ref<Message | null>(null);
  const loading = ref(false);

  // Actions
  async function fetchMessages(filters?: { page?: number; unread_only?: boolean }) {
    loading.value = true;
    try {
      const response = await api.get('/messages', { params: filters });
      messages.value = response.data.data || response.data;
      return response.data;
    } finally {
      loading.value = false;
    }
  }

  async function fetchMessage(id: number) {
    loading.value = true;
    try {
      const response = await api.get(`/messages/${id}`);
      currentMessage.value = response.data;
      return response.data;
    } finally {
      loading.value = false;
    }
  }

  async function sendMessage(data: SendMessageData) {
    loading.value = true;
    try {
      const response = await api.post('/messages', data);
      messages.value.unshift(response.data);
      return response.data;
    } finally {
      loading.value = false;
    }
  }

  async function markAsRead(id: number) {
    await api.put(`/messages/${id}/read`);
    const message = messages.value.find((m) => m.id === id);
    if (message) {
      // Update read status
    }
  }

  async function replyToMessage(id: number, body: string) {
    loading.value = true;
    try {
      const response = await api.post(`/messages/${id}/reply`, { body });
      return response.data;
    } finally {
      loading.value = false;
    }
  }

  return {
    // State
    messages,
    currentMessage,
    loading,
    // Actions
    fetchMessages,
    fetchMessage,
    sendMessage,
    markAsRead,
    replyToMessage,
  };
});

