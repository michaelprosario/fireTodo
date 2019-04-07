<template>
  <div>
      <div>
        <div>Task</div>
        <div><input type="text" id="txtAction" v-model="action"></div>
        <div>Priority</div>
        <div><input type="text" id="txtPriority"  v-model="priority"></div>
        <div>Complexity</div>
        <div><input type="text" id="txtComplexity" v-model="complexity"></div>
        <div>
          <button v-on:click="saveTask()">Save task</button>
        </div>
      </div>
      <br><br><br>
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
  </div>
</template>
<script lang='ts' src="./Todo.ts"></script>
