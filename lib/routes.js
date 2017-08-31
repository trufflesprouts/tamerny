
FlowRouter.route('/', {
    triggersEnter: [function(context, redirect) {
      if(Meteor.user() || Meteor.loggingIn())
        redirect('/profile');
    }],
    name: 'home',
    action() {
      BlazeLayout.render('HomeLayout');
    }
});

FlowRouter.route('/join', {
    triggersEnter: [function(context, redirect) {
      if(Meteor.user() || Meteor.loggingIn())
        redirect('/profile');
    }],
    name: 'home',
    action() {
      BlazeLayout.render('JoinLayout');
    }
});

FlowRouter.route('/profile', {
    triggersEnter: [function(context, redirect) {
      if(!Meteor.user() && !Meteor.loggingIn())
        redirect('/');
      }],
    name: 'profile',
    action() {
      BlazeLayout.render('MainLayout', {main: 'ProfileLayout', nav: 'SideNav'});
    }
});

FlowRouter.route('/test', {
    triggersEnter: [function(context, redirect) {
      if(!Meteor.user() && !Meteor.loggingIn())
        redirect('/');
      }],
    name: 'home',
    action() {
      BlazeLayout.render('MainLayout', {main: 'TestLayout', nav: 'Navbar'});
    }
});

FlowRouter.route('/reset_pass_link', {
    name: 'reset_pass',
    action() {
      BlazeLayout.render('ResetPassLinkLayout');
    }
});

FlowRouter.route('/reset-password/:token', {
    triggersEnter: [function(context, redirect) {
      if(Meteor.userId() != null)
        redirect('/');
      }],
    name: 'reset_pass',
    action() {
      BlazeLayout.render('ResetPassLayout');
    }
});


FlowRouter.route('/operatorDashboard/:customer', {
    triggersEnter: [function(context, redirect) {
      console.log("Meteor.userId()")
      console.log(Meteor.userId())
      if(!Meteor.user() && !Meteor.loggingIn()) // Role checking in "SecureDashboardLink" in client main.js
        redirect('/');
      }],
    name: 'home',
    action(params) {
      BlazeLayout.render('MainLayout', {dashboardCont: 'OperatorDashboardLayout', nav: 'SideNav'});
    }
});

FlowRouter.route('/sales', {
    triggersEnter: [function(context, redirect) {
      if(!Meteor.user() && !Meteor.loggingIn())
        redirect('/');
      }],
    name: 'sales',
    action() {
      BlazeLayout.render('MainLayout', {main: 'SalesLayout', nav: 'SideNav'});
    }
});

FlowRouter.route('/performance', {
    triggersEnter: [function(context, redirect) {
      if(!Meteor.user() && !Meteor.loggingIn())
        redirect('/');
      }],
    name: 'performance',
    action() {
      BlazeLayout.render('MainLayout', {main: 'PerformanceLayout', nav: 'SideNav'});
    }
});

FlowRouter.route('/achievements', {
    triggersEnter: [function(context, redirect) {
      if(!Meteor.user() && !Meteor.loggingIn())
        redirect('/');
      }],
    name: 'performance',
    action() {
      BlazeLayout.render('MainLayout', {main: 'AchievementsLayout', nav: 'SideNav'});
    }
});

FlowRouter.route('/settings', {
    triggersEnter: [function(context, redirect) {
      if(!Meteor.user() && !Meteor.loggingIn())
        redirect('/');
      }],
    name: 'settings',
    action() {
      BlazeLayout.render('MainLayout', {main: 'SettingsLayout', nav: 'SideNav'});
    }
});

FlowRouter.route('/op-registration', {
    triggersEnter: [function(context, redirect) {
      if(!Meteor.user() && !Meteor.loggingIn())
        redirect('/');
    }],
    name: 'op-registration',
    action() {
      BlazeLayout.render('MainLayout', {main: 'OpRegistrationLayout', nav: 'SideNav'});
    }
});

FlowRouter.route('/op-registration/steps/:step', {
    triggersEnter: [function(context, redirect) {
      if(!Meteor.user() && !Meteor.loggingIn())
        redirect('/');
      }],
    name: 'OpRegStepsLayout',
    action() {
        BlazeLayout.render('MainLayout', {main: 'OpRegStepsLayout', nav: 'SideNav'});
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

FlowRouter.route('/payment', {
    name: 'payment',
    action() {
      BlazeLayout.render('Payment');
    }
});
