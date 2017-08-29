

/*
This client side JS file contains the logic for User/Operato profile which is called Home in HomeLayout.html

Templates:
  1. HomeLayout

*/

import d3 from 'd3';
import c3 from 'c3';
import Pikaday from 'pikaday';
import fakeServer from './fakeServer.js';


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

Template.sales.onRendered(function() {
  // Category Sales Chart
  var categorySalesChart = c3.generate({
    bindto: '#category-sales-chart',
    data: {
      columns: [],
      type: 'donut'
    },
    padding: {bottom: 30,},
    color: {
      pattern: ['#F8B856','#FF7B7B','#79BEEF','#7FCB6F']
    },
    legend: {
      position: 'bottom'
    }
  });
  var categorySalesPreloader = $('#category-sales-preloader');
  fakeServer('categorySales', null, null, updateCSChart)
  function updateCSChart(data) {
    categorySalesPreloader.removeClass('active');
    categorySalesChart.load({
        columns: data
    });
  }

  // Monthly Sales Chart
  var monthlySalesChart = c3.generate({
    bindto: '#monthly-sales-chart',
    data: {
      x: 'x',
      xFormat: '%Y-%m',
      columns: []
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
  var monthlySalesPreloader = $('#monthly-sales-preloader');
  fakeServer('monthlySales', null, 8, updateMSChart);
  $('#monthly-sales-form').on('change',function (){
    var months = $('#monthly-sales-form').val();
    monthlySalesPreloader.addClass('active');
    fakeServer('monthlySales', null, months, updateMSChart);
  });
  function updateMSChart(data) {
    monthlySalesPreloader.removeClass('active');
    monthlySalesChart.load({
        columns: data
    });
  }

  // Daily Sales Chart
  var picker = new Pikaday({ field: $('#daily-sales-start-date')[0] });
  var picker = new Pikaday({ field: $('#daily-sales-end-date')[0] });
  var dailySalesChart = c3.generate({
    bindto: '#daily-sales-chart',
    data: {
      x: 'x',
      xFormat: '%Y-%m-%d',
      columns: []
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
  var dailySalesPreloader = $('#daily-sales-preloader');
  fakeServer('dailySales', '2017-08-12', '2017-08-29', updateDSChart);
  $('.daily-sales-form').submit(function() {
    event.preventDefault();
    var startDate = $('#daily-sales-start-date').val();
    var endDate = $('#daily-sales-end-date').val();

    function loadNewData() {
      dailySalesPreloader.addClass('active');
      fakeServer('dailySales', startDate, endDate, updateDSChart);
    }

    validDates(startDate, endDate, 60, loadNewData);
  });
  function updateDSChart(data) {
    dailySalesPreloader.removeClass('active');
    dailySalesChart.load({
        columns: data
    });
  }
});

Template.performance.onRendered(function() {
  // Calendar Activity Chart
  var picker = new Pikaday({ field: $('#calendar-activity-start-date')[0] });
  var picker = new Pikaday({ field: $('#calendar-activity-end-date')[0] });
  var calendarActivityChart = c3.generate({
    bindto: '#calendar-activity-chart',
    data: {
      x: 'x',
      // type: 'spline',
      xFormat: '%Y-%m-%d',
      columns: []
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
        min: 0,
        tick: {
          format: function(x) { return x % 1 === 0 ? x : '';}
        },
        label: 'Hours'
      }
    }
  });
  var calendarActivityPreloader = $('#calendar-activity-preloader');
  fakeServer('calendarActivity', '2017-08-12', '2017-08-29', updateCAChart);
  $('.calendar-activity-form').submit(function() {
    event.preventDefault();
    var startDate = $('#calendar-activity-start-date').val();
    var endDate = $('#calendar-activity-end-date').val();

    function loadNewData() {
      calendarActivityPreloader.addClass('active');
      fakeServer('calendarActivity', startDate, endDate, updateCAChart);
    }

    validDates(startDate, endDate, 60, loadNewData);
  });
  function updateCAChart(data) {
    calendarActivityPreloader.removeClass('active');
    calendarActivityChart.load({
        columns: data
    });
  }

  // Average Rating Chart
  var averageRatingChart = c3.generate({
    bindto: '#average-rating-chart',
    data: {
      columns: [],
      type: 'bar',
      labels: true,
      color: function(color, d) {
        var colors = [
          '#79BEEF',
          '#F77F55',
          '#7FCB6F',
          '#6273F4',
          '#7d858a',
          '#F8B856',
          '#CD7EF0',
          '#6e7acb'
        ];
        return colors[d.index];
      }
    },
    legend: {show: false},
    axis: {
      x: {
        label: 'Category',
        type: 'category',
        categories: []
      },
      y: {
        max: 5,
        min: 0,
        tick: {
          values: [0, 1, 2, 3, 4, 5]
        },
        label: 'Rating',
        padding: { top: 0, bottom: 0 }
      }
    }
  });
  var averageRatingPreloader = $('#average-rating-preloader');
  fakeServer('averageRating', null, null, loadARChart);
  function loadARChart(data) {
    averageRatingPreloader.removeClass('active');
    averageRatingChart.load({
      columns: data.ratingData,
      categories: data.categories
    });
  }
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

// Section V: Functions

function validDates(startDate, endDate, maxRange = 15, cb) {
  var validPresentDate = moment().diff(startDate) >= 0 && moment().diff(endDate) >= 0;
  var validSD = moment(startDate, 'YYYY-MM-DD', true).isValid();
  var validED = moment(endDate, 'YYYY-MM-DD', true).isValid();
  var validRange = moment(startDate).isBefore(endDate);
  var validRangeLength = moment(endDate).diff(startDate, 'days') <= maxRange;

  if (validSD && validED && validRange && validRangeLength && validPresentDate) {
    cb();
  } else if (!validSD || !validED) {
    Materialize.toast('Please input a valid start and end date.', 4000);
  } else if (!validPresentDate) {
    Materialize.toast('Marty! you can\'t choose a date in the future.', 4000);
  } else if (!validRangeLength) {
    Materialize.toast('Max date range is ' + maxRange + ' days.', 4000);
  } else {
    Materialize.toast('End date must be after start date.', 3000);
  }
}
