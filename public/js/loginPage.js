//Constant(s) for DOM Elements
const loginForm = document.getElementById("login-form");
//Constant(s) for DOM Elements

//function that compares the provided email with a regex expression
function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

loginForm.addEventListener("submit", function(event) {
  /* 
  The dup key error-  
  the login and register forms had submit buttons but were still using ajax requests to send the data
  as a result the request was being sent twice which caused the dup key error on the second hit,
  it was fixed by using event.preventDefault() and event.stopImmediatePropogation() right in the 
  beginning.
  That only stopped the dup key error but after sending an ajax request the server can't redirect 
  the client to a different page which in this case is /user so the login and register forms now use 
  form submits instead of ajax requests.
  */
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
    event.preventDefault();
    const data = {
      type: "error",
      message: error
    };
    snackbarController(data);
    return false;
  } else {
    return true;
  }
});
