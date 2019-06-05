import './plugins/vuetify'
import App from './App.vue'
import VueLogger from 'vuejs-logger'
import { Vue } from 'vue-property-decorator'
const isProduction = process.env.NODE_ENV === 'production'
const wantedLoglevel = process.env.VUE_APP_TFLOG_LOGLEVEL
const options = {
  isEnabled: true,
  logLevel:  wantedLoglevel ? wantedLoglevel : isProduction ? 'error' : 'info',
  stringifyArguments: false,
  showLogLevel: true,
  showMethodName: true,
  separator: '|',
  showConsoleColors: true
}

declare module 'vue-property-decorator' {
  export interface Vue {
    $log: {
      debug(...args: any[]): void;
      info(...args: any[]): void;
      warn(...args: any[]): void;
      error(...args: any[]): void;
      fatal(...args: any[]): void;
    };
  }
}

Vue.use(VueLogger, options)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
