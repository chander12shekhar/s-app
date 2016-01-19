angular.module('FoodeeBuddee.factories.ReceipeRating', [])
  .factory('ReceipeRatingFactory', function() {

    var receipeFactory = function() {
      var receipe = this;
      receipe.averageRatingMenu = {
        "receipeHeading": "Average",
        "item": [{
          "name": "Average",
          "id": 1,
          "rating": 2
        }]

      };
      receipe.advanceRatingMenu = [{
        "receipeHeading": "CONTENT",
        "item": [{
          "name": "Easy Of Understand",
          "rating": 0
        }, {
          "name": "Photo",
          "rating": 0
        }]
      }, {
        "receipeHeading": "INGREDIENTS",
        "item": [{
          "name": "Availability",
          "rating": 0
        }, {
          "name": "Adaptability or Alternatives",
          "rating": 0
        }]

      }, {
        "receipeHeading": "PREPARATION PROCESS",
        "item": [{
            "name": "Time",
            "rating": 0
          }, {
            "name": "Difficulty level",
            "rating": 0
          }
        ]
      }, {
        "receipeHeading": "BRANDS",
        "item": [{
          "name": "Availability",
          "rating": 0
        }, {
          "name": "Adaptability or Alternatives",
          "rating": 0
        }, {
          "name": "Comfort Level",
          "rating": 0
        }]

      }, {
        "receipeHeading": "OVERALL OUTCOME",
        "item": [{
          "name": "Taste",
          "rating": 0
        }, {
          "name": "Final Product",
          "rating": 0
        }]
      }];
    };

    return receipeFactory;

  });