import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from '@/services/api';

interface HelpArticle {
  id: number;
  title: string;
  slug: string;
  content: string; // Markdown
  excerpt?: string;
  category: string;
  role_access?: string[] | null;
}

interface HelpCategory {
  name: string;
  count: number;
}

export const useHelpStore = defineStore('help', () => {
  // State
  const articles = ref<HelpArticle[]>([]);
  const currentArticle = ref<HelpArticle | null>(null);
  const categories = ref<HelpCategory[]>([]);
  const searchResults = ref<HelpArticle[]>([]);
  const loading = ref(false);

  // Actions
  async function fetchArticles(filters?: { category?: string; role?: string }) {
    loading.value = true;
    try {
      const response = await api.get('/help/articles', { params: filters });
      articles.value = response.data.data || response.data;
      return articles.value;
    } finally {
      loading.value = false;
    }
  }

  async function fetchArticle(id: number) {
    loading.value = true;
    try {
      const response = await api.get(`/help/articles/${id}`);
      currentArticle.value = response.data;
      return response.data;
    } finally {
      loading.value = false;
    }
  }

  async function searchArticles(query: string, category?: string) {
    loading.value = true;
    try {
      const response = await api.get('/help/search', {
        params: { q: query, category },
      });
      searchResults.value = response.data.data || response.data;
      return searchResults.value;
    } finally {
      loading.value = false;
    }
  }

  async function fetchCategories() {
    try {
      const response = await api.get('/help/categories');
      categories.value = response.data.data || response.data;
      return categories.value;
    } catch (error) {
      return [];
    }
  }

  return {
    // State
    articles,
    currentArticle,
    categories,
    searchResults,
    loading,
    // Actions
    fetchArticles,
    fetchArticle,
    searchArticles,
    fetchCategories,
  };
});
