// Generated by CoffeeScript 1.10.0
(function() {
  var module;

  module = angular.module("commons.ucomment.controllers", ['commons.ucomment.services', 'commons.base.services']);

  module.controller("CommentCtrl", function($scope, $rootScope, Comment, DataSharing) {
    "controlling comments attached to a resource. ";
    $scope.newcommentForm = {
      text: ""
    };
    $scope.init = function(objectTypeName) {
      $scope.objectTypeName = objectTypeName;
      console.log(" Shared Object ? ", DataSharing.sharedObject);
      $scope.object = DataSharing.sharedObject[$scope.objectTypeName];
      if ($scope.object) {
        $scope.refreshComments($scope.objectTypeName, $scope.object.id);
      }
      return $scope.$watch(function() {
        return DataSharing.sharedObject;
      }, function(newVal, oldVal) {
        console.log(" Updating Shared Object : new =" + newVal + " old = " + oldVal);
        if (newVal !== oldVal) {
          $scope.object = newVal[$scope.objectTypeName];
          return $scope.refreshComments($scope.objectTypeName, $scope.object.id);
        }
      });
    };
    $scope.refreshComments = function(objectTypeName, objectId) {
      return $scope.comments = Comment.one().customGETLIST(objectTypeName + '/' + objectId).$object;
    };
    $scope.isCommentAuthor = function(comment) {
      "To check wether connected user is comment's author";
      if ($rootScope.authVars.username === comment.user.username) {
        return true;
      } else {
        return false;
      }
    };
    $scope.removeComment = function(index) {
      "Remove comment placed at scope array index";
      return Comment.one($scope.comments[index].id).remove().then(function(data) {
        return $scope.comments.splice(index, 1);
      });
    };
    $scope.flagComment = function(index) {
      return Comment.one($scope.comments[index].id).customPOST({}, 'flag/').then(function(data) {
        return $scope.comments[index].flags.push({
          flag: 'flagged'
        });
      });
    };
    return $scope.postComment = function() {
      return Comment.one().customPOST({
        comment_text: $scope.newcommentForm.text
      }, $scope.objectTypeName + '/' + $scope.object.id).then(function(newcomment) {
        $scope.comments.push(newcomment);
        $scope.newcommentForm.text = '';
        return $scope.commenting = false;
      });
    };
  });

}).call(this);
