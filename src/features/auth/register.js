const form = document.getElementsByTagName("form")[0];
const [username, password, confirm_password] = [
  document.getElementById("username"),
  document.getElementById("password"),
  document.getElementById("confirm_password"),
];

function registerUser(e) {
  if (password.value !== confirm_password.value) {
    alert("Incorrect");
  }
  console.log({
    username: username.value,
    password: password.value,
    confirm_password: confirm_password.value,
  });
}

form.addEventListener("submit", registerUser);
