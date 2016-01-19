angular.module('FoodeeBuddee.factories.EateryRating', [])
  .factory('EateryRatingFactory', function() {

    var eateryRatingFactory = function() {
      var self = this;
      self.dineInMenu = [{
        header: "Food",
        items: [{
          name: "Quality",
          id: '1',
          rating: 0
        }, {
          name: "Taste",
          id: '2',
          rating: 0
        }, {
          name: "Price",
          id: '3',
          rating: 0
        }, {
          name: "Hygiene",
          id: '4',
          rating: 0
        }]
      }, {
        header: "Service",
        items: [{
          name: "Speed Of Service",
          id: '5',
          rating: 0
        }, {
          name: "Right Order",
          id: '6',
          rating: 0
        }, {
          name: "Experience",
          id: '7',
          rating: 0
        }]
        },{
        header: "Hygiene",
       items: [
       {
          name: "Cleanliness of Eatery",
          id: '8',
          rating: 0
        }, {
          name: "Cutlery & Service",
          id: '9',
          rating: 0
        }, {
          name: "Sanitization",
          id: '10',
          rating: 0
        }]
      }];


      self.deliveryMenu = [{
        header: "Home Delivery",
        items: [{
          name: "Quality",
          id: '11',
          rating: 0
        }, {
          name: "Quantity",
          id: '12',
          rating: 0
        }, {
          name: "Delivery Time",
          id: '13',
          rating: 0
        }, {
          name: "Temperature",
          id: '14',
          rating: 0
        }, {
          name: "Packaging Quality",
          id: '15',
          rating: 0
        }, {
          name: "Container Price",
          id: '16',
          rating: 0
        }, {
          name: "Delivery Charge",
          id: '17',
          rating: 0
        }, {
          name: "Overall Price",
          id: '18',
          rating: 0
        }, {
          name: "Payment Options",
          id: '19',
          rating: 0
        }]
      }, {
        header: "Pick Up",
        items: [{
          name: "Quality",
          id: '20',
          rating: 0
        }, {
          name: "Quantity",
          id: '21',
          rating: 0
        },{
          name: "Waiting Time",
          id: '22',
          rating: 0
        }, {
          name: "Temperature",
          id: '23',
          rating: 0
        }, {
          name: "Packaging Quality",
          id: '24',
          rating: 0
        }, {
          name: "Container Price",
          id: '25',
          rating: 0
        }, {
          name: "Overall Price",
          id: '26',
          rating: 0
        }, {
          name: "Payment Options",
          id: '27',
          rating: 0
        }]
      }];
    };
    return eateryRatingFactory;

  });