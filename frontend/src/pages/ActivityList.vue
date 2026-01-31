<template>
  <q-page class="activity-list-page">
    <div class="q-pa-md">
      <!-- Page Header -->
      <div class="row items-center q-mb-md">
        <div class="col">
          <div class="text-h4 text-weight-bold">Activities</div>
          <div class="text-subtitle1 text-grey-7">Manage and track your activities</div>
        </div>
        <div class="col-auto">
          <q-btn
            color="primary"
            label="New Activity"
            icon="add"
            @click="$router.push('/activities/create')"
          />
        </div>
      </div>

      <!-- Filters and Search -->
      <q-card class="q-mb-md">
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-input
                v-model="searchQuery"
                placeholder="Search activities..."
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
                v-model="statusFilter"
                :options="statusOptions"
                label="Status"
                outlined
                dense
                clearable
                emit-value
                map-options
              />
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

      <!-- Data Table -->
      <q-card>
        <q-card-section>
          <DataTable
            :rows="tableRows"
            :columns="columns"
            :loading="loading"
            :pagination="pagination"
            row-key="id"
            selection="multiple"
            :selected="selected"
            @request="onTableRequest"
            @selection="onSelection"
            @row-click="onRowClick"
          >
            <template #top>
              <div class="row items-center justify-between full-width">
                <div class="text-h6">Activities</div>
                <div v-if="selected.length > 0" class="row items-center q-gutter-sm">
                  <q-badge :label="`${selected.length} selected`" color="primary" />
                  <q-btn
                    flat
                    dense
                    color="negative"
                    label="Delete"
                    icon="delete"
                    @click="bulkDelete"
                  />
                </div>
              </div>
            </template>

            <template #body-cell-status="props">
              <q-td :props="props">
                <q-chip
                  :color="getStatusColor(props.value)"
                  text-color="white"
                  size="sm"
                  :label="props.value"
                />
              </q-td>
            </template>

            <template #body-cell-type="props">
              <q-td :props="props">
                <q-badge :color="getTypeColor(props.value)" :label="props.value" />
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
                  @click.stop="viewActivity(props.row)"
                />
                <q-btn
                  flat
                  dense
                  round
                  icon="edit"
                  color="orange"
                  @click.stop="editActivity(props.row)"
                />
                <q-btn
                  flat
                  dense
                  round
                  icon="delete"
                  color="negative"
                  @click.stop="deleteActivity(props.row)"
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
import { useActivityStore } from '@/stores/useActivityStore';
import DataTable, { type TableColumn } from '@/components/ui/DataTable.vue';

const router = useRouter();
const $q = useQuasar();
const activityStore = useActivityStore();

const searchQuery = ref('');
const statusFilter = ref<string | null>(null);
const typeFilter = ref<string | null>(null);
const selected = ref<any[]>([]);

const loading = computed(() => activityStore.loading);
const activities = computed(() => activityStore.activities);

const statusOptions = [
  { label: 'Draft', value: 'draft' },
  { label: 'Submitted', value: 'submitted' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
];

const typeOptions = [
  { label: 'Workshop', value: 'workshop' },
  { label: 'Campaign', value: 'campaign' },
  { label: 'Meeting', value: 'meeting' },
  { label: 'Training', value: 'training' },
  { label: 'Other', value: 'other' },
];

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
});

const columns: TableColumn[] = [
  {
    name: 'title',
    label: 'Title',
    field: 'title',
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
    name: 'status',
    label: 'Status',
    field: 'status',
    align: 'center',
    sortable: true,
  },
  {
    name: 'location',
    label: 'Location',
    field: 'location',
    align: 'left',
    sortable: true,
  },
  {
    name: 'date',
    label: 'Date',
    field: 'date',
    align: 'left',
    sortable: true,
    format: (val: string) => formatDate(val),
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
  let filtered = [...activities.value];

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      activity =>
        activity.title?.toLowerCase().includes(query) ||
        activity.description?.toLowerCase().includes(query) ||
        activity.location?.toLowerCase().includes(query)
    );
  }

  // Apply status filter
  if (statusFilter.value) {
    filtered = filtered.filter(activity => activity.status === statusFilter.value);
  }

  // Apply type filter
  if (typeFilter.value) {
    filtered = filtered.filter(activity => activity.type === typeFilter.value);
  }

  return filtered;
});

function applyFilters() {
  // Filters are applied reactively through computed property
  // This function can be used for additional filter logic if needed
}

function onTableRequest(props: { pagination: any; filter?: string }) {
  pagination.value = props.pagination;
  loadActivities();
}

function onSelection(selectedRows: any[]) {
  selected.value = selectedRows;
}

function onRowClick(_evt: Event, row: any) {
  router.push(`/activities/${row.id}`);
}

function viewActivity(activity: any) {
  router.push(`/activities/${activity.id}`);
}

function editActivity(activity: any) {
  router.push(`/activities/${activity.id}/edit`);
}

function deleteActivity(activity: any) {
  $q.dialog({
    title: 'Confirm Delete',
    message: `Are you sure you want to delete "${activity.title}"?`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await activityStore.deleteActivity(activity.id);
      $q.notify({
        type: 'positive',
        message: 'Activity deleted successfully',
      });
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Failed to delete activity',
      });
    }
  });
}

function bulkDelete() {
  if (selected.value.length === 0) return;

  $q.dialog({
    title: 'Confirm Delete',
    message: `Are you sure you want to delete ${selected.value.length} activities?`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await Promise.all(selected.value.map(activity => activityStore.deleteActivity(activity.id)));
      selected.value = [];
      $q.notify({
        type: 'positive',
        message: 'Activities deleted successfully',
      });
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Failed to delete activities',
      });
    }
  });
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

function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

async function loadActivities() {
  try {
    const response = await activityStore.fetchActivities({
      page: pagination.value.page,
      status: statusFilter.value || undefined,
      type: typeFilter.value || undefined,
    });
    if (response?.meta) {
      pagination.value.rowsNumber = response.meta.total || 0;
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to load activities',
    });
  }
}

onMounted(() => {
  loadActivities();
});
</script>

<style scoped lang="scss">
.activity-list-page {
  background-color: #f5f5f5;
}
</style>
