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