<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>RCAP</q-toolbar-title>
        <q-space />
        <q-btn flat round dense icon="notifications" />
        <q-btn flat round dense icon="account_circle" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>Navigation</q-item-label>
        <q-item clickable v-ripple to="/dashboard">
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/activities">
          <q-item-section avatar>
            <q-icon name="assignment" />
          </q-item-section>
          <q-item-section>Activities</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/messages">
          <q-item-section avatar>
            <q-icon name="mail" />
          </q-item-section>
          <q-item-section>Messages</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-grey-1">
      <AppFooter />
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AppFooter from '@/components/AppFooter.vue';

const leftDrawerOpen = ref(false);
</script>

