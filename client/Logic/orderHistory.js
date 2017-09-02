/*
This client side JS file contains the logic for the Operator Sales page which is called Sales in SalesLayout.html

Templates:
  1. SalesLayout

*/

import { ReactiveDict } from 'meteor/reactive-dict';
import _ from 'underscore';

Template.HistoryLayout.onRendered(function() {
  $('.collapsible').collapsible();
  $('select').material_select();
});

Template.HistoryLayout.onCreated(function() {
  this.orders = new ReactiveVar([]);
  this.state = new ReactiveDict();
  var self = this;
  $.getJSON('/MOCK_DATA.json', json => {
    setTimeout(function() {
      $('#order-history-preloader').removeClass('active');
      self.orders.set(json);
    }, 2000);
  });
});

Template.HistoryLayout.events({
  'change #sort-type'(event, instance) {
    instance.state.set('sort', event.target.value);
  },
  'change #rating-filter'(event, instance) {
    var ratingFilters = {
      stars5: true,
      stars4: true,
      stars3: true,
      stars2: true,
      stars1: true,
      stars0: true
    };
    var checkboxes = $('#rating-filter').find(':checkbox');

    checkboxes.each(function() {
      ratingFilters[$(this).prop('id')] = $(this).is(':checked');
    });

    instance.state.set('ratingFilters', ratingFilters);
  }
});

Template.HistoryLayout.helpers({
  orders() {
    var instance = Template.instance();
    var stateSort = instance.state.get('sort');
    var stateRatingFilter = instance.state.get('ratingFilters');
    var ordersData = instance.orders.get();
    var sortedData = _.sortBy(ordersData, function(order) {
      return order.date;
    }).reverse();

    if (stateSort) {
      switch (stateSort) {
        case 'new_old':
          sortedData = sortedData;
          break;
        case 'old_new':
          sortedData = _.sortBy(ordersData, function(order) {
            return order.date;
          });
          break;
        case 'high_rating':
          sortedData = _.sortBy(ordersData, function(order) {
            return order.rating;
          }).reverse();
          break;
        case 'low_rating':
          sortedData = _.sortBy(ordersData, function(order) {
            return order.rating;
          });
          break;
        default:
          sortedData = sortedData;
      }
    }

    if (stateRatingFilter) {
      sortedData = _.filter(sortedData, function(order) {
        if (stateRatingFilter['stars' + order.rating]) {
          return true;
        } else {
          return false;
        }
      });
    }

    return sortedData;
  }
});

Template.order.helpers({
  fullStars(count) {
    var countArr = [];
    for (var i = 0; i < count; i++) {
      countArr.push({});
    }
    return countArr;
  },
  emptyStars(count) {
    count = 5 - count;
    var countArr = [];
    for (var i = 0; i < count; i++) {
      countArr.push({});
    }
    return countArr;
  }
});
