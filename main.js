import { createNavElement } from "./src/components/nav";
import { userSession } from "./usersession";
let nav = createNavElement();
document.body.prepend(nav);
console.log(userSession);
let userName = document.querySelector("#user-name");
let userEmail = document.querySelector("#user-email");
if (userName && userSession)
  userName.innerText = userSession.username;

if (userEmail && userSession)
  userName.innerText = userSession.email;

let head = document.body.previousElementSibling;
head.insertAdjacentHTML(
  "beforeend",
  `<link rel="stylesheet" href="/style.css">`
);
