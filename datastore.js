define(["config", "common/logger", "mongoose"], function(config, logger, mongoose) {
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

   return {
       /**
        * @param loc Loc
        * @param distance in km
		* @param callback Callback(err, res)
        */
       getBoards: function(loc, distance, callback) {
           // maxDistance=1.0 := 69 miles=111.044736km
           // maxDistance=0.045026898 := 5km
           // 48.742323, 9.308228 := Hafenmark1, Esslingen am Neckar
           // 48.777361, 9.175018 := Calwer Straße 11, Stuttgart
           Board.find({loc: { $near: [loc.lng, loc.lat], $maxDistance: 0.045026898}}, callback); // TODO distance
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
           b.save(callback);
		   // TODO publish a message to redis that a new board was created
       },
	   /**
		* @param boardId board's id
		* @param callback Callback(err, res)
		*/
	   getMessages: function(boardId, callback) {
		   Message.find({boardId: boardId}, callback); // TODO order by createdAt
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
		   m.save(callback);
		   // TODO publish a new message into the boards room
       }
   };
});