import { createNavElement } from "./src/components/nav";

let nav = createNavElement();

document.body.prepend(nav);
let head = document.body.previousElementSibling;
head.insertAdjacentHTML(
  "beforeend",
  `<link rel="stylesheet" href="/style.css">`
);
