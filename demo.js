/**
 * The demo module can make some noice to impress the jury :)
 */
define(["datastore", "common/logger"], function(datastore, logger) {
	"use strict";

	// user 0 is the conversation starter, user 1 and 2 are the other guys :)
	var conversations = {
		"You're... Jimmie, right? This is your house?": [
			{
				user: 1,
				message: "Sure is."
			}, {
				user: 0,
				message: "I'm Winston Wolfe. I solve problems."
			}, {
				user: 1,
				message: "Good, we got one."
			}, {
				user: 0,
				message: "So I heard. May I come in?"
			}, {
				user: 1,
				message: "Uh, yeah, please do."
			}
		],
		"So, I hear you're taking Mia out.": [
			{
				user: 1,
				message: "At Marsellus's request."
			}, {
				user: 0,
				message: "You met Mia yet?"
			}, {
				user: 1,
				message: "No."
			}, {
				user: 0,
				message: "What's so fucking funny?"
			}, {
				user: 2,
				message: "I gotta piss."
			}, {
				user: 1,
				message: " Look, I'm not stupid. It's the Big Man's wife. I'm gonna sit across from her, chew my food with my mouth closed, laugh at her fucking jokes, and that's it."
			}
		],
		"Whose motorcycle is this?": [
			{
				user: 1,
				message: "It's a chopper, baby."
			}, {
				user: 0,
				message: "Whose chopper is this?"
			}, {
				user: 1,
				message: "It's Zed's."
			}, {
				user: 0,
				message: "Who's Zed?"
			}, {
				user: 1,
				message: "Zed's dead, baby. Zed's dead."
			}
		],
		"Where's my watch?": [
			{
				user: 1,
				message: "It's there."
			}, {
				user: 0,
				message: "No it's not."
			}, {
				user: 1,
				message: "It should be."
			}, {
				user: 0,
				message: "Yes, it most definitely should be but it's not here now, so where the fuck is it?"
			}
		],
		"Maybe I can give you guys a ride. Where do you live?": [
			{
				user: 1,
				message: "Redondo Beach."
			}, {
				user: 2,
				message: "Inglewood."
			}, {
				user: 0,
				message: "It's your future... I see a cab ride. Move out of the sticks, gentlemen."
			}
		],
		"Vincent, do you still want to hear my Fox Force Five joke?": [
			{
				user: 1,
				message: "Sure, but I think I'm still a little too petrified to laugh."
			}, {
				user: 0,
				message: "No, you wont laugh, 'cus it's not funny. But if you still wanna hear it, I'll tell it."
			}, {
				user: 1,
				message: "I can't wait. "
			}, {
				user: 0,
				message: "Three tomatoes are walking down the street- a poppa tomato, a momma tomato, and a little baby tomato. Baby tomato starts lagging behind. Poppa tomato gets angry, goes over to the baby tomato, and smooshes him... and says, Catch up."
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
		var lngD = rand(-0.005, 0.005);
		var latD = rand(-0.005, 0.005);
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
						pickBoardAndSendMessage(loc, distance, boards);
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
				if (res.length < 10) {
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
		}, rand(5, 15) * 1000);
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