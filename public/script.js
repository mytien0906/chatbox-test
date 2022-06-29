// const socket = io();
// const input = document.querySelector("#chat_input");
// const formChat = document.querySelector(".chat-box-footer");
// const chatBlock = document.querySelector("#chat_messages");
// const formLogin = document.querySelector(".form-login");
// // const userName = document.querySelector('input[name="username"]');
// // const password = document.querySelector('input[name="password"]');
// const otherProfile = document.querySelector(".other-profile");
// const myProfile = document.querySelector(".my-profile");
// socket.on("userNames", (msg) => {
//   for (let index = 0; index < msg.length; index++) {
//     const span = document.createElement("span");

//     if (index % 2 === 0) {
//       span.textContent = msg[index];
//       myProfile.appendChild(span);
//     }
//     else{
//       span.textContent = msg[index];
//       otherProfile.appendChild(span);
//     }
//   }
//   // msg.forEach((element) => {
//   //   const span = document.createElement("span");
//   //   span.textContent = element;
//   //   myProfile.appendChild(span);
//   // });
// });
// socket.on("messages", (msg) => {
//   msg.forEach((element) => {
//     createMessage(element);
//   });
// });
// socket.on("message", (msg) => {
//   createMessage(msg);
// });

// // formLogin.addEventListener("submit", (e) => {
// //   e.preventDefault();
// //   if (userName.value && password.value) {
// //     socket.emit("userName", userName.value);
// //     userName.value = "";
// //     password.value = "";
// //     window.location.href = "http://localhost:3000/index";
// //   }
// // });
// formChat.addEventListener("submit", (e) => {
//   console.log(111);
//   e.preventDefault();
//   if (input.value) {
//     console.log(input.value);
//     socket.emit("message", input.value);
//     input.value = "";
//   }
// });
// const createMessage = (msg) => {
//   const item = document.createElement("div");
//   item.classList.add("message");
//   item.classList.add("my-message");
//   item.textContent = msg;
//   chatBlock.appendChild(item);
//   window.scrollTo(0, document.body.scrollHeight);
// };

const socket = io();

let user = {};
if (window.location.pathname === "/login") {
  if (localStorage.getItem("user")) {
    window.location.href = "/";
  }
} else {
  if (localStorage.getItem("user")) {
    user = JSON.parse(localStorage.getItem("user"));
    socket.emit("re-login", { username: user.username });
  } else {
    window.location.href = "/login";
  }
}

const btnLogin = document.querySelector("#btnLogin");
const btnRegister = document.querySelector("#btnRegister");
const username = document.querySelector("#formLogin input[name=username]");
const password = document.querySelector("#formLogin input[name=password]");

const boxStatus = document.querySelector(".box-status");
const formChat = document.querySelector("#formChat");
const inputChat = document.querySelector("#inputChat");
const btnChat = document.querySelector("#btnChat");
const chatBody = document.querySelector("#chat_box_body");
const chatMessage = document.querySelector("#chat_messages");

btnLogin?.addEventListener("click", () => {
  if (username.value && password.value) {
    socket.emit("login", {
      username: username.value,
      password: password.value,
    });
  }
});

btnRegister?.addEventListener("click", () => {
  if (username.value && password.value) {
    socket.emit("register", {
      username: username.value,
      password: password.value,
    });
  }
});

formChat?.addEventListener("submit", (e) => {
  e.preventDefault();
  if (inputChat.value) {
    socket.emit("message", {
      username: user.username,
      message: inputChat.value,
    });
    inputChat.value = "";
  }
});

socket.on("users", (users) => {
  boxStatus.innerHTML = "";
  users.forEach((user) => {
    boxStatus.innerHTML += `<div class="message other-message"><span class="${
      user?.online ? "online" : ""
    }"></span>${user?.username}</div>`;
  });
});

socket.on("login", (data) => {
  const { username, success, message } = data;
  if (success) {
    localStorage.setItem("user", JSON.stringify({ username }));
    window.location.href = "/";
  } else {
    alert(message);
  }
});

socket.on("register", (data) => {
  const { username, success, message } = data;
  if (success) {
    localStorage.setItem("user", JSON.stringify({ username }));
    window.location.href = "/";
  } else {
    alert(message);
  }
});

socket.on("logout", () => {
  localStorage.removeItem("user");
  window.location.href = "/login";
});

const createMessage = (msg, next = false) => {
  const { username, message } = msg;
  if (username === user.username) {
    chatMessage.innerHTML += `
    ${
      next
        ? ""
        : `<div class="profile my-profile">
      <img
        src="https://images.unsplash.com/photo-1534135954997-e58fbd6dbbfc?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ&s=02d536c38d9cfeb4f35f17fdfaa36619"
        width="30" height="30" />
        <span>${username}</span>
    </div>`
    }
    <div class="message my-message">${message}</div>`;
  } else {
    chatMessage.innerHTML += `
     ${
       next
         ? ""
         : `<div class="profile other-profile">
        <img
          src="https://images.unsplash.com/photo-1537396123722-b93d0acd8848?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ&s=efc6e85c24d3cfdd15cd36cb8a2471ed"
          width="30" height="30" />
          <span>${username}</span>
    </div>`
     }
    <div class="message other-message"></span>${message}</div>`;
  }
  chatBody.scrollTo(0, chatBody.scrollHeight);
};

socket.on("message", (data) => {
  const { next } = data;
  createMessage(data, next);
});

socket.on("messages", (data) => {
  for (let i = 0; i < data.length; i += 1) {
    createMessage(data[i], data[i]?.username === data[i - 1]?.username);
  }
});
