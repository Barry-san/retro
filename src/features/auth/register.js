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
import { doc, getDoc, setDoc } from "firebase/firestore";
import { setUserSession } from "../../utils/usersession";

const form = document.getElementsByTagName("form")[0];
const googleSignupButton =
  document.getElementsByClassName("google-signup")[0];
const googleProvider = new GoogleAuthProvider();
const [usernameElem, emailElem, passwordElem] = [
  document.getElementById("username"),
  document.getElementById("email"),
  document.getElementById("password"),
];

function validate() {
  const pristine = new Pristine(form);
  pristine.validate();
}

async function addUserToDb(uid, username, email) {
  await setDoc(doc(database, "users", username), {
    username,
    email,
    uid,
  });
}

async function confirmUserUniqueness() {
  const usernameRef = doc(
    database,
    "users",
    usernameElem.value
  );
  const usernameSnap = await getDoc(usernameRef);
  if (usernameSnap.exists()) {
    return true;
  } else {
    return false;
  }
}

async function signUpWithGoogle() {
  await signInWithPopup(auth, googleProvider)
    .then((user) => {
      addUserToDb(
        user.user.uid,
        user.user.displayName.split(" ")[0],
        user.user.email
      );
      let userData = {
        name: user.user.displayName.split(" ")[0],
        email: user.user.email,
        uid: user.user.uid,
      };
      setUserSession(userData);
      location.href = "/";
    })
    .catch((err) => {
      console.log(err.message);
    });
}

async function registerUser(e) {
  e.preventDefault();
  validate();
  let usernameExists = await confirmUserUniqueness();
  if (usernameExists === false) {
    await createUserWithEmailAndPassword(
      auth,
      emailElem.value,
      passwordElem.value
    )
      .then(async (userCred) => {
        try {
          await addUserToDb(
            userCred.user.uid,
            usernameElem.value,
            emailElem.value
          ).then(() => {
            let user = {
              email: emailElem.value,
              uid: userCred.user.uid,
              username: usernameElem.value,
            };
            setUserSession(user);
            location.href = "/";
          });
        } catch (err) {
          console.log(err);
        }
      })
      .catch((err) => {
        if (err.message.includes("email-already-in-use")) {
          console.log("Email already exists");
        }
      });
  } else {
    console.log("Username already exists");
  }
}

form.addEventListener("submit", registerUser);
googleSignupButton.addEventListener(
  "click",
  signUpWithGoogle
);
