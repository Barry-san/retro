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
/* firebase function to add user to db, using the email 
as the unique document identifier. check
 https://firebase.google.com/docs/firestore/manage-data/add-data#set_a_document
 */
async function addUserToDb(uid, username, email) {
  await setDoc(doc(database, "users", email), {
    username,
    email,
    uid,
  });
}

/*function to check if the value entered as email already exists.
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

/*google sign up option. start from 
https://firebase.google.com/docs/auth/web/google-signin#handle_the_sign-in_flow_with_the_firebase_sdk */
async function signUpWithGoogle() {
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

async function registerUser(e) {
  let [username, email, password] = [
    usernameElem.value,
    emailElem.value,
    passwordElem.value,
  ];
  //prevent form from refreshing after submit
  e.preventDefault();
  //pristine js form validation function. https://pristine.js.org/
  validate();

  //disable form button after submission
  formSubmitButton.setAttribute("disabled", true);
  formSubmitButton.innerText = "Loading...";

  let userExists = await confirmUserUniqueness(
    email,
    username
  );

  if (userExists === false) {
    //if there is no user with the inputted username, create new user instance and
    //add the user to the db.
    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )
      .then(async (userCred) => {
        try {
          await addUserToDb(
            userCred.user.uid,
            username,
            emailElem.value
          ).then(() => {
            let user = {
              email: emailElem.value,
              uid: userCred.user.uid,
              username,
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
