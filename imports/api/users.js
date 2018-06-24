import { Meteor } from 'meteor/meteor';

// User profile api settings
if (Meteor.isServer) {
  Meteor.publish('users', () => Meteor.users.find({}, {
    fields: {
      emails: 1,
      profile: 1,
    },
  }));
}
