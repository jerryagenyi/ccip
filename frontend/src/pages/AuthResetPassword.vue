<template>
  <q-page class="flex flex-center">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Reset Password</div>
      </q-card-section>
      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            v-model="token"
            label="Reset Token"
            :rules="[val => !!val || 'Token is required']"
            outlined
          />
          <q-input
            v-model="email"
            label="Email"
            type="email"
            :rules="[val => !!val || 'Email is required']"
            outlined
          />
          <q-input
            v-model="password"
            label="New Password"
            type="password"
            :rules="[val => !!val || 'Password is required', val => val.length >= 8 || 'Password must be at least 8 characters']"
            outlined
          />
          <q-input
            v-model="passwordConfirmation"
            label="Confirm Password"
            type="password"
            :rules="[val => !!val || 'Please confirm password', val => val === password || 'Passwords do not match']"
            outlined
          />
          <div>
            <q-btn type="submit" color="primary" label="Reset Password" class="full-width" :loading="authStore.loading" />
            <q-btn flat label="Back to Login" to="/auth/login" class="full-width q-mt-sm" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/useAuthStore';
import { Notify } from 'quasar';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const token = ref(route.query.token as string || '');
const email = ref('');
const password = ref('');
const passwordConfirmation = ref('');

onMounted(() => {
  // Get token from URL query if present
  if (route.query.token) {
    token.value = route.query.token as string;
  }
});

const onSubmit = async () => {
  try {
    await authStore.resetPassword({
      token: token.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    });
    Notify.create({
      type: 'positive',
      message: 'Password reset successfully. Please login.',
    });
    router.push('/auth/login');
  } catch (error) {
    // Error handled by API interceptor
  }
};
</script>

