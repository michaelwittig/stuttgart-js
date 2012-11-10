define(["config", "logger", "mongoose"], function(config, logger, mongoose) {
    "use strict";

    var db = mongoose.createConnection(config["mongo.host"], config["mongo.db"]);

    var boardSchema = new mongoose.Schema({
        name: String,
        geo: {type: [Number], index: "2d"}
    });
    var Board = db.model("Board", boardSchema);

    var userSchema = new mongoose.Schema({
        name: String
    });
    var User = db.model("User", userSchema);

   return {
       /**
        * @param long [-180;180)
        * @param lat [-90;90]
        * @param distance in km
        */
       getBoards: function(long, lat, distance, callback) {
           // maxDistance=1.0 := 69 miles=111.044736km
           // maxDistance=0.045026898 := 5km
           // 48.742323, 9.308228 := Hafenmark1, Esslingen am Neckar
           // 48.777361, 9.175018 := Calwer Straße 11, Stuttgart
           Board.find({geo: { $near: [long, lat], $maxDistance: 0.045026898}}, callback); // TODO distance
       },
       /**
        * @param name name of the board
        * @param long [-180;180)
        * @param lat [-90;90]
        * @param userId user's id
        * @param message message
        */
       addBoard: function(name, long, lat, userId, message, callback) {
           var b1 = new Board({
               name: name,
               geo: [long, lat] // TODO userId, message
           });
           b1.save(callback);
       },
       /**
        * @param id board's id
        */
       deleteBoard: function(id, callback) {

       },
       /**
        * @param boardId board's id
        * @param userId user's id
        * @param message message
        */
       addMessage: function(boardId, user, message, callback) {

       }
   };
});