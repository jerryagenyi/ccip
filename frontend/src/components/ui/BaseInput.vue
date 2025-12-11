<template>
  <q-input
    :model-value="modelValue"
    :label="label"
    :type="type"
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
    :lazy-rules="lazyRules"
    :debounce="debounce"
    @update:model-value="$emit('update:modelValue', $event)"
    @blur="$emit('blur', $event)"
    @focus="$emit('focus', $event)"
  >
    <template v-if="$slots.prepend" #prepend>
      <slot name="prepend" />
    </template>
    <template v-if="$slots.append" #append>
      <slot name="append" />
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  modelValue: string | number | null;
  label?: string;
  type?: string;
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
  lazyRules?: boolean;
  debounce?: number;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  outlined: true,
  dense: false,
  clearable: false,
  lazyRules: false,
  debounce: 0,
});

defineEmits<{
  'update:modelValue': [value: string | number | null];
  blur: [event: FocusEvent];
  focus: [event: FocusEvent];
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
</script>

