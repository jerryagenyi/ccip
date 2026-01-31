<template>
  <q-page class="activity-create-page">
    <div class="q-pa-md">
      <!-- Page Header -->
      <div class="row items-center q-mb-md">
        <q-btn flat round icon="arrow_back" @click="$router.push('/activities')" />
        <div class="col q-ml-md">
          <div class="text-h4 text-weight-bold">Create Activity</div>
          <div class="text-subtitle1 text-grey-7">Fill in the details to create a new activity</div>
        </div>
      </div>

      <!-- Multi-step Form Wizard -->
      <q-card>
        <q-card-section>
          <FormWizard
            v-model="currentStep"
            :steps="wizardSteps"
            :finish-loading="submitting"
            finish-label="Submit Activity"
            @finish="handleSubmit"
          >
            <!-- Step 1: Basic Details -->
            <template #step-details>
              <div class="q-gutter-md">
                <q-input
                  v-model="formData.title"
                  label="Activity Title"
                  outlined
                  dense
                  :rules="[
                    val => !!val || 'Title is required',
                    val => val.length >= 5 || 'Title must be at least 5 characters',
                  ]"
                  hint="Enter a descriptive title for the activity"
                />

                <q-select
                  v-model="formData.type"
                  :options="activityTypes"
                  label="Activity Type"
                  outlined
                  dense
                  emit-value
                  map-options
                  :rules="[val => !!val || 'Activity type is required']"
                />

                <q-input
                  v-model="formData.description"
                  label="Description"
                  type="textarea"
                  outlined
                  rows="5"
                  :rules="[
                    val => !!val || 'Description is required',
                    val => val.length >= 10 || 'Description must be at least 10 characters',
                  ]"
                  hint="Provide a detailed description of the activity"
                />
              </div>
            </template>

            <!-- Step 2: Location & Logistics -->
            <template #step-location>
              <div class="q-gutter-md">
                <LocationSelector
                  v-model:country="formData.country"
                  v-model:level1="formData.administrativeLevel1"
                  v-model:level2="formData.administrativeLevel2"
                  v-model:city="formData.city"
                  level1-label="Region/State/Province"
                  level2-label="District/LGA/County"
                />

                <div class="row q-col-gutter-md">
                  <div class="col-12 col-md-6">
                    <q-input
                      v-model="formData.startDate"
                      label="Start Date"
                      outlined
                      dense
                      type="date"
                      :rules="[val => !!val || 'Start date is required']"
                    />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-input
                      v-model="formData.endDate"
                      label="End Date"
                      outlined
                      dense
                      type="date"
                      :rules="[
                        val => !!val || 'End date is required',
                        val =>
                          !formData.startDate ||
                          val >= formData.startDate ||
                          'End date cannot be before start date',
                      ]"
                    />
                  </div>
                </div>
              </div>
            </template>

            <!-- Step 3: Message Planning -->
            <template #step-message>
              <div class="q-gutter-md">
                <q-input
                  v-model="formData.plannedMessage"
                  label="Planned Message"
                  type="textarea"
                  outlined
                  rows="6"
                  hint="Enter the message content for this activity"
                />

                <q-select
                  v-model="formData.targetContextRegion"
                  :options="regionOptions"
                  label="Target Region"
                  outlined
                  dense
                  emit-value
                  map-options
                />

                <q-select
                  v-model="formData.targetContextLanguage"
                  :options="languageOptions"
                  label="Target Language"
                  outlined
                  dense
                  emit-value
                  map-options
                />

                <q-select
                  v-model="formData.targetContextCulture"
                  :options="cultureOptions"
                  label="Target Culture"
                  outlined
                  dense
                  emit-value
                  map-options
                />

                <q-select
                  v-model="formData.targetMessengers"
                  :options="messengerOptions"
                  label="Target Messengers"
                  outlined
                  dense
                  multiple
                  emit-value
                  map-options
                  hint="Select one or more messenger types"
                />
              </div>
            </template>

            <!-- Step 4: Attachments -->
            <template #step-attachments>
              <div class="q-gutter-md">
                <div class="text-subtitle2 q-mb-sm">Upload Evidence Files</div>
                <FileUpload
                  v-model="formData.attachments"
                  label="Select files to upload"
                  :multiple="true"
                  :custom="true"
                  accept="image/*,application/pdf,.doc,.docx"
                />
                <div class="text-caption text-grey-6">
                  Supported formats: Images, PDF, Word documents. Maximum file size: 10MB per file.
                </div>

                <!-- AI Semiotic Analysis -->
                <div class="q-mt-xl">
                  <div class="text-subtitle2 q-mb-md">
                    <q-icon name="psychology" class="q-mr-sm" />
                    Optional: AI Semiotic Analysis
                  </div>
                  <SemioticAnalysis :activity-data="formData" />
                </div>
              </div>
            </template>
          </FormWizard>

          <!-- Action Buttons (Outside Wizard) -->
          <div class="row justify-between q-mt-lg">
            <q-btn
              flat
              label="Save as Draft"
              icon="save"
              :loading="savingDraft"
              @click="saveDraft"
            />
            <div class="q-gutter-sm">
              <q-btn flat label="Cancel" @click="$router.push('/activities')" />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useActivityStore } from '@/stores/useActivityStore';
import FormWizard, { type WizardStep } from '@/components/ui/FormWizard.vue';
import FileUpload from '@/components/ui/FileUpload.vue';
import LocationSelector from '@/components/activities/LocationSelector.vue';
import SemioticAnalysis from '@/components/activities/SemioticAnalysis.vue';

const router = useRouter();
const $q = useQuasar();
const activityStore = useActivityStore();

const currentStep = ref(1);
const submitting = ref(false);
const savingDraft = ref(false);

const formData = ref({
  title: '',
  type: '',
  description: '',
  country: null as string | null,
  administrativeLevel1: null as string | null,
  administrativeLevel2: null as string | null,
  city: null as string | null,
  startDate: '',
  endDate: '',
  plannedMessage: '',
  targetContextRegion: '',
  targetContextLanguage: 'English',
  targetContextCulture: 'General Audience',
  targetMessengers: [] as string[],
  attachments: [] as any[],
});

const activityTypes = [
  { label: 'Workshop', value: 'workshop' },
  { label: 'Campaign', value: 'campaign' },
  { label: 'Meeting', value: 'meeting' },
  { label: 'Training', value: 'training' },
  { label: 'Other', value: 'other' },
];

const regionOptions = [
  { label: 'Global', value: 'Global' },
  { label: 'Africa', value: 'Africa' },
  { label: 'West Africa', value: 'West Africa' },
  { label: 'East Africa', value: 'East Africa' },
  { label: 'Central Africa', value: 'Central Africa' },
  { label: 'Southern Africa', value: 'Southern Africa' },
  { label: 'North Africa', value: 'North Africa' },
  { label: 'Asia', value: 'Asia' },
  { label: 'Europe', value: 'Europe' },
  { label: 'Americas', value: 'Americas' },
  { label: 'Oceania', value: 'Oceania' },
];

const languageOptions = [
  { label: 'English', value: 'English' },
  { label: 'French', value: 'French' },
  { label: 'Spanish', value: 'Spanish' },
  { label: 'Portuguese', value: 'Portuguese' },
  { label: 'Arabic', value: 'Arabic' },
  { label: 'Swahili', value: 'Swahili' },
  { label: 'Hausa', value: 'Hausa' },
  { label: 'Yoruba', value: 'Yoruba' },
  { label: 'Igbo', value: 'Igbo' },
  { label: 'Mandarin', value: 'Mandarin' },
  { label: 'Hindi', value: 'Hindi' },
];

const cultureOptions = [
  { label: 'General Audience', value: 'General Audience' },
  { label: 'Urban', value: 'Urban' },
  { label: 'Rural', value: 'Rural' },
  { label: 'Youth', value: 'Youth' },
  { label: 'Elderly', value: 'Elderly' },
  { label: 'Religious', value: 'Religious' },
];

const messengerOptions = [
  { label: 'Health Workers', value: 'Health Workers' },
  { label: 'Community Leaders', value: 'Community Leaders' },
  { label: 'Media', value: 'Media' },
  { label: 'Social Media Influencers', value: 'Social Media Influencers' },
  { label: 'Traditional Healers', value: 'Traditional Healers' },
];

const wizardSteps: WizardStep[] = [
  {
    name: 'details',
    title: 'Basic Details',
    caption: 'Activity information',
    icon: 'description',
  },
  {
    name: 'location',
    title: 'Location & Logistics',
    caption: 'Where and when',
    icon: 'location_on',
  },
  {
    name: 'message',
    title: 'Message Planning',
    caption: 'Target context',
    icon: 'message',
  },
  {
    name: 'attachments',
    title: 'Attachments',
    caption: 'Evidence files',
    icon: 'attach_file',
  },
];

async function handleSubmit() {
  // Validate form
  if (!formData.value.title || !formData.value.type || !formData.value.description) {
    $q.notify({
      type: 'negative',
      message: 'Please fill in all required fields',
    });
    return;
  }

  submitting.value = true;
  try {
    // Build location string from components
    const locationParts = [
      formData.value.city,
      formData.value.administrativeLevel2,
      formData.value.administrativeLevel1,
      formData.value.country,
    ].filter(Boolean);

    const activityData = {
      title: formData.value.title,
      type: formData.value.type,
      description: formData.value.description,
      location: locationParts.join(', '),
      country: formData.value.country,
      administrative_level_1: formData.value.administrativeLevel1,
      administrative_level_2: formData.value.administrativeLevel2,
      city: formData.value.city,
      date: formData.value.startDate,
      // Add other fields as needed
    };

    await activityStore.createActivity(activityData);

    $q.notify({
      type: 'positive',
      message: 'Activity created successfully',
    });

    router.push('/activities');
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to create activity',
    });
  } finally {
    submitting.value = false;
  }
}

async function saveDraft() {
  savingDraft.value = true;
  try {
    // Save as draft logic
    const locationParts = [
      formData.value.city,
      formData.value.administrativeLevel2,
      formData.value.administrativeLevel1,
      formData.value.country,
    ].filter(Boolean);

    const activityData = {
      title: formData.value.title || 'Untitled Activity',
      type: formData.value.type || 'other',
      description: formData.value.description || '',
      location: locationParts.join(', ') || '',
      country: formData.value.country,
      administrative_level_1: formData.value.administrativeLevel1,
      administrative_level_2: formData.value.administrativeLevel2,
      city: formData.value.city,
      date: formData.value.startDate || new Date().toISOString(),
      status: 'draft' as const,
    };

    await activityStore.createActivity(activityData);

    $q.notify({
      type: 'positive',
      message: 'Activity saved as draft',
    });

    router.push('/activities');
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to save draft',
    });
  } finally {
    savingDraft.value = false;
  }
}
</script>

<style scoped lang="scss">
.activity-create-page {
  background-color: #f5f5f5;
}
</style>
