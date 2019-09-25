import Vue from "vue";
import { Button, Slider } from "ant-design-vue";
import App from "./App.vue";

import "ant-design-vue/dist/antd.css";

Vue.config.productionTip = false;

Vue.use(Button);
Vue.use(Slider);

new Vue({
  render: h => h(App)
}).$mount("#app");
