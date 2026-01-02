<template>
  <q-page class="settings-page">
    <div class="q-pa-md">
      <!-- Page Header -->
      <div class="row items-center q-mb-md">
        <div class="col">
          <div class="text-h4 text-weight-bold">Settings</div>
          <div class="text-subtitle1 text-grey-7">Manage your account and preferences</div>
        </div>
      </div>

      <!-- Settings Tabs -->
      <q-tabs v-model="activeTab" class="text-primary q-mb-md">
        <q-tab name="profile" label="Profile" icon="person" />
        <q-tab name="notifications" label="Notifications" icon="notifications" />
        <q-tab name="preferences" label="Preferences" icon="settings" />
      </q-tabs>

      <q-separator />

      <!-- Tab Panels -->
      <q-tab-panels v-model="activeTab" animated>
        <!-- Profile Tab -->
        <q-tab-panel name="profile">
          <q-card>
            <q-card-section>
              <div class="text-h6 q-mb-md">Profile Information</div>
              <q-form @submit="updateProfile" class="q-gutter-md">
                <div class="row items-center q-mb-md">
                  <q-avatar size="80px" color="primary" text-color="white">
                    {{ profileForm.name?.charAt(0).toUpperCase() || 'U' }}
                  </q-avatar>
                  <div class="q-ml-md">
                    <q-btn
                      color="primary"
                      label="Change Photo"
                      outline
                      size="sm"
                      @click="triggerFileUpload"
                    />
                  </div>
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    style="display: none"
                    @change="handleFileSelect"
                  />
                </div>
                <q-input
                  v-model="profileForm.name"
                  label="Full Name"
                  outlined
                  dense
                  :rules="[val => !!val || 'Name is required']"
                />
                <q-input
                  v-model="profileForm.email"
                  label="Email"
                  type="email"
                  outlined
                  dense
                  readonly
                  hint="Email cannot be changed"
                />
                <div class="row justify-end q-mt-md">
                  <q-btn
                    color="primary"
                    label="Save Changes"
                    type="submit"
                    :loading="saving"
                  />
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </q-tab-panel>

        <!-- Notifications Tab -->
        <q-tab-panel name="notifications">
          <q-card>
            <q-card-section>
              <div class="text-h6 q-mb-md">Notification Preferences</div>
              <q-form @submit="updateNotificationPreferences" class="q-gutter-md">
                <div class="text-subtitle2 q-mb-sm">Email Notifications</div>
                <q-toggle
                  v-model="notificationPrefs.email_enabled"
                  label="Enable email notifications"
                  color="primary"
                />
                <q-toggle
                  v-model="notificationPrefs.message_email"
                  label="Email for new messages"
                  color="primary"
                  :disable="!notificationPrefs.email_enabled"
                />
                <q-toggle
                  v-model="notificationPrefs.activity_email"
                  label="Email for activity updates"
                  color="primary"
                  :disable="!notificationPrefs.email_enabled"
                />
                <q-toggle
                  v-model="notificationPrefs.urgent_email"
                  label="Email for urgent notifications"
                  color="primary"
                  :disable="!notificationPrefs.email_enabled"
                />

                <q-separator class="q-my-md" />

                <div class="text-subtitle2 q-mb-sm">In-App Notifications</div>
                <q-toggle
                  v-model="notificationPrefs.in_app_enabled"
                  label="Enable in-app notifications"
                  color="primary"
                />
                <q-toggle
                  v-model="notificationPrefs.message_in_app"
                  label="In-app for new messages"
                  color="primary"
                  :disable="!notificationPrefs.in_app_enabled"
                />
                <q-toggle
                  v-model="notificationPrefs.activity_in_app"
                  label="In-app for activity updates"
                  color="primary"
                  :disable="!notificationPrefs.in_app_enabled"
                />
                <q-toggle
                  v-model="notificationPrefs.urgent_in_app"
                  label="In-app for urgent notifications"
                  color="primary"
                  :disable="!notificationPrefs.in_app_enabled"
                />

                <div class="row justify-end q-mt-md">
                  <q-btn
                    color="primary"
                    label="Save Preferences"
                    type="submit"
                    :loading="saving"
                  />
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </q-tab-panel>

        <!-- Preferences Tab -->
        <q-tab-panel name="preferences">
          <q-card>
            <q-card-section>
              <div class="text-h6 q-mb-md">Application Preferences</div>
              <q-form class="q-gutter-md">
                <q-select
                  v-model="preferences.language"
                  :options="languageOptions"
                  label="Language"
                  outlined
                  dense
                  emit-value
                  map-options
                />
                <q-select
                  v-model="preferences.timezone"
                  :options="timezoneOptions"
                  label="Timezone"
                  outlined
                  dense
                  use-input
                  input-debounce="300"
                  @filter="filterTimezones"
                />
                <q-toggle
                  v-model="preferences.email_notifications"
                  label="Receive email notifications"
                  color="primary"
                />
                <q-toggle
                  v-model="preferences.weekly_digest"
                  label="Weekly activity digest"
                  color="primary"
                />
                <div class="row justify-end q-mt-md">
                  <q-btn
                    color="primary"
                    label="Save Preferences"
                    :loading="saving"
                    @click="savePreferences"
                  />
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useUserStore } from '@/stores/useUserStore';
import { useNotificationStore } from '@/stores/useNotificationStore';

const $q = useQuasar();
const userStore = useUserStore();
const notificationStore = useNotificationStore();

const activeTab = ref('profile');
const saving = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const profileForm = ref({
  name: '',
  email: '',
});

const notificationPrefs = ref({
  email_enabled: true,
  in_app_enabled: true,
  message_email: true,
  message_in_app: true,
  activity_email: true,
  activity_in_app: true,
  urgent_email: true,
  urgent_in_app: true,
});

const preferences = ref({
  language: 'en',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  email_notifications: true,
  weekly_digest: false,
});

const languageOptions = [
  { label: 'English', value: 'en' },
  { label: 'French', value: 'fr' },
  { label: 'Spanish', value: 'es' },
  { label: 'Portuguese', value: 'pt' },
];

const timezoneOptions = ref([
  { label: 'UTC', value: 'UTC' },
  { label: 'GMT', value: 'GMT' },
  { label: 'Africa/Lagos', value: 'Africa/Lagos' },
  { label: 'America/New_York', value: 'America/New_York' },
  { label: 'Europe/London', value: 'Europe/London' },
  { label: 'Asia/Tokyo', value: 'Asia/Tokyo' },
]);

function filterTimezones(val: string, update: (callback: () => void) => void) {
  update(() => {
    // Filter timezones
  });
}

function triggerFileUpload() {
  fileInput.value?.click();
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    // Handle file upload
    $q.notify({
      type: 'info',
      message: 'File upload functionality to be implemented',
    });
  }
}

async function updateProfile() {
  saving.value = true;
  try {
    await userStore.updateProfile({
      name: profileForm.value.name,
    });
    $q.notify({
      type: 'positive',
      message: 'Profile updated successfully',
    });
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to update profile',
    });
  } finally {
    saving.value = false;
  }
}

async function updateNotificationPreferences() {
  saving.value = true;
  try {
    await notificationStore.updatePreferences(notificationPrefs.value);
    $q.notify({
      type: 'positive',
      message: 'Notification preferences updated',
    });
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to update preferences',
    });
  } finally {
    saving.value = false;
  }
}

async function savePreferences() {
  saving.value = true;
  try {
    // Save preferences to backend
    $q.notify({
      type: 'positive',
      message: 'Preferences saved successfully',
    });
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to save preferences',
    });
  } finally {
    saving.value = false;
  }
}

onMounted(async () => {
  await userStore.fetchProfile();
  if (userStore.currentUser) {
    profileForm.value.name = userStore.currentUser.name;
    profileForm.value.email = userStore.currentUser.email;
  }

  await notificationStore.fetchPreferences();
  if (notificationStore.preferences) {
    notificationPrefs.value = { ...notificationStore.preferences };
  }
});
</script>

<style scoped lang="scss">
.settings-page {
  background-color: var(--ccip-bg-page);
}
</style>

