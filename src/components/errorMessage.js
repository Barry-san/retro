export function errorMessage(msg) {
  // creating the component's elements
  const container = document.createElement("div");
  const message = document.createElement("p");

  message.textContent = msg;
  // closeButton.textContent = "close";

  //appending elements to component
  container.append(message);
  container.classList.add("error-message");
  return container;
}
