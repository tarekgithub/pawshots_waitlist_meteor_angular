import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import moment from 'moment';
import angularMoment from 'angular-moment';

import './petsList.html';
import { Pets } from '../../../api/pets/index';
import { name as PetRemove } from '../petRemove/petRemove';

class PetsList {
  constructor($scope, $reactive, moment) {
    'ngInject';

    $reactive(this).attach($scope);

    this.subscribe('pets');
    this.moment = moment;
    console.log(moment());

    this.startSlot = moment();
    this.startSlot.minutes(Math.floor(this.startSlot.minutes() / 15) * 15);
    this.startSlot.seconds(0);
    this.endSlot = moment(this.startSlot).add(15, 'minutes');
    console.log(this.startSlot);
    console.log(this.endSlot);

    function callEveryHour() {
      setInterval(() => {
        this.startSlot = moment();
        this.startSlot.minutes(Math.floor(this.startSlot.minutes() / 15) * 15);
        this.startSlot.seconds(0);
        this.endSlot = moment(this.startSlot).add(15, 'minutes');
        console.log(this.startSlot);
        console.log(this.endSlot);
      }, 1000 * 60 * 15);
    }
    const timeDiff = this.endSlot.diff(moment());
    console.log(timeDiff);
    // setTimeout(callEveryHour, timeDiff)
    setTimeout(() => {
      console.log(this.startSlot);
      console.log(this.endSlot);
      this.startSlot = moment();
      this.startSlot.minutes(Math.floor(this.startSlot.minutes() / 15) * 15);
      this.startSlot.seconds(0);
      this.endSlot = moment(this.startSlot).add(15, 'minutes');
      console.log(this.startSlot);
      console.log(this.endSlot);
      $scope.$apply();
      console.log('running timeout');
      setInterval(() => {
        this.startSlot = moment();
        this.startSlot.minutes(Math.floor(this.startSlot.minutes() / 15) * 15);
        this.startSlot.seconds(0);
        this.endSlot = moment(this.startSlot).add(15, 'minutes');
        console.log(this.startSlot);
        console.log(this.endSlot);
        $scope.$apply();
      }, 1000 * 60 * 15);
    }, timeDiff);
    // Set default search status to 'not completed'
    this.search = {};
    this.search.status = 'started';

    // get list of clients & count of clients pending
    this.helpers({
      pets() {
        return Pets.find({});
      },
      petsQueued() {
        const value = [];
        Pets.find({ status: 'queued' }).forEach((pet) => {
          const time = moment();
          time.hour(pet.slotTime.getHours());
          time.minutes(pet.slotTime.getMinutes());
          time.seconds(0);
          console.log(time);
          pet.slotTime = time;
          value.push(pet);
        });
        console.log(value);
        return value;
      },
      count() {
        let petsCount = 0;
        let clientsCount = 0;

        Pets.find({ status: 'started' }).forEach((pet) => {
          petsCount = petsCount + pet.dogs.length;
          clientsCount++;
        });

        return {
          petsCount,
          clientsCount,
        };
      },
      countCompleted() {
        let petsCount = 0;
        let clientsCount = 0;

        Pets.find({ status: 'completed' }).forEach((pet) => {
          petsCount = petsCount + pet.dogs.length;
          clientsCount++;
        });

        return {
          petsCount,
          clientsCount,
        };
      },
    });
  }
}

const name = 'petsList';

// list module
export default angular.module(name, [
  angularMeteor,
  angularMoment,
  uiRouter,
  PetRemove,
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: PetsList,
})
  .config(config);

// show only to logged in user
function config($stateProvider) {
  'ngInject';

  $stateProvider
    .state('pets', {
      url: '/pets',
      template: '<pets-list flex layout="column" layout-fill></pets-list>',
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
