export const createMessage = (message, userName, className) => {
  const time = getDate();
  const messageElem = document.createElement("div");
  messageElem.classList.add("messageWrapper", `${className}`);
  messageElem.innerHTML = `
    <div class="message">
              <p class="username">${userName}</p>
              <p class="text">${message}</p>
              <span class="timeStamp">${time}</span>
            </div>
    `;

  return messageElem;
};

const getDate = () => {
  const currentDate = new Date();
  const hour = currentDate.getHours().toString().padStart(2, "0");
  const minutes = currentDate.getMinutes().toString().padStart(2, "0");

  return `${hour}:${minutes}`;
};

export const updateUsersList = (users, listElem, socket) => {
  listElem.innerHTML = "";

  users.forEach((user) => {
    const listItem = document.createElement("li");
    if (user.id == socket.id) {
      listItem.classList.add("me");
    }
    listItem.textContent = user.username;
    listElem.appendChild(listItem);
  });
};

export const handleToggleSideBar = (sideBar, btn, overlay) => {
  btn.addEventListener("click", () => {
    sideBar.classList.toggle("show");
    btn.classList.toggle("open");
    overlay.classList.toggle("show");
  });

  overlay.addEventListener("click", () => {
    sideBar.classList.remove("show");
    btn.classList.remove("open");
    overlay.classList.remove("show");
  });
};

export const createTag = (text) => {
  const tag = document.createElement("p");
  tag.textContent = text;
  tag.classList.add("tag");
  return tag;
};

export const handleSendMessageOnEnter = (input, btn) => {
  input.addEventListener("keydown", (e) => {
    const key = e.code;

    if (key === "Enter") {
      e.preventDefault();
      btn.click();
    }
  });
};

export const scrollIntoView = (elem) => {
  elem.scrollIntoView();
};

export const handleThemeToggle = (btn) => {
  const body = document.querySelector("body");
  let darkTheme = localStorage.getItem("darkTheme")
    ? localStorage.getItem("darkTheme")
    : "false";
  let isDarkTheme = darkTheme === "true" ? true : false;

  if (isDarkTheme) {
    body.classList.add("dark-theme");
    btn.classList.add("dark-theme");
  } else {
    body.classList.remove("dark-theme");
    btn.classList.remove("dark-theme");
  }

  btn.addEventListener("click", () => {
    body.classList.toggle("dark-theme");
    btn.classList.toggle("dark-theme");
    if (isDarkTheme) {
      localStorage.setItem("darkTheme", false);
    } else {
      localStorage.setItem("darkTheme", true);
    }
  });
};
