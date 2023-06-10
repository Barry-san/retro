import { setUserSession } from "../../utils/usersession";
import {
  auth,
  database,
} from "../../config/firebase.config";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import Pristine from "pristinejs";

const form = document.getElementsByTagName("form")[0];
const googleSigninButton =
  document.getElementsByClassName("google-signin")[0];
const googleProvider = new GoogleAuthProvider();
let users = [];
const [userNameElem, passwordElem] = [
  document.getElementById("username"),
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

/*google sign in option. start from 
https://firebase.google.com/docs/auth/web/google-signin#handle_the_sign-in_flow_with_the_firebase_sdk */
async function signInWithGoogle() {
  await signInWithPopup(auth, googleProvider)
    .then(async (user) => {
      let username = user.user.displayName.split(" ")[0];
      let email = user.user.email;
      let userExists = await confirmUserUniqueness(
        email,
        username
      );
      let userData = {
        username: username,
        email: user.user.email,
        uid: user.user.uid,
      };
      // if the user does not exist, create an instance of the user in the db
      if (userExists === false) {
        await addUserToDb(
          user.user.uid,
          username,
          email
        ).then(() => {
          //store user data in local storage and go to the homepage
          setUserSession(userData);
          location.href = "/";
        });
      } else {
        setUserSession(userData);
        location.href = "/";
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
}

async function loginUser(e) {
  e.preventDefault();
  validate();
  await getAvailableUsers().then(async () => {
    await signInWithEmailAndPassword(
      auth,
      emailElem.value,
      passwordElem.value
    )
      .then(() => {
        let userData = checkForAccountExistence(
          users,
          emailElem.value
        );
        setUserSession(userData);
        location.href = "/";
      })
      .catch((err) => {
        if (err.message.includes("user-not-found")) {
          console.log("Invalid login details");
        }
      });
  });
}
async function getAvailableUsers() {
  const querySnapshot = await getDocs(
    collection(database, "users")
  );
  querySnapshot.forEach((doc) => {
    users.push(doc.data());
  });
}

/*function to check if the value entered as username already exists.
The user collection is checked to find a document with the particular username.
check https://firebase.google.com/docs/firestore/query-data/get-data#get_a_document */
async function confirmUserUniqueness(email, username) {
  const emailRef = doc(database, "users", email);
  const emailSnap = await getDoc(emailRef);
  if (emailSnap.exists()) {
    if (emailSnap.data().username === username) {
      return true;
    }
  } else {
    return false;
  }
}
form.addEventListener("submit", loginUser);
googleSigninButton.addEventListener(
  "click",
  signInWithGoogle
);
