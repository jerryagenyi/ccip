<template>
  <q-page class="help-article-page">
    <div class="q-pa-md">
      <!-- Loading State -->
      <div v-if="loading" class="text-center q-pa-xl">
        <q-spinner color="primary" size="3em" />
        <div class="q-mt-md">Loading article...</div>
      </div>

      <!-- Article Content -->
      <div v-else-if="article">
        <!-- Header -->
        <div class="row items-center q-mb-md">
          <q-btn
            flat
            round
            icon="arrow_back"
            @click="$router.push('/help')"
          />
          <div class="col q-ml-md">
            <div class="text-h4 text-weight-bold">{{ article.title }}</div>
            <div class="text-subtitle2 text-grey-7 q-mt-xs">
              <q-chip
                size="sm"
                :label="article.category"
                color="primary"
                text-color="white"
              />
            </div>
          </div>
        </div>

        <!-- Article Body -->
        <q-card>
          <q-card-section>
            <div class="help-article-content" v-html="formatContent(article.content)"></div>
          </q-card-section>
        </q-card>

        <!-- Related Articles -->
        <q-card v-if="relatedArticles.length > 0" class="q-mt-md">
          <q-card-section>
            <div class="text-h6 q-mb-md">Related Articles</div>
            <q-list separator>
              <q-item
                v-for="related in relatedArticles"
                :key="related.id"
                clickable
                @click="viewArticle(related)"
              >
                <q-item-section avatar>
                  <q-icon name="article" color="primary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ related.title }}</q-item-label>
                  <q-item-label caption lines="1">
                    {{ related.excerpt || related.content.substring(0, 100) + '...' }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="chevron_right" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>

        <!-- Actions -->
        <div class="row justify-center q-mt-md q-gutter-sm">
          <q-btn
            flat
            label="Back to Help"
            icon="arrow_back"
            @click="$router.push('/help')"
          />
          <q-btn
            flat
            label="Search Help"
            icon="search"
            @click="$router.push('/help')"
          />
        </div>
      </div>

      <!-- Not Found -->
      <div v-else class="text-center q-pa-xl">
        <q-icon name="article" size="48px" color="grey-5" class="q-mb-sm" />
        <div class="text-h6 text-grey-6">Article not found</div>
        <q-btn
          flat
          label="Back to Help"
          color="primary"
          @click="$router.push('/help')"
          class="q-mt-md"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useHelpStore } from '@/stores/useHelpStore';

const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const helpStore = useHelpStore();

const articleId = computed(() => route.params.id || route.params.slug);
const article = computed(() => helpStore.currentArticle);
const loading = computed(() => helpStore.loading);

const relatedArticles = computed(() => {
  if (!article.value) return [];
  return helpStore.articles
    .filter((a) => a.id !== article.value?.id && a.category === article.value?.category)
    .slice(0, 3);
});

function formatContent(content: string): string {
  if (!content) return '';
  // If content is markdown, convert to HTML
  // For now, just return as-is (assuming backend sends HTML or we'll use a markdown parser)
  return content;
}

function viewArticle(relatedArticle: any) {
  router.push(`/help/${relatedArticle.slug || relatedArticle.id}`);
}

onMounted(async () => {
  try {
    const id = Number(articleId.value);
    if (isNaN(id)) {
      // Try to find by slug
      await helpStore.fetchArticles();
      const found = helpStore.articles.find((a) => a.slug === articleId.value);
      if (found) {
        await helpStore.fetchArticle(found.id);
      } else {
        $q.notify({
          type: 'negative',
          message: 'Article not found',
        });
        router.push('/help');
      }
    } else {
      await helpStore.fetchArticle(id);
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to load article',
    });
    router.push('/help');
  }
});
</script>

<style scoped lang="scss">
.help-article-page {
  background-color: var(--ccip-bg-page);
}

.help-article-content {
  line-height: 1.8;
  
  :deep(h1), :deep(h2), :deep(h3) {
    margin-top: 1.5em;
    margin-bottom: 0.5em;
  }
  
  :deep(p) {
    margin-bottom: 1em;
  }
  
  :deep(ul), :deep(ol) {
    margin-left: 2em;
    margin-bottom: 1em;
  }
  
  :deep(code) {
    background-color: var(--ccip-bg-page);
    padding: 2px 6px;
    border-radius: 3px;
    font-family: monospace;
  }
  
  :deep(pre) {
    background-color: var(--ccip-bg-page);
    padding: 1em;
    border-radius: 4px;
    overflow-x: auto;
  }
}
</style>
