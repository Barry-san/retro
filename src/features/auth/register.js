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

const form = document.querySelector(".register-form");
const formSubmitButton =
  document.querySelector(".register-cta");
const googleSignupButton = document.querySelector(
  ".google-signup"
);
const googleProvider = new GoogleAuthProvider();

//used javascript destructuring to get the following html elements
const [displayNameElem, emailElem, passwordElem] = [
  document.getElementById("display-name"),
  document.getElementById("email"),
  document.getElementById("password"),
];

//form validation function from pristine js. check out https://pristine.js.org/ and the demo page
function validate() {
  const pristine = new Pristine(form);
  pristine.validate();
}
/* firebase function to add user to db, using the email 
as the unique document identifier. check
 https://firebase.google.com/docs/firestore/manage-data/add-data#set_a_document
 */
async function addUserToDb(uid, displayName, email) {
  await setDoc(doc(database, "users", email), {
    displayName,
    email,
    uid,
  });
}

/*function to check if the value entered as email already exists.
The user collection is checked to find a document with the particular email
check https://firebase.google.com/docs/firestore/query-data/get-data#get_a_document */
async function confirmUserUniqueness(email) {
  const emailRef = doc(database, "users", email);
  const emailSnap = await getDoc(emailRef);
  if (emailSnap.exists()) {
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
      let displayName = user.user.displayName;
      let email = user.user.email;
      let uid = user.user.uid;
      let userExists = await confirmUserUniqueness(email);
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

async function registerUser(e) {
  let [displayName, email, password] = [
    displayNameElem.value,
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

  let userExists = await confirmUserUniqueness(email);

  if (userExists === false) {
    //if there is no user with the inputted displayName, create new user instance and
    //add the user to the db.
    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    ).then(async (userCred) => {
      try {
        await addUserToDb(
          userCred.user.uid,
          displayName,
          email
        ).then(() => {
          let user = {
            email,
            uid: userCred.user.uid,
            displayName,
          };
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
    });
  } else {
    console.log("email already in use");
    formSubmitButton.removeAttribute("disabled");
    formSubmitButton.innerText = "Register";
  }
}

form.addEventListener("submit", registerUser);
googleSignupButton.addEventListener(
  "click",
  signUpWithGoogle
);
