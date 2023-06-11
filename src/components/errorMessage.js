export function errorMessage(msg) {
  // creating the component's elements
  const container = document.createElement("div");
  const message = document.createElement("p");
  const closeButton = document.createElement("button");

  message.textContent = msg;
  closeButton.textContent = "close";

  //on click function to close component
  closeButton.addEventListener("click", () => {
    container.style.display = "none";
  });

  //appending elements to component
  container.append(message);
  container.append(closeButton);

  //component styling
  container.style.maxWidth = "300px";
  container.style.border = "solid 1px black";
  container.style.padding = ".5rem";
  container.style.display = "flex";
  container.style.alignItems = "center";
  container.style.justifyContent = "space-evenly";
  container.style.gap = "1rem";
  container.style.top = "20%";
  container.style.marginInline = "auto";
  message.style.textAlign = "center";

  return container;
}
