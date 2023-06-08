export function createNavElement() {
  let nav = document.createElement("nav");
  nav.innerHTML = `
    <nav id="nav">
        <a href="/">Home</a>
        <div>
        <a id="login" href="/src/features/auth/login.html">Login</a>
        <a id="register" href="/src/features/auth/register.html" style="margin-left: 10px;">Register</a>
        </div>
    </nav>
    `;

  nav.firstElementChild.style.display = "flex";
  nav.firstElementChild.style.justifyContent =
    "space-between";
  nav.style.backgroundColor = "transparent";

  return nav;
}
