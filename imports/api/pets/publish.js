import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Pets } from './collection';

if (Meteor.isServer) {
  Meteor.publish('pets', function () {
    // Publish the count of pets to not logged in client
    Counts.publish(this, 'numberOfPets', Pets.find({ status: 'started' }), {
      noReady: true,
    });

    // return the pets collection to user
    return Pets.find({});
  });
}
