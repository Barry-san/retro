export const userSession = JSON.parse(
  localStorage.getItem("user")
);

export function setUserSession(user) {
  localStorage.setItem(
    "user",
    JSON.stringify({
      email: user.email,
      displayName: user.displayName,
      uid: user.uid,
    })
  );
}

export function logOutUser() {
  localStorage.removeItem("user");
  location.href = "/";
}
