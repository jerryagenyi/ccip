import { createApp } from 'vue';
import { Quasar } from 'quasar';

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css';

// Import Quasar css
import 'quasar/src/css/index.sass';

// Assumes your root component is App.vue
// and placed in same folder as main.js
import App from './App.vue';
import router from './router';

// Create app
const app = createApp(App);

// Pinia is initialized via Quasar boot file (src/boot/pinia.ts)
// which runs before this point

app.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
});

app.use(router);

// Quasar CLI automatically injects #q-app in the HTML template
// Mount the app to #q-app
const mountPoint = document.querySelector('#q-app');
if (mountPoint) {
  app.mount(mountPoint);
} else {
  // Fallback: create mount point if it doesn't exist (shouldn't happen with Quasar CLI)
  const fallbackMount = document.createElement('div');
  fallbackMount.id = 'q-app';
  document.body.appendChild(fallbackMount);
  app.mount(fallbackMount);
  console.warn('Created #q-app mount point - this should not happen with Quasar CLI');
}

