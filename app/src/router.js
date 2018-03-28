import Vue from 'vue';
import Router from 'vue-router';
import home from './views/home.vue';
import notes from './views/notes.vue';
import note from './views/note.vue'

Vue.use(Router);

export default new Router({
  mode:'history',
  hashbang:false,
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
    },
    {
      path: '/notes/:id',
      name: 'note',
      component: note
    }
  ],
});
