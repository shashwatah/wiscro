//Constant(s) for DOM Elements
const loginButton = document.getElementById("login-input-button");
//Constant(s) for DOM Elements

//function that compares the provided email with a regex expression
function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

loginButton.addEventListener("click", function(event) {
  let error = "";
  //Getting the value of the fields
  const email = document.getElementById("login-input-email").value;
  const pass = document.getElementById("login-input-pass").value;
  //Checking if any field is empty
  if (!email || !pass) {
    event.preventDefault();
    error += "Fill in all the fields.";
  } else {
    //Validating email by calling the validateEmail function
    if (!validateEmail(email)) {
      event.preventDefault();
      error += "Invalid Email. ";
    }
    //Checking the length of the password
    if (pass.length < 8) {
      event.preventDefault();
      error += "Password length less than 8 characters.";
    }
  }
  if (error.length > 0) {
    const data = {
      type: "error",
      message: error
    };
    snackbarController(data);
  } else {
    $.ajax({
      url: "/login",
      method: "POST",
      data: {
        email: email,
        password: pass
      }
    });
  }
});
