import angular from 'angular';
import angularMeteor from 'angular-meteor';

import './petRemove.html';
import { Pets } from '../../../api/pets/index';

class PetRemove {
  constructor($scope, $reactive, $timeout, $mdDialog, $mdMedia) {
    'ngInject';

    this.$mdDialog = $mdDialog;
    this.$mdMedia = $mdMedia;
    this.$timeout = $timeout;

    $reactive(this).attach($scope);
  }

  // show the message to user
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
              <h3 style="color:green; text-align:center;"> Deleted Successfully</h3>
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

  // update the status to deleted
  remove(event) {
    if (this.pet) {
      Pets.update({
        _id: this.pet._id,
      }, {
        $set: {
          status: 'deleted',
        },
      }, (error) => {
        if (error) {
          console.log('Oops, unable to delete the value..');
          this.error = 'Failed to update';
        } else {
          this.openDialog(event);
        }
      });
    }
  }
}

const name = 'petRemove';

// delete module
export default angular.module(name, [
  angularMeteor,
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  bindings: {
    pet: '<',
  },
  controllerAs: name,
  controller: PetRemove,
});
