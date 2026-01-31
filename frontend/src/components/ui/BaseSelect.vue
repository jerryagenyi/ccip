<template>
  <q-select
    :model-value="modelValue"
    :options="options"
    :label="label"
    :placeholder="placeholder"
    :hint="hint"
    :error="hasError"
    :error-message="errorMessage"
    :disable="disabled"
    :readonly="readonly"
    :required="required"
    :rules="computedRules"
    :outlined="outlined"
    :filled="filled"
    :dense="dense"
    :clearable="clearable"
    :multiple="multiple"
    :use-input="useInput"
    :input-debounce="inputDebounce"
    :option-label="optionLabel"
    :option-value="optionValue"
    :emit-value="emitValue"
    :map-options="mapOptions"
    @update:model-value="$emit('update:modelValue', $event)"
    @filter="onFilter"
  >
    <template v-if="$slots.prepend" #prepend>
      <slot name="prepend" />
    </template>
    <template v-if="$slots.append" #append>
      <slot name="append" />
    </template>
    <template v-if="$slots.option" #option="scope">
      <slot name="option" v-bind="scope" />
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

interface Props {
  modelValue: any;
  options: any[];
  label?: string;
  placeholder?: string;
  hint?: string;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  rules?: Array<(val: any) => boolean | string>;
  outlined?: boolean;
  filled?: boolean;
  dense?: boolean;
  clearable?: boolean;
  multiple?: boolean;
  useInput?: boolean;
  inputDebounce?: number;
  optionLabel?: string | ((option: any) => string);
  optionValue?: string | ((option: any) => any);
  emitValue?: boolean;
  mapOptions?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  outlined: true,
  dense: false,
  clearable: false,
  multiple: false,
  useInput: false,
  inputDebounce: 0,
  emitValue: false,
  mapOptions: false,
});

defineEmits<{
  'update:modelValue': [value: any];
  filter: [value: string, update: (callback: () => void) => void];
}>();

const hasError = computed(() => {
  return props.error || !!props.errorMessage;
});

const computedRules = computed(() => {
  const rules = props.rules || [];
  if (props.required) {
    return [
      (val: any) => (val !== null && val !== undefined && val !== '') || 'This field is required',
      ...rules,
    ];
  }
  return rules;
});

function onFilter(val: string, update: (callback: () => void) => void) {
  update(() => {
    // Filter logic can be handled by parent component
  });
  // Emit filter event for parent to handle
}
</script>
