angular.module('FoodeeBuddee.services.Subscriber',[])

.factory('SubscriberService', function() {

  var self = this;
  var topics = {};

  return {
    subscribe: function(topic, listener) {
      if(topics[topic] === undefined) {
        topics[topic] = [];
      }

      topics[topic].push(listener);
    },

    publish: function(topic, info) {
      if(topics[topic] === undefined) {
        return;
      }

      topics[topic].forEach(function(item) {
        item(info !== undefined ? info : {});
      });
    }
  };

});