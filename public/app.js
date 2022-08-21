import {
  createMessage,
  updateUsersList,
  handleToggleSideBar,
  createTag,
  handleSendMessageOnEnter,
  scrollIntoView,
  handleThemeToggle,
} from "./utils.js";
// UI elements
const sideBar = document.querySelector(".sideBar");
const overlay = document.querySelector(".overlay");
const sideBarBtn = document.querySelector(".open-sideBarBtn");
const themeBtn = document.querySelector(".theme-btn");

handleToggleSideBar(sideBar, sideBarBtn, overlay);

handleThemeToggle(themeBtn);
// Chat Elements
const form = document.querySelector(".form");
const input = document.querySelector("textarea");
const sendBtn = document.querySelector(".form button");
const messagesContainer = document.querySelector(".messagesContainer");
const usersList = document.querySelector(".sideBar ul");

handleSendMessageOnEnter(input, sendBtn);

// Login Page Elements
const loginPage = document.querySelector(".loginPage");
const nameInput = document.querySelector(".nameInput");
const loginForm = document.querySelector(".loginForm");

let name;

// Handle Join Server
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  name = nameInput.value;

  if (name) {
    loginPage.classList.add("hide");

    nameInput.value = "";

    connect();
  }
});

// Handle connection and interact with server
const connect = () => {
  // Connect
  const socket = io();

  socket.emit("join-server", name);

  // create "you joined" tag locally
  const youJoinedTag = createTag("Você entrou");
  messagesContainer.appendChild(youJoinedTag);
  scrollIntoView(youJoinedTag);

  socket.on("new-user", (users) => {
    updateUsersList(users, usersList, socket);
  });

  // Send tags to other users
  socket.on("user-joined", (name) => {
    const userJoinedTag = createTag(`${name} entrou`);
    messagesContainer.appendChild(userJoinedTag);
    scrollIntoView(userJoinedTag);
  });

  // Handle user disconnect
  socket.on("user-disconnected", (user) => {
    const userLeftTag = createTag(`${user.username} saiu`);
    messagesContainer.appendChild(userLeftTag);
    scrollIntoView(userLeftTag);
  });

  // Send Message
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = input.value;
    if (message) {
      socket.emit("send-message", message);

      const messageElem = createMessage(message, "Você", "myMessage");
      messagesContainer.appendChild(messageElem);
      scrollIntoView(messageElem);

      input.value = "";
    }
  });

  sendBtn.addEventListener("click", () => {
    input.focus();
  });

  // Receive Message
  socket.on("message-sent", ({ message, user }) => {
    const messageElem = createMessage(message, user, "otherMessage");

    messagesContainer.appendChild(messageElem);
    scrollIntoView(messageElem);
  });
};
