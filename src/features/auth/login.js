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
import { doc, getDoc, setDoc } from "firebase/firestore";
import Pristine from "pristinejs";

const form = document.getElementsByTagName("form")[0];
const googleSigninButton =
  document.getElementsByClassName("google-signin")[0];
const googleProvider = new GoogleAuthProvider();
const [emailElem, passwordElem] = [
  document.getElementById("email"),
  document.getElementById("password"),
];

function validate() {
  const pristine = new Pristine(form);
  pristine.validate();
}

//add user to firestore db. 
async function addUserToDb(uid, displayName, email) {
  await setDoc(doc(database, "users", email), {
    displayName,
    email,
    uid,
  });
}

/*google sign up option. start from 
https://firebase.google.com/docs/auth/web/google-signin#handle_the_sign-in_flow_with_the_firebase_sdk */
async function signInWithGoogle() {
  await signInWithPopup(auth, googleProvider)
    .then(async (user) => {
      let displayName = user.user.displayName;
      let email = user.user.email;
      let uid = user.user.uid;
      let userExists = await checkUserExistence(email);
      let userData = {
        displayName,
        email,
        uid,
      };
      // if the user does not exist, create an instance of the user in the db
      if (userExists === false) {
        await addUserToDb(uid, displayName, email).then(
          () => {
            //store user data in local storage and go to the homepage
            setUserSession(userData);
            location.href = "/";
          }
        );
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
  const [email, password] = [
    emailElem.value,
    passwordElem.value,
  ];
  e.preventDefault();
  validate();
  let userAccount = await checkUserExistence(email);
  if (userAccount) {
    await signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setUserSession(userAccount);
        location.href = "/";
      })
      .catch((err) => {
        console.log(err);
        console.log("invalid login details");
      });
  }
}

/*function to check if the value entered as username already exists.
The user collection is checked to find a document with the particular username.
check https://firebase.google.com/docs/firestore/query-data/get-data#get_a_document */
async function checkUserExistence(email) {
  const emailRef = doc(database, "users", email);
  const emailSnap = await getDoc(emailRef);
  if (emailSnap.exists()) {
    console.log(emailSnap.data());
    return emailSnap.data();
  } else {
    return false;
  }
}
form.addEventListener("submit", loginUser);
googleSigninButton.addEventListener(
  "click",
  signInWithGoogle
);
