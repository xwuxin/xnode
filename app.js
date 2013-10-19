
var app = module.exports = require('express').createServer(),
io = require('socket.io').listen(app);
nicknames = [];

app.listen(3000);

app.get('/',function(req,res) {
	
	res.sendfile('index.html',{root:__dirname});

});

io.sockets.on('connection',function(socket){
	
	socket.on('nickname',function(data,callback){

		if(nicknames.indexOf(data) != -1){

			callback(false);

		}else{
		
			callback(true);
			nicknames.push(data);
			socket.nickname = data;
			console.log('nicknames are:'+nicknames);
			io.sockets.emit('nicknames',nicknames);
		
		}
	
	});

	socket.on('user message',function(data){
		io.sockets.emit('user message',{
			nick:socket.nickname,
			message:data
		});
	});

	socket.on('disconnect',function(){

		if(!socket.nickname) return;
		if(nicknames.indexOf(socket.nickname) > -1){
			nicknames.splice(nicknames.indexOf(socket.nickname),1);
		}
		console.log('nicknames are' + nicknames);

	});
});

