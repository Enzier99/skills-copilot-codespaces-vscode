// create web server
var express = require('express');
var app = express();
// create server
var server = require('http').createServer(app);
// create socket
var io = require('socket.io').listen(server);
// create mysql connection
var mysql = require('mysql');

// create mysql connection
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'comments'
});

// connect to mysql
connection.connect(function(error) {
    if (error) {
        console.log(error);
    } else {
        console.log('Connected to MySQL');
    }
});

// create table if not exists
connection.query('CREATE TABLE IF NOT EXISTS comments (id int primary key auto_increment, name varchar(255), comment text)', function(error, result) {
    if (error) {
        console.log(error);
    } else {
        console.log('Table created');
    }
});

// server listen on port 3000
server.listen(3000);

// show index.html
app.get('/', function(request, response) {
    response.sendFile(__dirname + '/index.html');
});

// show comments
app.get('/comments', function(request, response) {
    connection.query('SELECT * FROM comments', function(error, result) {
        if (error) {
            console.log(error);
        } else {
            response.send(result);
        }
    });
});

// add comment
app.get('/add', function(request, response) {
    var name = request.query.name;
    var comment = request.query.comment;
    connection.query('INSERT INTO comments (name, comment) VALUES (?, ?)', [name, comment], function(error, result) {
        if (error) {
            console.log(error);
        } else {
            response.send('Comment added');
        }
    });
});

// listen to socket
io.sockets.on('connection', function(socket) {
    socket.on('add', function(data) {
        io.sockets.emit('add', data);
    });
});