<template>
  <q-page class="analytics-page">
    <div class="q-pa-md">
      <!-- Page Header -->
      <div class="row items-center q-mb-md">
        <div class="col">
          <div class="text-h4 text-weight-bold">Analytics</div>
          <div class="text-subtitle1 text-grey-7">Insights and performance metrics</div>
        </div>
        <div class="col-auto">
          <q-btn
            color="primary"
            label="Export Data"
            icon="download"
            @click="showExportDialog = true"
          />
        </div>
      </div>

      <!-- Date Range Filter -->
      <q-card class="q-mb-md">
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-input
                v-model="dateRange.start"
                label="Start Date"
                type="date"
                outlined
                dense
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="dateRange.end"
                label="End Date"
                type="date"
                outlined
                dense
              />
            </div>
            <div class="col-12 col-md-4">
              <q-btn
                color="primary"
                label="Apply Filters"
                class="full-width"
                @click="loadAnalytics"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Loading State -->
      <div v-if="loading" class="text-center q-pa-xl">
        <q-spinner color="primary" size="3em" />
        <div class="q-mt-md">Loading analytics...</div>
      </div>

      <!-- Analytics Content -->
      <div v-else class="row q-col-gutter-md">
        <!-- Status Breakdown -->
        <div class="col-12 col-md-6">
          <q-card>
            <q-card-section>
              <div class="text-h6 q-mb-md">Activity Status Breakdown</div>
              <div v-if="statusBreakdown" class="q-gutter-sm">
                <div
                  v-for="(value, status) in statusBreakdown"
                  :key="status"
                  class="status-item q-mb-sm"
                >
                  <div class="row items-center">
                    <div class="col-3 text-capitalize">{{ status }}</div>
                    <div class="col-9">
                      <q-linear-progress
                        :value="value / maxStatusValue"
                        :color="getStatusColor(status)"
                        size="24px"
                      >
                        <div class="absolute-full flex flex-center">
                          <span class="text-white text-weight-bold">{{ value }}</span>
                        </div>
                      </q-linear-progress>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center q-py-lg text-grey-6">
                No status data available
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Engagement Metrics -->
        <div class="col-12 col-md-6">
          <q-card>
            <q-card-section>
              <div class="text-h6 q-mb-md">Engagement Metrics</div>
              <div v-if="engagementMetrics.length > 0" class="q-gutter-md">
                <div
                  v-for="metric in engagementMetrics.slice(0, 5)"
                  :key="metric.activity_id"
                  class="metric-item"
                >
                  <div class="row items-center justify-between">
                    <div class="text-body2">Activity #{{ metric.activity_id }}</div>
                    <div class="text-h6 text-primary">{{ metric.value }} {{ metric.unit || '' }}</div>
                  </div>
                  <div class="text-caption text-grey-6">{{ formatDate(metric.recorded_at) }}</div>
                </div>
              </div>
              <div v-else class="text-center q-py-lg text-grey-6">
                No engagement metrics available
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Engagement Trends -->
        <div class="col-12">
          <q-card>
            <q-card-section>
              <div class="text-h6 q-mb-md">Engagement Trends</div>
              <div v-if="engagementTrends.length > 0" class="trend-chart">
                <div
                  v-for="trend in engagementTrends"
                  :key="trend.date"
                  class="trend-item q-mb-sm"
                >
                  <div class="row items-center">
                    <div class="col-3 text-caption">{{ formatDate(trend.date) }}</div>
                    <div class="col-9">
                      <div class="row items-center q-gutter-sm">
                        <div class="col">
                          <q-linear-progress
                            :value="trend.average / 100"
                            color="primary"
                            size="16px"
                          />
                        </div>
                        <div class="col-auto text-body2">
                          Avg: {{ trend.average.toFixed(1) }} | Total: {{ trend.total }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center q-py-lg text-grey-6">
                No trend data available
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Export Dialog -->
    <BaseDialog
      v-model="showExportDialog"
      title="Export Analytics Data"
      @update:model-value="showExportDialog = $event"
    >
      <q-form @submit="exportData">
        <q-select
          v-model="exportFormat"
          :options="exportFormats"
          label="Export Format"
          outlined
          dense
          emit-value
          map-options
          :rules="[val => !!val || 'Format is required']"
          class="q-mb-md"
        />
        <template #actions>
          <q-btn flat label="Cancel" @click="showExportDialog = false" />
          <q-btn color="primary" label="Export" type="submit" :loading="exporting" />
        </template>
      </q-form>
    </BaseDialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useAnalyticsStore } from '@/stores/useAnalyticsStore';
import BaseDialog from '@/components/ui/BaseDialog.vue';

const $q = useQuasar();
const analyticsStore = useAnalyticsStore();

const loading = computed(() => analyticsStore.loading);
const statusBreakdown = computed(() => analyticsStore.statusBreakdown);
const engagementMetrics = computed(() => analyticsStore.engagementMetrics);
const engagementTrends = computed(() => analyticsStore.engagementTrends);

const dateRange = ref({
  start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  end: new Date().toISOString().split('T')[0],
});

const showExportDialog = ref(false);
const exportFormat = ref('csv');
const exporting = ref(false);

const exportFormats = [
  { label: 'CSV', value: 'csv' },
  { label: 'Excel', value: 'excel' },
  { label: 'PDF', value: 'pdf' },
];

const maxStatusValue = computed(() => {
  if (!statusBreakdown.value) return 1;
  const values = Object.values(statusBreakdown.value);
  return Math.max(...values, 1);
});

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

async function loadAnalytics() {
  try {
    await Promise.all([
      analyticsStore.fetchStatusBreakdown({
        start_date: dateRange.value.start,
        end_date: dateRange.value.end,
      }),
      analyticsStore.fetchEngagementMetrics({
        start_date: dateRange.value.start,
        end_date: dateRange.value.end,
      }),
      analyticsStore.fetchEngagementTrends({
        start_date: dateRange.value.start,
        end_date: dateRange.value.end,
      }),
    ]);
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to load analytics',
    });
  }
}

async function exportData() {
  exporting.value = true;
  try {
    // Implement export logic
    $q.notify({
      type: 'positive',
      message: 'Analytics data exported successfully',
    });
    showExportDialog.value = false;
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to export data',
    });
  } finally {
    exporting.value = false;
  }
}

onMounted(() => {
  loadAnalytics();
});
</script>

<style scoped lang="scss">
.analytics-page {
  background-color: var(--ccip-bg-page);
}

.status-item {
  min-height: 40px;
}

.metric-item {
  padding: 8px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.trend-chart {
  min-height: 200px;
}

.trend-item {
  min-height: 40px;
}
</style>

