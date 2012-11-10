define(['handlebars', 'libs/moment'], function (Handlebars, moment) {

      function timeago(time, options) {
	    return moment(time).fromNow();
      }

      Handlebars.registerHelper('timeago', timeago);

      return timeago;
});