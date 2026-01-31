<template>
  <q-badge
    v-if="!dot"
    :color="color"
    :text-color="textColor"
    :label="label"
    :floating="floating"
    :transparent="transparent"
    :outline="outline"
    :class="badgeClass"
  >
    <slot />
  </q-badge>
  <q-badge
    v-else
    :color="color"
    :floating="floating"
    :transparent="transparent"
    :outline="outline"
    :class="badgeClass"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  label?: string | number;
  color?: string;
  textColor?: string;
  variant?: 'default' | 'outline' | 'dot';
  floating?: boolean;
  transparent?: boolean;
  outline?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary',
  variant: 'default',
  floating: false,
  transparent: false,
  outline: false,
});

const dot = computed(() => props.variant === 'dot');

const badgeClass = computed(() => {
  return {
    [`badge-${props.variant}`]: true,
  };
});
</script>

<style scoped lang="scss">
.badge-default {
  font-weight: 500;
}

.badge-outline {
  font-weight: 500;
}
</style>
