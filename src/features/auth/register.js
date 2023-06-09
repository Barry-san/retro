import Pristine from "pristinejs";
import { auth } from "../../../firebase.config";
import { createUserWithEmailAndPassword } from "firebase/auth";

const form = document.getElementsByTagName("form")[0];

const [email, password] = [
  document.getElementById("email"),
  document.getElementById("password"),
];

async function registerUser(e) {
  e.preventDefault();
  const pristine = new Pristine(form);
  pristine.validate();
  console.log("here");
  await createUserWithEmailAndPassword(
    auth,
    email.value,
    password.value
  )
    .then((userCred) => {
      const user = userCred.user;
      console.log(user);
    })
    .catch((err) => {
      console.log(err);
    });
  console.log("here too");
}

form.addEventListener("submit", registerUser);
