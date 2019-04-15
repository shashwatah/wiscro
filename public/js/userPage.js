//Constant(s) for DOM Elements
const menuBtn = document.getElementById('user-topbar-menu-btn');
const menuOverlay = document.getElementById('user-menu-overlay');
const closeMenuBtn = document.getElementById('user-menu-overlay-topbar-menu-btn');
const menuOverlayBtns = Array.from(document.getElementsByClassName('user-menu-overlay-nav-el'));
const pageBtnArray = Array.from(document.getElementsByClassName('home-page-button'));
const pageArray = Array.from(document.getElementsByClassName('user-page'));
const homePageArray = Array.from(document.getElementsByClassName('user-page-page'));
const bottomBar = document.getElementById('user-bottombar');
const topBar = document.getElementById('user-topbar');
const contentContainer = document.getElementById('user-content-container');
const askSubmitBtn = document.getElementById('user-ask-form-submit-btn');
const askTextarea = document.getElementById('user-ask-form-textarea');
const ansPage = document.getElementById('user-main-ques-container');
//Constant(s) for DOM elements

//Function to toggle the overlay menu on button click
function toggleMenuOverlay() {
	//toggles the menu-overlay-inactive which changes the 'visibility' and 'opacity' styles
	if(menuOverlay.classList.contains('menu-overlay-inactive')) {
		menuOverlay.classList.remove('menu-overlay-inactive');
	} else {
		menuOverlay.classList.add('menu-overlay-inactive');
	}
}
//function to toggle the height of the container depending on the type of the device
function toggleContainerHeight(sm, lr) {
	//Checking if the device is a mobile if it's screen width is less than 1024
	if(window.screen.width < 1024) {
		contentContainer.style.height = "calc(100% - " + sm + ")";
	} else {
		contentContainer.style.height = "calc(100% - " + lr + ")";	
	}
}
//function to toggle the bottom bar on page change depending on the displayValue argument
function toggleBottomBar(displayValue) {
	bottomBar.style.display = displayValue;
	if(displayValue === "none") {
		toggleContainerHeight("175px", "85px");
	} else {
		toggleContainerHeight("350px", "170px");
	}	
}

//function to add hover animations to the specified child element(btnChild) of button div  
function btnHoverAnimation(btnChild, transformVal, fontSizeVal) {
	//If the given element is a P tag
	if(btnChild.nodeName = "P") {
		//Checking if the device is a mobile by checking it's screen width
		if(window.screen.width <= 1024) {
			btnChild.style.fontSize = "48px";
		}else {
			btnChild.style.transform = transformVal;
			btnChild.style.fontSize = fontSizeVal;
		}
	}
}

$.ajax({
	url: '/feedques',
	method: 'GET'
}).done(function(data){
	/*
	<div class = "user-question">
		<div class = "user-question-div user-question-ans user-question-yes"><p>Yes</p></div>
		<div class = "user-question-div user-question-ques"><p></p></div>
		<div class = "user-question-div user-question-ans user-question-no"><p>No</p></div>
	</div>
	*/
	console.log(ansPage);
	data.forEach(function(current) {
		console.log(current);
		ansPage.innerHTML += `<div class = "user-question" data-questionID = "${current.questionID}">
								<div class = "user-question-div user-question-ans user-question-yes"><p>Yes</p></div>
								<div class = "user-question-div user-question-ques"><p>${current.questionText}</p></div>
								<div class = "user-question-div user-question-ans user-question-no"><p>No</p></div>
							  </div>`;

	});
	
	const yesBtns = Array.from(document.getElementsByClassName('user-question-yes'));
	const noBtns = Array.from(document.getElementsByClassName('user-question-no'));
	//Adding a forEach method for each Yes button div in the page
	yesBtns.forEach(function(curYesBtn) {
		//Hover Event Listener for each Yes Button
		curYesBtn.addEventListener('mouseover', function(event) {
			var yesBtnChildren = curYesBtn.childNodes;
			//Calling btnHoverAnimation function for each child element of the button div
			//The function will only do something if the child element is a P tag
			yesBtnChildren.forEach(function(curChild) {
				btnHoverAnimation(curChild, "rotate(0deg)", "60px");
			});
		});
		//Doing a similar thing when the cursor moves away from the button
		curYesBtn.addEventListener('mouseout', function(event) {
			var yesBtnChildren = curYesBtn.childNodes;
			yesBtnChildren.forEach(function(curChild) {
				if(curYesBtn.style.width !== "100%") {
					btnHoverAnimation(curChild, "rotate(-90deg)", "25px");
				}
			});
		});
		//Event Listener for click on each Yes button
		curYesBtn.addEventListener('click', function(event) {


			/////////////////////////////////Complete this!!!!/////////////////////////////////
			$.ajax({
				url: '',
				method: 'POST',
				data: {
					questionID = curYesBtn.parentNode.getAttribute('data-questionID');
					answer = "YES"
				}
			}).done(function(data) {
				console.log(data);
			});
			/////////////////////////////////Complete this!!!!/////////////////////////////////

			//Removing every element from the question div that is not the Yes button that was clicked
			curYesBtn.parentNode.childNodes.forEach(function(curNode) {
				if(curNode.nodeName !== "#text") {
					//Evert=y Yes button contains user-question-yes in it's class list
					if(!curNode.classList.contains('user-question-yes')) {
						curNode.style.display = "none";
					}	
				}
			});
			//Changing the style of the Yes button div that was just clicked
			var yesBtnChildren = curYesBtn.childNodes;
			yesBtnChildren.forEach(function(curChild) {
				if(curChild.nodeName = "P") {
					if(window.screen.width <= 1024) {
						curChild.style.transform = "rotate(0deg)";
						curChild.style.fontSize = "150px";
						curChild.style.marginTop = "440px";
					}
				}
			});
			curYesBtn.style.width = "100%";
			curYesBtn.parentNode.style.transition = "1s linear";
			curYesBtn.parentNode.style.opacity = "0";

			//Removing the question div after 1 second of an answer button being clicked
			setTimeout(function() {
				curYesBtn.parentNode.parentNode.removeChild(curYesBtn.parentNode);
			}, 1000);
		});
	});

	//Adding a forEach method for each No button div in the page
	noBtns.forEach(function(curNoBtn) {
		//Hover Event Listener for each No Butto
		curNoBtn.addEventListener('mouseover', function(event) {
			var noBtnChildren = curNoBtn.childNodes;
			//Calling btnHoverAnimation function for each child element of the button div
			//The function will only do something if the child element is a P tag
			noBtnChildren.forEach(function(curChild) {
				btnHoverAnimation(curChild, "rotate(0deg)", "60px");
			});
		});
		//Doing a similar thing when the cursor moves away from the button
		curNoBtn.addEventListener('mouseout', function(event) {
			var noBtnChildren = curNoBtn.childNodes;
			noBtnChildren.forEach(function(curChild) {
				if(curNoBtn.style.width !== "100%") {
					btnHoverAnimation(curChild, "rotate(90deg)", "25px");
				}
			});
		});
		//Event Listener for click on each No button
		curNoBtn.addEventListener('click', function(event) {
			/*Adding a flexDirection of row-reverse because a No button is on the right side of the 
			question div and it needs to expand the right way(towards left) on being clicked*/
			curNoBtn.parentNode.style.flexDirection = "row-reverse";
			//Removing every element from the question div that is not the No button that was clicked
			curNoBtn.parentNode.childNodes.forEach(function(curNode) {
				if(curNode.nodeName !== "#text") {
					//Every No button contains user-question-no in it's class list
					if(!curNode.classList.contains('user-question-no')) {
						curNode.style.display = "none";
					}
				}
			});
			//Changing the style of the No button div that was just clicked
			var noBtnChildren = curNoBtn.childNodes;
			noBtnChildren.forEach(function(curChild) {
				if(curChild.nodeName = "P") {
					curChild.style.transform = "rotate(0deg)";
					if(window.screen.width <= 1024) {
						curChild.style.fontSize = "150px";
						curChild.style.marginTop = "440px";
					}else {
						curChild.style.fontSize = "60px";
					}
				}
			});
			curNoBtn.style.width = "100%";
			curNoBtn.parentNode.style.transition = "1s linear";
			curNoBtn.parentNode.style.opacity = "0";

			//Removing the question div after 1 second of an answer button being clicked
			setTimeout(function() {
				curNoBtn.parentNode.parentNode.removeChild(curNoBtn.parentNode);
			}, 1000);
		});
	});
});


//forEach method of every button on the bottom bar
pageBtnArray.forEach(function(curBtn) {
	curBtn.addEventListener('click', function(event) {
		//forEach method for every sub-page on the home page
		homePageArray.forEach(function(curPage) {
			//Switching to the page if the data attributes match (pageName === btnName)
			if(curPage.getAttribute('data-pageName') === curBtn.getAttribute('data-btnName')) {
				curPage.classList.remove('inactive-page');
			} else {
				curPage.classList.add('inactive-page');
			}
		});
		//Making the clicked button the active button
		pageBtnArray.forEach(function(curButton) {
			if(curButton === curBtn) {
				curButton.classList.add('active-home-page-button');
			} else {
				curButton.classList.remove('active-home-page-button');
			}
		});
	});
});

//Adding the Event Listeners to the buttons(menuBtn, closeMenuBtn) that toggle the overlay menu
menuBtn.addEventListener('click', function(event) {
	toggleMenuOverlay();
});	

closeMenuBtn.addEventListener('click', function(event) {
	toggleMenuOverlay();
});

//forEach method for every button in the overlay menu
menuOverlayBtns.forEach(function(curMenuOvlBtn) {
	//Checking if the button is not the logout button
	if(curMenuOvlBtn.id !== "menu-overlay-logout-btn") {
		//Adding click Event Listener to the current button
		curMenuOvlBtn.addEventListener('click', function(event) {
			/*Fetching data from the server for every page depending upon the data attribute 
			fetchurl*/
			if(curMenuOvlBtn.getAttribute('data-fetchurl') === 'myques') {
				$.ajax({
					url: '/myques',
					method: 'GET',
					dataType: 'JSON'
				}).done(function(data) {
					console.log(data);
				});
			} else if(curMenuOvlBtn.getAttribute('data-fetchurl') === 'myans') {
				$.ajax({
					url: '/myans',
					method: 'GET'
				}).done(function(data) {
					console.log(`myans request sent, data: ${data}`);
				});
			}
			//Closing the overlay menu
			toggleMenuOverlay();
			//forEach method for every page
			pageArray.forEach(function(curPage) {
				//Switching to the page if the data attributes match (pageName === btnName)
				if(curPage.getAttribute('data-pageName') !== curMenuOvlBtn.getAttribute('data-btnName')) {
					curPage.classList.add('inactive-page');
				}else {
					curPage.classList.remove('inactive-page');
				}
			});
			//Toggling the bottom bar on button click
			/*The bottom bar is not visible if the current page is not home page(any of the sub 
			pages of the home page - the answer or the ask page)*/
			if(curMenuOvlBtn.getAttribute('data-btnName') !== 'home') {
				toggleBottomBar("none");
			} else {
				toggleBottomBar("block");
			}
		});
	}
});

askSubmitBtn.addEventListener('click', function(event) {
	$.ajax({
		url: '/submitques',
		method: 'POST',
		data: {
			question: askTextarea.value
		}
		//.done() does not work when the dataType is set to JSON
	}).done(function(data) {
		askTextarea.value = "";
		alert(data);
	});
});