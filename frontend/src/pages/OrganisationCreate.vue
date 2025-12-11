<template>
  <q-page class="organisation-create-page">
    <div class="q-pa-md">
      <!-- Page Header -->
      <div class="row items-center q-mb-md">
        <q-btn
          flat
          round
          icon="arrow_back"
          @click="$router.push('/organisations')"
        />
        <div class="col q-ml-md">
          <div class="text-h4 text-weight-bold">Create Organisation</div>
          <div class="text-subtitle1 text-grey-7">Add a new organisation to the system</div>
        </div>
      </div>

      <!-- Create Form -->
      <q-card>
        <q-card-section>
          <q-form @submit="createOrganisation" class="q-gutter-md">
            <!-- Organisation Name -->
            <q-input
              v-model="formData.name"
              label="Organisation Name"
              outlined
              dense
              :rules="[val => !!val || 'Organisation name is required', val => val.length >= 3 || 'Name must be at least 3 characters']"
              hint="Enter the full name of the organisation"
            />

            <!-- Category -->
            <q-select
              v-model="formData.category"
              :options="categoryOptions"
              label="Category"
              outlined
              dense
              emit-value
              map-options
              :rules="[val => !!val || 'Category is required']"
              hint="Select the organisation category"
            />

            <!-- Administrative Level (for Government organisations) -->
            <q-select
              v-if="formData.category === 'Government'"
              v-model="formData.administrativeLevel"
              :options="administrativeLevelOptions"
              label="Administrative Level"
              outlined
              dense
              emit-value
              map-options
              :rules="formData.category === 'Government' ? [val => !!val || 'Administrative level is required'] : []"
              hint="Select the administrative hierarchy level (required for government organisations)"
            />

            <!-- Parent Organisation -->
            <q-select
              v-if="formData.administrativeLevel && !isTopLevel(formData.administrativeLevel)"
              v-model="formData.parent_id"
              :options="parentOrganisationOptions"
              label="Parent Organisation"
              outlined
              dense
              clearable
              emit-value
              map-options
              :rules="formData.administrativeLevel && !isTopLevel(formData.administrativeLevel) ? [val => !!val || 'Parent organisation is required'] : []"
              hint="Select the parent organisation (required for sub-national levels)"
              @filter="filterParentOrganisations"
            >
              <template #no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No parent organisations found
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <!-- Description -->
            <q-input
              v-model="formData.description"
              label="Description"
              type="textarea"
              outlined
              rows="4"
              hint="Optional description of the organisation"
            />

            <!-- Actions -->
            <div class="row justify-end q-mt-lg">
              <q-btn
                flat
                label="Cancel"
                @click="$router.push('/organisations')"
              />
              <q-btn
                color="primary"
                label="Create Organisation"
                type="submit"
                :loading="loading"
                icon="add"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useOrganisationStore } from '@/stores/useOrganisationStore';

const router = useRouter();
const $q = useQuasar();
const organisationStore = useOrganisationStore();

const loading = ref(false);

const formData = ref({
  name: '',
  category: null as 'Government' | 'NGO' | 'CSO' | null,
  administrativeLevel: null as string | null,
  parent_id: null as number | null,
  description: '',
});

const categoryOptions = [
  { label: 'Government', value: 'Government' },
  { label: 'NGO', value: 'NGO' },
  { label: 'CSO', value: 'CSO' },
];

// Generic administrative levels - can be configured per organisation
const administrativeLevelOptions = [
  { label: 'National/Federal', value: 'national' },
  { label: 'Regional/State/Province', value: 'regional' },
  { label: 'District/LGA/County', value: 'district' },
  { label: 'Local/Municipal', value: 'local' },
  { label: 'Community/Ward', value: 'community' },
];

const parentOrganisationOptions = ref<any[]>([]);

// Watch for administrative level changes to update parent organisation options
watch(
  () => formData.value.administrativeLevel,
  async (newLevel) => {
    if (newLevel && !isTopLevel(newLevel)) {
      await loadParentOrganisations(newLevel);
    } else {
      parentOrganisationOptions.value = [];
      formData.value.parent_id = null;
    }
  }
);

function isTopLevel(level: string): boolean {
  // Top level is typically 'national' or 'federal'
  return level === 'national' || level === 'federal';
}

function filterParentOrganisations(val: string, update: (callback: () => void) => void) {
  update(() => {
    if (val === '') {
      // Show all available parent organisations
    } else {
      const needle = val.toLowerCase();
      parentOrganisationOptions.value = parentOrganisationOptions.value.filter(
        (org) => org.label.toLowerCase().includes(needle)
      );
    }
  });
}

async function loadParentOrganisations(level: string) {
  try {
    // Determine parent level based on hierarchy
    let parentLevel: string | undefined;
    const levelHierarchy = ['national', 'regional', 'district', 'local', 'community'];
    const currentIndex = levelHierarchy.indexOf(level);
    
    if (currentIndex > 0) {
      parentLevel = levelHierarchy[currentIndex - 1];
    }

    if (parentLevel) {
      await organisationStore.fetchOrganisations({ type: parentLevel });
      parentOrganisationOptions.value = organisationStore.organisations.map((org) => ({
        label: org.name,
        value: org.id,
      }));
    }
  } catch (error) {
    // Silently fail
  }
}

async function createOrganisation() {
  // Validate form
  if (!formData.value.name || !formData.value.category) {
    $q.notify({
      type: 'negative',
      message: 'Please fill in all required fields',
    });
    return;
  }

  // Validate administrative level for government organisations
  if (formData.value.category === 'Government' && !formData.value.administrativeLevel) {
    $q.notify({
      type: 'negative',
      message: 'Administrative level is required for government organisations',
    });
    return;
  }

  // Validate parent for sub-national levels
  if (formData.value.administrativeLevel && !isTopLevel(formData.value.administrativeLevel) && !formData.value.parent_id) {
    $q.notify({
      type: 'negative',
      message: 'Parent organisation is required for sub-national administrative levels',
    });
    return;
  }

  loading.value = true;
  try {
    const organisationData = {
      name: formData.value.name,
      type: formData.value.administrativeLevel || formData.value.category.toLowerCase(),
      parent_id: formData.value.parent_id || undefined,
      description: formData.value.description || undefined,
    };

    await organisationStore.createOrganisation(organisationData);

    $q.notify({
      type: 'positive',
      message: 'Organisation created successfully',
    });

    router.push('/organisations');
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to create organisation',
    });
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  // Pre-load national organisations in case user selects regional level
  await organisationStore.fetchOrganisations({ type: 'national' });
});
</script>

<style scoped lang="scss">
.organisation-create-page {
  background-color: #f5f5f5;
}
</style>
