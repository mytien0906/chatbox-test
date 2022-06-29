const socket = io();
const input = document.querySelector("#chat_input");
const formChat = document.querySelector(".chat-box-footer");
const chatBlock = document.querySelector("#chat_messages");
const formLogin = document.querySelector(".form-login");
// const userName = document.querySelector('input[name="username"]');
// const password = document.querySelector('input[name="password"]');
const otherProfile = document.querySelector(".other-profile");
const myProfile = document.querySelector(".my-profile");
socket.on("userNames", (msg) => {
  for (let index = 0; index < msg.length; index++) {
    const span = document.createElement("span");

    if (index % 2 === 0) {
      span.textContent = msg[index];
      myProfile.appendChild(span);
    }
    else{
      span.textContent = msg[index];
      otherProfile.appendChild(span);
    }
  }
  // msg.forEach((element) => {
  //   const span = document.createElement("span");
  //   span.textContent = element;
  //   myProfile.appendChild(span);
  // });
});
socket.on("messages", (msg) => {
  msg.forEach((element) => {
    createMessage(element);
  });
});
socket.on("message", (msg) => {
  createMessage(msg);
});

// formLogin.addEventListener("submit", (e) => {
//   e.preventDefault();
//   if (userName.value && password.value) {
//     socket.emit("userName", userName.value);
//     userName.value = "";
//     password.value = "";
//     window.location.href = "http://localhost:3000/index";
//   }
// });
formChat.addEventListener("submit", (e) => {
  console.log(111);
  e.preventDefault();
  if (input.value) {
    console.log(input.value);
    socket.emit("message", input.value);
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
