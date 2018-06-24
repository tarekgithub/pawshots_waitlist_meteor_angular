import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';


import { Meteor } from 'meteor/meteor';

import './petEdit.html';
import { Pets } from '../../../api/pets/index';

class PetEdit {
  constructor($stateParams, $scope, $reactive, $timeout, $mdDialog, $mdMedia, $state) {
    'ngInject';

    this.$mdDialog = $mdDialog;
    this.$mdMedia = $mdMedia;
    this.$timeout = $timeout;
    this.$state = $state;

    $reactive(this).attach($scope);

    this.petId = $stateParams.petId;

    this.subscribe('pets');
    this.subscribe('users');

    this.helpers({
      pet() {
        return Pets.findOne({
          _id: $stateParams.petId,
        });
      },
    });
  }

  // to show the user a dialog message
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

  // to update the client details
  save(event) {
    if (this.pet.status === 'queued') {
      if (this.pet.slotTime === undefined || this.pet.slotTime === null) {
        console.log('slotTime not set');
        this.error = 'Failed to update - Slot time not set';
        return false;
      }
    } else {
      this.pet.slotTime = null;
    }
    console.log('slotTime');
    console.log(this.pet.slotTime);

    Pets.update({
      _id: this.pet._id,
    }, {
      $set: {
        dogs: angular.copy(this.pet.dogs),
        paymentStatus: this.pet.paymentStatus,
        owner: this.pet.owner,
        notes: this.pet.notes,
        status: this.pet.status,
        slotTime: this.pet.slotTime,
      },
    }, (error) => {
      if (error) {
        console.log('Oops, unable to update the value..');
        this.error = 'Failed to update';
      } else {
        this.error = '';
        this.openDialog(event);
        this.$state.go('petDetails', { petId: this.pet._id });
      }
    });
  }

  // to delete a dog from the array`
  deleteDog(dog) {
    // skip delete if only one dog
    if (this.pet.dogs.length === 1) return false;

    for (let i = 0; i < this.pet.dogs.length; i++) {
      if (this.pet.dogs[i] === dog) {
        this.pet.dogs.splice(i, 1);
      }
    }
  }

  // to add new dog nto the array
  addDog() {
    this.pet.dogs.push({ name: '' });
  }
}

const name = 'petEdit';

// edit pet details module
export default angular.module(name, [
  angularMeteor,
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: PetEdit,
})
  .config(config);

// show only for logged in user
function config($stateProvider) {
  'ngInject';

  $stateProvider.state('petDetailsEdit', {
    url: '/pets/:petId/edit',
    template: '<pet-edit></pet-edit>',
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
