A friend of mine from our local Google developer group(GDG) requested that we cover content that would help during a hackathon.  In particular, he had become curious about learning patterns for rapid back-end prototyping.  With this in mind, I wanted to share some content around Vue and Google FireStore. 

## Motivations for using VueJS+FireStore

VueJS has become respected for it's simplicity and speed.  In contrast with Angular, it has a lower concept count making it easier to learn.  

https://vuejs.org/

Google FireStore, a no-SQL platform as a service, provides a robust and scalable tool for building web and mobile apps.  The platform provides features for data storage, analytics, identity, authorization, and more.  I'm convinced that it's a great prototyping platform.  FireStore has a very generous free tier. It's worth checking out.  In this post, we'll walk through the process of building a small todo app using VueJS, FireStore, VueCLI, and TypeScript. 

https://firebase.google.com/docs/firestore/

## Setup of vue/typescript/cli 

To get started, install VueCLI. This command line tool makes it easy to scaffold Vue projects.  You can explore the Vue setup process using the following resource.  It should be noted that I selected TypeScript for my project setup.

https://cli.vuejs.org/guide/creating-a-project.html#vue-create

## Major parts of Todo.vue

Please note that you can review the completed demo code at the following github repo: https://github.com/michaelprosario/fireTodo

In the 'src\views' directory of the project, we created a template called Todo.vue.  I like keeping my TypeScript in a different file from the markup.  In the last line of the Todo.vue, we implement a script reference to 'Todo.ts' and created the file.

```html
<template>
  <div>
    ...
  </div>
</template>
<script lang='ts' src="./Todo.ts"></script>

```

## Form to capture todo

In the following code, we setup a very simple form in Todo.vue to capture a new item.  In this context, a todo item has an action, complexity, and priority as strings. You'll notice the 'v-model' attributes that bind the content of the text boxes to their respective component properties.  We've also added a 'saveTask' method to commit the todo item to the database.


```html
<div>Task</div>
<div><input type="text" id="txtAction" v-model="action"></div>
<div>Priority</div>
<div><input type="text" id="txtPriority"  v-model="priority"></div>
<div>Complexity</div>
<div><input type="text" id="txtComplexity" v-model="complexity"></div>
<div><button v-on:click="saveTask()">Save task</button></div>
```

## Adding behavior to Todo.vue

Let's checkout the implementation of Todo.ts to see how we manage data at a high level.  In the data section, we initialize the state of our component.  We set the tasks collection to an empty array.  We also initialize our form properties to empty strings.  In the architecture of Angular, I really appreciate how data operations get encapsulated into services.  I've tried to model this practice in this demo code.   All the FireStore database operations are encapsulated in a class called TodoDataServices.   In the 'saveTask' method, we create an instance of this service, populate a todo record, and store it using the data service.  When the add operation completes, we re-load the list.

```javascript
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

```

## TodoDataService

There's not a lot of complexity in the TodoDataService.   The 'add' method passes the todo record to a class called FireStoreDataServices.  This class helps create re-usable code fore Google FireStore operations.   In the add call, we pass the todo record and the name of the database table or collection.

```javascript
export class TodoDataServices{

    dataServices: FireStoreDataServices;
    constructor(){
        this.dataServices = new FireStoreDataServices();
    }

    Add(todo: TodoRecord){
        var data = JSON.parse(JSON.stringify(todo));  // not sure why this hack is needed
        return this.dataServices.addRecord(data, "tasks");
    }

    Delete(recordId: string){
        return this.dataServices.deleteRecord(recordId, "tasks");
    }

    GetAll(){
        return this.dataServices.getAll("tasks", DocToTodoRecordMap);
    }
}
```

## FireStoreDataServices

```javascript
import db from './FirebaseConfig';

export class FireStoreDataServices {

    addRecord(recordObject: any, tableName: string) {
        return new Promise(function (resolve, reject) {  
            // implement add
        });
    }

    updateRecord(recordObject: any, tableName: string) {
        return new Promise(function (resolve, reject) {
            // implement update
        });
    }

    getRecord(recordID: string, tableName: string, docToRecordMap) {
        return new Promise(function (resolve, reject) {
            // implement get record
        });
    }

    deleteRecord(recordID: string, tableName: string) {
        return new Promise(function (resolve, reject) {
            // implement delete

        });
    }

    getAll(tableName: string, docToRecordMap) {
        return new Promise(function (resolve, reject) {
            // implement get all
        });
    }
}
```

## Adding Stuff

```javascript
addRecord(recordObject: any, tableName: string) {
    return new Promise(function (resolve, reject) {            
        db.collection(tableName).add(recordObject).then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
            resolve(docRef.id);
        })
        .catch(function (error) {
            console.error("Error adding document: ", error);
            reject(error);
        });
    });
}
```














## List todo items

```html
<table  class='table'>
<tr>
    <td>Action</td>
    <td>Priority</td>
    <td>Complexity</td>
</tr>
<tr v-for='task in tasks' v-bind:key='task.id'>
    <td>{{task.action}}</td>
    <td>{{task.complexity}}</td>
    <td>{{task.priority}}</td>
    <td >
    <button v-on:click="removeTask(task)">Delete</button>
    </td>
</tr>
</table>
```


## Todo class
```javascript
export class TodoRecord{
    id: string = '';
    action: string = '';
    priority: string = '';
    complexity: string = '';
}
```

## Mapping Firebase document too Todo class

```javascript
export function DocToTodoRecordMap(doc) : TodoRecord {
    var rowData = doc.data();
    var record = {
        id: doc.id,
        action: rowData.action,
        priority: rowData.priority,
        complexity: rowData.complexity
    };
    
    return record;
}
```






## Delete Stuff

```javascript
deleteRecord(recordID: string, tableName: string) {
    return new Promise(function (resolve, reject) {

        db.collection(tableName).doc(recordID).delete().then(function (doc) {
            resolve();
        }).catch(function (error) {
            reject(error);
        });
    });
}
}
```

## Get All The Things

```javascript
getAll(tableName: string, docToRecordMap) {
    return new Promise(function (resolve, reject) {

        var records = [];
        db.collection(tableName)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    records.push(docToRecordMap(doc));
                });

                resolve(records);
            });
    });
}
```

## Configure Google FireStore

```javascript
import firebase from 'firebase'
import 'firebase/firestore'

// Initialize Firebase
  var config = {
    apiKey: "...",
    authDomain: "changeme.firebaseapp.com",
    databaseURL: "https://changeme.firebaseio.com",
    projectId: "changeme",
    storageBucket: "changeme.appspot.com",
    messagingSenderId: "..."
};

const firebaseApp = firebase.initializeApp(config);

export default firebaseApp.firestore();
```
