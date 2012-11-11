define(['handlebars'], function (Handlebars) {

      function miles(distance, options) {
	return (Math.round(distance * 100) / 100) + ' miles';
      }

      Handlebars.registerHelper('miles', miles);

      return miles;
});