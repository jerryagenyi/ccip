<template>
  <q-page class="error-not-found-page flex flex-center">
    <div class="text-center">
      <div class="error-code">404</div>
      <div class="text-h4 text-weight-bold q-mt-md q-mb-sm">
        Page Not Found
      </div>
      <div class="text-body1 text-grey-7 q-mb-xl" style="max-width: 500px; margin: 0 auto">
        The page you're looking for doesn't exist or has been moved.
      </div>
      <div class="row q-gutter-sm justify-center">
        <q-btn
          color="primary"
          label="Go Home"
          icon="home"
          @click="$router.push('/')"
        />
        <q-btn
          flat
          label="Go Back"
          icon="arrow_back"
          @click="$router.back()"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
// 404 error page
</script>

<style scoped lang="scss">
.error-not-found-page {
  background-color: #f5f5f5;
  min-height: 100vh;
}

.error-code {
  font-size: 8rem;
  font-weight: 700;
  color: var(--q-primary);
  line-height: 1;
  opacity: 0.3;
}
</style>
