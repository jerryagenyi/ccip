<template>
  <div class="location-selector">
    <div class="q-gutter-md">
      <!-- Country Selection -->
      <q-select
        v-model="country"
        :options="countryOptions"
        label="Country"
        outlined
        dense
        use-input
        input-debounce="300"
        :rules="[val => !!val || 'Country is required']"
        @filter="filterCountries"
        @update:model-value="onCountryChange"
      >
        <template #no-option>
          <q-item>
            <q-item-section class="text-grey"> No countries found </q-item-section>
          </q-item>
        </template>
      </q-select>

      <!-- Administrative Division Level 1 (State/Province/Region) -->
      <q-select
        v-if="showLevel1"
        v-model="level1"
        :options="level1Options"
        :label="level1Label"
        outlined
        dense
        use-input
        input-debounce="300"
        :disable="!country"
        :rules="level1Required ? [val => !!val || `${level1Label} is required`] : []"
        :hint="country ? `Select ${level1Label.toLowerCase()}` : 'Select a country first'"
        @filter="filterLevel1"
        @update:model-value="onLevel1Change"
      >
        <template #no-option>
          <q-item>
            <q-item-section class="text-grey"> No options found </q-item-section>
          </q-item>
        </template>
      </q-select>

      <!-- Administrative Division Level 2 (LGA/District/County) -->
      <q-select
        v-if="showLevel2"
        v-model="level2"
        :options="level2Options"
        :label="level2Label"
        outlined
        dense
        use-input
        input-debounce="300"
        :disable="!level1"
        :rules="level2Required ? [val => !!val || `${level2Label} is required`] : []"
        :hint="
          level1
            ? `Select ${level2Label.toLowerCase()}`
            : `Select ${level1Label.toLowerCase()} first`
        "
        @filter="filterLevel2"
        @update:model-value="$emit('update:level2', $event)"
      >
        <template #no-option>
          <q-item>
            <q-item-section class="text-grey"> No options found </q-item-section>
          </q-item>
        </template>
      </q-select>

      <!-- City/Town -->
      <q-input
        v-model="city"
        label="City/Town"
        outlined
        dense
        :rules="[
          val => !!val || 'City/Town is required',
          val => val.length >= 2 || 'City name must be at least 2 characters',
        ]"
        hint="Enter the city or town name"
        @update:model-value="$emit('update:city', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { api } from '@/services/api';

interface Props {
  country?: string | null;
  level1?: string | null;
  level2?: string | null;
  city?: string | null;
  level1Label?: string;
  level2Label?: string;
  level1Required?: boolean;
  level2Required?: boolean;
  showLevel1?: boolean;
  showLevel2?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  level1Label: 'Region/State/Province',
  level2Label: 'District/LGA/County',
  level1Required: false,
  level2Required: false,
  showLevel1: true,
  showLevel2: true,
});

const emit = defineEmits<{
  'update:country': [value: string | null];
  'update:level1': [value: string | null];
  'update:level2': [value: string | null];
  'update:city': [value: string | null];
}>();

const country = computed({
  get: () => props.country,
  set: value => emit('update:country', value),
});

const level1 = computed({
  get: () => props.level1,
  set: value => emit('update:level1', value),
});

const level2 = computed({
  get: () => props.level2,
  set: value => emit('update:level2', value),
});

const city = computed({
  get: () => props.city,
  set: value => emit('update:city', value),
});

// Options
const allCountries = ref<any[]>([]);
const countryOptions = ref<any[]>([]);
const level1Options = ref<any[]>([]);
const level2Options = ref<any[]>([]);

// Load countries from API or use common list
async function loadCountries() {
  try {
    // Try to load from API first
    const response = await api.get('/locations/countries');
    allCountries.value = response.data.data || response.data || [];
    countryOptions.value = allCountries.value.map((c: any) => ({
      label: c.name || c,
      value: c.code || c,
    }));
  } catch (error) {
    // Fallback to common countries list
    allCountries.value = [
      'Nigeria',
      'Kenya',
      'Ghana',
      'South Africa',
      'Tanzania',
      'Uganda',
      'Ethiopia',
      'Senegal',
      'Cameroon',
      'Zimbabwe',
      'Malawi',
      'Zambia',
      'United States',
      'United Kingdom',
      'Canada',
      'Australia',
      'India',
      'Brazil',
      'Mexico',
      'France',
      'Germany',
      'Italy',
      'Spain',
    ];
    countryOptions.value = allCountries.value.map(c => ({
      label: c,
      value: c,
    }));
  }
}

async function loadLevel1(countryCode: string) {
  if (!countryCode) return;
  try {
    const response = await api.get(`/locations/${countryCode}/regions`);
    level1Options.value = (response.data.data || response.data || []).map((r: any) => ({
      label: r.name || r,
      value: r.code || r,
    }));
  } catch (error) {
    // If API fails, allow free text input
    level1Options.value = [];
  }
}

async function loadLevel2(countryCode: string, level1Code: string) {
  if (!countryCode || !level1Code) return;
  try {
    const response = await api.get(`/locations/${countryCode}/${level1Code}/districts`);
    level2Options.value = (response.data.data || response.data || []).map((d: any) => ({
      label: d.name || d,
      value: d.code || d,
    }));
  } catch (error) {
    // If API fails, allow free text input
    level2Options.value = [];
  }
}

function filterCountries(val: string, update: (callback: () => void) => void) {
  update(() => {
    if (val === '') {
      countryOptions.value = allCountries.value.map((c: any) => ({
        label: typeof c === 'string' ? c : c.name || c,
        value: typeof c === 'string' ? c : c.code || c,
      }));
    } else {
      const needle = val.toLowerCase();
      countryOptions.value = allCountries.value
        .filter((c: any) => {
          const name = typeof c === 'string' ? c : c.name || c;
          return name.toLowerCase().includes(needle);
        })
        .map((c: any) => ({
          label: typeof c === 'string' ? c : c.name || c,
          value: typeof c === 'string' ? c : c.code || c,
        }));
    }
  });
}

function filterLevel1(val: string, update: (callback: () => void) => void) {
  update(() => {
    // Filtering handled by API or free text
  });
}

function filterLevel2(val: string, update: (callback: () => void) => void) {
  update(() => {
    // Filtering handled by API or free text
  });
}

function onCountryChange(value: string | null) {
  level1.value = null;
  level2.value = null;
  if (value) {
    loadLevel1(value);
  }
}

function onLevel1Change(value: string | null) {
  level2.value = null;
  if (value && country.value) {
    loadLevel2(country.value, value);
  }
}

// Initialize
loadCountries();

// Watch for country changes
watch(
  () => props.country,
  newCountry => {
    if (newCountry) {
      loadLevel1(newCountry);
    }
  }
);

// Watch for level1 changes
watch(
  () => props.level1,
  newLevel1 => {
    if (newLevel1 && props.country) {
      loadLevel2(props.country, newLevel1);
    }
  }
);
</script>

<style scoped lang="scss">
.location-selector {
  width: 100%;
}
</style>
