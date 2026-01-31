<template>
  <q-page class="organisation-list-page">
    <div class="q-pa-md">
      <!-- Page Header -->
      <div class="row items-center q-mb-md">
        <div class="col">
          <div class="text-h4 text-weight-bold">Organisations</div>
          <div class="text-subtitle1 text-grey-7">Manage organisations and their hierarchy</div>
        </div>
        <div class="col-auto">
          <q-btn
            color="primary"
            label="New Organisation"
            icon="add"
            @click="$router.push('/organisations/create')"
          />
        </div>
      </div>

      <!-- Filters -->
      <q-card class="q-mb-md">
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-input
                v-model="searchQuery"
                placeholder="Search organisations..."
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
              <q-select
                v-model="typeFilter"
                :options="typeOptions"
                label="Type"
                outlined
                dense
                clearable
                emit-value
                map-options
              />
            </div>
            <div class="col-12 col-md-3">
              <q-select
                v-model="levelFilter"
                :options="levelOptions"
                label="Level"
                outlined
                dense
                clearable
                emit-value
                map-options
              />
            </div>
            <div class="col-12 col-md-2">
              <q-btn
                color="primary"
                label="Filter"
                icon="filter_list"
                class="full-width"
                @click="applyFilters"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Organisation List -->
      <q-card>
        <q-card-section>
          <DataTable
            :rows="tableRows"
            :columns="columns"
            :loading="loading"
            :pagination="pagination"
            row-key="id"
            @request="onTableRequest"
            @row-click="onRowClick"
          >
            <template #top>
              <div class="text-h6">Organisations</div>
            </template>

            <template #body-cell-type="props">
              <q-td :props="props">
                <q-badge :color="getTypeColor(props.value)" :label="props.value" />
              </q-td>
            </template>

            <template #body-cell-level="props">
              <q-td :props="props">
                <q-chip
                  v-if="props.value"
                  :color="getLevelColor(props.value)"
                  text-color="white"
                  size="sm"
                  :label="props.value"
                />
                <span v-else class="text-grey-6">-</span>
              </q-td>
            </template>

            <template #body-cell-parent="props">
              <q-td :props="props">
                <span v-if="props.value">{{ props.value.name }}</span>
                <span v-else class="text-grey-6">-</span>
              </q-td>
            </template>

            <template #body-cell-actions="props">
              <q-td :props="props">
                <q-btn
                  flat
                  dense
                  round
                  icon="visibility"
                  color="primary"
                  @click.stop="viewOrganisation(props.row)"
                />
                <q-btn
                  flat
                  dense
                  round
                  icon="edit"
                  color="orange"
                  @click.stop="editOrganisation(props.row)"
                />
                <q-btn
                  flat
                  dense
                  round
                  icon="people"
                  color="teal"
                  @click.stop="viewMembers(props.row)"
                />
              </q-td>
            </template>
          </DataTable>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useOrganisationStore } from '@/stores/useOrganisationStore';
import DataTable, { type TableColumn } from '@/components/ui/DataTable.vue';

const router = useRouter();
const $q = useQuasar();
const organisationStore = useOrganisationStore();

const searchQuery = ref('');
const typeFilter = ref<string | null>(null);
const levelFilter = ref<string | null>(null);

const loading = computed(() => organisationStore.loading);
const organisations = computed(() => organisationStore.organisations);

const typeOptions = [
  { label: 'National/Federal', value: 'national' },
  { label: 'Regional/State/Province', value: 'regional' },
  { label: 'District/LGA/County', value: 'district' },
  { label: 'Local/Municipal', value: 'local' },
  { label: 'Community/Ward', value: 'community' },
];

const levelOptions = [
  { label: 'National/Federal', value: 'national' },
  { label: 'Regional/State/Province', value: 'regional' },
  { label: 'District/LGA/County', value: 'district' },
  { label: 'Local/Municipal', value: 'local' },
  { label: 'Community/Ward', value: 'community' },
];

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
});

const columns: TableColumn[] = [
  {
    name: 'name',
    label: 'Name',
    field: 'name',
    align: 'left',
    sortable: true,
    required: true,
  },
  {
    name: 'type',
    label: 'Type',
    field: 'type',
    align: 'center',
    sortable: true,
  },
  {
    name: 'level',
    label: 'Level',
    field: 'type',
    align: 'center',
    sortable: true,
  },
  {
    name: 'parent',
    label: 'Parent',
    field: (row: any) => (row.parent_id ? { name: 'Parent Org' } : null),
    align: 'left',
    sortable: false,
  },
  {
    name: 'description',
    label: 'Description',
    field: 'description',
    align: 'left',
    sortable: false,
    format: (val: string) => (val ? (val.length > 50 ? val.substring(0, 50) + '...' : val) : '-'),
  },
  {
    name: 'actions',
    label: 'Actions',
    field: 'actions',
    align: 'center',
    sortable: false,
  },
];

const tableRows = computed(() => {
  let filtered = [...organisations.value];

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      org =>
        org.name?.toLowerCase().includes(query) || org.description?.toLowerCase().includes(query)
    );
  }

  // Apply type filter
  if (typeFilter.value) {
    filtered = filtered.filter(org => org.type === typeFilter.value);
  }

  // Apply level filter
  if (levelFilter.value) {
    filtered = filtered.filter(org => org.type === levelFilter.value);
  }

  return filtered;
});

function applyFilters() {
  // Filters are applied reactively
}

function onTableRequest(props: { pagination: any; filter?: string }) {
  pagination.value = props.pagination;
  loadOrganisations();
}

function onRowClick(_evt: Event, row: any) {
  router.push(`/organisations/${row.id}`);
}

function viewOrganisation(org: any) {
  router.push(`/organisations/${org.id}`);
}

function editOrganisation(org: any) {
  router.push(`/organisations/${org.id}/edit`);
}

function viewMembers(org: any) {
  router.push(`/organisations/${org.id}?tab=members`);
}

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

function getLevelColor(level: string): string {
  const colors: Record<string, string> = {
    national: 'purple',
    regional: 'blue',
    district: 'teal',
    local: 'orange',
    community: 'green',
  };
  return colors[level.toLowerCase()] || 'grey';
}

async function loadOrganisations() {
  try {
    await organisationStore.fetchOrganisations({
      type: typeFilter.value || undefined,
    });
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to load organisations',
    });
  }
}

onMounted(() => {
  loadOrganisations();
});
</script>

<style scoped lang="scss">
.organisation-list-page {
  background-color: #f5f5f5;
}
</style>
