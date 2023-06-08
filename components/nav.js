export function createNavElement() {
  let nav = document.createElement("nav");
  nav.innerHTML = `
    <nav id="nav">
        <a href="/">Home</a>
        <a id="login" href="src/login.html">Login</a>
    </nav>
    `;

  nav.firstElementChild.style.display = "flex";
  nav.firstElementChild.style.justifyContent = "space-between";
  nav.style.backgroundColor = "transparent";

  return nav;
}
