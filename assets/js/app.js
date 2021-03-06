/**
 * Created by maximesenecal on 19/08/2016.
 */
'use strict';

angular.module("notebookApp", [])
  .controller("MainController", function ($scope, $http) {

    $scope.userid = null;
    $scope.notebooks = [];
    $scope.todos = {};

    activate();

    function activate() {
      $http.get('/user/current').then(function (response) {
        if(response.data.error){
          console.log(response.data.error);
        }else{
          $scope.userid = response.data;
          getUserNotebooks($scope.userid);
        }
      });
    }

    /*
     * NOTEBOOKS
     */

    /*
     * Get Notebooks from User
     * Blueprint API populate where
     * GET /:model/:id/:association
     */
    function getUserNotebooks(user_id) {
      $http.get('/user/' + user_id + '/notebooks').then(function (response) {
        $scope.notebooks = response.data;
        for (var i = 0; i < response.data.length; i++) {
          getNotebookTodos(response.data[i].id);
        }
        console.log("Loading notebooks (User : " + user_id + ") from API !");
      });
    }

    $scope.addNotebook = function () {
      var notebook = {
        'title': "My new notebook",
        'owner': $scope.userid
      };
      $http.post('/notebook/create', notebook).then(function (response) {
        console.log("A notebook was added");
        notebook = response.data;
      }, function (res) {
        console.log("An error occurred when adding new notebook");
      });
      $scope.notebooks.unshift(notebook);
    };

    $scope.deleteNotebook = function (notebook, index) {
      $http.delete('/notebook/' + notebook.id, notebook).then(function (res) {
        console.log("The notebook was correctly deleted");
      }, function (res) {
        console.log("An error occurred in removal");
      });
      $scope.notebooks.splice(index, 1);
    };

    $scope.saveNotebook = function (notebook) {
      $http.put('/notebook/' + notebook.id, notebook).then(function (res) {
        console.log("The notebook was saved");
      }, function (res) {
        console.log("An error occurred during updating");
      });
    };

    /*
     * TODOS CRUD
     */
    $scope.addTodo = function (notebook) {
      var todo = {
        'title': "My new todo",
        'content': "Lorem ipsum",
        'owner': notebook.id
      };
      $http.post('/todo/create', todo).then(function (response) {
        todo = response.data;
        console.log("A todo was added in the notebook " + notebook.id + "");
      });
      $scope.todos[notebook.id].unshift(todo);
    };

    function getNotebookTodos(notebook_id) {
      $http.get('/notebook/' + notebook_id + '/todos').then(function (response) {
        $scope.todos[notebook_id] = response.data;
      });
    };

    $scope.saveTodo = function (todo) {
      $http.put('/todo/' + todo.id, todo).then(function (res) {
        console.log("The todo was saved");
      }, function (res) {
        console.log("An error occurred during updating the todo " +todo.id);
      });
    };

    $scope.deleteTodo = function (notebook_id, todo, index) {
      $http.delete('/todo/' + todo.id, todo).then(function (res) {
        console.log("The todo in notebook "+ notebook_id +" was correctly deleted");
      }, function (res) {
        console.log("An error occurred in removal");
      });
      $scope.todos[notebook_id].splice(index, 1);
    };

  });
