// Generated by CoffeeScript 1.10.0
(function() {
  var module;

  module = angular.module("imagination.profile.controllers", ['imagination.profile.services', 'commons.base.services', 'commons.catalog.services', 'commons.accounts.services', 'commons.base.controllers', 'imagination.catalog.controllers']);

  module.controller("ImaginationProfileListCtrl", function($scope, $controller, Profile) {
    angular.extend(this, $controller('AbstractListCtrl', {
      $scope: $scope
    }));
    return $scope.refreshList = function() {
      return $scope.profiles = Profile.one().getList().$object;
    };
  });

  module.controller("ImaginationProfileCtrl", function($scope, $stateParams, Profile, Project, ObjectProfileLink, PostalAddress, TaggedItem) {
    return Profile.one($stateParams.id).get().then(function(profileResult) {
      $scope.profile = profileResult;
      $scope.preparedInterestTags = [];
      $scope.preparedSkillTags = [];
      $scope.member_projects = [];
      $scope.member_resources = [];
      $scope.fan_projects = [];
      $scope.fan_resources = [];
      ObjectProfileLink.getList({
        content_type: 'project',
        profile__id: $scope.profile.id
      }).then(function(linkedProjectResults) {
        return angular.forEach(linkedProjectResults, function(linkedProject) {
          return Project.one().get({
            id: linkedProject.object_id
          }).then(function(projectResults) {
            if (projectResults.objects.length === 1) {
              if (linkedProject.level === 0) {
                $scope.member_projects.push(projectResults.objects[0]);
                return angular.forEach(projectResults.objects[0].tags, function(projectTag) {
                  console.log("interest tags : ", projectTag);
                  return $scope.preparedInterestTags.push({
                    text: projectTag.tag.name,
                    taggedItemId: projectTag.id
                  });
                });
              } else if (linkedProject.level === 2) {
                return $scope.fan_projects.push(projectResults.objects[0]);
              }
            }
          });
        });
      });
      angular.forEach($scope.profile.tags, function(taggedItem) {
        return $scope.preparedInterestTags.push({
          text: taggedItem.tag.name,
          taggedItemId: taggedItem.id
        });
      });
      $scope.addTagToProfile = function(tag_type, tag) {
        return TaggedItem.one().customPOST({
          tag: tag.text
        }, "profile/" + $scope.profile.id, {});
      };
      $scope.removeTagFromProfile = function(tag) {
        return TaggedItem.one(tag.taggedItemId).remove();
      };
      $scope.updateProfile = function(resourceName, resourceId, fieldName, data) {
        var putData;
        putData = {};
        putData[fieldName] = data;
        switch (resourceName) {
          case 'Profile':
            return Profile.one(resourceId).patch(putData);
          case 'PostalAddress':
            return PostalAddress.one(resourceId).patch(putData);
        }
      };
      return $scope.updateSocialNetworks = function(profileSlug, socials) {
        "FIXME : add socials fields to generic Profiles object";
        return Profile.one(profileSlug).patch(socials);
      };
    });
  });

}).call(this);
