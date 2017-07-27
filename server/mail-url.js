Meteor.startup(function(){
    Meteor.Mailgun.config({
      username: 'postmaster@sandbox5f36b1a0f7db41c6bcd9be8a0fc4a50a.mailgun.org',
      password: '156ec2596133e7d6bccad827f683d721'
    });
  });