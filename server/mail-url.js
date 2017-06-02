Meteor.startup(function(){
    Meteor.Mailgun.config({
      username: 'postmaster@tamerny.com',
      password: '7b6aa71c66ddb30e32b5b96af0e5d1d9'
    });
  });