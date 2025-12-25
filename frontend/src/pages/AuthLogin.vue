<template>
  <div class="auth-login">
    <!-- Login Header -->
    <div class="text-center q-mb-lg">
      <h2 class="text-h4 text-weight-medium q-ma-none">
        Welcome Back
      </h2>
      <p class="text-body1 text-grey-6 q-mt-sm">
        Sign in to your CCIP account
      </p>
    </div>

    <!-- Login Form -->
    <q-form @submit="handleLogin" class="q-gutter-md">
      <q-input
        v-model="form.email"
        label="Email address"
        type="email"
        outlined
        dense
        no-error-icon
        :rules="emailRules"
        lazy-rules
        :loading="authStore.loading"
        :disable="authStore.loading"
      >
        <template v-slot:prepend>
          <q-icon name="email" />
        </template>
      </q-input>

      <q-input
        v-model="form.password"
        label="Password"
        :type="showPassword ? 'text' : 'password'"
        outlined
        dense
        no-error-icon
        :rules="passwordRules"
        lazy-rules
        :loading="authStore.loading"
        :disable="authStore.loading"
      >
        <template v-slot:prepend>
          <q-icon name="lock" />
        </template>
        <template v-slot:append>
          <q-icon
            :name="showPassword ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="showPassword = !showPassword"
          />
        </template>
      </q-input>

      <!-- Remember Me & Forgot Password -->
      <div class="row justify-between items-center q-mt-md">
        <q-checkbox
          v-model="form.remember"
          label="Remember me"
          color="primary"
          :disable="authStore.loading"
        />
        <q-btn
          flat
          dense
          no-caps
          label="Forgot password?"
          color="primary"
          size="sm"
          @click="goToForgotPassword"
          :disable="authStore.loading"
        />
      </div>

      <!-- Login Button -->
      <q-btn
        type="submit"
        color="primary"
        class="full-width q-mt-lg"
        size="md"
        :loading="authStore.loading"
        :disable="!isValid || authStore.loading"
      >
        Sign In
      </q-btn>

      <!-- Error Message -->
      <q-banner
        v-if="authStore.error"
        class="bg-negative text-white q-mt-md"
        dense
        rounded
      >
        <template v-slot:avatar>
          <q-icon name="error" />
        </template>
        {{ authStore.error }}
      </q-banner>
    </q-form>

    <!-- Divider -->
    <div class="row items-center q-mt-xl q-mb-lg">
      <q-separator class="col" />
      <span class="q-px-md text-caption text-grey-6">OR</span>
      <q-separator class="col" />
    </div>

    <!-- Register Link -->
    <div class="text-center">
      <p class="text-body2 text-grey-7">
        Don't have an account?
        <q-btn
          flat
          dense
          no-caps
          label="Sign up"
          color="primary"
          @click="goToRegister"
        />
      </p>
    </div>

    <!-- Demo Account Notice -->
    <q-card
      flat
      bordered
      class="q-mt-lg bg-grey-1"
    >
      <q-card-section class="q-pa-md">
        <div class="flex items-center q-gutter-sm">
          <q-icon
            name="info"
            color="info"
            size="sm"
          />
          <span class="text-caption text-grey-7">
            Demo account: demo@ccip.com / demo123
          </span>
          <q-btn
            flat
            dense
            size="sm"
            label="Use"
            color="info"
            @click="fillDemoCredentials"
          />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from '@/stores/useAuthStore';
import type { LoginCredentials } from '@/types';

const router = useRouter();
const route = useRoute();
const $q = useQuasar();
const authStore = useAuthStore();

// Form data
const form = reactive<LoginCredentials & { remember?: boolean }>({
  email: '',
  password: '',
  remember: false
});

// UI state
const showPassword = ref(false);

// Validation rules
const emailRules = [
  (val: string) => !!val || 'Email is required',
  (val: string) => /.+@.+\..+/.test(val) || 'Please enter a valid email address'
];

const passwordRules = [
  (val: string) => !!val || 'Password is required',
  (val: string) => val.length >= 6 || 'Password must be at least 6 characters'
];

// Computed
const isValid = computed(() => {
  return form.email && form.password &&
         /.+@.+\..+/.test(form.email) &&
         form.password.length >= 6;
});

// Methods
const handleLogin = async () => {
  try {
    await authStore.login({
      email: form.email,
      password: form.password,
      remember: form.remember
    });

    // Show success notification
    $q.notify({
      type: 'positive',
      message: 'Login successful!',
      position: 'top'
    });

    // Redirect to intended page or dashboard
    const redirect = route.query.redirect as string || '/dashboard';
    router.push(redirect);
  } catch (error) {
    // Error is handled by the store
    console.error('Login failed:', error);
  }
};

const goToForgotPassword = () => {
  router.push('/auth/forgot-password');
};

const goToRegister = () => {
  router.push('/auth/register');
};

const fillDemoCredentials = () => {
  form.email = 'demo@ccip.com';
  form.password = 'demo123';
};

// Lifecycle
onMounted(() => {
  // Check if already authenticated
  if (authStore.isAuthenticated) {
    router.push('/dashboard');
  }
});
</script>

<style lang="scss" scoped>
@import '@/quasar-variables.sass';

.auth-login {
  width: 100%;
}

.q-field {
  :deep(.q-field__control) {
    border-radius: $button-border-radius;
  }
}

.q-btn {
  border-radius: $button-border-radius;
  font-weight: 500;
}

.q-banner {
  :deep(.q-banner__content) {
    font-size: 0.875rem;
  }
}

// Focus styles
.q-field {
  &:focus-within {
    :deep(.q-field__control) {
      box-shadow: 0 0 0 2px rgba(113, 81, 179, 0.2);
    }
  }
}
</style>

