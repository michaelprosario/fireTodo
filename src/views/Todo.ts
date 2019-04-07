import Vue from 'vue';
import { TodoDataServices, TodoRecord } from './FireStoreDataServices';

export default Vue.extend({
  name: 'HelloWorld',
  data() {
    return {
      tasks: [],
      action: '',
      complexity: '',
      priority: ''
    }
  },
  created() {
    this.loadTasks();
  },
  methods: {
    saveTask() {
      let todoDataService = new TodoDataServices();
      let todo = new TodoRecord();
      todo.action = this.action;
      todo.complexity = this.complexity;
      todo.priority = this.priority;
      let context = this;
      todoDataService.Add(todo).then(function () {
        context.loadTasks();
      })
    },
    loadTasks() {
      let todoDataService = new TodoDataServices();
      todoDataService.GetAll().then(listData => {
        this.tasks = listData;
      });
    },
    removeTask(record) {
      let todoDataService = new TodoDataServices();
      let context = this;
      todoDataService.Delete(record.id).then(function () {
        context.loadTasks();
      });
    }

  },

});
