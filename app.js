const express = require('express');
const app = express()
    .use(express.static('./src/css'))
    .use(express.static('./src/images'))
    .use(express.static('./src/js'))

const http = require('http').Server(app);
const io = require('socket.io')(http);
const nicknames = [];
const port = 2000;
let charCounter = 0
let maxChar = 15;

const word = ['hond', 'pauw', 'beer', 'muis', 'haas', 'lama'];
let randomWord = word[Math.floor(word.length * Math.random())];

randomWord = randomWord.toLowerCase();

console.log(randomWord);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/view/pages/index.html');
});

io.on('connection', function(socket) {
	socket.on('new user', function(username, callback){
			callback(true);
			socket.nickname = username;
			nicknames.push(socket.nickname);
			console.log(nicknames)
			io.emit('usernames', nicknames);
	});

    socket.on('chat message', function(msg) {
    	charCounter += msg.length
    		if(charCounter <= maxChar){
    			// let splitWord = word.split('');
	    		//  splitWord.forEach((letter)=>{
	    		//  	if(msg === letter){
	    				io.emit('chat message', {msg: msg, splitWord: randomWord, nick: socket.nickname});
	    		//  	}
	    		// })
	    		
	    	}else{
	    		console.log("stopping")
	    		io.emit('stop', {serverMsg: "Limit has been reached"})	
	    	}
		
    });

    socket.on('disconnect', function(msg){
    	if(!socket.nickname) {
    		console.log("username is gone")
    	}
    	else{
    		console.log("username is there")
    		const nicknameList = nicknames.slice(nicknames.indexOf(socket.nickname), 1)
    		console.log("listnames " + nicknameList)
    		console.log("list " + socket.nickname)
    		io.emit('user disconnected', {msg: msg, nick: socket.nickname})
    	}
		
    })
});

// http.listen(2000, () => console.log(`Example app listening on port ${port}!`))
http.listen(process.env.PORT || 2000)