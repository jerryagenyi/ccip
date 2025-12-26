<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
          class="q-mr-sm"
        />
        <q-toolbar-title>CCIP</q-toolbar-title>
        <q-space />
        <ThemeToggle />
        <NotificationCenter />
        <UserMenu />
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
        <q-item clickable v-ripple to="/organisations">
          <q-item-section avatar>
            <q-icon name="business" />
          </q-item-section>
          <q-item-section>Organisations</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/messages">
          <q-item-section avatar>
            <q-icon name="mail" />
          </q-item-section>
          <q-item-section>Messages</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/reports">
          <q-item-section avatar>
            <q-icon name="description" />
          </q-item-section>
          <q-item-section>Reports</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/analytics">
          <q-item-section avatar>
            <q-icon name="analytics" />
          </q-item-section>
          <q-item-section>Analytics</q-item-section>
        </q-item>
        <q-separator class="q-my-sm" />
        <q-item clickable v-ripple to="/help">
          <q-item-section avatar>
            <q-icon name="help" />
          </q-item-section>
          <q-item-section>Help & Support</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/profile">
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>
          <q-item-section>Profile</q-item-section>
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
import NotificationCenter from '@/components/layout/NotificationCenter.vue';
import UserMenu from '@/components/layout/UserMenu.vue';
import ThemeToggle from '@/components/ui/ThemeToggle.vue';

const leftDrawerOpen = ref(false);
</script>

