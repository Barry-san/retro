import Pristine from "pristinejs";
import {
  auth,
  database,
} from "../../config/firebase.config";

import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

const form = document.getElementsByTagName("form")[0];
const googleSignupButton =
  document.getElementsByClassName("google-signup")[0];
let user;
const googleProvider = new GoogleAuthProvider();
const [username, email, password] = [
  document.getElementById("username"),
  document.getElementById("email"),
  document.getElementById("password"),
];

function validate() {
  const pristine = new Pristine(form);
  pristine.validate();
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

async function registerUser(e) {
  e.preventDefault();
  validate();
  let usernameExists = confirmUsernameUniqueness();
  console.log(usernameExists);
  // if (usernameExists !== true) {
  //   await createUserWithEmailAndPassword(
  //     auth,
  //     email.value,
  //     password.value
  //   )
  //     .then((userCred) => {
  //       addUserToDb(userCred.user.uid);
  //     })
  //     .catch((err) => {
  //       console.log(err.message);
  //     });
  // } else {
  //   console.log("Username already exists");
  // }
}

async function confirmUsernameUniqueness() {
  const docRef = doc(database, "users", username.value);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return "sike"
  } else {
    return false;
  }
}

async function addUserToDb(uid) {
  await setDoc(doc(database, "users", uid), {
    username: username.value,
    email: email.value,
  }).catch((err) => console.log(err.message));
}

form.addEventListener("submit", registerUser);
googleSignupButton.addEventListener(
  "click",
  signUpWithGoogle
);
