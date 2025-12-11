<template>
  <div class="auth-register">
    <!-- Register Header -->
    <div class="text-center q-mb-lg">
      <h2 class="text-h4 text-weight-medium q-ma-none">
        Create Account
      </h2>
      <p class="text-body1 text-grey-6 q-mt-sm">
        Join CCIP to start managing risk communications
      </p>
    </div>

    <!-- Step Indicator -->
    <div class="step-indicator q-mb-xl">
      <q-stepper
        v-model="step"
        ref="stepper"
        color="primary"
        animated
        done-color="positive"
        active-color="primary"
        inactive-color="grey-6"
        flat
      >
        <!-- Step 1: Personal Information -->
        <q-step
          :name="1"
          title="Personal Info"
          icon="person"
          :done="step > 1"
          :header-nav="false"
        >
          <q-form ref="step1Form" @submit="goToStep(2)" class="q-gutter-md">
            <q-input
              v-model="form.name"
              label="Full Name"
              outlined
              dense
              no-error-icon
              :rules="nameRules"
              lazy-rules
              :loading="authStore.loading"
              :disable="authStore.loading"
            >
              <template v-slot:prepend>
                <q-icon name="person" />
              </template>
            </q-input>

            <q-input
              v-model="form.email"
              label="Email Address"
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
              v-model="form.phoneNumber"
              label="Phone Number (Optional)"
              type="tel"
              outlined
              dense
              no-error-icon
              :rules="phoneRules"
              lazy-rules
              :loading="authStore.loading"
              :disable="authStore.loading"
            >
              <template v-slot:prepend>
                <q-icon name="phone" />
              </template>
            </q-input>
          </q-form>
        </q-step>

        <!-- Step 2: Organisation Details -->
        <q-step
          :name="2"
          title="Organisation"
          icon="business"
          :done="step > 2"
          :header-nav="false"
        >
          <q-form ref="step2Form" @submit="goToStep(3)" class="q-gutter-md">
            <div class="q-mb-md">
              <p class="text-body2 text-grey-7">
                Are you joining an existing organisation or creating a new one?
              </p>
              <q-option-group
                v-model="form.orgType"
                :options="orgTypeOptions"
                color="primary"
                class="q-mt-md"
                :disable="authStore.loading"
              />
            </div>

            <!-- Existing Organisation -->
            <template v-if="form.orgType === 'existing'">
              <q-select
                v-model="form.organisation_id"
                :options="organisationOptions"
                label="Select Organisation"
                outlined
                dense
                emit-value
                map-options
                use-chips
                clearable
                :rules="[(val) => form.orgType === 'new' || !!val || 'Please select an organisation']"
                :loading="loadingOrgs"
                :disable="authStore.loading"
              >
                <template v-slot:prepend>
                  <q-icon name="business" />
                </template>
              </q-select>
            </template>

            <!-- New Organisation -->
            <template v-if="form.orgType === 'new'">
              <q-input
                v-model="newOrg.name"
                label="Organisation Name"
                outlined
                dense
                no-error-icon
                :rules="[(val) => form.orgType === 'existing' || !!val || 'Organisation name is required']"
                :loading="authStore.loading"
                :disable="authStore.loading"
              >
                <template v-slot:prepend>
                  <q-icon name="business" />
                </template>
              </q-input>

              <q-select
                v-model="newOrg.category"
                :options="orgCategoryOptions"
                label="Organisation Category"
                outlined
                dense
                emit-value
                map-options
                :rules="[(val) => form.orgType === 'existing' || !!val || 'Please select a category']"
                :loading="authStore.loading"
                :disable="authStore.loading"
              >
                <template v-slot:prepend>
                  <q-icon name="category" />
                </template>
              </q-select>

              <q-select
                v-model="newOrg.level"
                :options="orgLevelOptions"
                label="Organisation Level"
                outlined
                dense
                emit-value
                map-options
                :rules="[(val) => form.orgType === 'existing' || !!val || 'Please select a level']"
                :loading="authStore.loading"
                :disable="authStore.loading"
              >
                <template v-slot:prepend>
                  <q-icon name="account_balance" />
                </template>
              </q-select>
            </template>
          </q-form>
        </q-step>

        <!-- Step 3: Account Setup -->
        <q-step
          :name="3"
          title="Account Setup"
          icon="lock"
          :done="step > 3"
          :header-nav="false"
        >
          <q-form ref="step3Form" @submit="goToStep(4)" class="q-gutter-md">
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

            <q-input
              v-model="form.password_confirmation"
              label="Confirm Password"
              :type="showConfirmPassword ? 'text' : 'password'"
              outlined
              dense
              no-error-icon
              :rules="confirmPasswordRules"
              lazy-rules
              :loading="authStore.loading"
              :disable="authStore.loading"
            >
              <template v-slot:prepend>
                <q-icon name="lock_outline" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="showConfirmPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="showConfirmPassword = !showConfirmPassword"
                />
              </template>
            </q-input>

            <!-- Password Strength Indicator -->
            <div v-if="form.password" class="q-mt-sm">
              <div class="text-caption text-grey-6 q-mb-xs">Password Strength:</div>
              <q-linear-progress
                :value="passwordStrength.value"
                :color="passwordStrength.color"
                size="4px"
                rounded
              />
              <div class="text-caption q-mt-xs" :class="`text-${passwordStrength.color}`">
                {{ passwordStrength.text }}
              </div>
            </div>
          </q-form>
        </q-step>

        <!-- Step 4: Review & Submit -->
        <q-step
          :name="4"
          title="Review"
          icon="check_circle"
          :done="step > 4"
          :header-nav="false"
        >
          <div class="review-section q-gutter-md">
            <!-- Personal Info Review -->
            <q-card flat bordered class="q-pa-md">
              <div class="text-h6 text-weight-medium q-mb-md">
                <q-icon name="person" class="q-mr-sm" />
                Personal Information
              </div>
              <div class="q-gutter-sm">
                <div class="row">
                  <div class="col-4 text-caption text-grey-6">Name:</div>
                  <div class="col-8">{{ form.name }}</div>
                </div>
                <div class="row">
                  <div class="col-4 text-caption text-grey-6">Email:</div>
                  <div class="col-8">{{ form.email }}</div>
                </div>
                <div v-if="form.phoneNumber" class="row">
                  <div class="col-4 text-caption text-grey-6">Phone:</div>
                  <div class="col-8">{{ form.phoneNumber }}</div>
                </div>
              </div>
            </q-card>

            <!-- Organisation Review -->
            <q-card flat bordered class="q-pa-md">
              <div class="text-h6 text-weight-medium q-mb-md">
                <q-icon name="business" class="q-mr-sm" />
                Organisation Information
              </div>
              <div class="q-gutter-sm">
                <div class="row">
                  <div class="col-4 text-caption text-grey-6">Type:</div>
                  <div class="col-8">{{ form.orgType === 'existing' ? 'Existing Organisation' : 'New Organisation' }}</div>
                </div>
                <div v-if="form.orgType === 'existing' && form.organisation_id" class="row">
                  <div class="col-4 text-caption text-grey-6">Organisation:</div>
                  <div class="col-8">{{ getSelectedOrganisationName() }}</div>
                </div>
                <div v-if="form.orgType === 'new'">
                  <div v-if="newOrg.name" class="row">
                    <div class="col-4 text-caption text-grey-6">Name:</div>
                    <div class="col-8">{{ newOrg.name }}</div>
                  </div>
                  <div v-if="newOrg.category" class="row">
                    <div class="col-4 text-caption text-grey-6">Category:</div>
                    <div class="col-8">{{ newOrg.category }}</div>
                  </div>
                  <div v-if="newOrg.level" class="row">
                    <div class="col-4 text-caption text-grey-6">Level:</div>
                    <div class="col-8">{{ newOrg.level }}</div>
                  </div>
                </div>
              </div>
            </q-card>

            <!-- Terms & Conditions -->
            <q-checkbox
              v-model="form.acceptTerms"
              label="I agree to the Terms of Service and Privacy Policy"
              color="primary"
              :rules="[(val) => !!val || 'You must accept the terms to continue']"
              :disable="authStore.loading"
            />
          </div>
        </q-step>
      </q-stepper>
    </div>

    <!-- Navigation Buttons -->
    <div class="row justify-between q-mt-lg">
      <q-btn
        v-if="step > 1"
        flat
        color="primary"
        label="Previous"
        @click="goToStep(step - 1)"
        :disable="authStore.loading"
      />
      <div v-else></div>

      <q-btn
        v-if="step < 4"
        color="primary"
        label="Next"
        @click="handleNext"
        :loading="authStore.loading"
        :disable="!canProceed"
      />
      <q-btn
        v-else
        color="primary"
        label="Create Account"
        @click="handleSubmit"
        :loading="authStore.loading"
        :disable="!form.acceptTerms || authStore.loading"
      />
    </div>

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

    <!-- Login Link -->
    <div class="text-center q-mt-xl">
      <p class="text-body2 text-grey-7">
        Already have an account?
        <q-btn
          flat
          dense
          no-caps
          label="Sign in"
          color="primary"
          @click="goToLogin"
        />
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from '@/stores/useAuthStore';
import type { RegisterData, OrganisationCategory, OrganisationLevel } from '@/types';

const router = useRouter();
const $q = useQuasar();
const authStore = useAuthStore();

// Step management
const step = ref(1);
const stepper = ref();

// Form refs
const step1Form = ref();
const step2Form = ref();
const step3Form = ref();

// Form data
const form = reactive<RegisterData & {
  phoneNumber?: string;
  orgType: 'existing' | 'new';
  organisation_id?: string;
  acceptTerms: boolean;
}>({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  phoneNumber: '',
  orgType: 'existing',
  organisation_id: undefined,
  acceptTerms: false
});

// New organisation data
const newOrg = reactive({
  name: '',
  category: '' as OrganisationCategory,
  level: '' as OrganisationLevel
});

// UI state
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const loadingOrgs = ref(false);

// Options
const orgTypeOptions = [
  { label: 'Join existing organisation', value: 'existing' },
  { label: 'Create new organisation', value: 'new' }
];

const orgCategoryOptions = [
  { label: 'Government', value: 'Government' },
  { label: 'NGO', value: 'NGO' },
  { label: 'CSO', value: 'CSO' },
  { label: 'Private', value: 'Private' }
];

const orgLevelOptions = [
  { label: 'Federal', value: 'Federal' },
  { label: 'State', value: 'State' },
  { label: 'LGA', value: 'LGA' }
];

// Mock organisation options
const organisationOptions = ref([
  { label: 'Federal Ministry of Health', value: '1' },
  { label: 'State Emergency Management Agency', value: '2' },
  { label: 'Red Cross Society', value: '3' },
  { label: 'WHO Nigeria', value: '4' }
]);

// Validation rules
const nameRules = [
  (val: string) => !!val || 'Name is required',
  (val: string) => val.length >= 2 || 'Name must be at least 2 characters'
];

const emailRules = [
  (val: string) => !!val || 'Email is required',
  (val: string) => /.+@.+\..+/.test(val) || 'Please enter a valid email address'
];

const phoneRules = [
  (val: string) => !val || /^\+?[\d\s\-()]+$/.test(val) || 'Please enter a valid phone number'
];

const passwordRules = [
  (val: string) => !!val || 'Password is required',
  (val: string) => val.length >= 8 || 'Password must be at least 8 characters',
  (val: string) => /[A-Z]/.test(val) || 'Password must contain at least one uppercase letter',
  (val: string) => /[a-z]/.test(val) || 'Password must contain at least one lowercase letter',
  (val: string) => /\d/.test(val) || 'Password must contain at least one number'
];

const confirmPasswordRules = [
  (val: string) => !!val || 'Please confirm password',
  (val: string) => val === form.password || 'Passwords do not match'
];

// Password strength calculation
const passwordStrength = computed(() => {
  const password = form.password;
  if (!password) return { value: 0, color: 'grey-6', text: '' };

  let strength = 0;
  if (password.length >= 8) strength += 0.25;
  if (password.length >= 12) strength += 0.25;
  if (/[A-Z]/.test(password)) strength += 0.25;
  if (/[0-9]/.test(password)) strength += 0.25;
  if (/[^A-Za-z0-9]/.test(password)) strength += 0.25;

  if (strength < 0.4) return { value: 0.3, color: 'negative', text: 'Weak' };
  if (strength < 0.6) return { value: 0.5, color: 'warning', text: 'Fair' };
  if (strength < 0.8) return { value: 0.7, color: 'info', text: 'Good' };
  return { value: 1, color: 'positive', text: 'Strong' };
});

// Can proceed to next step
const canProceed = computed(() => {
  switch (step.value) {
    case 1:
      return form.name && form.email && /.+@.+\..+/.test(form.email);
    case 2:
      if (form.orgType === 'existing') {
        return !!form.organisation_id;
      } else {
        return newOrg.name && newOrg.category && newOrg.level;
      }
    case 3:
      return form.password && form.password_confirmation &&
             form.password.length >= 8 && form.password === form.password_confirmation;
    default:
      return false;
  }
});

// Methods
const goToStep = async (newStep: number) => {
  // Validate current step
  const currentForm = [null, step1Form, step2Form, step3Form][step.value];
  if (currentForm) {
    const isValid = await currentForm.value.validate();
    if (!isValid) return;
  }

  step.value = newStep;
};

const handleNext = () => {
  goToStep(step.value + 1);
};

const handleSubmit = async () => {
  if (!form.acceptTerms) {
    $q.notify({
      type: 'negative',
      message: 'Please accept the terms and conditions'
    });
    return;
  }

  try {
    const registerData: RegisterData = {
      name: form.name,
      email: form.email,
      password: form.password,
      password_confirmation: form.password_confirmation,
      organisation_id: form.orgType === 'existing' ? form.organisation_id : undefined
    };

    await authStore.register(registerData);

    $q.notify({
      type: 'positive',
      message: 'Account created successfully!',
      position: 'top'
    });

    router.push('/dashboard');
  } catch (error) {
    console.error('Registration failed:', error);
  }
};

const goToLogin = () => {
  router.push('/auth/login');
};

const getSelectedOrganisationName = () => {
  const org = organisationOptions.value.find(o => o.value === form.organisation_id);
  return org ? org.label : '';
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
.auth-register {
  width: 100%;
}

.q-stepper {
  :deep(.q-stepper__tab) {
    padding: 8px 16px;
    font-size: 0.875rem;
  }

  :deep(.q-stepper__caption) {
    font-size: 0.75rem;
  }
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

.review-section {
  .q-card {
    border-radius: $card-border-radius;
  }
}

.q-banner {
  :deep(.q-banner__content) {
    font-size: 0.875rem;
  }
}

// Password strength indicator
.q-linear-progress {
  :deep(.q-linear-progress__track) {
    border-radius: 2px;
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

