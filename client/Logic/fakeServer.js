export default function fakeServer(type, startDate, endDate, cb) {
  switch (type) {
    case 'categorySales':
      setTimeout(function() {
        getCategorySalesData(cb);
      }, 1120);
      break;
    case 'monthlySales':
      setTimeout(function() {
        getMonthlySalesData(endDate, cb);
      }, 1001);
      break;
    case 'dailySales':
      setTimeout(function() {
        getDailySalesData(startDate, endDate, cb);
      }, 942);
      break;
    case 'calendarActivity':
      setTimeout(function() {
        getCalendarActivityData(startDate, endDate, cb);
      }, 1350);
      break;
    case 'averageRating':
      setTimeout(function() {
        getAverageRatingData(cb);
      }, 900);
      break;
    default:
  }

  var serviceCategories = [
    ['Flights', '#79BEEF'],
    ['Food Delivery', '#F77F55'],
    ['Hotels', '#7FCB6F'],
    ['Transportation', '#6273F4'],
    ['Shipment', '#7d858a'],
    ['Delivery', '#F8B856'],
    ['Events/Tickets', '#CD7EF0'],
    ['General Info', '#6e7acb'],
  ];

  function getCategorySalesData(cb) {
    var data = (categorySalesData = [
      ['Transportation', 240],
      ['Food', 150],
      ['E-Commerce', 470],
      ['Home Maintenance', 140],
    ]);
    cb(data);
  }

  function getMonthlySalesData(months, cb) {
    var data = [['x'], ['Sales']];

    for (var i = 0; i < months; i++) {
      var date = moment()
        .subtract(i, 'months')
        .format('YYYY-MM');
      data[0].push(date);
      data[1].push(Math.floor(Math.random() * (6000 - 1300) + 1300));
    }
    cb(data);
  }

  function getDailySalesData(startDate, endDate, cb) {
    var data = [['x'], ['Sales']];
    var dateRange = moment(endDate).diff(startDate, 'days');

    for (var i = 0; i < dateRange; i++) {
      data[0].push(
        moment(startDate)
          .add(i, 'd')
          .format('YYYY-MM-DD')
      );
      data[1].push(Math.floor(Math.random() * (500 - 90) + 90));
    }
    cb(data);
  }

  function getCalendarActivityData(startDate, endDate, cb) {
    var data = [['x'], ['Hours']];
    var dateRange = moment(endDate).diff(startDate, 'days');

    for (var i = 0; i < dateRange; i++) {
      data[0].push(
        moment(startDate)
          .add(i, 'd')
          .format('YYYY-MM-DD')
      );
      data[1].push(Math.floor(Math.random() * (7 - 3) + 3));
    }

    cb(data);
  }

  function getAverageRatingData(cb) {
    var data = {
      ratingData: [['Average Rating']],
      categories: serviceCategories.map(service => service[0]),
    };

    for (var i = 0; i < Math.random() * (8 - 5) + 5; i++) {
      data.ratingData[0].push(Math.ceil(Math.random() * 3 + 2));
    }

    cb(data);
  }
}
