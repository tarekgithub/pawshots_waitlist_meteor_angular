import angular from 'angular';
import angularMeteor from 'angular-meteor';
import ngMaterial from 'angular-material';
import uiRouter from 'angular-ui-router';
import angularMessages from 'angular-messages';

import './shop.html';
import { name as PetAdd } from '../petAdd/petAdd';

import { name as PetsList } from '../petsList/petsList';
import { name as PetDetails } from '../petDetails/petDetails';
import { name as PetEdit } from '../petEdit/petEdit';
import { name as Navigation } from '../navigation/navigation';
import { name as Auth } from '../auth/auth';

class Shop {}

const name = 'shop';

// root module - loading all the required module
export default angular.module(name, [
  angularMeteor,
  ngMaterial,
  angularMessages,
  uiRouter,
  PetAdd,
  PetsList,
  PetDetails,
  PetEdit,
  Navigation,
  Auth,
  'accounts.ui',
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: Shop,
})
  .config(config)
  .run(run);

function config($locationProvider, $urlRouterProvider, $mdIconProvider, $mdThemingProvider) {
  'ngInject';

  $locationProvider.html5Mode(true);

  // default url routing
  $urlRouterProvider.otherwise('/add');

  // theme config settings - change theme settings here
  $mdThemingProvider.theme('default')
    .primaryPalette('grey', {
      default: '800',
    })
    .accentPalette('amber', {
      default: 'A700',
    });

  // icon set to use in project
  const iconPath = '/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/';

  $mdIconProvider
    .iconSet(
      'social',
      `${iconPath}svg-sprite-social.svg`,
    )
    .iconSet(
      'action',
      `${iconPath}svg-sprite-action.svg`,
    )
    .iconSet(
      'communication',
      `${iconPath}svg-sprite-communication.svg`,
    )
    .iconSet(
      'content',
      `${iconPath}svg-sprite-content.svg`,
    )
    .iconSet(
      'toggle',
      `${iconPath}svg-sprite-toggle.svg`,
    )
    .iconSet(
      'navigation',
      `${iconPath}svg-sprite-navigation.svg`,
    )
    .iconSet(
      'image',
      `${iconPath}svg-sprite-image.svg`,
    );
}

function run($rootScope, $state) {
  'ngInject';

  // default page if not logged in
  $rootScope.$on(
    '$stateChangeError',
    (event, toState, toParams, fromState, fromParams, error) => {
      if (error === 'AUTH_REQUIRED') {
        $state.go('addPets');
      }
    },
  );
}
