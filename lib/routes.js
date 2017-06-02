FlowRouter.route('/', {
    name: 'home',
    action() {
      BlazeLayout.render('MainLayout', {main: 'HomeLayout', nav: 'Navbar'});
    }
});

FlowRouter.route('/test', {
    // triggersEnter: [AccountsTemplates.ensureSignedIn],
    name: 'home',
    action() {
      BlazeLayout.render('MainLayout', {main: 'TestLayout'});
    }
});

FlowRouter.route('/about', {
    // triggersEnter: [AccountsTemplates.ensureSignedIn],
    name: 'home',
    action() {
      BlazeLayout.render('MainLayout', {main: 'AboutLayout', nav: 'Navbar'});
    }
});

FlowRouter.route('/profile', {
    // triggersEnter: [AccountsTemplates.ensureSignedIn],
    name: 'profile',
    action() {
      BlazeLayout.render('MainLayout', {nocont: 'ProfileLayout', nav: 'Navbar'});
    }
});

FlowRouter.route('/op-registration', {
    // triggersEnter: [AccountsTemplates.ensureSignedIn],
    name: 'op-registration',
    action() {
      BlazeLayout.render('MainLayout', {nocont: 'OpRegistrationLayout', nav: 'Navbar'});
    }
});

FlowRouter.route('/op-registration/steps/:step', {
    // triggersEnter: [AccountsTemplates.ensureSignedIn],
    name: 'OpRegStepsLayout',
    action() {
        // pass form the form type from the link
        BlazeLayout.render('MainLayout', {nocont: 'OpRegStepsLayout', nav: 'Navbar'});
    }
});

FlowRouter.route( '/verify-email/:token', {
  name: 'verify-email',
  action( params ) {
    Accounts.verifyEmail( params.token, ( error ) =>{
      if ( error ) {
        FlowRouter.go( '/' );
          Materialize.toast(error.reason, 1000)
      } else {
        FlowRouter.go( '/' );
        
        var account = Meteor.users.findOne({_id: Meteor.userId()})
        var emailsCount = account.emails.length
        console.log("Current Number of Emails")
        console.log(emailsCount)
        if (emailsCount > 1){
          Materialize.toast('Your email has been verified and updated', 1000)
            var oldEmail = account.emails[0].address
            console.log("Old email should be removed")
            
            Meteor.call('removeEmail', Meteor.userId(), oldEmail)
        } else {
            Materialize.toast('Email verified!', 1000)
        }
        
      }
    });
  }
});