define(['backbone', function(Backbone) {

  var Message = Backbone.Model.extend({
    defaults: {
      user: '',
      timeago: '',
      content: '',
      photo: ''
    },

    initialize: function() {

    }

  });

  return Message;
}]);