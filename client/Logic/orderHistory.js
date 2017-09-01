/*
This client side JS file contains the logic for the Operator Sales page which is called Sales in SalesLayout.html

Templates:
  1. SalesLayout

*/

import Pikaday from 'pikaday';
import fakeServer from './fakeServer.js';
import { validDates } from './helpers.js';

Template.HistoryLayout.onRendered(function() {
  // $.getJSON("/MOCK_DATA.json", function(json) {
  //     let orders = json;
  //     console.log(orders);
  // });
});

Template.HistoryLayout.onCreated(function () {
  this.orders = new ReactiveVar([]);

  $.getJSON("/MOCK_DATA.json", json => {
    console.log(json[0].title);
    this.orders.set(json);
  });
});

Template.HistoryLayout.helpers({
  orders() {
    return Template.instance().orders.get();
  }
});

Template.order.helpers({
  fullStars(count){
    var countArr = [];
    for (var i=0; i<count; i++){
      countArr.push({});
    }
    return countArr;
  },
  emptyStars(count){
    count = 5 - count;
    var countArr = [];
    for (var i=0; i<count; i++){
      countArr.push({});
    }
    return countArr;
  }
});
