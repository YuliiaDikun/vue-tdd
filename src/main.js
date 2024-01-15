import { createApp } from "vue";
import i18n from "./locales/i18n";
import router from "./routes/router";
import "./style.css";
import App from "./App.vue";

createApp(App).use(router).use(i18n).mount("#app");
