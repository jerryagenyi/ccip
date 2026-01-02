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

const app = createApp(App);

app.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
});

app.use(router);

// Try both possible mount points
const mountPoint = document.querySelector('#q-app') || document.querySelector('#root');
if (mountPoint) {
  app.mount(mountPoint);
} else {
  console.error('Could not find Vue app mount point (#q-app or #root)');
}

