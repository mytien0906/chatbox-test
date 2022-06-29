const socket = io();
const input = document.querySelector("#chat_input");
const btnSend = document.querySelector("#send");
const chatBlock = document.querySelector("#chat_messages");
const formLogin = document.querySelector(".form-login");
const userName = document.querySelector('input[name="username"]');
const password = document.querySelector('input[name="password"]');
const otherProfile = document.querySelector('.other-profile');
const myProfile = document.querySelector('.my-profile');
socket.on("userNames", (msg) => {
    msg.forEach(element => {
        const span = document.createElement("span");
        span.textContent = element;
        myProfile.appendChild(span);
    });
});
// socket.on("messages", (msg) => {
//     msg.forEach(element => {
//         createMessage(element)
//     });
// });

socket.on("message", (msg) => {
  createMessage(msg);
});


formLogin.addEventListener("click", (e) => {
    e.preventDefault();
    if (userName.value && password.value) {
      socket.emit("userName", userName.value);
      userName.value = "";
      password.value = "";
      window.location.href = "http://localhost:3000/index";
    }
  });

btnSend.addEventListener("click", (e) => {
    e.preventDefault();
    if (input.value) {
      socket.emit("message", input.value);
      console.log(input.value);
      input.value = "";
    }
  });
const createMessage = (msg) => {
  const item = document.createElement("div");
  item.classList.add("message");
  item.classList.add("my-message");
  item.textContent = msg;
  chatBlock.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
};
