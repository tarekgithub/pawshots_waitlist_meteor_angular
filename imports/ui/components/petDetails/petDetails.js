import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import ngclipboard from 'ngclipboard';
import { Meteor } from 'meteor/meteor';

import './petDetails.html';
import { Pets } from '../../../api/pets/index';

class PetDetails {
  constructor($stateParams, $scope, $reactive, $timeout, $mdDialog, $mdMedia, $state, $mdToast) {
    'ngInject';

    this.$mdDialog = $mdDialog;
    this.$mdMedia = $mdMedia;
    this.$timeout = $timeout;
    this.$state = $state;
    this.$mdToast = $mdToast;

    $reactive(this).attach($scope);

    this.petId = $stateParams.petId;

    this.subscribe('pets');
    this.subscribe('users');

    // find the list of pets
    this.helpers({
      pet() {
        return Pets.findOne({
          _id: $stateParams.petId,
        });
      },
    });
  }

  // show the dialog message to user
  openDialog(event) {
    this.$mdDialog.show({
      controller($mdDialog, $timeout) {
        'ngInject';

        this.close = () => {
          $mdDialog.hide();
        };

        $timeout(() => {
          $mdDialog.hide();
        }, 1000);
      },
      controllerAs: 'successDialog',
      template: `
      <md-dialog aria-label="message"  ng-cloak>
          <md-dialog-content>
            <div class="md-dialog-content">
              <h3 style="color:green; text-align:center;"> Successfully Updated </h3>
            </div>
          </md-dialog-content>
          <md-dialog-actions layout="row">
            <md-button ng-click="successDialog.close()">Close</md-button>
          </md-dialog-actions>
      </md-dialog>
      `,
      targetEvent: event,
      parent: angular.element(document.body),
      clickOutsideToClose: true,
      fullscreen: this.$mdMedia('sm') || this.$mdMedia('xs'),
    });
  }

  // update the value in the db
  save(event) {
    Pets.update({
      _id: this.pet._id,
    }, {
      $set: {
        dogs: angular.copy(this.pet.dogs),
        paymentStatus: this.pet.paymentStatus,
        owner: this.pet.owner,
        notes: this.pet.notes,
        status: this.pet.status,
        completed: this.pet.completed,
      },
    }, (error) => {
      if (error) {
        console.log('Oops, unable to update the value..');
        this.error = 'Failed to update';
      } else {
        this.error = '';
        this.openDialog(event);
        this.$state.go('pets');
      }
    });
  }

  // to update the client as completed
  done(event) {
    this.pet.status = 'completed';
    this.pet.completed = Date.now();
    this.save(event);
    this.$state.go('pets');
  }

  onSuccess(e) {
    this.$mdToast.show(this.$mdToast.simple()
      .textContent('Copied to clipboard')
      .position('bottom right')
      .hideDelay(3000));

    e.clearSelection();
  }

  onError(e) {
    console.error('Action:', e.action);
    console.error('Trigger:', e.trigger);
    this.$mdToast.show(this.$mdToast.simple()
      .textContent('Failed to copy!')
      .position('bottom right')
      .hideDelay(3000));
  }
}

const name = 'petDetails';

// details module
export default angular.module(name, [
  angularMeteor,
  ngclipboard,
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: PetDetails,
})
  .config(config);

// allow only signed in user
function config($stateProvider) {
  'ngInject';

  $stateProvider.state('petDetails', {
    url: '/pets/:petId',
    template: '<pet-details></pet-details>',
    resolve: {
      currentUser($q) {
        if (Meteor.userId() === null) {
          return $q.reject('AUTH_REQUIRED');
        }
        return $q.resolve();
      },
    },
  });
}
