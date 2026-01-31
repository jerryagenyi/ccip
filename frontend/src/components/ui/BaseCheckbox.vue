<template>
  <q-checkbox
    :model-value="modelValue"
    :label="label"
    :disable="disabled"
    :indeterminate-value="indeterminateValue"
    :true-value="trueValue"
    :false-value="falseValue"
    :color="color"
    :size="size"
    :dense="dense"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean | any;
  label?: string;
  disable?: boolean;
  indeterminateValue?: any;
  trueValue?: any;
  falseValue?: any;
  color?: string;
  size?: string;
  dense?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary',
  dense: false,
});

defineEmits<{
  'update:modelValue': [value: boolean | any];
}>();
</script>
