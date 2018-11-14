/* global ga, __GOOGLE_ANALYTICS_ID__ */

import BootstrapVue from 'bootstrap-vue';
import VeeValidate from 'vee-validate';
import { VueSpinners } from '@saeris/vue-spinners';

export default ({ Vue, router }) => {
  if (typeof window !== 'undefined' && __GOOGLE_ANALYTICS_ID__) {
    (function (i, s, o, g, r, a, m) {
      i.GoogleAnalyticsObject = r;
      i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments);
      };
      i[r].l = 1 * new Date();
      a = s.createElement(o);
      m = s.getElementsByTagName(o)[0];
      a.async = 1;
      a.src = g;
      m.parentNode.insertBefore(a, m);
    })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

    ga('create', __GOOGLE_ANALYTICS_ID__, 'auto');
    ga('set', 'anonymizeIp', true);
    ga('send', 'pageview');

    router.afterEach(function (to) {
      ga('set', 'page', to.fullPath);
      ga('send', 'pageview');
    });
  }

  Vue.use(BootstrapVue);
  Vue.use(VeeValidate);
  Vue.use(VueSpinners);
};
