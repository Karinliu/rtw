(function() {
    const form = document.querySelector('.message');
    const inputValue = document.querySelector('#m');
	const charCounter =  document.getElementById("charcount");
    let contentWrap = document.getElementById("contentWrap");

    let nickForm = document.getElementById("nickForm");
    let nickError = document.getElementById("nickError");
    let nickBox = document.getElementById("nickName");
    const socket = io();
    const maxCharacters = 100;
    let messageLength = 0;

    //Username form
    nickForm.addEventListener("submit", function(e) {
        e.preventDefault();
            socket.emit('new user', nickBox.value, function(username){
                if(username){
                    nickWrap.classList.add('hidden');
                    contentWrap.classList.remove('hidden');
                }else{
                    nickError.innerHTML = "Username is taken"
                }
            });
            nickBox.value = "";
        
    });

    //Chat form
    form.addEventListener("submit", function(e) {
        e.preventDefault();

        messageLength += inputValue.value.length;

        charCounter.innerHTML = messageLength +'/10';

        if (messageLength <= maxCharacters) {
            socket.emit('chat message', inputValue.value);
            inputValue.value = "";
            return false;
        }else{
        	charCounter.innerHTML = "Je hebt het max characters bereikt!"
        }
        
    });

    socket.on('stop', function(msg) {
        charCounter.innerHTML = msg.serverMsg//"Je hebt het max characters bereikt!"
    })

    //Username form on socket
    socket.on('usernames', function(username){
        let html = 'Current users in chat:' + '<br/>';
        for(i=0; i<username.length; i++){
            html += "•" + username[i] + '<br>'
        }
        let users = document.getElementById("users");
        console.log(users)
        // users.insertAdjacentHTML('beforeend', html )
        users.innerHTML = html;

        console.log(username);
    });

    //Chat form on socket
    socket.on('chat message', function(data) {
        let words = {
        x:"Spel starten!"
        }

        let n= data.msg.replace(/x/gi, function(matched){
          return words[matched];
        });

        console.log(n)

        let messages = document.querySelector('#messages');
        const li = document.createElement("li");
        const msgtext = document.createTextNode(data.letter);
        const msguser = document.createTextNode(data.nick + ": ");

        let rightletters = data.splitWord;
        let position = ['first', 'second', 'third', 'four', 'five','six'];

        let rightWord = data.splitWord;

        console.log(rightWord)

        for (i = 0; i < rightWord.length; i++) {
            if (data.msg === rightWord[i]) {
                console.log(data.msg)
                document.getElementById(position[i]).innerHTML = data.msg + " ";
            }else{
                document.getElementById(position[i]).innerHTML = "_ ";
            }
        }

        // li.insertAdjacentHTML('beforeend', data.nick + ": " + data.msg)
        li.insertAdjacentHTML('beforeend', data.nick + ": " + n)
        messages.appendChild(li);
    });
    // socket.on('chat message', function() {});
    socket.on('user disconnected', function (data) {
        let messagesUser = document.querySelector('#messages');
        const disconnect = document.createElement("li");

        if(data.nick === undefined){
            console.log("doe niks")
        }else{
            disconnect.insertAdjacentHTML('beforeend', data.nick + ": is disconnected");
            messagesUser.appendChild(disconnect);
            console.log(data.nick + ": is disconnected")
        }
    });

}());