Meteor.startup(function(){
    Meteor.Mailgun.config({
      username: 'postmaster@sandbox47aff26333624bb8b16b11df39bcae5c.mailgun.org',
      password: '497f3e1c76032949cef09e164b9db0ad'
    });
  });