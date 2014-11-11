'use strict';

(function() {

  var app = angular.module('plugin.tab', ['plugin.common', 'plugin.ajax']);

   app.run(function() {
    // Nothing here for the moment but the time to get the list of servers will come sooner or later.
   });

  app.controller('TableController', ['$scope', function($scope){
    this.domains = [
        {
          name: "AD_DOMAIN",
          provider: "Active Directory",
          status: "Validate"
        },
        {
          name: "auth-server",
          provider: "free-ipa",
          status: "Validate"
        }
    ];

  }]);

  app.factory('RefreshManager', ['request', function(request){
    return {
      getDomains: function(){
        request.list();

      }
    };
  }]);

  // Redefine MessageUtil specially for the main tab
  app.factory('tabMessageUtil', ['messageUtil', function(messageUtil){
    return {
      sendMessage: function(action, target){
        var message = {
           source: 'emd-tab',
           action: action,
           target: target
        };

        messageUtil.sendMessageToParent(message);
      }
    };
  }]);


   // Hold all the function to create the dialog windows
   app.factory('dialogManager', ['pluginApi', 'urlUtil', 'cacheService','tabMessageUtil', function (pluginApi, urlUtil, cache, messager) {

      return {
         // Show the Add Dialog Window
         showAddDialog: function () {
            pluginApi.showDialog('Add Domain', 'add-dialog', urlUtil.relativeUrl('add.html'), '780px', '650px',
               {
                  buttons: [
                     {
                        label: 'Cancel',
                        onClick: function() {
                          pluginApi.closeDialog('add-dialog');
                        }
                     },
                     {
                        label: 'Ok',
                        onClick: function() {
                          messager.sendMessage('submit','add-dialog');
                        }
                      }
                  ],
                  resizeEnabled: true,
                  closeIconVisible: false,
                  closeOnEscKey: false
               }
            );
         },

         // Show the Edit Dialog Window
         showEditDialog: function (domain) {
            var dialogName = "Edit " + domain.name;

            cache.setData('domainToEdit', domain);

            pluginApi.showDialog( dialogName, 'edit-dialog', urlUtil.relativeUrl('edit.html'), '780px', '650px',
               {
                  buttons: [
                     {
                        label: 'Cancel',
                        onClick: function() {
                           pluginApi.closeDialog('edit-dialog');
                           cache.removeData('domainToEdit');
                        }
                     },
                     {
                        label: 'Ok',
                        onClick: function() {
                          messager.sendMessage('submit','edit-dialog');
                        }
                      }
                  ],
                  resizeEnabled: true,
                  closeIconVisible: false,
                  closeOnEscKey: false
               }
            );
         },

         // Show the Remove Dialog Window
         showRemoveDialog: function (domain) {
            var dialogName = "Remove " + domain.name;

            cache.setData('domainToRemove',domain);

            pluginApi.showDialog( dialogName, 'remove-dialog', urlUtil.relativeUrl('remove.html'), '450px', '170px',
               {
                  buttons: [
                     {
                        label: 'Cancel',
                        onClick: function() {
                           pluginApi.closeDialog('remove-dialog');
                           cache.removeData('domainToRemove');
                        }
                     },
                     {
                        label: 'Ok',
                        onClick: function() {
                          messager.sendMessage('remove','remove-dialog');
                        }
                      }
                  ],
                  resizeEnabled: true,
                  closeIconVisible: false,
                  closeOnEscKey: false
               }
            );
         },

      };
   }]);

   // Controller to provide the functions to open the dialogs
   app.controller('menuController', ['$scope', 'dialogManager', 'RefreshManager', 'animationService', function ($scope, dialogManager, refreshManager, animationState){
      $scope.openAddDialog = function() {
         dialogManager.showAddDialog();
      };

      $scope.openEditDialog = function(domain) {
         dialogManager.showEditDialog(domain);
      };

      $scope.openRemoveDialog = function(domain) {
         dialogManager.showRemoveDialog(domain);
      };

      $scope.isAnimated = animationState.get();

      $scope.refreshTable = function() {
        refreshManager.getDomains();
        $scope.isAnimated = animationState.set(true);
      };

      $scope.reqRefreshisOver = function() {
        console.log('Refreshing is over, time re-enable the button.');
        $scope.isAnimated = animationState.set(false);
      }


   }]);

   app.service('animationService', function(){
     var isAnimated = false ;
         return {
             set : function(isAnimated) {
                 this.isAnimated = isAnimated;
             },
             get : function() {
                 return this.isAnimated;
             }
         };
   });

  app.service('alertService', function () {
    var type = 'alert-info';
    var msg = 'No information at the the moment.';
    return {
      set : function(type, msg) {
        this.type = type;
        this.msg = msg;
      },
      getType : function() {
        return this.type;
      },
      getMsg : function() {
        return this.msg;
      }
    }
  });

  app.controller('alertController', ['$scope', 'alertService', function($scope, alertService) {
    $scope.type = 'alert-info';
    $scope.msg = 'No information to display at the moment.';
  }]);


})();
