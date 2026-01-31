<template>
  <q-page class="user-profile-page">
    <div class="q-pa-md">
      <!-- Loading State -->
      <div v-if="loading" class="text-center q-pa-xl">
        <q-spinner color="primary" size="3em" />
        <div class="q-mt-md">Loading profile...</div>
      </div>

      <!-- Profile Content -->
      <div v-else-if="user">
        <!-- Header -->
        <div class="row items-center q-mb-md">
          <div class="col">
            <div class="text-h4 text-weight-bold">{{ user.name }}</div>
            <div class="text-subtitle1 text-grey-7">{{ user.email }}</div>
          </div>
          <div class="col-auto">
            <q-btn
              color="primary"
              label="Edit Profile"
              icon="edit"
              @click="showEditDialog = true"
            />
          </div>
        </div>

        <!-- Tabs -->
        <q-tabs v-model="activeTab" class="text-primary q-mb-md">
          <q-tab name="profile" label="Profile" icon="person" />
          <q-tab name="activities" label="Activities" icon="assignment" />
          <q-tab name="settings" label="Settings" icon="settings" />
        </q-tabs>

        <q-separator />

        <!-- Tab Panels -->
        <q-tab-panels v-model="activeTab" animated>
          <!-- Profile Tab -->
          <q-tab-panel name="profile">
            <div class="row q-col-gutter-md">
              <!-- Profile Info Card -->
              <div class="col-12 col-md-6">
                <q-card>
                  <q-card-section>
                    <div class="text-h6 q-mb-md">Profile Information</div>
                    <div class="row items-center q-mb-md">
                      <q-avatar size="80px" color="primary" text-color="white">
                        {{ user.name?.charAt(0).toUpperCase() || 'U' }}
                      </q-avatar>
                      <div class="q-ml-md">
                        <div class="text-h6">{{ user.name }}</div>
                        <div class="text-subtitle2 text-grey-7">{{ user.email }}</div>
                      </div>
                    </div>
                    <q-list>
                      <q-item>
                        <q-item-section>
                          <q-item-label caption>Role</q-item-label>
                          <q-item-label>
                            <q-chip
                              :color="getRoleColor(user.role)"
                              text-color="white"
                              :label="user.role"
                            />
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item v-if="user.organisation">
                        <q-item-section>
                          <q-item-label caption>Organisation</q-item-label>
                          <q-item-label>
                            <q-btn
                              flat
                              dense
                              :label="user.organisation.name"
                              @click="$router.push(`/organisations/${user.organisation.id}`)"
                            />
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-card-section>
                </q-card>
              </div>

              <!-- Statistics Card -->
              <div class="col-12 col-md-6">
                <q-card>
                  <q-card-section>
                    <div class="text-h6 q-mb-md">Statistics</div>
                    <div class="row q-col-gutter-md">
                      <div class="col-6">
                        <q-card flat bordered>
                          <q-card-section class="text-center">
                            <div class="text-h4 text-primary">{{ userActivities.length }}</div>
                            <div class="text-caption text-grey-7">Activities</div>
                          </q-card-section>
                        </q-card>
                      </div>
                      <div class="col-6">
                        <q-card flat bordered>
                          <q-card-section class="text-center">
                            <div class="text-h4 text-teal">{{ unreadMessages }}</div>
                            <div class="text-caption text-grey-7">Unread Messages</div>
                          </q-card-section>
                        </q-card>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </q-tab-panel>

          <!-- Activities Tab -->
          <q-tab-panel name="activities">
            <q-card>
              <q-card-section>
                <div class="text-h6 q-mb-md">My Activities</div>
                <q-list v-if="userActivities.length > 0" separator>
                  <q-item
                    v-for="activity in userActivities"
                    :key="activity.id"
                    clickable
                    @click="$router.push(`/activities/${activity.id}`)"
                  >
                    <q-item-section avatar>
                      <q-avatar :color="getStatusColor(activity.status)" text-color="white">
                        {{ activity.title?.charAt(0).toUpperCase() || 'A' }}
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ activity.title }}</q-item-label>
                      <q-item-label caption>{{ formatDate(activity.date) }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-chip
                        :color="getStatusColor(activity.status)"
                        text-color="white"
                        size="sm"
                        :label="activity.status"
                      />
                    </q-item-section>
                  </q-item>
                </q-list>
                <div v-else class="text-center q-py-xl text-grey-6">
                  <q-icon name="assignment" size="48px" class="q-mb-sm" />
                  <div>No activities yet</div>
                </div>
              </q-card-section>
            </q-card>
          </q-tab-panel>

          <!-- Settings Tab -->
          <q-tab-panel name="settings">
            <q-card>
              <q-card-section>
                <div class="text-h6 q-mb-md">Account Settings</div>
                <q-list>
                  <q-item clickable @click="showChangePasswordDialog = true">
                    <q-item-section avatar>
                      <q-icon name="lock" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Change Password</q-item-label>
                      <q-item-label caption>Update your account password</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-icon name="chevron_right" />
                    </q-item-section>
                  </q-item>
                  <q-item clickable>
                    <q-item-section avatar>
                      <q-icon name="notifications" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Notification Preferences</q-item-label>
                      <q-item-label caption>Manage your notification settings</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-icon name="chevron_right" />
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>

    <!-- Edit Profile Dialog -->
    <BaseDialog
      v-model="showEditDialog"
      title="Edit Profile"
      @update:model-value="showEditDialog = $event"
    >
      <q-form @submit="updateProfile">
        <q-input
          v-model="editFormData.name"
          label="Name"
          outlined
          dense
          :rules="[val => !!val || 'Name is required']"
          class="q-mb-md"
        />
        <template #actions>
          <q-btn flat label="Cancel" @click="showEditDialog = false" />
          <q-btn color="primary" label="Save" type="submit" :loading="updating" />
        </template>
      </q-form>
    </BaseDialog>

    <!-- Change Password Dialog -->
    <BaseDialog
      v-model="showChangePasswordDialog"
      title="Change Password"
      @update:model-value="showChangePasswordDialog = $event"
    >
      <q-form @submit="changePassword">
        <q-input
          v-model="passwordFormData.currentPassword"
          label="Current Password"
          type="password"
          outlined
          dense
          :rules="[val => !!val || 'Current password is required']"
          class="q-mb-md"
        />
        <q-input
          v-model="passwordFormData.newPassword"
          label="New Password"
          type="password"
          outlined
          dense
          :rules="[
            val => !!val || 'New password is required',
            val => val.length >= 8 || 'Password must be at least 8 characters',
          ]"
          class="q-mb-md"
        />
        <q-input
          v-model="passwordFormData.confirmPassword"
          label="Confirm New Password"
          type="password"
          outlined
          dense
          :rules="[
            val => !!val || 'Please confirm password',
            val => val === passwordFormData.newPassword || 'Passwords do not match',
          ]"
          class="q-mb-md"
        />
        <template #actions>
          <q-btn flat label="Cancel" @click="showChangePasswordDialog = false" />
          <q-btn
            color="primary"
            label="Change Password"
            type="submit"
            :loading="changingPassword"
          />
        </template>
      </q-form>
    </BaseDialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useUserStore } from '@/stores/useUserStore';
import { useActivityStore } from '@/stores/useActivityStore';
import { useMessageStore } from '@/stores/useMessageStore';
import BaseDialog from '@/components/ui/BaseDialog.vue';

const $q = useQuasar();
const userStore = useUserStore();
const activityStore = useActivityStore();
const messageStore = useMessageStore();

const user = computed(() => userStore.currentUser);
const loading = computed(() => userStore.loading);

const activeTab = ref('profile');
const showEditDialog = ref(false);
const showChangePasswordDialog = ref(false);
const updating = ref(false);
const changingPassword = ref(false);

const editFormData = ref({
  name: '',
});

const passwordFormData = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const userActivities = ref<any[]>([]);
const unreadMessages = ref(0);

function getRoleColor(role: string): string {
  const colors: Record<string, string> = {
    super_admin: 'red',
    admin: 'purple',
    sub_admin: 'blue',
    user: 'grey',
  };
  return colors[role.toLowerCase()] || 'grey';
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    draft: 'orange',
    submitted: 'blue',
    approved: 'green',
    rejected: 'red',
  };
  return colors[status.toLowerCase()] || 'grey';
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

async function updateProfile() {
  updating.value = true;
  try {
    await userStore.updateProfile({
      name: editFormData.value.name,
    });
    $q.notify({
      type: 'positive',
      message: 'Profile updated successfully',
    });
    showEditDialog.value = false;
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to update profile',
    });
  } finally {
    updating.value = false;
  }
}

async function changePassword() {
  changingPassword.value = true;
  try {
    await userStore.changePassword({
      current_password: passwordFormData.value.currentPassword,
      password: passwordFormData.value.newPassword,
      password_confirmation: passwordFormData.value.confirmPassword,
    });
    $q.notify({
      type: 'positive',
      message: 'Password changed successfully',
    });
    showChangePasswordDialog.value = false;
    passwordFormData.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to change password',
    });
  } finally {
    changingPassword.value = false;
  }
}

async function loadUserActivities() {
  try {
    const data = await activityStore.fetchActivities();
    userActivities.value = data?.data || data || [];
  } catch (error) {
    // Silently fail
  }
}

async function loadUnreadMessages() {
  try {
    const data = await messageStore.fetchMessages({ unread_only: true });
    unreadMessages.value = data?.data?.length || data?.length || 0;
  } catch (error) {
    // Silently fail
  }
}

onMounted(async () => {
  await userStore.fetchProfile();
  if (user.value) {
    editFormData.value.name = user.value.name;
    await loadUserActivities();
    await loadUnreadMessages();
  }
});
</script>

<style scoped lang="scss">
.user-profile-page {
  background-color: #f5f5f5;
}
</style>
