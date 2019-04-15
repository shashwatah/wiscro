//Constant(s) for DOM Elements
const loginForm = document.getElementById('login-form');
//Constant(s) for DOM Elements

//function that compares the provided email with a regex expression
function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

//Submit Event Listener on the form 
//If there is any error the submit event will not execute because of the preventDefault() method
loginForm.addEventListener("submit", function(event) {
	//Getting the value of the fields
	const email = document.getElementById('login-input-email').value;
	const pass = document.getElementById('login-input-pass').value;
	//Checking if any field is empty
	if(!email || !pass) {
		event.preventDefault();
		console.log("Fill in all the fields");
	}
	//Validating email by calling the validateEmail function
	if(!validateEmail(email)) {
		event.preventDefault();
		console.log('Invalid Email');
	} 
	//Checking the length of the password
	if(pass.length < 8) {
		event.preventDefault();
		console.log('Password length less than 8 characters');
	}
});

