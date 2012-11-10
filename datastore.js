define(["config", "common/logger", "mongoose"], function(config, logger, mongoose) {
    "use strict";

    var db = mongoose.createConnection(config["mongo.host"], config["mongo.db"]);

    var boardSchema = new mongoose.Schema({
        title: String,
		expireAt: Date,
		createdAt: {type: Date, default: Date.now},
		user: {
			type: String,
			id: String
		},
		loc: {type: [Number], index: "2d"}
    });
    var Board = db.model("Board", boardSchema);

	var messageSchema = new mongoose.Schema({
		title: String,
		createdAt: {type: Date, default: Date.now},
		user: {
			type: String,
			id: String
		},
		boardId: {type: mongoose.Schema.Types.ObjectId, index: 1}
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
       }
   };
});