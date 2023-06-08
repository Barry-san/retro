export function createNavElement(loginLink) {
  let nav = document.createElement("nav");
  nav.innerHTML = `
    <nav id="nav">
        <a href="/">Home</a>
        <a id="login" href="/${loginLink}">Login</a>
    </nav>
    `;

  nav.firstElementChild.style.display = "flex";
  nav.firstElementChild.style.justifyContent = "space-between";
  nav.style.backgroundColor = "transparent";

  return nav;
}
