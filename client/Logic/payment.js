/*
This client side JS file contains the logic for payment in Payment.html

Templates:
  1. Payment

*/

// Section I: Importing collections from MongoDB

import { UserProfiles } from '../../collections/userProfiles.js';
import { Payments } from '../../collections/payments.js';

// Section III: Functions

function userInfo() {
  var url = self.location.href;

  var index = url.indexOf('?uid=') + 5;
  var end = index + 17;

  var uId = url.slice(index, end);
  var doc = UserProfiles.findOne({ userId: uId });

  if (doc == null) {
    doc = UserProfiles.findOne({ userId: Meteor.userId() });
  }

  return doc;
}

// Section II: onRendered

Template.Payment.onRendered(function() {
  $(document).ready(function() {
    setTimeout(function() {
      $('select').material_select();
    }, 1000);
    $('ul.tabs').tabs();
  });
});

Template.Payment.events({
  'submit .safe': function(event) {
    event.preventDefault();
    var amount = document.getElementById('amount').value;
    var number = document.getElementById('number').value;
    var name = document.getElementById('name').value;
    var cvv = document.getElementById('cvv').value;
    var month = $('#month').val();
    var year = document.getElementById('year').value;

    year = parseInt(year);
    if (year < 2000) {
      year = year + 2000;
    }

    $('#amount').val('');
    $('#number').val('');
    $('#name').val('');
    $('#cvv').val('');
    $('#month').val('');
    $('#year').val('');

    // grab moyasar
    var moyasar = new (require('moyasar'))(
      'sk_test_DJDn2MPWZuinhXxhWjwXVsBGtVQouFLnnAmuQpL2'
    );

    var index = self.location.href.indexOf('/', 7);
    var user = userInfo();

    var paymentTest = moyasar.payment
      .create({
        // Convert from Riyals to Halalas
        amount: parseInt((amount * 100).toFixed(0)),
        currency: 'SAR',
        description: '',
        source: {
          type: 'creditcard',
          name: name,
          number: number,
          cvc: cvv,
          month: month,
          year: year,
        },
        callback_url:
          self.location.href.slice(0, index) + '/payment/?uid=' + user.userId,
      })
      .then(function(payment) {
        if (payment.source.transaction_url != null) {
          self.location.href = payment.source.transaction_url;
        }

        if (payment.status == 'paid') {
          var payment = moyasar.payment
            .fetch(payment.id)
            .then(function(payment) {
              Meteor.call('addCustomerPayment', user.userId, payment);

              var newbalance = payment.amount / 100 + user.balance;
              Meteor.call('updateCustomerBalance', user.userId, newbalance);

              var desc = payment.source.type;
              Meteor.call(
                'addCustomerTransaction',
                user.userId,
                'Top Up',
                payment.amount / 100,
                desc,
                'accepted'
              );
            });
        }
      });
  },
  load: function(event) {
    console.log('Load caught!');
    if (
      self.location.href.indexOf('?id') > 0 ||
      self.location.href.indexOf('&id') > 0
    ) {
      var callback_url = self.location.href;

      var id = null;
      var status = null;
      var message = null;

      var index = callback_url.indexOf('uid');

      if (callback_url.indexOf('=') > 0) {
        if (index > 0) {
          var start = callback_url.indexOf('=', index + 5) + 1;
        } else {
          var start = callback_url.indexOf('=') + 1;
        }
        var end = callback_url.indexOf('&', start);
        var id = callback_url.slice(start, end);
      }

      if (callback_url.indexOf('=', start) > 0) {
        var start = callback_url.indexOf('=', start) + 1;
        var end = callback_url.indexOf('&', end + 1);
        var status = callback_url.slice(start, end);
      }

      if (callback_url.indexOf('=', start) > 0) {
        var start = callback_url.indexOf('=', start) + 1;
        var end = callback_url.indexOf('%');
        var message = callback_url.slice(start, end);
      }

      if (id != null && status != null && message != null) {
        if (status == 'paid') {
          // grab moyasar
          var moyasar = new (require('moyasar'))(
            'sk_test_DJDn2MPWZuinhXxhWjwXVsBGtVQouFLnnAmuQpL2'
          );

          var payment = moyasar.payment.fetch(id).then(function(payment) {
            var user = userInfo();
            console.log(user);
            var duplicate = Payments.findOne({
              userId: user.userId,
              'payment.id': id,
            });
            console.log(duplicate);
            if (duplicate == null) {
              Meteor.call('addCustomerPayment', user.userId, payment);

              var newbalance = payment.amount / 100 + user.balance;
              Meteor.call('updateCustomerBalance', user.userId, newbalance);

              var desc = payment.source.type;
              Meteor.call(
                'addCustomerTransaction',
                user.userId,
                'Top Up',
                payment.amount / 100,
                desc,
                'accepted'
              );
            } else {
              console.log('Already');
              Materialize.toast('Already Paid!', 4000);
            }
          });
        } else {
          Materialize.toast('Authentication ' + message, 4000);
        }
      } else {
        Materialize.toast('No response', 4000);
      }
    }
  },
});

// Section IIII: Helpers

Template.Payment.helpers({
  paymentRecieved() {
    if (self.location.href.indexOf('?id') > 0) {
      return true;
    } else {
      return false;
    }
  },
  paymentStatus() {
    var callback_url = self.location.href;

    var id = null;
    var status = null;
    var message = null;

    if (callback_url.indexOf('=') > 0) {
      var start = callback_url.indexOf('=') + 1;
      var end = callback_url.indexOf('&');
      var id = callback_url.slice(start, end);
    }

    if (callback_url.indexOf('=', start) > 0) {
      var start = callback_url.indexOf('=', start) + 1;
      var end = callback_url.indexOf('&', end + 1);
      var status = callback_url.slice(start, end);
    }

    if (callback_url.indexOf('=', start) > 0) {
      var start = callback_url.indexOf('=', start) + 1;
      var end = callback_url.indexOf('%');
      var message = callback_url.slice(start, end);
    }

    var paymentStatus = 'Payment ' + message + '.';
    return paymentStatus;
  },
  userInfo() {
    var url = self.location.href;

    var index = url.indexOf('?uid=') + 5;
    var end = index + 17;

    var uId = url.slice(index, end);
    var doc = UserProfiles.findOne({ userId: uId });

    if (doc == null) {
      doc = UserProfiles.findOne({ userId: Meteor.userId() });
    }

    return doc;
  },
  fixedAmount() {
    var index = self.location.href.indexOf('&amount=');
    if (index > 0) {
      return true;
    } else {
      return false;
    }
  },
  amount() {
    var url = self.location.href;

    var index = url.indexOf('&amount=') + 8;
    var point = url.indexOf('.', index);

    var sar = url.slice(index, point);
    var halal = url.slice(point + 1, point + 3);

    var amount = parseInt(sar + halal) / 100;

    return amount;
  },
  since(then) {
    var then = then.getTime();
    var now = new Date().getTime();

    diff = now - then;
    if (diff / 1000 < 1) {
      var difference = 'Now';
    } else if (diff / (1000 * 60) < 1) {
      var difference = parseInt(diff / 1000) + 's';
    } else if (diff / (1000 * 60 * 60) < 1) {
      var difference = parseInt(diff / (1000 * 60)) + 'min';
    } else if (diff / (1000 * 60 * 60 * 24) < 1) {
      var difference = parseInt(diff / (1000 * 60 * 60)) + 'h';
    } else if (diff / (1000 * 60 * 60 * 24 * 30) < 1) {
      var difference = parseInt(diff / (1000 * 60 * 60 * 24)) + 'd';
    } else if (diff / (1000 * 60 * 60 * 24 * 365) < 1) {
      var difference = parseInt(diff / (1000 * 60 * 60 * 24 * 30)) + 'm';
    } else {
      var difference = parseInt(diff / (1000 * 60 * 60 * 24 * 365)) + 'y';
    }
    return difference;
  },
});
