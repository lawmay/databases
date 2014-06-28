//Have a hash initiated here that is updated each thing
//

var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'chat'
});

connection.connect();


exports.roomExists = function(roomName, cb) {
  connection.query('SELECT * FROM rooms', function(err, rows) {
    if (err) throw err;
    for (var i = 0; i < rows.length; i++) {
      var room = rows[i];
      if (roomName === room.name) {
        cb(room.id);
        return;
      }
    }
    cb(undefined);
  });
};

exports.userExists = function(userName, cb) {
  connection.query('SELECT * FROM users', function(err, rows) {
    if (err) throw err;
    for (var i = 0; i < rows.length; i++) {
      var user = rows[i];
      if (userName === user.name) {
        cb(user.id);
        return;
      }
    }
    cb(undefined);
  });
};


exports.findOrAddRoom = function(roomName, cb) {
  exports.roomExists(roomName, function(roomId) {
    if (roomId !== undefined) {
      cb(roomId);
    } else {
      connection.query('INSERT INTO rooms (name) VALUES (' + connection.escape(roomName) + ')',function(err, result) {
        if (err) throw err;
        cb(result.insertId);
      });
    }
  });
};

exports.addMessage = function(message) {
  exports.findOrAddRoom(message.roomname.toString(), function(roomId) {
    exports.findOrAddUser(message.username.toString(), function(userId) {
      connection.query('INSERT INTO messages (id_room, id_user, text, createdAt) VALUES (' +
          roomId + ', ' + userId + ', ' + connection.escape(message.text) +', ' + connection.escape(new Date()) +
          ')', function(err, result) {
        if (err) throw err;
      });
    });
  });
};

exports.findOrAddUser = function(userName, cb) {
  exports.userExists(userName, function(userId) {
    if (userId !== undefined) {
      cb(userId);
    } else {
      connection.query('INSERT INTO users (name) VALUES (' + connection.escape(userName) + ')',function(err, result) {
        if (err) throw err;
        cb(result.insertId);
      });
    }
  });
};

exports.readMessages = function(cb) {
  connection.query( 'SELECT messages.id, text, rooms.name AS roomname, users.name AS username FROM messages ' +
                    'LEFT JOIN rooms ON messages.id_room = rooms.id ' +
                    'LEFT JOIN users ON messages.id_user = users.id',
                    function(err, messages) {
    if (err) throw err;

    cb(messages);
  });
};

exports.readMessagesByRoom = function(roomName, cb) {
  connection.query( 'SELECT messages.id, text, rooms.name AS roomname, users.name AS username FROM messages ' +
                    'LEFT JOIN rooms ON messages.id_room = rooms.id ' +
                    'LEFT JOIN users ON messages.id_user = users.id ' +
                    'WHERE rooms.name = ' + connection.escape(roomName),
                    function(err, messages) {
    if (err) throw err;

    cb(messages);
  });
};

