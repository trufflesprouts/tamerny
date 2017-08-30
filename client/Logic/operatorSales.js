

/*
This client side JS file contains the logic for the Operator Sales page which is called Sales in SalesLayout.html

Templates:
  1. SalesLayout

*/

import d3 from 'd3';
import c3 from 'c3';
import Pikaday from 'pikaday';
import fakeServer from './fakeServer.js';
import {validDates} from './helpers.js';

Template.SalesLayout.onRendered(function() {
  $('select').material_select();

  // Category Sales Chart
  var categorySalesChart = c3.generate({
    bindto: '#category-sales-chart',
    size: {
        height: 400
    },
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
    size: {
        height: 400
    },
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
    size: {
        height: 400
    },
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
