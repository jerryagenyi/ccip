<template>
  <div class="data-table-container">
    <q-table
      :rows="rows"
      :columns="columns"
      :loading="loading"
      :filter="filter"
      :pagination="pagination"
      :row-key="rowKey"
      :selection="selection"
      :selected="selected"
      :dense="dense"
      :flat="flat"
      :bordered="bordered"
      :separator="separator"
      :no-data-label="noDataLabel"
      :loading-label="loadingLabel"
      :rows-per-page-label="rowsPerPageLabel"
      :no-results-label="noResultsLabel"
      @request="onRequest"
      @selection="onSelection"
      @row-click="onRowClick"
    >
      <template v-if="$slots.top" #top>
        <slot name="top" />
      </template>

      <template v-if="$slots.header" #header="props">
        <slot name="header" v-bind="props" />
      </template>

      <template v-if="$slots.body" #body="props">
        <slot name="body" v-bind="props" />
      </template>

      <template v-if="$slots['body-cell']" #body-cell="props">
        <slot name="body-cell" v-bind="props" />
      </template>

      <template v-if="$slots.bottom" #bottom>
        <slot name="bottom" />
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

export interface TableColumn {
  name: string;
  label: string;
  field: string | ((row: any) => any);
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  required?: boolean;
  format?: (val: any, row: any) => string;
  style?: string;
  classes?: string;
}

interface Props {
  rows: any[];
  columns: TableColumn[];
  loading?: boolean;
  filter?: string;
  pagination?: {
    page: number;
    rowsPerPage: number;
    rowsNumber?: number;
  };
  rowKey?: string;
  selection?: 'single' | 'multiple' | 'none';
  selected?: any[];
  dense?: boolean;
  flat?: boolean;
  bordered?: boolean;
  separator?: 'horizontal' | 'vertical' | 'cell' | 'none';
  noDataLabel?: string;
  loadingLabel?: string;
  rowsPerPageLabel?: string;
  noResultsLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  rowKey: 'id',
  selection: 'none',
  dense: false,
  flat: false,
  bordered: false,
  separator: 'horizontal',
  noDataLabel: 'No data available',
  loadingLabel: 'Loading...',
  rowsPerPageLabel: 'Rows per page:',
  noResultsLabel: 'No results found',
});

const emit = defineEmits<{
  request: [props: { pagination: any; filter?: string }];
  selection: [selected: any[]];
  'row-click': [evt: Event, row: any, index: number];
}>();

const selected = ref(props.selected || []);

const pagination = computed(() => {
  return (
    props.pagination || {
      page: 1,
      rowsPerPage: 10,
    }
  );
});

function onRequest(requestProps: { pagination: any; filter?: string }) {
  emit('request', requestProps);
}

function onSelection(selectedRows: any[]) {
  selected.value = selectedRows;
  emit('selection', selectedRows);
}

function onRowClick(evt: Event, row: any, index: number) {
  emit('row-click', evt, row, index);
}
</script>

<style scoped lang="scss">
.data-table-container {
  width: 100%;
}
</style>
