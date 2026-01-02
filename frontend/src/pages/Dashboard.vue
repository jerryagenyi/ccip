<template>
  <q-page class="dashboard-page">
    <div class="q-pa-md">
      <!-- Page Header -->
      <div class="row items-center q-mb-md">
        <div class="col">
          <div class="text-h4 text-weight-bold">Dashboard</div>
          <div class="text-subtitle1 text-grey-7">Overview of your activities and metrics</div>
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

      <!-- Loading State -->
      <div v-if="loading" class="row q-col-gutter-md">
        <div v-for="i in 4" :key="i" class="col-12 col-sm-6 col-md-3">
          <q-card>
            <q-card-section>
              <q-skeleton type="text" width="60%" />
              <q-skeleton type="text" width="40%" class="q-mt-sm" />
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Metrics Cards -->
      <div v-else class="row q-col-gutter-md q-mb-md">
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="metric-card">
            <q-card-section>
              <div class="row items-center no-wrap">
                <div class="col">
                  <div class="text-grey-7 text-caption">Total Activities</div>
                  <div class="text-h5 text-weight-bold q-mt-xs">
                    {{ summary?.total_activities || 0 }}
                  </div>
                </div>
                <div class="col-auto">
                  <q-icon name="assignment" size="48px" color="primary" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="metric-card">
            <q-card-section>
              <div class="row items-center no-wrap">
                <div class="col">
                  <div class="text-grey-7 text-caption">Draft</div>
                  <div class="text-h5 text-weight-bold q-mt-xs text-orange">
                    {{ summary?.by_status?.draft || 0 }}
                  </div>
                </div>
                <div class="col-auto">
                  <q-icon name="edit" size="48px" color="orange" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="metric-card">
            <q-card-section>
              <div class="row items-center no-wrap">
                <div class="col">
                  <div class="text-grey-7 text-caption">Submitted</div>
                  <div class="text-h5 text-weight-bold q-mt-xs text-blue">
                    {{ summary?.by_status?.submitted || 0 }}
                  </div>
                </div>
                <div class="col-auto">
                  <q-icon name="send" size="48px" color="blue" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="metric-card">
            <q-card-section>
              <div class="row items-center no-wrap">
                <div class="col">
                  <div class="text-grey-7 text-caption">Approved</div>
                  <div class="text-h5 text-weight-bold q-mt-xs text-green">
                    {{ summary?.by_status?.approved || 0 }}
                  </div>
                </div>
                <div class="col-auto">
                  <q-icon name="check_circle" size="48px" color="green" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Charts and Recent Activities Row -->
      <div class="row q-col-gutter-md">
        <!-- Activity Status Chart -->
        <div class="col-12 col-md-8">
          <q-card>
            <q-card-section>
              <div class="text-h6 q-mb-md">Activity Status Distribution</div>
              <div class="chart-container">
                <!-- Simple bar chart representation -->
                <div class="row q-col-gutter-sm">
                  <div class="col-12">
                    <div class="chart-bar-container">
                      <div
                        v-for="(value, status) in statusData"
                        :key="status"
                        class="chart-bar-item q-mb-sm"
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
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Activity Types -->
        <div class="col-12 col-md-4">
          <q-card>
            <q-card-section>
              <div class="text-h6 q-mb-md">Activity Types</div>
              <div class="activity-types">
                <div
                  v-for="(count, type) in summary?.by_type || {}"
                  :key="type"
                  class="activity-type-item q-mb-sm"
                >
                  <div class="row items-center justify-between">
                    <div class="text-capitalize">{{ type }}</div>
                    <q-badge :color="getTypeColor(type)" :label="count" />
                  </div>
                </div>
                <div v-if="!summary?.by_type || Object.keys(summary.by_type).length === 0" class="text-grey-6 text-center q-py-md">
                  No activity types yet
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Recent Activities -->
      <div class="row q-mt-md">
        <div class="col-12">
          <q-card>
            <q-card-section>
              <div class="row items-center justify-between q-mb-md">
                <div class="text-h6">Recent Activities</div>
                <q-btn
                  flat
                  dense
                  label="View All"
                  icon-right="arrow_forward"
                  @click="$router.push('/activities')"
                />
              </div>

              <q-list v-if="recentActivities.length > 0" separator>
                <q-item
                  v-for="activity in recentActivities"
                  :key="activity.id"
                  clickable
                  @click="$router.push(`/activities/${activity.id}`)"
                >
                  <q-item-section avatar>
                    <q-avatar :color="getStatusColor(activity.status)" text-color="white" size="40px">
                      {{ activity.title.charAt(0).toUpperCase() }}
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ activity.title }}</q-item-label>
                    <q-item-label caption>
                      {{ formatDate(activity.date) }}
                    </q-item-label>
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

              <div v-else class="text-center q-py-lg text-grey-6">
                <q-icon name="inbox" size="48px" class="q-mb-sm" />
                <div>No recent activities</div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useDashboardStore } from '@/stores/useDashboardStore';
import { useAuthStore } from '@/stores/useAuthStore';

const dashboardStore = useDashboardStore();
const authStore = useAuthStore();

const loading = computed(() => dashboardStore.loading);
const summary = computed(() => dashboardStore.summary);

const statusData = computed(() => {
  if (!summary.value?.by_status) return {};
  return {
    draft: summary.value.by_status.draft || 0,
    submitted: summary.value.by_status.submitted || 0,
    approved: summary.value.by_status.approved || 0,
    rejected: summary.value.by_status.rejected || 0,
  };
});

const maxStatusValue = computed(() => {
  const values = Object.values(statusData.value);
  return Math.max(...values, 1);
});

const recentActivities = computed(() => {
  return summary.value?.recent_activities || [];
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

onMounted(async () => {
  const userRole = authStore.user?.role || 'user';
  await dashboardStore.fetchDashboard(userRole);
});
</script>

<style scoped lang="scss">
.dashboard-page {
  background-color: var(--ccip-bg-page);
}

.metric-card {
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

.chart-container {
  min-height: 200px;
}

.chart-bar-container {
  padding: 8px 0;
}

.chart-bar-item {
  min-height: 40px;
}

.activity-types {
  min-height: 150px;
}

.activity-type-item {
  padding: 8px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
</style>
