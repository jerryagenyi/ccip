<template>
  <div class="form-wizard">
    <q-stepper
      v-model="currentStep"
      :color="color"
      :animated="animated"
      :vertical="vertical"
      :alternative-labels="alternativeLabels"
      :contracted="contracted"
      :header-nav="headerNav"
      :keep-alive="keepAlive"
      :flat="flat"
      :bordered="bordered"
    >
      <q-step
        v-for="(step, index) in steps"
        :key="index"
        :name="step.name"
        :title="step.title"
        :caption="step.caption"
        :icon="step.icon"
        :done="step.done || currentStep > index + 1"
        :error="step.error"
        :disable="step.disable"
      >
        <slot :name="`step-${step.name}`" :step="step" :index="index">
          <div v-if="step.content" v-html="step.content" />
        </slot>
      </q-step>

      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn v-if="currentStep > 1" :color="color" label="Back" @click="previousStep" />
          <q-space />
          <q-btn v-if="currentStep < steps.length" :color="color" label="Next" @click="nextStep" />
          <q-btn
            v-else
            :color="color"
            :label="finishLabel"
            :loading="finishLoading"
            @click="onFinish"
          />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

export interface WizardStep {
  name: string;
  title: string;
  caption?: string;
  icon?: string;
  done?: boolean;
  error?: boolean;
  disable?: boolean;
  content?: string;
}

interface Props {
  steps: WizardStep[];
  modelValue?: string | number;
  color?: string;
  animated?: boolean;
  vertical?: boolean;
  alternativeLabels?: boolean;
  contracted?: boolean;
  headerNav?: boolean;
  keepAlive?: boolean;
  flat?: boolean;
  bordered?: boolean;
  finishLabel?: string;
  finishLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 1,
  color: 'primary',
  animated: true,
  vertical: false,
  alternativeLabels: false,
  contracted: false,
  headerNav: true,
  keepAlive: false,
  flat: false,
  bordered: false,
  finishLabel: 'Finish',
  finishLoading: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string | number];
  finish: [];
  'step-change': [step: string | number];
}>();

const currentStep = computed({
  get: () => props.modelValue || 1,
  set: value => {
    emit('update:modelValue', value);
    emit('step-change', value);
  },
});

function nextStep() {
  if (currentStep.value < props.steps.length) {
    currentStep.value = currentStep.value + 1;
  }
}

function previousStep() {
  if (currentStep.value > 1) {
    currentStep.value = currentStep.value - 1;
  }
}

function onFinish() {
  emit('finish');
}
</script>

<style scoped lang="scss">
.form-wizard {
  width: 100%;
}
</style>
