import Pristine from "pristinejs";
import bcrypt from "bcryptjs";
async function hashPassword(password) {
  let hash = await bcrypt.hash(password);
  return hash;
}
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

  let hasher = hashPassword(password);
  console.log(hasher);
}

form.addEventListener("submit", registerUser);
