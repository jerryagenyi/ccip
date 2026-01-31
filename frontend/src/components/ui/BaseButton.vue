<template>
  <q-btn
    :type="type"
    :color="color"
    :size="size"
    :outline="variant === 'outline'"
    :flat="variant === 'text'"
    :round="round"
    :icon="icon"
    :loading="loading"
    :disable="disabled"
    :class="buttonClass"
    @click="$emit('click', $event)"
  >
    <slot />
  </q-btn>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  type?: 'button' | 'submit' | 'reset';
  icon?: string;
  round?: boolean;
  loading?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  color: 'primary',
  type: 'button',
  round: false,
  loading: false,
  disabled: false,
});

defineEmits<{
  click: [event: MouseEvent];
}>();

const buttonClass = computed(() => {
  return {
    [`btn-${props.variant}`]: true,
    [`btn-${props.size}`]: true,
  };
});
</script>

<style scoped lang="scss">
.btn-primary {
  font-weight: 500;
}

.btn-secondary {
  font-weight: 500;
}

.btn-outline {
  font-weight: 500;
}

.btn-text {
  font-weight: 500;
}
</style>
