import { createApp } from "vue";
import App from "./App.vue";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Cần có cái này để dropdown hoạt động chỗ hiển thị đăng xuất

import router from "./router";

createApp(App).use(router).mount("#app");
