define(['handlebars', 'libs/moment'], function (Handlebars, moment) {

      function timeago(time, options) {
	    return time ? moment(time).fromNow() : 'never';
      }

      Handlebars.registerHelper('timeago', timeago);

      return timeago;
});