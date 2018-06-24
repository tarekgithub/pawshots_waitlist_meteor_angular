import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

// Server code to run during start of application
Meteor.startup(() => {
  // Change to stronger passwords
  const usersCredentials = [
    {
      email: 'adnan4@gmail.com',
      password: 'Password123',
    },
    {
      email: 'adnan5@gmail.com',
      password: 'Password456',
    },
    {
      email: 'adnan6@gmail.com',
      password: 'Password789',
    },
  ];

    // Check if the user exist or else create the user
  usersCredentials.forEach((credentials) => {
    const userExist = Meteor.users.find({ 'emails.address': credentials.email }, { limit: 1 }).count() > 0;

    if (userExist) {
      console.log('User Found');
    } else {
      Accounts.createUser(credentials);
      console.log('Account Created');
    }
  });

  // Disable signups
  Accounts.config({
    forbidClientAccountCreation: true,
  });
});
