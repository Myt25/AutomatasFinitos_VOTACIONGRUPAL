//inicio
var express = require("express");
var path = require("path");
var app = express();

/*
DIRECCIONAMIENTO DE LA UBICACION DE LOS ARCHIVOS Y NOMBRE
*/
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.get('/', function(req, res) {
    res.render("index");
});

/*
PUERTO DONDE SE LEVANTARA EL SERVIDOR
*/
var server = app.listen(1111, function() {
    console.log("Escuchando en el puerto 1111");
});

/*
ESCUCHANDO AL SERVIDOR
*/
var io = require('socket.io').listen(server);

/*
contador inciados en ceros
*/
var con_gmail = 0;
var con_itsva = 0;
var con_otro = 0;

/*
ESTABLECIMIENTO DE LA CONEXION
Y LAS OPCIONES ELEJIDAS EN CONSOLA
*/
io.sockets.on('connection', function(socket) {
    console.log("servidor corriendo para los votos");
    //muestra los datos en la consola
    io.emit('sum_yesVotes', { response: con_gmail });
    io.emit('sum_noVotes', { response: con_itsva });
    io.emit('sum_OTRO', { response: con_otro });
    



/*
EL PRIMER VOTO SE CUENTA Y ES RELEJADO EN LA PAGINA,
SI SE VUELVE A VOTAR YA NO SE CUENTA EL VOTO
*/
    socket.on("vote", function(data) {
        console.log('Voto' + data.newVote);
        if (data.newVote == ' GMAIL') {
            con_gmail += 1;
            io.emit('sum_yesVotes', { response: con_gmail });
           io.emit('sum_all', { response: (con_gmail + con_itsva + con_otro) }); //datos de entrada de otros usuarios
            return con_gmail;
        } else if (data.newVote == ' ITSVA') {
            con_itsva += 1;
            io.emit('sum_noVotes', { response: con_itsva });
            io.emit('sum_all', { response: (con_gmail + con_itsva + con_otro) }); //datos de entrada de otros usuarios
            return con_itsva;
        } else if (data.newVote == ' OTRO') {
            con_otro += 1;
            io.emit('sum_OTRO', { response: con_otro });
            io.emit('sum_all', { response: (con_gmail + con_itsva + con_otro) }); //datos de entrada de otros usuarios
            return con_otro;
        }
    });


})