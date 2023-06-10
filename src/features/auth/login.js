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
  getDocs,
  setDoc,
} from "firebase/firestore";
import Pristine from "pristinejs";

const form = document.getElementsByTagName("form")[0];
const googleSigninButton =
  document.getElementsByClassName("google-signin")[0];
const googleProvider = new GoogleAuthProvider();
let users = [];
const [emailElem, passwordElem] = [
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

async function signInWithGoogle(e) {
  e.preventDefault();
  await getAvailableUsers().then(async () => {
    await signInWithPopup(auth, googleProvider)
      .then((userCred) => {
        let username =
          userCred.user.displayName.split(" ")[0];
        let email = userCred.user.email;
        let uid = userCred.user.uid;
        let result = checkForAccountExistence(users, email);
        let user = { username, email, uid };
        if (!result) {
          addUserToDb(uid, username, email);
          setUserSession(user);
        } else {
          setUserSession(user);
        }
        location.href = "/";
      })
      .catch((err) => console.log(err.message));
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

function checkForAccountExistence(userList, email) {
  const existingAccount =
    userList && userList.find((x) => x.email === email);
  return existingAccount ? existingAccount : false;
}

form.addEventListener("submit", loginUser);
googleSigninButton.addEventListener(
  "click",
  signInWithGoogle
);
