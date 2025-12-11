<template>
  <q-page class="help-search-page">
    <div class="q-pa-md">
      <!-- Page Header -->
      <div class="row items-center q-mb-md">
        <div class="col">
          <div class="text-h4 text-weight-bold">Help & Support</div>
          <div class="text-subtitle1 text-grey-7">Find answers to your questions</div>
        </div>
      </div>

      <!-- Search Section -->
      <q-card class="q-mb-md">
        <q-card-section>
          <q-input
            v-model="searchQuery"
            placeholder="Search for help articles..."
            outlined
            dense
            clearable
            @keyup.enter="performSearch"
            @clear="clearSearch"
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
            <template #append>
              <q-btn
                flat
                dense
                round
                icon="search"
                @click="performSearch"
              />
            </template>
          </q-input>
        </q-card-section>
      </q-card>

      <!-- Categories -->
      <q-card v-if="categories.length > 0" class="q-mb-md">
        <q-card-section>
          <div class="text-h6 q-mb-md">Browse by Category</div>
          <div class="row q-col-gutter-md">
            <div
              v-for="category in categories"
              :key="category.name"
              class="col-12 col-sm-6 col-md-4"
            >
              <q-card
                clickable
                :class="{ 'category-active': selectedCategory === category.name }"
                @click="filterByCategory(category.name)"
              >
                <q-card-section>
                  <div class="text-subtitle1">{{ category.name }}</div>
                  <div class="text-caption text-grey-6">{{ category.count }} articles</div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Loading State -->
      <div v-if="loading" class="text-center q-pa-xl">
        <q-spinner color="primary" size="3em" />
        <div class="q-mt-md">Searching...</div>
      </div>

      <!-- Search Results -->
      <q-card v-else-if="searchResults.length > 0 || articles.length > 0">
        <q-card-section>
          <div class="row items-center justify-between q-mb-md">
            <div class="text-h6">
              {{ searchQuery ? `Search Results (${searchResults.length})` : `Articles (${articles.length})` }}
            </div>
            <q-chip
              v-if="selectedCategory"
              removable
              color="primary"
              text-color="white"
              :label="selectedCategory"
              @remove="clearCategory"
            />
          </div>

          <q-list separator>
            <q-item
              v-for="article in displayedArticles"
              :key="article.id"
              clickable
              @click="viewArticle(article)"
            >
              <q-item-section avatar>
                <q-icon name="article" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ article.title }}</q-item-label>
                <q-item-label caption lines="2">
                  {{ article.excerpt || article.content.substring(0, 150) + '...' }}
                </q-item-label>
                <q-item-label caption class="q-mt-xs">
                  <q-chip
                    size="sm"
                    :label="article.category"
                    color="grey-3"
                    text-color="grey-8"
                  />
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="chevron_right" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>

      <!-- Empty State -->
      <q-card v-else-if="!loading && (searchQuery || selectedCategory)">
        <q-card-section class="text-center q-py-xl">
          <q-icon name="search_off" size="48px" color="grey-5" class="q-mb-sm" />
          <div class="text-h6 text-grey-6">No articles found</div>
          <div class="text-body2 text-grey-6 q-mt-sm">
            Try adjusting your search terms or browse by category
          </div>
        </q-card-section>
      </q-card>

      <!-- Popular Articles -->
      <q-card v-else class="q-mt-md">
        <q-card-section>
          <div class="text-h6 q-mb-md">Popular Articles</div>
          <q-list separator>
            <q-item
              v-for="article in popularArticles"
              :key="article.id"
              clickable
              @click="viewArticle(article)"
            >
              <q-item-section avatar>
                <q-icon name="help" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ article.title }}</q-item-label>
                <q-item-label caption lines="1">
                  {{ article.excerpt || article.content.substring(0, 100) + '...' }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="chevron_right" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useHelpStore } from '@/stores/useHelpStore';
import { useAuthStore } from '@/stores/useAuthStore';

const router = useRouter();
const $q = useQuasar();
const helpStore = useHelpStore();
const authStore = useAuthStore();

const searchQuery = ref('');
const selectedCategory = ref<string | null>(null);

const loading = computed(() => helpStore.loading);
const articles = computed(() => helpStore.articles);
const searchResults = computed(() => helpStore.searchResults);
const categories = computed(() => helpStore.categories);

const displayedArticles = computed(() => {
  return searchQuery.value ? searchResults.value : articles.value;
});

const popularArticles = computed(() => {
  // Show first 5 articles as popular
  return articles.value.slice(0, 5);
});

async function performSearch() {
  if (!searchQuery.value.trim()) {
    $q.notify({
      type: 'info',
      message: 'Please enter a search term',
    });
    return;
  }

  try {
    await helpStore.searchArticles(
      searchQuery.value,
      selectedCategory.value || undefined
    );
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to search articles',
    });
  }
}

function clearSearch() {
  searchQuery.value = '';
  helpStore.searchResults = [];
}

async function filterByCategory(category: string) {
  selectedCategory.value = category;
  try {
    await helpStore.fetchArticles({
      category,
      role: authStore.user?.role,
    });
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to load articles',
    });
  }
}

function clearCategory() {
  selectedCategory.value = null;
  loadArticles();
}

function viewArticle(article: any) {
  router.push(`/help/${article.slug || article.id}`);
}

async function loadArticles() {
  try {
    await helpStore.fetchArticles({
      role: authStore.user?.role,
    });
    await helpStore.fetchCategories();
  } catch (error) {
    // Silently fail - help system is optional
  }
}

onMounted(() => {
  loadArticles();
});
</script>

<style scoped lang="scss">
.help-search-page {
  background-color: #f5f5f5;
}

.category-active {
  border: 2px solid var(--q-primary);
  background-color: rgba(123, 44, 191, 0.05);
}
</style>
