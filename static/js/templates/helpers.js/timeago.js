define(['Handlebars', 'libs/moment'], function (Handlebars, moment) {
  function timeago(context, options) {
    return moment(context).fromNow();
  }
  Handlebars.registerHelper( 'timeago', timeago );
  return timeago;
});