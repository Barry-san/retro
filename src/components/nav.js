import {
  userSession,
  logOutUser,
} from "../utils/usersession";

export function createNavElement() {
  let userExists = userSession ? true : false;
  console.log(userExists);
  let nav = document.createElement("nav");

  nav.style.backgroundColor = "transparent";
  if (userExists === false) {
    nav.innerHTML = `
    <nav id="nav">
        <a href="/">Home</a>
        <div>
        <a id="login" href="/src/features/auth/login.html">Login</a>
        <a id="register" href="/src/features/auth/register.html">Register</a>
        </div>
    </nav>
    `;
  } else {
    let logoutButton = document.createElement("button");
    logoutButton.innerText = "Log Out";
    logoutButton.addEventListener("click", logOutUser);

    nav.innerHTML = `
    <nav id="nav">
        <a href="/">Home</a>
    </nav>
    `;
    nav.insertAdjacentElement("beforeend", logoutButton);
  }

  return nav;
}
