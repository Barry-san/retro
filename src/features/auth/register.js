import Pristine from "pristinejs";
import { auth } from "@/config/firebase.config";

import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

const form = document.getElementsByTagName("form")[0];
const googleSignupButton =
  document.getElementsByClassName("google-signup")[0];
let user;
const googleProvider = new GoogleAuthProvider();
const [email, password] = [
  document.getElementById("email"),
  document.getElementById("password"),
];

function validate() {
  const pristine = new Pristine(form);
  pristine.validate();
}
async function registerUser(e) {
  e.preventDefault();
  validate();
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
}

async function signUpWithGoogle() {
  await signInWithPopup(auth, googleProvider)
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err.message);
    });
}

form.addEventListener("submit", registerUser);
googleSignupButton.addEventListener(
  "click",
  signUpWithGoogle
);
