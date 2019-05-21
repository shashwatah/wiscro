$.ajax({
  url: "/guestques",
  method: "GET"
}).done(function(data) {
  console.log(data);
});

//Constant(s) for DOM elements
const yesBtns = Array.from(
  document.getElementsByClassName("user-question-yes")
);
const noBtns = Array.from(document.getElementsByClassName("user-question-no"));
const contentContainer = document.getElementById("user-content-container");
//Constant(s) for DOM elements

//function to add hover animations to the specified child element(btnChild) of button div
function btnHoverAnimation(btnChild, transformVal, fontSizeVal) {
  //If the given element is a P tag
  if (btnChild.nodeName === "P") {
    //Checking if the device is a mobile by checking it's screen width
    if (window.screen.width <= 1024) {
      btnChild.style.fontSize = "48px";
    } else {
      btnChild.style.transform = transformVal;
      btnChild.style.fontSize = fontSizeVal;
    }
  }
}

//Adding a forEach method for each Yes button div in the page
yesBtns.forEach(function(curYesBtn) {
  //Hover Event Listener for each Yes Button
  curYesBtn.addEventListener("mouseover", function(event) {
    var yesBtnChildren = curYesBtn.childNodes;
    //Calling btnHoverAnimation function for each child element of the button div
    //The function will only do something if the child element is a P tag
    yesBtnChildren.forEach(function(curChild) {
      //console.log(curChild.nodeName);
      btnHoverAnimation(curChild, "rotate(0deg)", "60px");
    });
  });
  //Doing a similar thing when the cursor moves away from the button
  curYesBtn.addEventListener("mouseout", function(event) {
    var yesBtnChildren = curYesBtn.childNodes;
    yesBtnChildren.forEach(function(curChild) {
      if (curYesBtn.style.width !== "100%") {
        btnHoverAnimation(curChild, "rotate(-90deg)", "25px");
      }
    });
  });
  //Event Listener for click on each Yes button
  curYesBtn.addEventListener("click", function(event) {
    //Removing every element from the question div that is not the Yes button that was clicked
    curYesBtn.parentNode.childNodes.forEach(function(curNode) {
      if (curNode.nodeName !== "#text") {
        //Evert=y Yes button contains user-question-yes in it's class list
        if (!curNode.classList.contains("user-question-yes")) {
          curNode.style.display = "none";
        }
      }
    });
    //Changing the style of the Yes button div that was just clicked
    var yesBtnChildren = curYesBtn.childNodes;
    yesBtnChildren.forEach(function(curChild) {
      if ((curChild.nodeName = "P")) {
        if (window.screen.width <= 1024) {
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
  //Hover Event Listener for each No Button
  curNoBtn.addEventListener("mouseover", function(event) {
    var noBtnChildren = curNoBtn.childNodes;
    //Calling btnHoverAnimation function for each child element of the button div
    //The function will only do something if the child element is a P tag
    noBtnChildren.forEach(function(curChild) {
      btnHoverAnimation(curChild, "rotate(0deg)", "60px");
    });
  });
  //Doing a similar thing when the cursor moves away from the button
  curNoBtn.addEventListener("mouseout", function(event) {
    var noBtnChildren = curNoBtn.childNodes;
    noBtnChildren.forEach(function(curChild) {
      if (curNoBtn.style.width !== "100%") {
        btnHoverAnimation(curChild, "rotate(90deg)", "25px");
      }
    });
  });
  //Event Listener for click on each No button
  curNoBtn.addEventListener("click", function(event) {
    /*Adding a flexDirection of row-reverse because a No button is on the right side of the 
		question div and it needs to expand the right way(towards left) on being clicked*/
    curNoBtn.parentNode.style.flexDirection = "row-reverse";
    //Removing every element from the question div that is not the No button that was clicked
    curNoBtn.parentNode.childNodes.forEach(function(curNode) {
      if (curNode.nodeName !== "#text") {
        //Every No button contains user-question-no in it's class list
        if (!curNode.classList.contains("user-question-no")) {
          curNode.style.display = "none";
        }
      }
    });
    //Changing the style of the No button div that was just clicked
    var noBtnChildren = curNoBtn.childNodes;
    noBtnChildren.forEach(function(curChild) {
      if ((curChild.nodeName = "P")) {
        curChild.style.transform = "rotate(0deg)";
        if (window.screen.width <= 1024) {
          curChild.style.fontSize = "150px";
          curChild.style.marginTop = "440px";
        } else {
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
