import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core';

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

/* import specific icons */
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

/* Import custom AppLink */
import AppLink from '@/components/base/links/AppLink.vue';
const app = createApp(App);

app.use(createPinia());
app.use(router);

/* add icons to the library */
library.add(faChevronDown, faChevronUp);

/* add font awesome icon component */
app.component('FontAwesomeIcon', FontAwesomeIcon);

/* Add AppLink globally */
app.component('AppLink', AppLink);

app.mount('#app');
