
FlowRouter.route('/', {
    name: 'home',
    action() {
      BlazeLayout.render('MainLayout', {main: 'HomeLayout', nav: 'Navbar'});
    }
});

FlowRouter.route('/test', {
    // triggersEnter: [function(context, redirect) {
    //   if(!Meteor.user())
    //     redirect('/');
    //   }],
    name: 'home',
    action() {
      BlazeLayout.render('MainLayout', {nav: 'TestLayout'});
    }
});

FlowRouter.route('/about', {
    // triggersEnter: [function(context, redirect) {
    //   if(!Meteor.user())
    //     redirect('/');
    //   }],
    name: 'home',
    action() {
      BlazeLayout.render('MainLayout', {main: 'AboutLayout', nav: 'Navbar'});
    }
});


// function dashboardLink(){
//     var doc = Pairings.findOne({operatorId: Meteor.userId()})

//     if (doc != undefined)
//       var link = '/operatorDashboard/' + doc.userIds[0]
//     else
//         var link = '/operatorDashboard/noCustomers'
    
//     return link
//   }

// function test(param, doc){

//   console.log("Customer ID")
//       console.log(param)
//       console.log("Operator ID")
//       console.log(Meteor.userId())
//       console.log("result")
//       console.log(doc)

//    if(doc != undefined){
//         var customers = doc.userIds
//         for (var i = customers.length - 1; i >= 0; i--) {
//           if(customers[i] == param){
//             console.log("should go to dashboard")
//             BlazeLayout.render('MainLayout', {nocont: 'OperatorDashboardLayout', nav: 'Navbar'});
//             break;
//           } else if( i == 0){
//             FlowRouter.go( dashboardLink() );
//             console.log("NO MATHC FOR CUSTOMER ID")
//           }
//         }
//       } else {
//         FlowRouter.go( dashboardLink() );
//         console.log("User doesn't have a pairing document?!")
//       }
// }


FlowRouter.route('/operatorDashboard/:customer', {
    name: 'home',
    action(params) {
      // console.log("Operator Dashobard Security Check (Accessed function)")
      // // First time this doesn't work properly
      // var doc = Pairings.findOne({operatorId: Meteor.userId()});
      // setTimeout(test(params.customer, doc), 1000000); // check again in a second 
      BlazeLayout.render('MainLayout', {nocont: 'OperatorDashboardLayout', nav: 'Navbar'});
    }
});

FlowRouter.route('/settings', {
    // triggersEnter: [function(context, redirect) {
    //   if(!Meteor.user())
    //     redirect('/');
    //   }],
    name: 'settings',
    action() {
      BlazeLayout.render('MainLayout', {nocont: 'SettingsLayout', nav: 'Navbar'});
    }
});

FlowRouter.route('/op-registration', {
    // triggersEnter: [function(context, redirect) {
    //   if(!Meteor.user())
    //     redirect('/');
    //   }],
    name: 'op-registration',
    action() {
      BlazeLayout.render('MainLayout', {nocont: 'OpRegistrationLayout', nav: 'Navbar'});
    }
});

FlowRouter.route('/op-registration/steps/:step', {
    // triggersEnter: [function(context, redirect) {
    //   if(!Meteor.user())
    //     redirect('/');
    //   }],
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


