/*
This client side JS file contains the logic for the Operator Sales page which is called Sales in PerformanceLayout.html

Templates:
  1. PerformanceLayout

*/

import d3 from 'd3';
import c3 from 'c3';
import Pikaday from 'pikaday';
import fakeServer from './fakeServer.js';
import { validDates } from './helpers.js';

Template.PerformanceLayout.onRendered(function() {
  // Calendar Activity Chart
  var picker = new Pikaday({ field: $('#calendar-activity-start-date')[0] });
  var picker = new Pikaday({ field: $('#calendar-activity-end-date')[0] });
  var calendarActivityChart = c3.generate({
    bindto: '#calendar-activity-chart',
    size: {
      height: 400,
    },
    data: {
      x: 'x',
      // type: 'spline',
      xFormat: '%Y-%m-%d',
      columns: [],
    },
    legend: { show: false },
    grid: { y: { show: true } },
    color: { pattern: ['#F87272'] },
    padding: { right: 30 },
    axis: {
      x: {
        label: 'Day',
        type: 'timeseries',
        tick: {
          format: '%Y-%m-%d',
        },
      },
      y: {
        min: 0,
        tick: {
          format: function(x) {
            return x % 1 === 0 ? x : '';
          },
        },
        label: 'Hours',
      },
    },
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
      columns: data,
    });
  }

  // Average Rating Chart
  var averageRatingChart = c3.generate({
    bindto: '#average-rating-chart',
    size: {
      height: 400,
    },
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
          '#6e7acb',
        ];
        return colors[d.index];
      },
    },
    legend: { show: false },
    axis: {
      x: {
        // show:false,
        type: 'category',
        categories: [],
      },
      y: {
        show: false,
        max: 5,
        min: 0,
        tick: {
          values: [0, 1, 2, 3, 4, 5],
        },
        label: 'Rating',
        padding: { top: 0, bottom: 0 },
      },
    },
  });
  var averageRatingPreloader = $('#average-rating-preloader');
  fakeServer('averageRating', null, null, loadARChart);
  function loadARChart(data) {
    averageRatingPreloader.removeClass('active');
    averageRatingChart.load({
      columns: data.ratingData,
      categories: data.categories,
    });
  }
});

Template.PerformanceLayout.helpers({
  completedOrders() {
    var num = 98.412;
    return parseInt(num);
  },
  usersServed() {
    var num = 132;
    return parseInt(num);
  },
  profitPerDay() {
    var num = 542.923;
    return parseInt(num);
  },
  averageRating() {
    var num = 4.2;
    return parseInt(num);
  },
});
