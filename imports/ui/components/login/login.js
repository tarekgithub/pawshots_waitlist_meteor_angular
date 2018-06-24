import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import { Meteor } from 'meteor/meteor';

import './login.html';

import { name as Register } from '../register/register';

class Login {
  constructor($scope, $reactive, $state) {
    'ngInject';

    this.$state = $state;

    $reactive(this).attach($scope);

    // credentials to use for login
    this.credentials = {
      email: '',
      password: '',
    };

    this.error = '';
  }

  // login function to trigger user login
  login() {
    Meteor.loginWithPassword(
      this.credentials.email, this.credentials.password,
      this.$bindToContext((err) => {
        if (err) {
          this.error = err;
        } else {
          this.$state.go('pets');
        }
      }),
    );
  }
}

const name = 'login';

// login module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
])
  .component(name, {
    templateUrl: `imports/ui/components/${name}/${name}.html`,
    controllerAs: name,
    controller: Login,
  })
  .config(config);

// login state
function config($stateProvider) {
  'ngInject';

  $stateProvider.state('login', {
    url: '/login',
    template: '<login></login>',
  });
}
