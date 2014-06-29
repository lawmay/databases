
var _ = require('underscore');
var Sequelize = require("sequelize");
var sequelize = new Sequelize("chat", "root", "", {
  dialect: 'mysql'
});

/* first define the data structure by giving property names and datatypes
 * See http://sequelizejs.com for other datatypes you can use besides STRING. */
var User = sequelize.define('User', {
  name: Sequelize.STRING
});

var Room = sequelize.define('Room', {
  name: Sequelize.STRING
});

var Message = sequelize.define('Message', {
  text: Sequelize.STRING
});

User.hasMany(Message);
Message.belongsTo(User);

Room.hasMany(Message);
Message.belongsTo(Room);


/* .sync() makes Sequelize create the database table for us if it doesn't
 *  exist already: */
sequelize.sync().success(function() {});

//Calls the callback on the room if it exists,
//otherwise creates the room, then does the callback
exports.findOrAddRoom = function(roomName, cb) {
  Room
    .find({where: {name: roomName}})
    .complete(function(err, room) {
      if (err) {
        console.log(err);
      } else if (!room) {
        //create room
        Room
          .create({
            name: roomName
          })
          .complete(function(err, room) {
            if (err) {
              console.log(err);
            } else {
              cb(room);
            }
          });
      } else {
        cb(room);
      }
    });
};
//Calls the callback on the user if it exists,
//otherwise creates the user, then does the callback
exports.findOrAddUser = function(userName, cb) {
  User
    .find({where: {name: userName}})
    .complete(function(err, user) {
      if (err) {
        console.log(err);
      } else if (!user) {
        //create user
        User
          .create({
            name: userName
          })
          .complete(function(err, user) {
            if (err) {
              console.log(err);
            } else {
              cb(user);
            }
          });
      } else {
        cb(user);
      }
    });
};

exports.addMessage = function(message) {
  exports.findOrAddRoom(message.roomname.toString(), function(room) {
    exports.findOrAddUser(message.username.toString(), function(user) {
      Message
        .create({
          text: message.text
        })
        .complete(function(err, msg) {
          if (err) {
            console.log(err);
          } else {
            room.addMessage(msg);
            user.addMessage(msg);
          }
        });
    });
  });
};

exports.readMessages = function(cb) {
  Message
    .findAll({
      include: [User, Room]
    })
    .complete(function(err, messages) {
      if (err) {
        console.log(err);
      } else {
        var msgs = _.map(messages, function(message) {
          var msg = {};

          msg.roomname = message.room.name;
          msg.username = message.user.name;
          msg.text = message.text;

          return msg;
        });
        cb(msgs);
      }
    });
};

exports.readMessagesByRoom = function(roomName, cb) {
  Room
    .find({
      where: {name: roomName}
    })
    .complete(function(err, room) {
      if (err) {
        console.log(err);
        cb([]);
      } else {
        room.getMessages({}).complete(function(err, messages) {
          if (err) {
            console.log(err);
          } else {
            cb(messages);
          }
        });
      }
    });
};

