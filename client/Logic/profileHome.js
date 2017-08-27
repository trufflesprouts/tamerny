

/*
This client side JS file contains the logic for User/Operato profile which is called Home in HomeLayout.html

Templates:
  1. HomeLayout

*/

import d3 from 'd3';
import c3 from 'c3';

// Section I: Importing collections from MongoDB

import { History } from '../../collections/history.js'

// Section II: onRendered

Template.HomeLayout.onRendered(function () {
  $(document).ready(function(){
    $('ul.tabs').tabs();
    $(".button-collapse").sideNav();
    $('.collapsible').collapsible();
    $('.tooltipped').tooltip({delay: 50});
  });
});

Template.transactions.onRendered(function () {
  $(document).ready(function(){
    $('ul.tabs').tabs();
    $('.collapsible').collapsible();
    $('.modal').modal();
    $('select').material_select();
  });
})

Template.HomeLayout.onRendered(function () {
  $('#3dsecurity').load(function (){

  })
})

var serviceCategories = [
    ['Flights', '#79BEEF'],
    ['Food Delivery', '#F77F55'],
    ['Hotels', '#7FCB6F'],
    ['Transportation', '#6273F4'],
    ['Shipment', '#7d858a'],
    ['Delivery', '#F8B856'],
    ['Events/Tickets', '#CD7EF0'],
    ['General Info', '#6e7acb']
  ];


Template.sales.onRendered(function() {
  categorySalesData = [
    ['Transportation', 240],
    ['Food', 150],
    ['E-Commerce', 470],
    ['Home Maintenance', 140]
  ]

  monthlySalesData = [
    ['x','2017-01','2017-02','2017-03','2017-04','2017-05','2017-06','2017-07','2017-08'],
    ['Sales', 1250, 2100, 1920, 2892, 3102, 3301, 3791, 4709]
  ];

  dailySalesData = [
    [ 'x',
      '2017-08-10','2017-08-11','2017-08-12','2017-08-13','2017-08-14','2017-08-15',
      '2017-08-16','2017-08-17','2017-08-18','2017-08-19','2017-08-20','2017-08-21',
      '2017-08-22','2017-08-23','2017-08-24','2017-08-25'
    ],
    ['Sales', 250, 100, 120, 292, 102, 91, 191, 309 , 250, 201, 220, 192, 202, 301, 291, 409]
  ];

  var categorySalesChart = c3.generate({
    bindto: '#category-sales-chart',
    data: {
      columns: categorySalesData,
      type: 'donut'
    },
    color: {
      pattern: ['#F8B856','#FF7B7B','#79BEEF','#7FCB6F']
    },
    legend: {
      position: 'right'
    }
  });

  var monthlySalesChart = c3.generate({
    bindto: '#monthly-sales-chart',
    data: {
      x: 'x',
      xFormat: '%Y-%m',
      columns: monthlySalesData
    },
    legend: {show: false},
    grid: {y: {show: true}},
    color: {pattern: ['#79BEEF']},
    padding: {right: 30,},
    axis: {
      x: {
        label: 'Day',
        type: 'timeseries',
        tick: {
          format: '%Y-%m'
        }
      },
      y: {
        label: 'SAR'
      }
    }
  });

  var dailySalesChart = c3.generate({
    bindto: '#daily-sales-chart',
    data: {
      x: 'x',
      xFormat: '%Y-%m-%d',
      columns: dailySalesData
    },
    legend: {show: false},
    grid: {y: {show: true}},
    color: {pattern: ['#7FCB6F']},
    padding: {right: 30,},
    axis: {
      x: {
        label: 'Day',
        type: 'timeseries',
        tick: {
          format: '%Y-%m-%d'
        }
      },
      y: {
        label: 'SAR'
      }
    }
  });
});

Template.performance.onRendered(function() {
  calendarActivityData = [
    [ 'x',
      '2017-08-10','2017-08-11','2017-08-12','2017-08-13','2017-08-14','2017-08-15',
      '2017-08-16','2017-08-17','2017-08-18','2017-08-19','2017-08-20','2017-08-21',
      '2017-08-22','2017-08-23','2017-08-24','2017-08-25'
    ],
    ['Hours', 5, 4, 3, 5, 4, 6, 4, 5 , 6, 5, 4, 4, 6, 4, 5, 7]
  ];

  averageRatingData = {
    data: [['Average Rating', 4, 3, 5, 4, 3, 4]],
    categories: serviceCategories.map(service => service[0]),
    colors: serviceCategories.map(service => service[1])
  };

  var calendarActivityChart = c3.generate({
    bindto: '#calendar-activity-chart',
    data: {
      x: 'x',
      xFormat: '%Y-%m-%d',
      columns: calendarActivityData
    },
    legend: {show: false},
    grid: {y: {show: true}},
    color: {pattern: ['#F87272']},
    padding: {right: 30,},
    axis: {
      x: {
        label: 'Day',
        type: 'timeseries',
        tick: {
          format: '%Y-%m-%d'
        }
      },
      y: {
        label: 'Hours'
      }
    }
  });

  var averageRatingChart = c3.generate({
      bindto: '#average-rating-chart',
      data: {
          columns: averageRatingData.data,
          type: 'bar',
          labels: true,
          color: function(color, d) {
            return averageRatingData.colors[d.index];
          }
      },
      axis: {
          x: {
            label: 'Category',
            type: 'category',
            categories: averageRatingData.categories
          },
          y: {
            tick : {values: [0,1,2,3,4,5]},
            label: 'Rating',
            padding: {top:0, bottom:0}
          }
      }
  });
});


// Section III: Events

Template.topUp.events({
  'submit .safe': function (event){
    event.preventDefault();
    var amount = document.getElementById('amount').value;
    var number = document.getElementById('number').value;
    var name = document.getElementById('name').value;
    var cvv = document.getElementById('cvv').value;
    var month = $('#month').val();
    var year = document.getElementById('year').value;

    year = parseInt(year);
    if (year < 2000){
      year = year + 2000;
    }

    $('#amount').val('');
    $('#number').val('');
    $('#name').val('');
    $('#cvv').val('');
    $('#month').val('');
    $('#year').val('');

    // grab moyasar
    var moyasar = new (require('moyasar'))('sk_test_DJDn2MPWZuinhXxhWjwXVsBGtVQouFLnnAmuQpL2');

    var paymentTest = moyasar.payment.create({
      // Convert from Riyals to Halalas
      amount: (100*amount),
      currency: 'SAR',
      description: '',
      source: {
       type: 'creditcard',
       name: name,
       number: number,
       cvc: cvv,
       month: month,
       year: year
     },
     callback_url: "http://localhost:3000"
    }).then( function(payment){

      if (payment.source.transaction_url != null){
          $('#3dsecurity_frame').modal('open');
          document.getElementById('3dsecurity').src = payment.source.transaction_url;
      }

      if (payment.status == "paid"){
        var payment = moyasar.payment.fetch(payment.id).then( function(payment){

          Meteor.call('addPayment', payment);

          var user = UserProfiles.findOne({userId: Meteor.userId()});
          var newbalance = payment.amount/100 + user.balance;
          Meteor.call('updateBalance', newbalance);

          var desc = payment.source.type;
          Meteor.call('addTransaction', "Top Up", payment.amount/100, desc, "accepted");
        });
       }
    });
  }
})

Template.HomeLayout.events({
  'load iframe': function (event){
    if (self.location.href.indexOf("?") > 0){
      var callback_url = self.location.href;

      var id = null;
      var status = null;
      var message = null;

      if (callback_url.indexOf("=") > 0){
        var start = callback_url.indexOf("=") + 1;
        var end = callback_url.indexOf("&");
        var id = callback_url.slice(start,end);
      }

      if (callback_url.indexOf("=",start) > 0){
        var start = callback_url.indexOf("=",start) + 1;
        var end = callback_url.indexOf("&",end + 1);
        var status = callback_url.slice(start,end);
      }

      if (callback_url.indexOf("=",start) > 0){
        var start = callback_url.indexOf("=",start) + 1;
        var end = callback_url.indexOf("%");
        var message = callback_url.slice(start,end);
      }

      window.parent.$("#3dsecurity_frame").modal("close");

      if (id != null && status != null && message != null){
        if (status == "paid"){

          // grab moyasar
          var moyasar = new (require('moyasar'))('sk_test_DJDn2MPWZuinhXxhWjwXVsBGtVQouFLnnAmuQpL2');

          var payment = moyasar.payment.fetch(id).then( function(payment){

            Meteor.call('addPayment', payment);

            var user = UserProfiles.findOne({userId: Meteor.userId()});
            var newbalance = payment.amount/100 + user.balance;
            Meteor.call('updateBalance', newbalance);

            var desc = payment.source.type;
            Meteor.call('addTransaction', "Top Up", (payment.amount/100), desc, "accepted");
          });
        } else {
          Materialize.toast("Authentication " + message, 4000)
        }
      } else {
        Materialize.toast("No response", 4000)
      }
    }
  }
});



// Section IV: Helpers

Template.userBalance.helpers({
  balance(){
    var userProfileDoc = UserProfiles.findOne({userId: Meteor.userId()});
    return userProfileDoc.balance;
  },
})

Template.HomeLayout.helpers({
  isOperator (){
    var userProfileDoc = UserProfiles.findOne({userId: Meteor.userId()});
    var roles = userProfileDoc.roles
    var rolesLength = roles.length
    var status = false;

    for (var i = 0; i < rolesLength; i++){
      if (roles[i] == "operator")
        status = true;
    }
    return status
  },
  user (){
    var userProfileDoc = UserProfiles.findOne({userId: Meteor.userId()});
    return userProfileDoc
  }
})

// Template.userInfo.helpers({
//   initials(first, last){
//     return first.charAt(0) + last.charAt(0)
//   }
// })

Template.transactions.helpers({
  since (then){
    var then = then.getTime();
    var now = (new Date()).getTime();

    diff = now - then;
    if (diff/1000 < 1) {
      var difference = "Now"
    } else if (diff/(1000*60) < 1) {
      var difference = parseInt(diff/(1000)) + "s"
    } else if (diff/(1000*60*60) < 1) {
      var difference = parseInt(diff/(1000*60)) + "min"
    } else if (diff/(1000*60*60*24) < 1) {
      var difference = parseInt(diff/(1000*60*60)) + "h"
    } else if (diff/(1000*60*60*24*30) < 1) {
      var difference = parseInt(diff/(1000*60*60*24)) + "d"
    } else if (diff/(1000*60*60*24*365) < 1) {
      var difference = parseInt(diff/(1000*60*60*24*30)) + "m"
    } else {
      var difference = parseInt(diff/(1000*60*60*24*365)) + "y"
    }
    return difference
  },
  userHistory (){
    var userHistory = History.findOne({userId: Meteor.userId()}).transactions.reverse();
    return userHistory
  },

})


Template.performance.helpers({
  completedOrders(){
    var num = 98.412;
    return parseInt(num);
  },
  usersServed(){
    var num = 132;
    return parseInt(num);
  },
  profitPerDay(){
    var num = 542.923;
    return parseInt(num);
  },
  averageRating(){
    var num = 4.2;
    return parseInt(num);
  },
})
