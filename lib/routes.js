FlowRouter.route('/', {
    name: 'home',
    action() {
      BlazeLayout.render('MainLayout', {main: 'HomeLayout', nav: 'Navbar'});
    }
});

FlowRouter.route('/about', {
    name: 'home',
    action() {
      BlazeLayout.render('MainLayout', {main: 'AboutLayout', nav: 'Navbar'});
    }
});

FlowRouter.route('/profile', {
    name: 'profile',
    action() {
      BlazeLayout.render('MainLayout', {main: 'ProfileLayout', nav: 'Navbar'});
    }
});

FlowRouter.route('/operator', {
    name: 'operator',
    action() {
      BlazeLayout.render('MainLayout', {main: 'OperatorLayout', nav: 'Navbar'});
    }
});