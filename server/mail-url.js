Meteor.startup(function(){
    Meteor.Mailgun.config({
      username: 'postmaster@mail.tamerny.com',
      password: '4deb7cfc6a52f647f3e0849bbbb8e062'
    });
  });