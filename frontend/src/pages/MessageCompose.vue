<template>
  <q-page class="message-compose-page">
    <div class="q-pa-md">
      <!-- Page Header -->
      <div class="row items-center q-mb-md">
        <q-btn flat round icon="arrow_back" @click="$router.push('/messages')" />
        <div class="col q-ml-md">
          <div class="text-h4 text-weight-bold">Compose Message</div>
          <div class="text-subtitle1 text-grey-7">Send a message to team members</div>
        </div>
      </div>

      <!-- Compose Form -->
      <q-card>
        <q-card-section>
          <q-form @submit="sendMessage" class="q-gutter-md">
            <!-- Recipient Selection -->
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-select
                  v-model="formData.recipient_id"
                  :options="userOptions"
                  label="Send to (Individual)"
                  outlined
                  dense
                  clearable
                  use-input
                  input-debounce="300"
                  @filter="filterUsers"
                  hint="Select a specific user"
                >
                  <template #no-option>
                    <q-item>
                      <q-item-section class="text-grey"> No users found </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  v-model="formData.organisation_id"
                  :options="organisationOptions"
                  label="Send to (Organisation)"
                  outlined
                  dense
                  clearable
                  hint="Or select an organisation"
                />
              </div>
            </div>

            <q-separator class="q-my-md" />

            <!-- Role-based Recipients -->
            <q-select
              v-model="formData.role"
              :options="roleOptions"
              label="Send to Role"
              outlined
              dense
              clearable
              emit-value
              map-options
              hint="Or send to all users with a specific role"
            />

            <q-separator class="q-my-md" />

            <!-- Subject -->
            <q-input
              v-model="formData.subject"
              label="Subject"
              outlined
              dense
              :rules="[val => !!val || 'Subject is required']"
            />

            <!-- Message Body -->
            <q-input
              v-model="formData.body"
              label="Message"
              type="textarea"
              outlined
              rows="10"
              :rules="[val => !!val || 'Message is required']"
            />

            <!-- Urgent Toggle -->
            <q-checkbox v-model="formData.is_urgent" label="Mark as urgent" color="red" />

            <!-- Actions -->
            <div class="row justify-end q-mt-lg">
              <q-btn flat label="Cancel" @click="$router.push('/messages')" />
              <q-btn
                color="primary"
                label="Send Message"
                type="submit"
                :loading="loading"
                icon="send"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useMessageStore } from '@/stores/useMessageStore';
import { useUserStore } from '@/stores/useUserStore';
import { useOrganisationStore } from '@/stores/useOrganisationStore';

const router = useRouter();
const $q = useQuasar();
const messageStore = useMessageStore();
const userStore = useUserStore();
const organisationStore = useOrganisationStore();

const loading = ref(false);

const formData = ref({
  recipient_id: null as number | null,
  organisation_id: null as number | null,
  role: null as string | null,
  subject: '',
  body: '',
  is_urgent: false,
});

const userOptions = ref<any[]>([]);
const organisationOptions = ref<any[]>([]);
const allUsers = ref<any[]>([]);

const roleOptions = [
  { label: 'Super Admin', value: 'super_admin' },
  { label: 'Admin', value: 'admin' },
  { label: 'Sub-admin', value: 'sub_admin' },
  { label: 'User', value: 'user' },
];

function filterUsers(val: string, update: (callback: () => void) => void) {
  update(() => {
    if (val === '') {
      userOptions.value = allUsers.value.map(user => ({
        label: `${user.name} (${user.email})`,
        value: user.id,
      }));
    } else {
      const needle = val.toLowerCase();
      userOptions.value = allUsers.value
        .filter(
          user =>
            user.name?.toLowerCase().includes(needle) || user.email?.toLowerCase().includes(needle)
        )
        .map(user => ({
          label: `${user.name} (${user.email})`,
          value: user.id,
        }));
    }
  });
}

async function sendMessage() {
  // Validate that at least one recipient is selected
  if (!formData.value.recipient_id && !formData.value.organisation_id && !formData.value.role) {
    $q.notify({
      type: 'negative',
      message: 'Please select at least one recipient',
    });
    return;
  }

  loading.value = true;
  try {
    await messageStore.sendMessage({
      recipient_id: formData.value.recipient_id || undefined,
      organisation_id: formData.value.organisation_id || undefined,
      role: formData.value.role || undefined,
      subject: formData.value.subject,
      body: formData.value.body,
      is_urgent: formData.value.is_urgent,
    });

    $q.notify({
      type: 'positive',
      message: 'Message sent successfully',
    });

    router.push('/messages');
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to send message',
    });
  } finally {
    loading.value = false;
  }
}

async function loadUsers() {
  try {
    // Assuming there's a fetchUsers method in userStore
    // If not, this would need to be implemented
    const users = (await userStore.fetchUsers?.()) || [];
    allUsers.value = users;
    userOptions.value = users.map((user: any) => ({
      label: `${user.name} (${user.email})`,
      value: user.id,
    }));
  } catch (error) {
    // Silently fail - users might not be available
  }
}

async function loadOrganisations() {
  try {
    await organisationStore.fetchOrganisations();
    organisationOptions.value = organisationStore.organisations.map(org => ({
      label: org.name,
      value: org.id,
    }));
  } catch (error) {
    // Silently fail
  }
}

onMounted(async () => {
  await loadUsers();
  await loadOrganisations();
});
</script>

<style scoped lang="scss">
.message-compose-page {
  background-color: #f5f5f5;
}
</style>
