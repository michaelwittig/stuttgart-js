define(['jquery'], function() {
    $(window).resize(function() {

    //  Map
	var mapHeight = ($(window).height()-$('#header').height()-$('#footer').height())+100;
	//$('#content,#map').css('height',mapHeight);

    //  Overlay
	var tempHeight = mapHeight+$('#header').height()+$('#footer').height();

	$('#overlay').css({
	    'width'  : $(window).width()+'px',
	    'height' : tempHeight+'px'
	});

    //  Position
	var inputPositionWidth = $(window).width()-126+'px';
	$('#footer').find('#sub-position input').css('width',inputPositionWidth);

    //  Create
	var textareaWidth = ($(window).width()-$('.column-right').width())-70+'px';
	$('#footer').find('.column-left').css('width',textareaWidth);

    //  Comment
	var inputCommentWidth = $(window).width()-86+'px';
	$('#footer').find('#sub-comment input').css('width',inputCommentWidth);

    //  Hide Top @ iPhone
	setTimeout(function () {
	    window.scrollTo(0, 1);
	}, 1000);

    });

    $(window).resize();

});
