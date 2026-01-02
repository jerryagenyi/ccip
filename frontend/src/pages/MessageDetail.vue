<template>
  <q-page class="message-detail-page" v-if="message">
    <div class="q-pa-md">
      <!-- Loading State -->
      <div v-if="loading" class="text-center q-pa-xl">
        <q-spinner color="primary" size="3em" />
        <div class="q-mt-md">Loading message...</div>
      </div>

      <!-- Message Content -->
      <div v-else>
        <!-- Header -->
        <div class="row items-center q-mb-md">
          <q-btn
            flat
            round
            icon="arrow_back"
            @click="$router.push('/messages')"
          />
          <div class="col q-ml-md">
            <div class="row items-center q-gutter-sm">
              <div class="text-h5 text-weight-bold">{{ message.subject }}</div>
              <q-badge
                v-if="message.is_urgent"
                color="red"
                label="Urgent"
              />
            </div>
            <div class="text-subtitle2 text-grey-7 q-mt-xs">
              From: {{ message.sender.name }} ({{ message.sender.email }})
            </div>
            <div class="text-caption text-grey-6">
              {{ formatDate(message.created_at) }}
            </div>
          </div>
          <div class="col-auto">
            <q-btn
              color="primary"
              label="Reply"
              icon="reply"
              @click="showReplyDialog = true"
            />
          </div>
        </div>

        <!-- Message Body -->
        <q-card class="q-mb-md">
          <q-card-section>
            <div class="message-body" v-html="formatMessageBody(message.body)"></div>
          </q-card-section>
        </q-card>

        <!-- Recipients -->
        <q-card class="q-mb-md">
          <q-card-section>
            <div class="text-h6 q-mb-md">Recipients</div>
            <q-list>
              <q-item
                v-for="recipient in message.recipients"
                :key="recipient.user_id"
              >
                <q-item-section avatar>
                  <q-avatar color="primary" text-color="white">
                    {{ recipient.user_name?.charAt(0).toUpperCase() || 'U' }}
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ recipient.user_name }}</q-item-label>
                  <q-item-label caption>
                    <q-icon
                      v-if="recipient.read_at"
                      name="check_circle"
                      color="green"
                      size="16px"
                    />
                    <span v-if="recipient.read_at">
                      Read {{ formatDate(recipient.read_at) }}
                    </span>
                    <span v-else class="text-orange">Unread</span>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>

        <!-- Reply Section -->
        <q-card v-if="showReplySection">
          <q-card-section>
            <div class="text-h6 q-mb-md">Reply</div>
            <q-form @submit="sendReply">
              <q-input
                v-model="replyBody"
                label="Your reply"
                type="textarea"
                outlined
                rows="5"
                :rules="[val => !!val || 'Reply is required']"
                class="q-mb-md"
              />
              <div class="row justify-end">
                <q-btn
                  flat
                  label="Cancel"
                  @click="showReplySection = false"
                />
                <q-btn
                  color="primary"
                  label="Send Reply"
                  type="submit"
                  :loading="loading"
                  icon="send"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Reply Dialog -->
    <BaseDialog
      v-model="showReplyDialog"
      title="Reply to Message"
      @update:model-value="showReplyDialog = $event"
    >
      <q-form @submit="sendReply">
        <q-input
          v-model="replyBody"
          label="Your reply"
          type="textarea"
          outlined
          rows="8"
          :rules="[val => !!val || 'Reply is required']"
          class="q-mb-md"
        />
        <template #actions>
          <q-btn flat label="Cancel" @click="showReplyDialog = false" />
          <q-btn color="primary" label="Send Reply" type="submit" :loading="loading" />
        </template>
      </q-form>
    </BaseDialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useMessageStore } from '@/stores/useMessageStore';
import BaseDialog from '@/components/ui/BaseDialog.vue';

const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const messageStore = useMessageStore();

const messageId = computed(() => Number(route.params.id));
const message = computed(() => messageStore.currentMessage);
const loading = computed(() => messageStore.loading);

const showReplyDialog = ref(false);
const showReplySection = ref(false);
const replyBody = ref('');

function formatMessageBody(body: string): string {
  if (!body) return '';
  // Convert line breaks to HTML
  return body.replace(/\n/g, '<br>');
}

function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

async function sendReply() {
  if (!replyBody.value.trim()) {
    $q.notify({
      type: 'negative',
      message: 'Please enter a reply',
    });
    return;
  }

  try {
    await messageStore.replyToMessage(messageId.value, replyBody.value);
    $q.notify({
      type: 'positive',
      message: 'Reply sent successfully',
    });
    replyBody.value = '';
    showReplyDialog.value = false;
    showReplySection.value = false;
    // Reload message to show the reply
    await messageStore.fetchMessage(messageId.value);
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to send reply',
    });
  }
}

onMounted(async () => {
  try {
    await messageStore.fetchMessage(messageId.value);
    // Mark as read
    if (message.value) {
      await messageStore.markAsRead(messageId.value);
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to load message',
    });
    router.push('/messages');
  }
});
</script>

<style scoped lang="scss">
.message-detail-page {
  background-color: var(--ccip-bg-page);
}

.message-body {
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.6;
}
</style>
