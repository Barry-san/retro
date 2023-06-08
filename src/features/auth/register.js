import Pristine from "pristinejs";

const form = document.getElementsByTagName("form")[0];
const [password, confirm_password, confirm_password_error] =
  [
    document.getElementById("password"),
    document.getElementById("confirm-password"),
    document.getElementById("confirm-password-error"),
  ];

function registerUser(e) {
  e.preventDefault();
  const pristine = new Pristine(form);
  pristine.validate();

  if (password.value !== confirm_password.value) {
    confirm_password_error.innerText =
      "Password does not match confirm password.";
  }
}

form.addEventListener("submit", registerUser);
