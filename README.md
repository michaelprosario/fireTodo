A friend of mine from our local Google developer group requested that we cover content that would help during a hackathon.  In particular, he had become curious about learning patterns for back-end development.  With this in mind, I wanted to share some content around Vue and Google FireStore. 

## Motivations for using VueJS+FireStore

VueJS has become respected for it's simplicity and speed.  In contrast with Angular, it has a lower concept count making it easier to learn.  

Google FireStore, a non-SQL platform as a service, provides a robust and scalable tool for building web and mobile apps.  The platform provides features for data storage, analytics, identity, authorization, and more.  I'm convinced that it's a great prototyping platform.  FireStore has a very generous free tier. It's worth checking out.  In this post, we'll walk through the process of building a small todo app using VueJS, FireStore, VueCLI, and TypeScript. 


## Setup of vue/typescript/cli 

To get started, install VueCLI. This command line tool makes it easy to scaffold Vue projects.  You can explore the Vue setup process using the following resource.  It should be noted that I selected TypeScript for my project setup.

https://cli.vuejs.org/guide/creating-a-project.html#vue-create

## Major parts of Todo.vue



```html
<template>
  <div>
    ...
  </div>
</template>
<script lang='ts' src="./Todo.ts"></script>

```

## Form to capture todo

```html
<div>Task</div>
<div><input type="text" id="txtAction" v-model="action"></div>
<div>Priority</div>
<div><input type="text" id="txtPriority"  v-model="priority"></div>
<div>Complexity</div>
<div><input type="text" id="txtComplexity" v-model="complexity"></div>
<div><button v-on:click="saveTask()">Save task</button></div>
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

## Adding behavior to Todo.vue

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

## TodoDataService

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
