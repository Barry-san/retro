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
const formSubmitButton =
  document.querySelector(".register-cta");
const googleSignupButton =
  document.getElementsByClassName("google-signup")[0];
const googleProvider = new GoogleAuthProvider();

//used javascript destructuring to get the following html elements
const [usernameElem, emailElem, passwordElem] = [
  document.getElementById("username"),
  document.getElementById("email"),
  document.getElementById("password"),
];

//form validation function from pristine js. check out https://pristine.js.org/
function validate() {
  const pristine = new Pristine(form);
  pristine.validate();
}
/* firebase function to add user to db, using the username 
as the unique document identifier. check
 https://firebase.google.com/docs/firestore/manage-data/add-data#set_a_document
 */
async function addUserToDb(uid, username, email) {
  await setDoc(doc(database, "users", username), {
    username,
    email,
    uid,
  });
}

/*function to check if the value entered as username already exists.
The user collection is checked to find a document with the particular username.
check https://firebase.google.com/docs/firestore/query-data/get-data#get_a_document */
async function confirmUserUniqueness(username) {
  const usernameRef = doc(database, "users", username);
  const usernameSnap = await getDoc(usernameRef);
  if (usernameSnap.exists()) {
    return true;
  } else {
    return false;
  }
}

/*google sign up option. start from 
https://firebase.google.com/docs/auth/web/google-signin#handle_the_sign-in_flow_with_the_firebase_sdk */
async function signUpWithGoogle() {
  await signInWithPopup(auth, googleProvider)
    .then(async (user) => {
      let username = user.user.displayName.split(" ")[0];
      let userExists = await confirmUserUniqueness(
        username
      );
      //if the user does not exist, create an instance of the user in the db
      if (!userExists) {
        addUserToDb(
          user.user.uid,
          username,
          user.user.email
        );
      }
      let userData = {
        username: username,
        email: user.user.email,
        uid: user.user.uid,
      };
      //store user data in local storage and go to the homepage
      setUserSession(userData);
      location.href = "/";
    })
    .catch((err) => {
      console.log(err.message);
    });
}

async function registerUser(e) {
  //prevent form from refreshing after submit
  e.preventDefault();
  //pristine js form validation function. https://pristine.js.org/
  validate();
  //disable form button after submission
  formSubmitButton.setAttribute("disabled", true);
  formSubmitButton.innerText = "Loading...";

  let usernameExists = await confirmUserUniqueness(
    usernameElem.value
  );

  if (usernameExists === false) {
    //if there is no user with the inputted username, create new user instance and
    //add the user to the db.
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
            //save user data in local storage and go to the homepage
            setUserSession(user);
            location.href = "/";
          });
          //in case of any errors, enable the button and change button
          //text back to it's default content.
        } catch (err) {
          console.log(err);
          formSubmitButton.removeAttribute("disabled");
          formSubmitButton.innerText = "Register";
        }
      })
      .catch((err) => {
        if (err.message.includes("email-already-in-use")) {
          console.log("Email already exists");
          formSubmitButton.removeAttribute("disabled");
          formSubmitButton.innerText = "Register";
        }
      });
  } else {
    console.log("Username already exists");
    formSubmitButton.removeAttribute("disabled");
    formSubmitButton.innerText = "Register";
  }
}

form.addEventListener("submit", registerUser);
googleSignupButton.addEventListener(
  "click",
  signUpWithGoogle
);
