import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Meteor } from 'meteor/meteor';

import './petAdd.html';
import { Pets } from '../../../api/pets/index';

class PetAdd {
  constructor($scope, $reactive, $mdDialog, $mdMedia) {
    'ngInject';

    this.$mdDialog = $mdDialog;
    this.$mdMedia = $mdMedia;

    $reactive(this).attach($scope);

    // initial setting of the data
    this.pet = {
      dogs: [{
        name: '',
      }],
    };

    this.subscribe('pets');

    this.helpers({
      // to fetch clients in queue count
      clientsCount() {
        return Counts.get('numberOfPets');
      },
    });
  }

  submit(regForm, event) {
    // Setting default status
    this.pet.status = 'started';
    this.pet.created = Date.now();
    console.log("pet info: ", this.pet);
    // checking if the form is valid
    if (regForm.$valid) {
      console.log("anuglar copy: ", angular.copy(this.pet));
      Pets.insert(angular.copy(this.pet));
      this.reset(regForm);
      this.openDialog(event, this.clientsCount);
    }
  }

  // to reset the form data &  validation checks
  reset(regForm) {
    this.pet = {
      dogs: [{
        name: '',
      }],
    };
    regForm.$setPristine();
    regForm.$setUntouched();
  }

  // to add new dog nto the array
  addDog() {
    this.pet.dogs.push({ name: '' });
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

  // to show a dialog message to the user
  openDialog(event) {
    const clientsCount = this.clientsCount;
    let post = '';
    if (clientsCount + 1 === 1) {
      post = 'st';
    } else if (clientsCount + 1 === 2) {
      post = 'nd';
    } else if (clientsCount + 1 === 3) {
      post = 'rd';
    } else {
      post = 'th';
    }

    this.$mdDialog.show({
      controller($mdDialog, $timeout) {
        'ngInject';

        // show the position in the queue
        this.count = clientsCount;
        this.post = post;
        this.close = () => {
          $mdDialog.hide();
        };

        $timeout(() => {
          $mdDialog.hide();
        }, 5000);
      },
      controllerAs: 'successDialog',
      template: `
      <md-dialog aria-label="message"  ng-cloak>
          <md-dialog-content>
            <div class="md-dialog-content">
            <h2 style="color:green; text-align:center;"> Thank You </h2>
            <p style="text-align:center;"> You are {{successDialog.count + 1}}{{successDialog.post}} in line</p>
            <p style="text-align:center;"> We will call your name shortly</p>
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
}

const name = 'petAdd';

// pet add module
export default angular.module(name, [
  angularMeteor,
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: PetAdd,
})
  .config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider
    .state('addPets', {
      url: '/add',
      template: '<pet-add></pet-add>',
    });
}
