import Vue from 'vue';
import Router from 'vue-router';
import ProposalChel from '@/components/ProposalChel';
import ProposalEkb from '@/components/ProposalEkb';
import ProposalSpb from '@/components/ProposalSpb';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/chel',
      name: 'ProposalChel',
      component: ProposalChel,
    },
    {
      path: '/ekb',
      name: 'ProposalEkb',
      component: ProposalEkb,
    },
    {
      path: '/spb',
      name: 'ProposalSpb',
      component: ProposalSpb,
    },
    // {
    //   path: '/:productId',
    //   name: 'Product',
    //   component: Product,
    // },
  ],
});
