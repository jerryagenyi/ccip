<template>
  <q-card :class="cardClass" :flat="flat" :bordered="bordered">
    <q-card-section v-if="title || $slots.header" class="card-header">
      <slot name="header">
        <div class="text-h6">{{ title }}</div>
      </slot>
    </q-card-section>

    <q-card-section v-if="$slots.default" :class="sectionClass">
      <slot />
    </q-card-section>

    <q-card-section v-if="$slots.content" :class="sectionClass">
      <slot name="content" />
    </q-card-section>

    <q-card-actions v-if="$slots.actions" align="right">
      <slot name="actions" />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  title?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  flat?: boolean;
  bordered?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  padding: 'md',
  flat: false,
  bordered: true,
});

const cardClass = computed(() => {
  return {
    [`card-${props.variant}`]: true,
  };
});

const sectionClass = computed(() => {
  return {
    [`q-pa-${props.padding === 'none' ? 'none' : props.padding === 'sm' ? 'xs' : props.padding === 'lg' ? 'lg' : 'md'}`]: true,
  };
});
</script>

<style scoped lang="scss">
.card-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.card-elevated {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-outlined {
  border: 1px solid rgba(0, 0, 0, 0.12);
  box-shadow: none;
}

.card-flat {
  box-shadow: none;
  border: none;
}
</style>
