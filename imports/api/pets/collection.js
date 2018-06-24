import { Mongo } from 'meteor/mongo';

export const Pets = new Mongo.Collection('pets');

// Allowed actions for the user
Pets.allow({
  insert(pet) {
    return true;
  },
  update(userId, pet, fields, modifier) {
    return userId !== null;
  },
});
