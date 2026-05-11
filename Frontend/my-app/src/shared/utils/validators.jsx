export const validateLoginForm = ({ email, mail, password }) => {
  const userEmail = email || mail || "";

  const isEmailValid = validateEmail(userEmail);
  const isPasswordValid = validatePassword(password || "");

  return isEmailValid && isPasswordValid;
};

export const validateRegisterForm = ({ email, mail, password, username }) => {
  const userEmail = email || mail || "";

  return (
    validateEmail(userEmail) &&
    validatePassword(password || "") &&
    validateUsername(username || "")
  );
};

export const validateMail = (mail) => {
  return validateEmail(mail || "");
};

const validatePassword = (password) => {
  return password.length > 5 && password.length < 13;
};

const validateEmail = (email) => {
  const emailPattern =
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  return emailPattern.test(email);
};

const validateUsername = (username) => {
  return username.length > 2 && username.length < 13;
};