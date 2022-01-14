import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/body/:id',
    name: 'ViewPage',
    component: () => import('@/views/ViewPage.vue'),
  },
  {
    path: '/',
    name: 'Main',
    component: () => import('@/views/MainPage.vue'),
  },
  {
    path: '/*',
    redirect: '/',
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
