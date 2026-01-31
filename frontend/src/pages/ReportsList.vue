<template>
  <q-page class="reports-list-page">
    <div class="q-pa-md">
      <!-- Page Header -->
      <div class="row items-center justify-between q-mb-md">
        <div class="col">
          <div class="text-h4 text-weight-bold">Reports</div>
          <div class="text-subtitle1 text-grey-7">Manage and generate reports</div>
        </div>
        <div class="col-auto q-gutter-sm">
          <q-btn
            color="primary"
            icon="add"
            label="Create Report"
            @click="showCreateDialog = true"
          />
          <q-btn
            color="secondary"
            icon="auto_awesome"
            label="AI Generator"
            @click="showAIGenerator = true"
          />
        </div>
      </div>

      <!-- Filters and Search -->
      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="row q-col-gutter-md items-center">
            <div class="col-12 col-md-4">
              <q-input
                v-model="searchQuery"
                label="Search reports"
                outlined
                dense
                clearable
                debounce="300"
                @update:model-value="handleSearch"
              >
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-2">
              <q-select
                v-model="statusFilter"
                :options="statusOptions"
                label="Status"
                outlined
                dense
                clearable
                emit-value
                map-options
                @update:model-value="handleStatusFilter"
              />
            </div>
            <div class="col-12 col-md-2">
              <q-select
                v-model="typeFilter"
                :options="typeOptions"
                label="Type"
                outlined
                dense
                clearable
                emit-value
                map-options
                @update:model-value="handleTypeFilter"
              />
            </div>
            <div class="col-12 col-md-2">
              <q-select
                v-model="periodFilter"
                :options="periodOptions"
                label="Period"
                outlined
                dense
                clearable
                emit-value
                map-options
                @update:model-value="handlePeriodFilter"
              />
            </div>
            <div class="col-12 col-md-2">
              <q-btn
                flat
                color="primary"
                label="Clear Filters"
                icon="clear"
                @click="clearFilters"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Reports Table -->
      <q-card flat bordered>
        <q-table
          v-model:pagination="pagination"
          :rows="reportStore.filteredReports"
          :columns="columns"
          :loading="reportStore.loading"
          row-key="id"
          selection="multiple"
          v-model:selected="selectedReports"
          :selected-rows-label="'reports selected'"
          @request="onTableRequest"
        >
          <!-- Header -->
          <template v-slot:top>
            <div class="row full-width items-center justify-between q-py-sm">
              <div class="text-h6">
                {{ reportStore.total }} reports
                <span v-if="selectedReports.length > 0" class="text-caption">
                  ({{ selectedReports.length }} selected)
                </span>
              </div>
              <div class="row q-gutter-sm">
                <q-btn
                  v-if="selectedReports.length > 0"
                  flat
                  color="negative"
                  label="Delete Selected"
                  icon="delete"
                  @click="confirmDeleteSelected"
                />
                <q-btn flat color="primary" icon="refresh" @click="refreshReports" />
              </div>
            </div>
          </template>

          <!-- Status Column -->
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-badge
                :color="getStatusColor(props.row.status)"
                :label="props.row.status"
                class="text-capitalize"
              />
            </q-td>
          </template>

          <!-- Type Column -->
          <template v-slot:body-cell-type="props">
            <q-td :props="props">
              <div class="text-capitalize">
                {{ props.row.type.replace('-', ' ') }}
              </div>
            </q-td>
          </template>

          <!-- Date Column -->
          <template v-slot:body-cell-createdAt="props">
            <q-td :props="props">
              {{ formatDate(props.row.createdAt) }}
            </q-td>
          </template>

          <!-- Actions Column -->
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <div class="row q-gutter-sm">
                <q-btn
                  flat
                  dense
                  round
                  color="primary"
                  icon="visibility"
                  @click="viewReport(props.row)"
                >
                  <q-tooltip>View Report</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  round
                  color="secondary"
                  icon="download"
                  @click="downloadReport(props.row)"
                >
                  <q-tooltip>Download</q-tooltip>
                </q-btn>
                <q-btn flat dense round color="info" icon="edit" @click="editReport(props.row)">
                  <q-tooltip>Edit</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  round
                  color="negative"
                  icon="delete"
                  @click="confirmDelete(props.row)"
                >
                  <q-tooltip>Delete</q-tooltip>
                </q-btn>
              </div>
            </q-td>
          </template>

          <!-- No Data -->
          <template v-slot:no-data>
            <div class="full-width text-center q-pa-lg">
              <q-icon name="description" size="3rem" color="grey-5" />
              <p class="text-h6 q-mt-md">No reports found</p>
              <p class="text-grey-6">Create your first report to get started</p>
              <q-btn
                color="primary"
                label="Create Report"
                icon="add"
                @click="showCreateDialog = true"
              />
            </div>
          </template>
        </q-table>
      </q-card>

      <!-- Pagination -->
      <div class="row justify-center q-mt-md">
        <q-pagination
          v-model="currentPage"
          :max="reportStore.totalPages"
          :max-pages="6"
          boundary-numbers
          @update:model-value="handlePageChange"
        />
      </div>
    </div>

    <!-- Create Report Dialog -->
    <q-dialog v-model="showCreateDialog" persistent>
      <q-card style="min-width: 600px">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Create New Report</div>
        </q-card-section>
        <q-card-section class="q-pt-md">
          <q-form @submit="createReport" class="q-gutter-md">
            <q-input
              v-model="newReport.title"
              label="Report Title"
              outlined
              dense
              :rules="[val => !!val || 'Title is required']"
            />
            <q-input
              v-model="newReport.description"
              label="Description"
              type="textarea"
              outlined
              rows="3"
              :rules="[val => !!val || 'Description is required']"
            />
            <q-select
              v-model="newReport.templateId"
              :options="templateOptions"
              label="Template"
              outlined
              dense
              emit-value
              map-options
              :rules="[val => !!val || 'Template is required']"
            />
            <div class="row q-mt-lg">
              <q-space />
              <q-btn flat label="Cancel" @click="showCreateDialog = false" />
              <q-btn
                color="primary"
                type="submit"
                label="Create"
                :loading="reportStore.loading"
                class="q-ml-sm"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- AI Generator Dialog -->
    <q-dialog v-model="showAIGenerator" full-width>
      <q-card>
        <q-card-section class="bg-primary text-white row items-center">
          <div class="text-h6">AI Report Generator</div>
          <q-space />
          <q-btn flat round icon="close" @click="showAIGenerator = false" />
        </q-card-section>
        <q-card-section class="q-pa-none">
          <AIReportGenerator @report-generated="handleReportGenerated" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useReportStore } from '@/stores/useReportStore';
import { DEFAULT_REPORT_TEMPLATES } from '@/data/reportTemplates';
import AIReportGenerator from '@/components/reports/AIReportGenerator.vue';
import type { Report, ReportTemplate } from '@/types';

const router = useRouter();
const $q = useQuasar();
const reportStore = useReportStore();

// Data
const selectedReports = ref<Report[]>([]);
const searchQuery = ref('');
const statusFilter = ref<Report['status'] | null>(null);
const typeFilter = ref<string | null>(null);
const periodFilter = ref<string | null>(null);
const currentPage = ref(1);
const showCreateDialog = ref(false);
const showAIGenerator = ref(false);

// New report form
const newReport = ref({
  title: '',
  description: '',
  templateId: '',
});

// Pagination
const pagination = ref({
  sortBy: 'createdAt',
  descending: true,
  page: 1,
  rowsPerPage: 10,
});

// Table columns
const columns = [
  {
    name: 'title',
    required: true,
    label: 'Title',
    align: 'left' as const,
    field: 'title',
    sortable: true,
  },
  {
    name: 'type',
    align: 'left' as const,
    label: 'Type',
    field: 'type',
    sortable: true,
  },
  {
    name: 'status',
    align: 'center' as const,
    label: 'Status',
    field: 'status',
    sortable: true,
  },
  {
    name: 'createdAt',
    align: 'left' as const,
    label: 'Created',
    field: 'createdAt',
    sortable: true,
  },
  {
    name: 'actions',
    align: 'center' as const,
    label: 'Actions',
    field: 'actions',
    sortable: false,
  },
];

// Filter options
const statusOptions = [
  { label: 'Draft', value: 'draft' },
  { label: 'Generating', value: 'generating' },
  { label: 'Completed', value: 'completed' },
  { label: 'Failed', value: 'failed' },
];

const typeOptions = [
  { label: 'Activity Summary', value: 'activity-summary' },
  { label: 'Performance Analysis', value: 'performance-analysis' },
  { label: 'Impact Assessment', value: 'impact-assessment' },
  { label: 'Semiotic Analysis', value: 'semiotic-analysis' },
  { label: 'Stakeholder Update', value: 'stakeholder-update' },
  { label: 'Research Findings', value: 'research-findings' },
  { label: 'Incident Report', value: 'incident-report' },
];

const periodOptions = [
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 3 months', value: '3m' },
  { label: 'Last 6 months', value: '6m' },
  { label: 'Last year', value: '1y' },
];

const templateOptions = computed(() =>
  DEFAULT_REPORT_TEMPLATES.map(template => ({
    label: template.name,
    value: template.id,
  }))
);

// Methods
async function loadReports() {
  try {
    await reportStore.fetchReports({
      page: currentPage.value,
      perPage: pagination.value.rowsPerPage,
      filters: {
        search: searchQuery.value,
        status: statusFilter.value ? [statusFilter.value] : undefined,
        type: typeFilter.value ? [typeFilter.value] : undefined,
        period: periodFilter.value ? [periodFilter.value] : undefined,
      },
    });
  } catch (error) {
    console.error('Failed to load reports:', error);
  }
}

function onTableRequest(props: any) {
  pagination.value = props.pagination;
  currentPage.value = props.pagination.page;
  loadReports();
}

function handleSearch() {
  currentPage.value = 1;
  loadReports();
}

function handleStatusFilter() {
  currentPage.value = 1;
  loadReports();
}

function handleTypeFilter() {
  currentPage.value = 1;
  loadReports();
}

function handlePeriodFilter() {
  currentPage.value = 1;
  loadReports();
}

function handlePageChange(page: number) {
  currentPage.value = page;
  loadReports();
}

function clearFilters() {
  searchQuery.value = '';
  statusFilter.value = null;
  typeFilter.value = null;
  periodFilter.value = null;
  currentPage.value = 1;
  loadReports();
}

async function refreshReports() {
  await loadReports();
  $q.notify({
    type: 'positive',
    message: 'Reports refreshed',
    position: 'top',
  });
}

function getStatusColor(status: string): string {
  const colors = {
    draft: 'grey',
    generating: 'info',
    completed: 'positive',
    failed: 'negative',
  };
  return colors[status as keyof typeof colors] || 'grey';
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString();
}

async function createReport() {
  try {
    const report = await reportStore.createReport({
      title: newReport.value.title,
      description: newReport.value.description,
      templateId: newReport.value.templateId,
    });

    $q.notify({
      type: 'positive',
      message: 'Report created successfully',
      position: 'top',
    });

    showCreateDialog.value = false;
    router.push(`/reports/${report.id}/edit`);
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to create report',
      position: 'top',
    });
  }
}

function viewReport(report: Report) {
  router.push(`/reports/${report.id}`);
}

async function downloadReport(report: Report) {
  try {
    await reportStore.downloadReport(report.id, 'pdf');
    $q.notify({
      type: 'positive',
      message: 'Report downloaded successfully',
      position: 'top',
    });
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to download report',
      position: 'top',
    });
  }
}

function editReport(report: Report) {
  router.push(`/reports/${report.id}/edit`);
}

function confirmDelete(report: Report) {
  $q.dialog({
    title: 'Delete Report',
    message: `Are you sure you want to delete "${report.title}"?`,
    ok: {
      label: 'Delete',
      color: 'negative',
    },
    cancel: {
      label: 'Cancel',
      color: 'primary',
    },
  }).onOk(async () => {
    try {
      await reportStore.deleteReport(report.id);
      $q.notify({
        type: 'positive',
        message: 'Report deleted successfully',
        position: 'top',
      });
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Failed to delete report',
        position: 'top',
      });
    }
  });
}

function confirmDeleteSelected() {
  const count = selectedReports.value.length;
  $q.dialog({
    title: 'Delete Reports',
    message: `Are you sure you want to delete ${count} selected report${count > 1 ? 's' : ''}?`,
    ok: {
      label: 'Delete',
      color: 'negative',
    },
    cancel: {
      label: 'Cancel',
      color: 'primary',
    },
  }).onOk(async () => {
    try {
      await reportStore.deleteSelectedReports();
      selectedReports.value = [];
      $q.notify({
        type: 'positive',
        message: 'Reports deleted successfully',
        position: 'top',
      });
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Failed to delete reports',
        position: 'top',
      });
    }
  });
}

function handleReportGenerated(report: Report) {
  showAIGenerator.value = false;
  router.push(`/reports/${report.id}`);
}

// Lifecycle
onMounted(() => {
  loadReports();
});
</script>

<style scoped lang="scss">
.reports-list-page {
  :deep(.q-table) {
    .q-table__top {
      padding: 12px 16px;
    }

    .q-table__bottom {
      padding: 12px 16px;
    }
  }
}
</style>
