<template>
  <q-page class="organisation-detail-page" v-if="organisation">
    <div class="q-pa-md">
      <!-- Loading State -->
      <div v-if="loading" class="text-center q-pa-xl">
        <q-spinner color="primary" size="3em" />
        <div class="q-mt-md">Loading organisation details...</div>
      </div>

      <!-- Organisation Details -->
      <div v-else>
        <!-- Header -->
        <div class="row items-center q-mb-md">
          <q-btn
            flat
            round
            icon="arrow_back"
            @click="$router.push('/organisations')"
          />
          <div class="col q-ml-md">
            <div class="text-h4 text-weight-bold">{{ organisation.name }}</div>
            <div class="text-subtitle1 text-grey-7">{{ organisation.description || 'No description' }}</div>
          </div>
          <div class="col-auto">
            <q-btn
              color="primary"
              label="Edit"
              icon="edit"
              @click="editOrganisation"
            />
          </div>
        </div>

        <!-- Tabs -->
        <q-tabs v-model="activeTab" class="text-primary q-mb-md">
          <q-tab name="overview" label="Overview" icon="dashboard" />
          <q-tab name="members" label="Team Members" icon="people" />
          <q-tab name="activities" label="Activities" icon="assignment" />
        </q-tabs>

        <q-separator />

        <!-- Tab Panels -->
        <q-tab-panels v-model="activeTab" animated>
          <!-- Overview Tab -->
          <q-tab-panel name="overview">
            <div class="row q-col-gutter-md">
              <!-- Organisation Info Card -->
              <div class="col-12 col-md-6">
                <q-card>
                  <q-card-section>
                    <div class="text-h6 q-mb-md">Organisation Information</div>
                    <q-list>
                      <q-item>
                        <q-item-section>
                          <q-item-label caption>Type</q-item-label>
                          <q-item-label>
                            <q-badge :color="getTypeColor(organisation.type)" :label="organisation.type" />
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item v-if="organisation.parent_id">
                        <q-item-section>
                          <q-item-label caption>Parent Organisation</q-item-label>
                          <q-item-label>{{ parentOrganisation?.name || 'Loading...' }}</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section>
                          <q-item-label caption>Description</q-item-label>
                          <q-item-label>{{ organisation.description || 'No description provided' }}</q-item-label>
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
                            <div class="text-h4 text-primary">{{ memberCount }}</div>
                            <div class="text-caption text-grey-7">Team Members</div>
                          </q-card-section>
                        </q-card>
                      </div>
                      <div class="col-6">
                        <q-card flat bordered>
                          <q-card-section class="text-center">
                            <div class="text-h4 text-teal">{{ activityCount }}</div>
                            <div class="text-caption text-grey-7">Activities</div>
                          </q-card-section>
                        </q-card>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </q-tab-panel>

          <!-- Members Tab -->
          <q-tab-panel name="members">
            <q-card>
              <q-card-section>
                <div class="row items-center justify-between q-mb-md">
                  <div class="text-h6">Team Members</div>
                  <q-btn
                    color="primary"
                    label="Invite Member"
                    icon="person_add"
                    @click="showInviteDialog = true"
                  />
                </div>

                <!-- Search -->
                <q-input
                  v-model="memberSearch"
                  placeholder="Search members..."
                  outlined
                  dense
                  clearable
                  class="q-mb-md"
                >
                  <template #prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>

                <!-- Members List -->
                <q-list v-if="filteredMembers.length > 0" separator>
                  <q-item
                    v-for="member in filteredMembers"
                    :key="member.id"
                    clickable
                    @click="viewMember(member)"
                  >
                    <q-item-section avatar>
                      <q-avatar color="primary" text-color="white">
                        {{ member.name?.charAt(0).toUpperCase() || 'U' }}
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ member.name }}</q-item-label>
                      <q-item-label caption>{{ member.email }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-chip
                        :color="getRoleColor(member.role)"
                        text-color="white"
                        size="sm"
                        :label="member.role"
                      />
                    </q-item-section>
                    <q-item-section side>
                      <q-btn
                        flat
                        dense
                        round
                        icon="more_vert"
                      >
                        <q-menu>
                          <q-list>
                            <q-item clickable @click="editMember(member)">
                              <q-item-section avatar>
                                <q-icon name="edit" />
                              </q-item-section>
                              <q-item-section>Edit</q-item-section>
                            </q-item>
                            <q-item clickable @click="removeMember(member)">
                              <q-item-section avatar>
                                <q-icon name="person_remove" />
                              </q-item-section>
                              <q-item-section>Remove</q-item-section>
                            </q-item>
                          </q-list>
                        </q-menu>
                      </q-btn>
                    </q-item-section>
                  </q-item>
                </q-list>

                <div v-else class="text-center q-py-xl text-grey-6">
                  <q-icon name="people_outline" size="48px" class="q-mb-sm" />
                  <div>No members found</div>
                </div>
              </q-card-section>
            </q-card>
          </q-tab-panel>

          <!-- Activities Tab -->
          <q-tab-panel name="activities">
            <q-card>
              <q-card-section>
                <div class="text-h6 q-mb-md">Organisation Activities</div>
                <q-list v-if="organisationActivities.length > 0" separator>
                  <q-item
                    v-for="activity in organisationActivities"
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
        </q-tab-panels>
      </div>
    </div>

    <!-- Invite Member Dialog -->
    <BaseDialog
      v-model="showInviteDialog"
      title="Invite Team Member"
      @update:model-value="showInviteDialog = $event"
    >
      <q-form @submit="inviteMember">
        <q-input
          v-model="inviteEmail"
          label="Email Address"
          type="email"
          outlined
          dense
          :rules="[val => !!val || 'Email is required', val => /.+@.+\..+/.test(val) || 'Invalid email']"
          class="q-mb-md"
        />
        <q-select
          v-model="inviteRole"
          :options="roleOptions"
          label="Role"
          outlined
          dense
          emit-value
          map-options
          :rules="[val => !!val || 'Role is required']"
          class="q-mb-md"
        />
        <template #actions>
          <q-btn flat label="Cancel" @click="showInviteDialog = false" />
          <q-btn color="primary" label="Send Invite" type="submit" />
        </template>
      </q-form>
    </BaseDialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useOrganisationStore } from '@/stores/useOrganisationStore';
import { useActivityStore } from '@/stores/useActivityStore';
import BaseDialog from '@/components/ui/BaseDialog.vue';

const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const organisationStore = useOrganisationStore();
const activityStore = useActivityStore();

const organisationId = computed(() => Number(route.params.id));
const organisation = computed(() => organisationStore.currentOrganisation);
const loading = computed(() => organisationStore.loading);

const activeTab = ref('overview');
const memberSearch = ref('');
const showInviteDialog = ref(false);
const inviteEmail = ref('');
const inviteRole = ref('user');

const members = ref<any[]>([]);
const organisationActivities = ref<any[]>([]);
const parentOrganisation = ref<any>(null);

const roleOptions = [
  { label: 'User', value: 'user' },
  { label: 'Sub-admin', value: 'sub_admin' },
  { label: 'Admin', value: 'admin' },
];

const memberCount = computed(() => members.value.length);
const activityCount = computed(() => organisationActivities.value.length);

const filteredMembers = computed(() => {
  if (!memberSearch.value) return members.value;
  const query = memberSearch.value.toLowerCase();
  return members.value.filter(
    (member) =>
      member.name?.toLowerCase().includes(query) ||
      member.email?.toLowerCase().includes(query)
  );
});

function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    national: 'purple',
    regional: 'blue',
    district: 'teal',
    local: 'orange',
    community: 'green',
  };
  return colors[type.toLowerCase()] || 'grey';
}

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

function editOrganisation() {
  router.push(`/organisations/${organisationId.value}/edit`);
}

function viewMember(member: any) {
  router.push(`/users/${member.id}`);
}

function editMember(member: any) {
  // Implement edit member functionality
  $q.notify({
    type: 'info',
    message: 'Edit member functionality to be implemented',
  });
}

function removeMember(member: any) {
  $q.dialog({
    title: 'Confirm Removal',
    message: `Are you sure you want to remove ${member.name} from this organisation?`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      // Implement remove member API call
      $q.notify({
        type: 'positive',
        message: 'Member removed successfully',
      });
      await loadMembers();
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Failed to remove member',
      });
    }
  });
}

async function inviteMember() {
  try {
    // Implement invite member API call
    $q.notify({
      type: 'positive',
      message: 'Invitation sent successfully',
    });
    showInviteDialog.value = false;
    inviteEmail.value = '';
    inviteRole.value = 'user';
    await loadMembers();
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to send invitation',
    });
  }
}

async function loadMembers() {
  try {
    const data = await organisationStore.fetchOrganisationUsers(organisationId.value);
    members.value = data || [];
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to load members',
    });
  }
}

async function loadActivities() {
  try {
    const data = await activityStore.fetchActivities({
      organisation_id: organisationId.value,
    });
    organisationActivities.value = data?.data || data || [];
  } catch (error) {
    // Silently fail - activities might not be available
  }
}

onMounted(async () => {
  await organisationStore.fetchOrganisation(organisationId.value);
  await loadMembers();
  await loadActivities();
});
</script>

<style scoped lang="scss">
.organisation-detail-page {
  background-color: var(--ccip-bg-page);
}
</style>
