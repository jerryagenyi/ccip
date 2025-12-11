<template>
  <div class="file-upload">
    <q-uploader
      v-if="!custom"
      :url="url"
      :label="label"
      :multiple="multiple"
      :accept="accept"
      :max-file-size="maxFileSize"
      :max-total-size="maxTotalSize"
      :max-files="maxFiles"
      :auto-upload="autoUpload"
      :hide-upload-btn="hideUploadBtn"
      :flat="flat"
      :bordered="bordered"
      :disable="disabled"
      :factory="factory"
      @added="onAdded"
      @removed="onRemoved"
      @uploaded="onUploaded"
      @failed="onFailed"
    />

    <div v-else class="custom-upload">
      <q-file
        v-model="fileModel"
        :label="label"
        :multiple="multiple"
        :accept="accept"
        :max-file-size="maxFileSize"
        :disable="disabled"
        :clearable="clearable"
        :use-chips="useChips"
        :counter="counter"
        @update:model-value="onFileChange"
      >
        <template v-if="$slots.prepend" #prepend>
          <slot name="prepend" />
        </template>
        <template v-if="$slots.append" #append>
          <slot name="append" />
        </template>
      </q-file>

      <div v-if="files.length > 0" class="file-list q-mt-md">
        <q-list bordered separator>
          <q-item
            v-for="(file, index) in files"
            :key="index"
            class="file-item"
          >
            <q-item-section avatar>
              <q-icon :name="getFileIcon(file.type || '')" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ file.name }}</q-item-label>
              <q-item-label caption>{{ formatFileSize(file.size) }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                icon="close"
                flat
                round
                dense
                @click="removeFile(index)"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <q-btn
        v-if="files.length > 0 && !autoUpload"
        :label="uploadLabel"
        :loading="uploading"
        :disable="disabled"
        color="primary"
        class="q-mt-md"
        @click="handleUpload"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface FileItem {
  name: string;
  size: number;
  type?: string;
  file?: File;
}

interface Props {
  modelValue?: File[] | FileItem[];
  url?: string;
  label?: string;
  multiple?: boolean;
  accept?: string;
  maxFileSize?: number;
  maxTotalSize?: number;
  maxFiles?: number;
  autoUpload?: boolean;
  hideUploadBtn?: boolean;
  flat?: boolean;
  bordered?: boolean;
  disabled?: boolean;
  custom?: boolean;
  clearable?: boolean;
  useChips?: boolean;
  counter?: boolean;
  uploadLabel?: string;
  factory?: (files: File[]) => Promise<{ url: string; formData: FormData }>;
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Upload files',
  multiple: false,
  autoUpload: true,
  hideUploadBtn: false,
  flat: false,
  bordered: true,
  disabled: false,
  custom: false,
  clearable: true,
  useChips: false,
  counter: true,
  uploadLabel: 'Upload',
});

const emit = defineEmits<{
  'update:modelValue': [files: File[] | FileItem[]];
  added: [files: File[]];
  removed: [files: File[]];
  uploaded: [info: { files: File[]; xhr: any }];
  failed: [info: { files: File[]; xhr: any }];
}>();

const fileModel = ref<File[] | null>(null);
const files = ref<FileItem[]>([]);
const uploading = ref(false);

function onAdded(files: File[]) {
  const fileItems = files.map((file) => ({
    name: file.name,
    size: file.size,
    type: file.type,
    file,
  }));
  emit('added', files);
  emit('update:modelValue', fileItems);
}

function onRemoved(files: File[]) {
  emit('removed', files);
}

function onUploaded(info: { files: File[]; xhr: any }) {
  emit('uploaded', info);
}

function onFailed(info: { files: File[]; xhr: any }) {
  emit('failed', info);
}

function onFileChange(newFiles: File[] | null) {
  if (!newFiles) {
    files.value = [];
    emit('update:modelValue', []);
    return;
  }

  const fileArray = Array.isArray(newFiles) ? newFiles : [newFiles];
  files.value = fileArray.map((file) => ({
    name: file.name,
    size: file.size,
    type: file.type,
    file,
  }));

  emit('update:modelValue', files.value);
}

function removeFile(index: number) {
  files.value.splice(index, 1);
  emit('update:modelValue', files.value);
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function getFileIcon(type: string): string {
  if (type.startsWith('image/')) return 'image';
  if (type.startsWith('video/')) return 'video_library';
  if (type.startsWith('audio/')) return 'audio_file';
  if (type.includes('pdf')) return 'picture_as_pdf';
  if (type.includes('word') || type.includes('document')) return 'description';
  if (type.includes('excel') || type.includes('spreadsheet')) return 'table_chart';
  return 'insert_drive_file';
}

async function handleUpload() {
  if (!props.factory || files.value.length === 0) return;

  uploading.value = true;
  try {
    const fileArray = files.value.map((item) => item.file!).filter(Boolean);
    const result = await props.factory(fileArray);
    emit('uploaded', { files: fileArray, xhr: result });
  } catch (error) {
    emit('failed', { files: [], xhr: error });
  } finally {
    uploading.value = false;
  }
}
</script>

<style scoped lang="scss">
.file-upload {
  width: 100%;
}

.custom-upload {
  width: 100%;
}

.file-list {
  max-height: 300px;
  overflow-y: auto;
}

.file-item {
  padding: 8px 16px;
}
</style>

