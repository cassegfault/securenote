import Vue from 'vue';
import Router from 'vue-router';
import home from './views/home.vue';
import notes from './views/notes.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: home,
    },
    {
      path: '/notes',
      name: 'notes',
      component: notes
    }
  ],
});
