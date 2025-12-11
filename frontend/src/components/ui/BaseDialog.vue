<template>
  <q-dialog
    :model-value="modelValue"
    :persistent="persistent"
    :maximized="maximized"
    :transition-show="transitionShow"
    :transition-hide="transitionHide"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <q-card :style="cardStyle" :class="cardClass">
      <q-card-section v-if="title || $slots.header" class="row items-center q-pb-none">
        <div class="text-h6">{{ title }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section v-if="$slots.default || $slots.content" :class="contentClass">
        <slot />
        <slot name="content" />
      </q-card-section>

      <q-card-actions v-if="$slots.actions" align="right" :class="actionsClass">
        <slot name="actions" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  modelValue: boolean;
  title?: string;
  persistent?: boolean;
  maximized?: boolean;
  width?: string;
  maxWidth?: string;
  transitionShow?: string;
  transitionHide?: string;
  contentPadding?: 'none' | 'sm' | 'md' | 'lg';
  actionsPadding?: 'none' | 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  persistent: false,
  maximized: false,
  transitionShow: 'scale',
  transitionHide: 'scale',
  contentPadding: 'md',
  actionsPadding: 'md',
});

defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const cardStyle = computed(() => {
  const style: Record<string, string> = {};
  if (props.width) style.width = props.width;
  if (props.maxWidth) style.maxWidth = props.maxWidth;
  return style;
});

const cardClass = computed(() => {
  return {
    'dialog-card': true,
  };
});

const contentClass = computed(() => {
  return {
    [`q-pa-${props.contentPadding === 'none' ? 'none' : props.contentPadding === 'sm' ? 'xs' : props.contentPadding === 'lg' ? 'lg' : 'md'}`]: true,
  };
});

const actionsClass = computed(() => {
  return {
    [`q-pa-${props.actionsPadding === 'none' ? 'none' : props.actionsPadding === 'sm' ? 'xs' : props.actionsPadding === 'lg' ? 'lg' : 'md'}`]: true,
  };
});
</script>

<style scoped lang="scss">
.dialog-card {
  min-width: 300px;
}
</style>

