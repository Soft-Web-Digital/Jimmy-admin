import { createApp, markRaw } from "vue";
import { createPinia  } from "pinia";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import "@/scss/style.scss";
import PerfectScrollbar from "vue3-perfect-scrollbar";
import VueApexCharts from "vue3-apexcharts";
// @ts-ignore:next-line
import InstantSearch from "vue-instantsearch/vue3/es";
import VCalendar from "v-calendar";
import Notifications from '@kyvg/vue3-notification'
import VueFeather from "vue-feather";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import VOtpInput from "vue3-otp-input";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
// import VueEasyLightbox from 'vue-easy-lightbox'
import { VueQueryPlugin } from "vue-query";

import VueCookies from 'vue3-cookies';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);


pinia.use(({ store }) => {
  store.router = markRaw(router)
});

const app = createApp(App)
app.component(VueFeather.name, VueFeather);



app.use(pinia);

app.use(VueApexCharts);
app.use(VueCookies);
app.use(router);
app.use(Notifications)
app.use(vuetify).mount("#app");
app.use(VueQueryPlugin)
app.component('v-otp-input', VOtpInput)



