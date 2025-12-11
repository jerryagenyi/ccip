<template>
  <q-page class="index-page">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="text-h3 text-weight-bold text-white q-mb-md">
          Risk Communication Activity Platform
        </div>
        <div class="text-h6 text-white q-mb-xl" style="opacity: 0.9">
          Coordinate, track, and optimize public health risk communication activities globally
        </div>
        <div class="row q-gutter-md justify-center">
          <q-btn
            v-if="!isAuthenticated"
            color="white"
            text-color="primary"
            size="lg"
            label="Get Started"
            icon="rocket_launch"
            @click="$router.push('/auth/register')"
          />
          <q-btn
            v-if="!isAuthenticated"
            color="white"
            text-color="primary"
            size="lg"
            outline
            label="Sign In"
            icon="login"
            @click="$router.push('/auth/login')"
          />
          <q-btn
            v-else
            color="white"
            text-color="primary"
            size="lg"
            label="Go to Dashboard"
            icon="dashboard"
            @click="$router.push('/dashboard')"
          />
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="features-section q-pa-xl">
      <div class="text-h4 text-weight-bold text-center q-mb-xl">
        Platform Features
      </div>
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-4">
          <q-card class="feature-card">
            <q-card-section class="text-center">
              <q-icon name="assignment" size="64px" color="primary" class="q-mb-md" />
              <div class="text-h6 text-weight-bold q-mb-sm">Activity Management</div>
              <div class="text-body2 text-grey-7">
                Create, track, and manage risk communication activities with comprehensive workflows and approval processes.
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-4">
          <q-card class="feature-card">
            <q-card-section class="text-center">
              <q-icon name="psychology" size="64px" color="primary" class="q-mb-md" />
              <div class="text-h6 text-weight-bold q-mb-sm">AI Semiotic Analysis</div>
              <div class="text-body2 text-grey-7">
                Evaluate message effectiveness across cultural contexts with AI-powered semiotic risk assessment.
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-4">
          <q-card class="feature-card">
            <q-card-section class="text-center">
              <q-icon name="people" size="64px" color="primary" class="q-mb-md" />
              <div class="text-h6 text-weight-bold q-mb-sm">Organisation Hierarchy</div>
              <div class="text-body2 text-grey-7">
                Manage multi-tier organisational structures with flexible administrative levels and role-based access.
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-4">
          <q-card class="feature-card">
            <q-card-section class="text-center">
              <q-icon name="dashboard" size="64px" color="primary" class="q-mb-md" />
              <div class="text-h6 text-weight-bold q-mb-sm">Analytics & Reporting</div>
              <div class="text-body2 text-grey-7">
                Track performance metrics, generate reports, and gain insights into communication effectiveness.
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-4">
          <q-card class="feature-card">
            <q-card-section class="text-center">
              <q-icon name="mail" size="64px" color="primary" class="q-mb-md" />
              <div class="text-h6 text-weight-bold q-mb-sm">Team Communication</div>
              <div class="text-body2 text-grey-7">
                Collaborate effectively with built-in messaging, notifications, and team coordination tools.
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-4">
          <q-card class="feature-card">
            <q-card-section class="text-center">
              <q-icon name="language" size="64px" color="primary" class="q-mb-md" />
              <div class="text-h6 text-weight-bold q-mb-sm">Global Platform</div>
              <div class="text-body2 text-grey-7">
                Designed for global use with configurable administrative hierarchies and multi-language support.
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div v-if="!isAuthenticated" class="cta-section q-pa-xl text-center">
      <div class="text-h5 text-weight-bold q-mb-md">
        Ready to get started?
      </div>
      <div class="text-body1 text-grey-7 q-mb-lg">
        Join organisations worldwide using CCIP to improve their risk communication activities
      </div>
      <q-btn
        color="primary"
        size="lg"
        label="Create Account"
        icon="person_add"
        @click="$router.push('/auth/register')"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/useAuthStore';

const router = useRouter();
const authStore = useAuthStore();

const isAuthenticated = computed(() => authStore.isAuthenticated);

onMounted(() => {
  // If authenticated, redirect to dashboard after a moment
  if (isAuthenticated.value) {
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  }
});
</script>

<style scoped lang="scss">
.index-page {
  min-height: 100vh;
}

.hero-section {
  background: linear-gradient(135deg, #7b2cbf 0%, #9d4edd 100%);
  padding: 80px 20px;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.features-section {
  background-color: #f5f5f5;
}

.feature-card {
  height: 100%;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

.cta-section {
  background-color: #ffffff;
}
</style>
