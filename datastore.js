define(["config", "common/logger", "mongoose", "pubsub"], function(config, logger, mongoose, pubsub) {
    "use strict";

    var db = mongoose.createConnection(config["mongo.url"]);

    var boardSchema = new mongoose.Schema({
        title: {type: String, required: true},
		expireAt: {type: Date, required: false}, // TODO implement expiry of boards
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
			loc: board.loc,
			user: board.user,
			createdAt: board.createdAt
		};
	}

   return {
       /**
        * @param loc Loc
        * @param distance in km
		* @param callback Callback(err, res)
        */
       getBoards: function(loc, distance, callback) {
		   distance = distance * 0.0090053796;
           Board.find({loc: { $near: [loc.lng, loc.lat], $maxDistance: distance}}, function(err, res) {
			   if (err) {
				   callback(err);
			   } else {
				   if (Array.isArray(res)) {
					   var view = [];
					   logger.debug("modify boards");
						res.forEach(function(board) {
							var b = boardView(board);
							b._distance = 1.0; // TODO add distance to output array
							logger.debug("modify board", b);
							view.push(b);
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
		* @param callback Callback(err, res)
        */
       addBoard: function(user, title, loc, callback) {
           var b = new Board({
               title: title,
			   user: {
				   type: user.type,
				   id: user.id
			   },
               loc: [loc.lng, loc.lat]
           });
           b.save(function(err, res) {
			   if (err) {
				   callback(err, res);
			   } else {
				   pubsub.pub("boards", {loc: loc});
				   callback(err, res);
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
					callback(err, res);
			   }
		   });
       }
   };
});