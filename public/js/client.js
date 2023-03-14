let socket = io();

let messages = document.getElementById('messages');
let form = document.getElementById("form");
let input = document.getElementById("input");
let userId = Date.now();

let username = prompt("What is your desired username?");

let typing = document.querySelector('.typing');
let typingTimer;

form.addEventListener("submit", function(e) {
    e.preventDefault();
    if (input.value) {
        socket.emit("newuser", username);
        socket.emit("chat message", {
            username: username,
            msg: input.value,
            user: userId
        });
        input.value = "";
    }
});

socket.on('chat message', (data) => {
    const message = document.createElement('li');
    const messageItem = document.createElement('span');
    messageItem.textContent = `${data.username}: ${data.msg}`;
    if (data.user === userId) {
        message.classList.add("right");
    }
    message.appendChild(messageItem);
    messages.appendChild(message);
    window.scrollTo(0, document.body.scrollHeight);
});


input.addEventListener('keypress', (e) => {
    socket.emit('typing', { username: username });
});


socket.on('typing', (data) => {
    typing.textContent = data.username + " is typing...";
    setTimeout(() => { typing.textContent = ''; }, 2500);
})