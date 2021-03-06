/*
This client side JS file contains the logic for User/Operato profile which is called ProfileLayout in ProfileLayout.html

Templates:
  1. ProfileLayout

*/

// Section I: Importing collections from MongoDB

import { History } from '../../collections/history.js';

// Section II: onRendered

Template.ProfileLayout.onRendered(function() {
  $('#3dsecurity').load(function() {});
});

Template.transactions.onRendered(function() {
  $(document).ready(function() {
    $('ul.tabs').tabs();
    $('.collapsible').collapsible();
    $('.modal').modal();
    $('select').material_select();
  });
});

// Section III: Events

Template.ProfileLayout.events({
  'load iframe': function(event) {
    if (self.location.href.indexOf('?') > 0) {
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

      window.parent.$('#3dsecurity_frame').modal('close');

      if (id != null && status != null && message != null) {
        if (status == 'paid') {
          // grab moyasar
          var moyasar = new (require('moyasar'))(
            'sk_test_DJDn2MPWZuinhXxhWjwXVsBGtVQouFLnnAmuQpL2'
          );

          var payment = moyasar.payment.fetch(id).then(function(payment) {
            Meteor.call('addPayment', payment);

            var user = UserProfiles.findOne({ userId: Meteor.userId() });
            var newbalance = payment.amount / 100 + user.balance;
            Meteor.call('updateBalance', newbalance);

            var desc = payment.source.type;
            Meteor.call(
              'addTransaction',
              'Top Up',
              payment.amount / 100,
              desc,
              'accepted'
            );
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

Template.topUp.events({
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

    var paymentTest = moyasar.payment
      .create({
        // Convert from Riyals to Halalas
        amount: 100 * amount,
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
        callback_url: 'http://localhost:3000',
      })
      .then(function(payment) {
        if (payment.source.transaction_url != null) {
          $('#3dsecurity_frame').modal('open');
          document.getElementById('3dsecurity').src =
            payment.source.transaction_url;
        }

        if (payment.status == 'paid') {
          var payment = moyasar.payment
            .fetch(payment.id)
            .then(function(payment) {
              Meteor.call('addPayment', payment);

              var user = UserProfiles.findOne({ userId: Meteor.userId() });
              var newbalance = payment.amount / 100 + user.balance;
              Meteor.call('updateBalance', newbalance);

              var desc = payment.source.type;
              Meteor.call(
                'addTransaction',
                'Top Up',
                payment.amount / 100,
                desc,
                'accepted'
              );
            });
        }
      });
  },
});

// Section IV: Helpers

Template.userBalance.helpers({
  balance() {
    var userProfileDoc = UserProfiles.findOne({ userId: Meteor.userId() });
    return userProfileDoc.balance;
  },
});

Template.transactions.helpers({
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
  userHistory() {
    var userHistory = History.findOne({
      userId: Meteor.userId(),
    }).transactions.reverse();
    return userHistory;
  },
});
