import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './navigation.html';

const name = 'navigation';

// default navigation panel when user not logged in
export default angular.module(name, [
  angularMeteor,
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
});
