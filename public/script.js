const socket = io();
const input = document.querySelector("#chat_input");
const btnSend = document.querySelector("#send");
const chatBlock = document.querySelector("#chat_messages");

btnSend.addEventListener("click", (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit("message", input.value);
    input.value = "";
  }
});
socket.on("message", (msg) => {
  createMessage(msg);
});
socket.on("messages", (msg) => {
    console.log(msg);
    msg.forEach(element => {
        createMessage(element);
    });
});

const createMessage = (msg) => {
  const item = document.createElement("div");
  item.classList.add("message");
  item.classList.add("my-message");
  item.textContent = msg;
  chatBlock.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
};
