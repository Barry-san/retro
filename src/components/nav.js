import {
  userSession,
  logOutUser,
} from "../utils/usersession";

//nav component. checks if user exists and returns the corresponding navigation bars based on
export function createNavElement() {
  let userExists = userSession ? true : false;
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
    //check out https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentElement#syntax
    nav.insertAdjacentElement("beforeend", logoutButton);
  }
  return nav;
}
