<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page class="auth-page flex flex-center">
        <div class="auth-container">
          <!-- Logo and Title Section -->
          <div class="auth-header text-center q-mb-xl">
            <div class="auth-logo q-mb-md">
              <!-- CCIP Logo -->
              <svg
                width="60"
                height="60"
                viewBox="0 0 60 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="q-mx-auto auth-logo-svg"
              >
                <circle cx="30" cy="30" r="28" stroke="currentColor" stroke-width="2" fill="none" class="logo-stroke"/>
                <path d="M30 15 L40 25 L40 40 L30 50 L20 40 L20 25 Z" fill="currentColor" class="logo-fill"/>
                <path d="M30 25 L35 30 L30 35 L25 30 Z" fill="currentColor" class="logo-white"/>
                <path d="M30 5 L40 15 L30 20 L20 15 Z" fill="currentColor" class="logo-accent" opacity="0.8"/>
                <path d="M30 40 L40 45 L30 55 L20 45 Z" fill="currentColor" class="logo-accent" opacity="0.8"/>
              </svg>
            </div>
            <h1 class="text-h4 text-weight-medium q-ma-none">
              <span class="text-gradient">CCIP</span>
            </h1>
            <p class="text-body2 q-mt-sm text-grey-7">
              Risk Communication & Assessment Platform
            </p>
          </div>

          <!-- Main Content -->
          <div class="auth-content">
            <router-view />
          </div>

          <!-- Footer -->
          <div class="auth-footer text-center q-mt-xl">
            <p class="text-caption text-grey-6">
              © 2025 CCIP. All rights reserved.
            </p>
            <div class="footer-links q-mt-sm">
              <q-btn
                flat
                dense
                no-caps
                label="Privacy Policy"
                color="grey-6"
                size="sm"
                class="q-mx-sm"
              />
              <q-btn
                flat
                dense
                no-caps
                label="Terms of Service"
                color="grey-6"
                size="sm"
                class="q-mx-sm"
              />
              <q-btn
                flat
                dense
                no-caps
                label="Help"
                color="grey-6"
                size="sm"
                class="q-mx-sm"
              />
            </div>
          </div>
        </div>

        <!-- Background decoration -->
        <div class="auth-decoration absolute-top-right">
          <div class="decoration-circle-1"></div>
          <div class="decoration-circle-2"></div>
          <div class="decoration-circle-3"></div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
// Auth layout - minimal layout for login/register pages
</script>

<style lang="scss" scoped>
@import '@/quasar-variables.sass';

.auth-page {
  min-height: 100vh;
  background: var(--ccip-gradient-subtle);
  position: relative;
  overflow: hidden;
}

.auth-container {
  width: 100%;
  max-width: 450px;
  padding: 2rem;
  z-index: 1;
  position: relative;
}

.auth-content {
  background: var(--ccip-card);
  border-radius: $card-border-radius;
  box-shadow: var(--ccip-shadow-lg);
  padding: 2rem;
}

.auth-logo {
  svg {
    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
  }
}

.auth-logo-svg {
  .logo-stroke {
    color: var(--ccip-primary);
  }
  
  .logo-fill {
    color: var(--ccip-primary);
  }
  
  .logo-white {
    color: var(--ccip-text-inverse);
  }
  
  .logo-accent {
    color: var(--ccip-accent);
  }
}

.text-gradient {
  background: var(--ccip-gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.footer-links {
  .q-btn {
    &:hover {
      color: var(--ccip-primary);
    }
  }
}

// Background decorations
.auth-decoration {
  pointer-events: none;
  opacity: 0.1;
}

.decoration-circle-1,
.decoration-circle-2,
.decoration-circle-3 {
  position: absolute;
  border-radius: 50%;
  background: var(--ccip-primary);
}

.decoration-circle-1 {
  width: 300px;
  height: 300px;
  top: -150px;
  right: -150px;
  background: radial-gradient(circle, var(--ccip-primary) 0%, transparent 70%);
}

.decoration-circle-2 {
  width: 200px;
  height: 200px;
  top: 20%;
  right: -100px;
  background: radial-gradient(circle, var(--ccip-accent) 0%, transparent 70%);
}

.decoration-circle-3 {
  width: 150px;
  height: 150px;
  bottom: 20%;
  right: 10%;
  background: radial-gradient(circle, var(--ccip-info) 0%, transparent 70%);
}

// Responsive
@media (max-width: 600px) {
  .auth-container {
    padding: 1rem;
    max-width: 100%;
  }

  .auth-content {
    padding: 1.5rem;
  }

  .decoration-circle-1 {
    width: 200px;
    height: 200px;
    top: -100px;
    right: -100px;
  }

  .decoration-circle-2 {
    width: 150px;
    height: 150px;
    right: -75px;
  }

  .decoration-circle-3 {
    width: 100px;
    height: 100px;
  }
}
</style>

