export const userSession = JSON.parse(
  localStorage.getItem("user")
);

export function setUserSession(user) {
  localStorage.setItem(
    "user",
    JSON.stringify({
      email: user.email,
      username: user.username,
      uid: user.uid,
    })
  );
}
