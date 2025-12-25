import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/LandingLayout.vue'),
    meta: { requiresAuth: false },
    children: [
      { 
        path: '', 
        name: 'home', 
        component: () => import('pages/IndexPage.vue'),
        meta: { requiresAuth: false }
      },
    ],
  },
  // Authentication routes
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { path: 'login', name: 'auth-login', component: () => import('pages/AuthLogin.vue') },
      { path: 'register', name: 'auth-register', component: () => import('pages/AuthRegister.vue') },
      { path: 'forgot-password', name: 'auth-forgot-password', component: () => import('pages/AuthForgotPassword.vue') },
      { path: 'reset-password', name: 'auth-reset-password', component: () => import('pages/AuthResetPassword.vue') },
    ],
  },
  // User routes
  {
    path: '/profile',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'user-profile', component: () => import('pages/UserProfile.vue') },
    ],
  },
  // Activity routes
  {
    path: '/activities',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'activities-list', component: () => import('pages/ActivityList.vue') },
      { path: 'create', name: 'activities-create', component: () => import('pages/ActivityCreate.vue') },
      { path: ':id', name: 'activities-detail', component: () => import('pages/ActivityDetail.vue') },
      { path: 'timeline', name: 'activities-timeline', component: () => import('pages/ActivityTimeline.vue') },
    ],
  },
  // Dashboard routes
  {
    path: '/dashboard',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'dashboard', component: () => import('pages/Dashboard.vue') },
    ],
  },
  // Organisation routes (admin)
  {
    path: '/organisations',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true, requiresRole: ['super_admin', 'admin'] },
    children: [
      { path: '', name: 'organisations-list', component: () => import('pages/OrganisationList.vue') },
      { path: 'create', name: 'organisations-create', component: () => import('pages/OrganisationCreate.vue') },
      { path: ':id', name: 'organisations-detail', component: () => import('pages/OrganisationDetail.vue') },
    ],
  },
  // Communication routes
  {
    path: '/messages',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'messages-inbox', component: () => import('pages/MessageInbox.vue') },
      { path: 'compose', name: 'messages-compose', component: () => import('pages/MessageCompose.vue') },
      { path: ':id', name: 'messages-detail', component: () => import('pages/MessageDetail.vue') },
    ],
  },
  // Reports routes
  {
    path: '/reports',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'reports-list', component: () => import('pages/ReportsList.vue') },
    ],
  },
  // Analytics routes
  {
    path: '/analytics',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'analytics', component: () => import('pages/Analytics.vue') },
    ],
  },
  // Settings routes
  {
    path: '/settings',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'settings', component: () => import('pages/Settings.vue') },
    ],
  },
  // Help routes
  {
    path: '/help',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'help-search', component: () => import('pages/HelpSearch.vue') },
      { path: ':id', name: 'help-article', component: () => import('pages/HelpArticle.vue') },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;

