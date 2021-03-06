define(["config", "common/logger", "common/lnglat", "mongoose", "pubsub"], function(config, logger, lnglat, mongoose, pubsub) {
    "use strict";

    var db = mongoose.createConnection(config["mongo.url"]);

    var boardSchema = new mongoose.Schema({
        title: {type: String, required: true},
		expireAt: {type: Date, required: false},
		createdAt: {type: Date, required: true, default: Date.now},
		user: {
			type: {type: String, required: true},
			id: {type: String, required: true}
		},
		loc: {type: [Number], required: true, index: "2d"}
    });
    var Board = db.model("Board", boardSchema);

	var messageSchema = new mongoose.Schema({
		title: {type: String, required: true},
		createdAt: {type: Date, required: true, default: Date.now, index: true},
		user: {
			type: {type: String, required: true},
			id: {type: String, required: true}
		},
		boardId: {type: mongoose.Schema.Types.ObjectId, required: true, index: true}
	});
	var Message = db.model("Message", messageSchema);

	function messageView(message) {
		return {
			_id: message._id,
			title: message.title,
			user: message.user,
			createdAt: message.createdAt
		};
	}

	function boardView(board) {
		return {
			_id: board._id,
			title: board.title,
			loc: {
				lng: board.loc[0],
				lat: board.loc[1]
			},
			user: board.user,
			createdAt: board.createdAt,
			expireAt: board.expireAt
		};
	}

	function removeBoard(board) {
		board.remove(function(err) {
			if (err) {
				logger.error("can not remove board", err);
			} else {
				Message.find({boardId: board._id}, function(err, res) {
					if (err) {
						logger.error("can not remove board messages", err);
					} else {
						res.forEach(function(message) {
							message.remove();
						});
					}
				});
				var b = boardView(board);
				logger.debug("removed board", b);
				pubsub.pub("messages", {"boardId": b._id});
				pubsub.pub("boards", {loc: b.loc});
			}
		});
	}

   return {
       /**
        * @param loc Loc
        * @param distance in miles
		* @param callback Callback(err, res)
        */
       getBoards: function(loc, distance, callback) {
		   distance = distance * 1.609344 * 0.0090053796; // distance to km to lnglat
           Board.find({loc: { $near: [loc.lng, loc.lat], $maxDistance: distance}}, function(err, res) {
			   if (err) {
				   callback(err);
			   } else {
				   var time = new Date().getTime();
				   if (Array.isArray(res)) {
					   var view = [];
						res.forEach(function(board) {
							var b = boardView(board);
							b._distance = lnglat.distance(loc, b.loc);
							if (b.expireAt && b.expireAt.getTime() < time) {
								removeBoard(board);
							} else {
								view.push(b);
							}
						});
				   }
				   callback(undefined, view);
			   }
		   });
       },
       /**
		* @param user User
        * @param title title of the board
        * @param loc Loc
		* @param expireIn (in hours)
		* @param callback Callback(err, res)
        */
       addBoard: function(user, title, loc, expireIn, callback) {
		   var expireAt;
		   if (expireIn > 0) {
			   expireAt = new Date(new Date().getTime() + (expireIn * 60 * 60 * 1000));
		   }
           var b = new Board({
               title: title,
			   user: {
				   type: user.type,
				   id: user.id
			   },
               loc: [loc.lng, loc.lat],
			   expireAt: expireAt
           });
           b.save(function(err, res) {
			   if (err) {
				   callback(err, res);
			   } else {
				   pubsub.pub("boards", {loc: loc});
				   callback(err, boardView(res));
			   }
		   });
       },
	   /**
		* @param boardId board's id
		* @param callback Callback(err, res)
		*/
	   getMessages: function(boardId, callback) {
		   Message.find({boardId: boardId}, null, {sort: {
			   createdAt: 1
		   }}, function(err, res) {
			   if (err) {
				   callback(err);
			   } else {
				   if (Array.isArray(res)) {
					   var view = [];
					   res.forEach(function(message) {
						   var m =  messageView(message);
						   view.push(m);
					   });
				   }
				   callback(undefined, view);
			   }
		   });
	   },
       /**
		* @param user User
        * @param boardId board's id
        * @param message message
		* @param callback Callback(err, res)
        */
       addMessage: function(user, boardId, message, callback) {
		   var m = new Message({
			   title: message,
			   user: {
				   type: user.type,
				   id: user.id
			   },
			   boardId: boardId
		   });
		   m.save(function(err, res) {
			   if (err) {
				   callback(err, res);
			   } else {
					pubsub.pub("messages", {"boardId": boardId});
					callback(err, messageView(res));
			   }
		   });
       }
   };
});