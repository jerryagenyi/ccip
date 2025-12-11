<template>
  <q-page class="activity-detail-page" v-if="activity">
    <div class="q-pa-md">
      <!-- Loading State -->
      <div v-if="loading" class="text-center q-pa-xl">
        <q-spinner color="primary" size="3em" />
        <div class="q-mt-md">Loading activity details...</div>
      </div>

      <!-- Activity Content -->
      <div v-else>
        <!-- Header -->
        <div class="row items-center q-mb-md">
          <q-btn
            flat
            round
            icon="arrow_back"
            @click="$router.push('/activities')"
          />
          <div class="col q-ml-md">
            <div class="row items-center q-gutter-sm">
              <div class="text-h4 text-weight-bold">{{ activity.title }}</div>
              <q-chip
                :color="getStatusColor(activity.status)"
                text-color="white"
                :label="activity.status"
              />
            </div>
            <div class="text-subtitle2 text-grey-7 q-mt-xs">
              {{ activity.type }} • {{ formatDate(activity.date) }}
            </div>
          </div>
          <div class="col-auto q-gutter-sm">
            <q-btn
              v-if="activity.status === 'draft'"
              color="primary"
              label="Edit"
              icon="edit"
              @click="editActivity"
            />
            <q-btn
              v-if="activity.status === 'draft'"
              color="blue"
              label="Submit"
              icon="send"
              @click="submitActivity"
            />
            <q-btn
              flat
              round
              icon="more_vert"
            >
              <q-menu>
                <q-list>
                  <q-item clickable @click="editActivity">
                    <q-item-section avatar>
                      <q-icon name="edit" />
                    </q-item-section>
                    <q-item-section>Edit Activity</q-item-section>
                  </q-item>
                  <q-item clickable @click="viewTimeline">
                    <q-item-section avatar>
                      <q-icon name="timeline" />
                    </q-item-section>
                    <q-item-section>View Timeline</q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item clickable @click="deleteActivity" class="text-negative">
                    <q-item-section avatar>
                      <q-icon name="delete" color="negative" />
                    </q-item-section>
                    <q-item-section>Delete Activity</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </div>

        <!-- Tabs -->
        <q-tabs v-model="activeTab" class="text-primary q-mb-md">
          <q-tab name="overview" label="Overview" icon="info" />
          <q-tab name="details" label="Details" icon="description" />
          <q-tab name="attachments" label="Attachments" icon="attach_file" />
          <q-tab name="timeline" label="Timeline" icon="timeline" />
        </q-tabs>

        <q-separator />

        <!-- Tab Panels -->
        <q-tab-panels v-model="activeTab" animated>
          <!-- Overview Tab -->
          <q-tab-panel name="overview">
            <div class="row q-col-gutter-md">
              <!-- Activity Info Card -->
              <div class="col-12 col-md-8">
                <q-card>
                  <q-card-section>
                    <div class="text-h6 q-mb-md">Activity Information</div>
                    <q-list>
                      <q-item>
                        <q-item-section>
                          <q-item-label caption>Title</q-item-label>
                          <q-item-label>{{ activity.title }}</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section>
                          <q-item-label caption>Type</q-item-label>
                          <q-item-label>
                            <q-badge :color="getTypeColor(activity.type)" :label="activity.type" />
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section>
                          <q-item-label caption>Status</q-item-label>
                          <q-item-label>
                            <q-chip
                              :color="getStatusColor(activity.status)"
                              text-color="white"
                              :label="activity.status"
                            />
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section>
                          <q-item-label caption>Location</q-item-label>
                          <q-item-label>{{ activity.location }}</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section>
                          <q-item-label caption>Date</q-item-label>
                          <q-item-label>{{ formatDate(activity.date) }}</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item v-if="activity.organisation">
                        <q-item-section>
                          <q-item-label caption>Organisation</q-item-label>
                          <q-item-label>
                            <q-btn
                              flat
                              dense
                              :label="activity.organisation.name"
                              @click="$router.push(`/organisations/${activity.organisation.id}`)"
                            />
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-card-section>
                </q-card>
              </div>

              <!-- Quick Actions Card -->
              <div class="col-12 col-md-4">
                <q-card>
                  <q-card-section>
                    <div class="text-h6 q-mb-md">Quick Actions</div>
                    <q-list>
                      <q-item clickable @click="editActivity">
                        <q-item-section avatar>
                          <q-icon name="edit" color="primary" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>Edit Activity</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item clickable @click="viewTimeline">
                        <q-item-section avatar>
                          <q-icon name="timeline" color="teal" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>View Timeline</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item v-if="activity.status === 'draft'" clickable @click="submitActivity">
                        <q-item-section avatar>
                          <q-icon name="send" color="blue" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>Submit for Approval</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </q-tab-panel>

          <!-- Details Tab -->
          <q-tab-panel name="details">
            <q-card>
              <q-card-section>
                <div class="text-h6 q-mb-md">Description</div>
                <div class="activity-description">{{ activity.description }}</div>

                <q-separator class="q-my-md" />

                <div class="text-h6 q-mb-md">Additional Information</div>
                <q-list>
                  <q-item v-if="activity.tags && activity.tags.length > 0">
                    <q-item-section>
                      <q-item-label caption>Tags</q-item-label>
                      <q-item-label>
                        <q-chip
                          v-for="tag in activity.tags"
                          :key="tag.id"
                          :label="tag.name"
                          color="primary"
                          text-color="white"
                          size="sm"
                          class="q-mr-xs q-mb-xs"
                        />
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </q-tab-panel>

          <!-- Attachments Tab -->
          <q-tab-panel name="attachments">
            <q-card>
              <q-card-section>
                <div class="text-h6 q-mb-md">Evidence Files</div>
                <q-list v-if="activity.evidence && activity.evidence.length > 0" separator>
                  <q-item
                    v-for="file in activity.evidence"
                    :key="file.id"
                    clickable
                  >
                    <q-item-section avatar>
                      <q-icon :name="getFileIcon(file.file_type)" size="32px" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ file.file_name }}</q-item-label>
                      <q-item-label caption>{{ file.file_type }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-btn
                        flat
                        round
                        dense
                        icon="download"
                        @click="downloadFile(file)"
                      />
                    </q-item-section>
                  </q-item>
                </q-list>
                <div v-else class="text-center q-py-xl text-grey-6">
                  <q-icon name="attach_file" size="48px" class="q-mb-sm" />
                  <div>No attachments</div>
                </div>
              </q-card-section>
            </q-card>
          </q-tab-panel>

          <!-- Timeline Tab -->
          <q-tab-panel name="timeline">
            <q-card>
              <q-card-section>
                <div class="text-h6 q-mb-md">Activity Timeline</div>
                <q-timeline color="primary">
                  <q-timeline-entry
                    title="Activity Created"
                    :subtitle="formatDate(activity.date)"
                    icon="add_circle"
                  />
                  <q-timeline-entry
                    v-if="activity.status !== 'draft'"
                    title="Submitted for Approval"
                    subtitle="Status changed to submitted"
                    icon="send"
                  />
                  <q-timeline-entry
                    v-if="activity.status === 'approved'"
                    title="Approved"
                    subtitle="Activity has been approved"
                    icon="check_circle"
                    color="green"
                  />
                </q-timeline>
              </q-card-section>
            </q-card>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
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

const activeTab = ref('overview');

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    draft: 'orange',
    submitted: 'blue',
    approved: 'green',
    rejected: 'red',
  };
  return colors[status.toLowerCase()] || 'grey';
}

function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    workshop: 'purple',
    campaign: 'pink',
    meeting: 'indigo',
    training: 'teal',
    other: 'grey',
  };
  return colors[type.toLowerCase()] || 'primary';
}

function getFileIcon(fileType: string): string {
  if (fileType.startsWith('image/')) return 'image';
  if (fileType.startsWith('video/')) return 'video_library';
  if (fileType.startsWith('audio/')) return 'audio_file';
  if (fileType.includes('pdf')) return 'picture_as_pdf';
  if (fileType.includes('word') || fileType.includes('document')) return 'description';
  return 'insert_drive_file';
}

function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function editActivity() {
  router.push(`/activities/${activityId.value}/edit`);
}

function viewTimeline() {
  router.push(`/activities/${activityId.value}/timeline`);
}

async function submitActivity() {
  $q.dialog({
    title: 'Submit Activity',
    message: 'Are you sure you want to submit this activity for approval?',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await activityStore.submitActivity(activityId.value);
      $q.notify({
        type: 'positive',
        message: 'Activity submitted successfully',
      });
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Failed to submit activity',
      });
    }
  });
}

function deleteActivity() {
  $q.dialog({
    title: 'Delete Activity',
    message: 'Are you sure you want to delete this activity? This action cannot be undone.',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await activityStore.deleteActivity(activityId.value);
      $q.notify({
        type: 'positive',
        message: 'Activity deleted successfully',
      });
      router.push('/activities');
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Failed to delete activity',
      });
    }
  });
}

function downloadFile(file: any) {
  // Implement file download logic
  $q.notify({
    type: 'info',
    message: 'File download functionality to be implemented',
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
.activity-detail-page {
  background-color: #f5f5f5;
}

.activity-description {
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.6;
}
</style>
