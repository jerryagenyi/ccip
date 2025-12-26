import { createApp } from 'vue';
import { Quasar, Dark } from 'quasar';
import { createPinia } from 'pinia';

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css';

// Import Quasar css
import 'quasar/src/css/index.sass';

// Assumes your root component is App.vue
// and placed in same folder as main.js
import App from './App.vue';
import router from './router';
import { useThemeStore } from './stores/useThemeStore';

const app = createApp(App);
const pinia = createPinia();

app.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
});
app.use(pinia);
app.use(router);

// Initialize theme store to set dark theme as default
const themeStore = useThemeStore();
themeStore.initTheme();

// Try both possible mount points
const mountPoint = document.querySelector('#q-app') || document.querySelector('#root');
if (mountPoint) {
  app.mount(mountPoint);
} else {
  console.error('Could not find Vue app mount point (#q-app or #root)');
}

