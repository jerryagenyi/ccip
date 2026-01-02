<template>
  <q-page class="activity-timeline-page" v-if="activity">
    <div class="q-pa-md">
      <!-- Header -->
      <div class="row items-center q-mb-md">
        <q-btn
          flat
          round
          icon="arrow_back"
          @click="$router.push(`/activities/${activityId}`)"
        />
        <div class="col q-ml-md">
          <div class="text-h4 text-weight-bold">Activity Timeline</div>
          <div class="text-subtitle1 text-grey-7">{{ activity.title }}</div>
        </div>
      </div>

      <!-- Timeline -->
      <q-card>
        <q-card-section>
          <div class="text-h6 q-mb-md">Activity History</div>
          <q-timeline color="primary" layout="dense">
            <q-timeline-entry
              title="Activity Created"
              :subtitle="formatDateTime(activity.date)"
              icon="add_circle"
              color="primary"
            >
              <div class="text-body2 q-mt-sm">
                Activity was created by {{ activity.user?.name || 'User' }}
              </div>
            </q-timeline-entry>

            <q-timeline-entry
              v-if="activity.status !== 'draft'"
              title="Submitted for Approval"
              subtitle="Status changed to submitted"
              icon="send"
              color="blue"
            >
              <div class="text-body2 q-mt-sm">
                Activity was submitted for review and approval
              </div>
            </q-timeline-entry>

            <q-timeline-entry
              v-if="activity.status === 'approved'"
              title="Approved"
              subtitle="Activity has been approved"
              icon="check_circle"
              color="green"
            >
              <div class="text-body2 q-mt-sm">
                Activity was approved and is now active
              </div>
            </q-timeline-entry>

            <q-timeline-entry
              v-if="activity.status === 'rejected'"
              title="Rejected"
              subtitle="Activity was rejected"
              icon="cancel"
              color="red"
            >
              <div class="text-body2 q-mt-sm">
                Activity was rejected and requires revision
              </div>
            </q-timeline-entry>

            <q-timeline-entry
              v-if="activity.lastModified && activity.lastModified !== activity.date"
              title="Last Modified"
              :subtitle="formatDateTime(activity.lastModified)"
              icon="edit"
              color="orange"
            >
              <div class="text-body2 q-mt-sm">
                Activity details were last updated
              </div>
            </q-timeline-entry>
          </q-timeline>
        </q-card-section>
      </q-card>

      <!-- Status Changes -->
      <q-card class="q-mt-md">
        <q-card-section>
          <div class="text-h6 q-mb-md">Status Changes</div>
          <q-list>
            <q-item>
              <q-item-section avatar>
                <q-icon name="radio_button_checked" color="orange" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Draft</q-item-label>
                <q-item-label caption>{{ formatDateTime(activity.date) }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="activity.status !== 'draft'">
              <q-item-section avatar>
                <q-icon name="radio_button_checked" color="blue" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Submitted</q-item-label>
                <q-item-label caption>Submitted for approval</q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="activity.status === 'approved'">
              <q-item-section avatar>
                <q-icon name="radio_button_checked" color="green" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Approved</q-item-label>
                <q-item-label caption>Activity approved</q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="activity.status === 'rejected'">
              <q-item-section avatar>
                <q-icon name="radio_button_checked" color="red" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Rejected</q-item-label>
                <q-item-label caption>Activity rejected</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useActivityStore } from '@/stores/useActivityStore';

const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const activityStore = useActivityStore();

const activityId = computed(() => Number(route.params.id));
const activity = computed(() => activityStore.currentActivity);
const loading = computed(() => activityStore.loading);

function formatDateTime(dateString: string): string {
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

onMounted(async () => {
  try {
    await activityStore.fetchActivity(activityId.value);
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to load activity',
    });
    router.push('/activities');
  }
});
</script>

<style scoped lang="scss">
.activity-timeline-page {
  background-color: var(--ccip-bg-page);
}
</style>
