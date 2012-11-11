/**
 * The demo module can make some noice to impress the jury :)
 */
define(["datastore", "common/logger"], function(datastore, logger) {
	"use strict";

	// user 0 is the conversation starter, user 1 and 2 are the other guys :)
	var conversations = {
		"make pizza tonight?": [
			{
				user: 1,
				message: "+1"
			}, {
				user: 2,
				message: "very good idea"
			}, {
				user: 1,
				message: "some friends of mine are also in town!"
			}, {
				user: 0,
				message: "so come at 9pm. drinks are free:)"
			}, {
				user: 1,
				message: "yeay :)"
			}
		],
		"my hp printer for sale!": [
			{
				user: 1,
				message: "can you give me some details?"
			}, {
				user: 0,
				message: "sure. 3yrs old, color printer."
			}, {
				user: 2,
				message: "can you send me a picture?"
			}, {
				user: 0,
				message: "ok. printer is sold to a friend of mine. thanks!"
			}
		]
	};

	function randomElement(array) {
		var rand = Math.round(Math.random() * (array.length - 1));
		return array[rand];
	}

	function rand(lower, upper) {
		return Math.random() * (upper - lower) + lower;
	}

	/**
	 *
	 * @param loc Location
	 * @param distance Distance (in miles)
	 * @return Location
	 */
	function randomPosition(loc, distance) {
		distance = distance * 1.609344 * 0.0090053796; // distance to km to lnglat
		distance /= 2.0;
		var lngD = rand(-distance, distance);
		var latD = rand(-distance, distance);
		return {
			lng: loc.lng + lngD,
			lat: loc.lat + latD
		};
	}

	function randomBoardTitle() {
		return randomElement(Object.keys(conversations));
	}

	function randomMessage(board, messages) {
		var conversation = conversations[board.title];
		if (!conversation) {
			return null;
		}
		var user = [];
		user[0] = board.user;
		var i;
		for (i = 0; i < messages.length; i++) {
			user[conversation[i].user] = messages[i].user;
		}
		if (!user[1]) {
			user[1] = randomUser(user[0]);
		}
		if (!user[2]) {
			user[2] = randomUser(user[0], user[1]);
		}
		if (!conversation[i]) {
			return null;
		}
		return {
			user: user[conversation[i].user],
			message: conversation[i].message
		}
	}

	function randomFacebookUserId() {
		var rand = Math.random();
		if (rand > 0.66) {
			return "1476961015"; // jorin
		} else if (rand > 0.33) {
			return "691170657"; // simon
		} else {
			return "100000077428412"; // markus
		}
	}

	function randomUser() {
		var user = {
			type: "facebook",
			id: randomFacebookUserId()
		};
		var i;
		for (i = 0; i < arguments.length; i++) {
			var excludedUser = arguments[i];
			if (user.type === excludedUser.type && user.id === excludedUser.id) {
				logger.debug("exclusion");
				return randomUser();
			}
		}
		return user;
	}

	function pickBoardAndSendMessage(loc, distance, boards) {
		var board = randomElement(boards);
		datastore.getMessages(board._id, function(err, messages){
			if (err) {
				logger.debug("add message event: error", err);
			} else {
				var rand = randomMessage(board, messages);
				if (rand === null) {
					// pick another board if possible or create a new one
					if (boards.length > 1) {
						var idx = boards.indexOf(board);
						boards.splice(idx, 1);
						pickBoardAndSendMessage(boards);
					} else {
						logger.debug("add message event: no messages available, create board");
						eventAddBoard(loc, distance);
					}
				} else {
					datastore.addMessage(rand.user, board._id, rand.message, function(err, res) {
						if (err) {
							logger.debug("add message event: error", err);
						} else {
							logger.debug("add message event: done", res);
						}
					});
				}
			}
		});
	}

	function eventAddMessage(loc, distance) {
		logger.debug("add message event");
		datastore.getBoards(loc, distance, function(err, boards) {
			if (err) {
				logger.error("add board: error", err);
			} else {
				if (Array.isArray(boards) && boards.length > 0) {
					pickBoardAndSendMessage(loc, distance, boards);
				} else {
					logger.debug("add message event: no boards, create board");
					eventAddBoard(loc, distance);
				}
			}
		});
	}

	function eventAddBoard(loc, distance) {
		logger.debug("add board event");
		datastore.getBoards(loc, distance, function(err, res) {
			if (err) {
				logger.error("add board: error", err);
			} else {
				if (res.length < distance * 2) {
					datastore.addBoard(randomUser(), randomBoardTitle(), randomPosition(loc, distance), null, function(err, res) {
						if (err) {
							logger.debug("add board event: error", err);
						} else {
							logger.debug("add board event: done", res);
						}
					});
				} else {
					logger.debug("add board event: too many boards, skip");
				}
			}
		});
	}

	function randomEvent(loc, distance) {
		logger.debug("random event");
		var rand = Math.random();
		if (rand >= 0.95) {
			eventAddBoard(loc, distance);
		} else {
			eventAddMessage(loc, distance);
		}
	}

	function event(start, loc, distance, duration) {
		logger.debug("demo event");
		randomEvent(loc, distance);
		setTimeout(function() {
			var now = new Date();
			if ((start.getTime() + (duration * 60 * 1000)) < now.getTime()) {
				logger.debug("demo ended");
			} else {
				event(start, loc, distance, duration);
			}
		}, 20 * 1000);
	}

	return {
		/**
		 * @param loc Location
		 * @param distance Distance
		 * @param duration Duration in minutes
		 */
		start: function(loc, distance, duration) {
			event(new Date(),loc, distance, duration);
		}
	};
});