import Vue from 'vue';
import Router from 'vue-router';
import Todo from './views/Todo.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'todo',
      component: Todo,
    },
  ],
});
