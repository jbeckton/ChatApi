/**
 * Created by jbeckton on 2/9/16.
 */
module.exports = function (params) {

    var app = params.app;
    var Room = require('../models/room.js');

    function getRooms(req, res) {

        Room.find({}, function(err, rooms){
            if(err){
                res.send(err);
            }

            res.json(rooms);

        });

    };

    function createRoom(req, res) {

        var room = new Room();

        room.name = req.body.name;
        room.createdBy = req.user;

        room.save(function(err){
            if(err){
                res.send(err);
            }

            res.json({room: room});

        })



    }

    return {
        getRooms: getRooms,
        createRoom: createRoom

    }

}