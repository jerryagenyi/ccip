<template>
  <q-page class="message-inbox-page">
    <div class="q-pa-md">
      <!-- Page Header -->
      <div class="row items-center q-mb-md">
        <div class="col">
          <div class="text-h4 text-weight-bold">Messages</div>
          <div class="text-subtitle1 text-grey-7">Manage your communications</div>
        </div>
        <div class="col-auto">
          <q-btn
            color="primary"
            label="Compose"
            icon="edit"
            @click="$router.push('/messages/compose')"
          />
        </div>
      </div>

      <!-- Filters -->
      <q-card class="q-mb-md">
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="searchQuery"
                placeholder="Search messages..."
                outlined
                dense
                clearable
              >
                <template #prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-3">
              <q-btn-toggle
                v-model="filterUnread"
                toggle-color="primary"
                :options="[
                  { label: 'All', value: false },
                  { label: 'Unread', value: true }
                ]"
                @update:model-value="loadMessages"
              />
            </div>
            <div class="col-12 col-md-3">
              <q-btn
                color="primary"
                label="Refresh"
                icon="refresh"
                class="full-width"
                @click="loadMessages"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Messages List -->
      <q-card>
        <q-card-section>
          <div class="text-h6 q-mb-md">Inbox</div>

          <!-- Loading State -->
          <div v-if="loading" class="text-center q-pa-xl">
            <q-spinner color="primary" size="3em" />
            <div class="q-mt-md">Loading messages...</div>
          </div>

          <!-- Messages -->
          <q-list v-else-if="filteredMessages.length > 0" separator>
            <q-item
              v-for="message in filteredMessages"
              :key="message.id"
              clickable
              :class="{ 'message-unread': !isRead(message) }"
              @click="viewMessage(message)"
            >
              <q-item-section avatar>
                <q-avatar :color="message.is_urgent ? 'red' : 'primary'" text-color="white">
                  {{ message.sender.name?.charAt(0).toUpperCase() || 'U' }}
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  <span class="text-weight-bold">{{ message.sender.name }}</span>
                  <q-badge
                    v-if="message.is_urgent"
                    color="red"
                    label="Urgent"
                    class="q-ml-sm"
                  />
                </q-item-label>
                <q-item-label caption lines="2">
                  {{ message.subject }}
                </q-item-label>
                <q-item-label caption>
                  {{ formatDate(message.created_at) }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon
                  v-if="!isRead(message)"
                  name="fiber_manual_record"
                  color="primary"
                  size="12px"
                />
              </q-item-section>
            </q-item>
          </q-list>

          <!-- Empty State -->
          <div v-else class="text-center q-py-xl text-grey-6">
            <q-icon name="inbox" size="48px" class="q-mb-sm" />
            <div>No messages found</div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useMessageStore } from '@/stores/useMessageStore';
import { useAuthStore } from '@/stores/useAuthStore';

const router = useRouter();
const $q = useQuasar();
const messageStore = useMessageStore();
const authStore = useAuthStore();

const searchQuery = ref('');
const filterUnread = ref(false);

const loading = computed(() => messageStore.loading);
const messages = computed(() => messageStore.messages);

const filteredMessages = computed(() => {
  let filtered = [...messages.value];

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (message) =>
        message.subject?.toLowerCase().includes(query) ||
        message.body?.toLowerCase().includes(query) ||
        message.sender.name?.toLowerCase().includes(query)
    );
  }

  // Apply unread filter
  if (filterUnread.value) {
    filtered = filtered.filter((message) => !isRead(message));
  }

  // Sort by date (newest first)
  return filtered.sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
});

function isRead(message: any): boolean {
  const currentUserId = authStore.user?.id;
  if (!currentUserId) return false;
  const recipient = message.recipients?.find((r: any) => r.user_id === currentUserId);
  return recipient?.read_at !== null;
}

function viewMessage(message: any) {
  router.push(`/messages/${message.id}`);
}

function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

async function loadMessages() {
  try {
    await messageStore.fetchMessages({
      unread_only: filterUnread.value || undefined,
    });
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to load messages',
    });
  }
}

onMounted(() => {
  loadMessages();
});
</script>

<style scoped lang="scss">
.message-inbox-page {
  background-color: var(--ccip-bg-page);
}

.message-unread {
  background-color: rgba(123, 44, 191, 0.05);
  border-left: 3px solid #7b2cbf;
}
</style>
