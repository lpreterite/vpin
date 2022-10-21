import Vue from "vue";
import App from "./App.vue";
import vpin from "../src/main";

Vue.use(vpin({debug:false}))
Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
