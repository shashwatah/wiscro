////////////////////////////////////Ajax Request////////////////////////////////////
//Getting data from the /feedques route to show on the Answer page
$.ajax({
  url: "/feedques",
  method: "GET"
}).done(function(data) {
  data.forEach(function(current) {
    console.log(current);
    //Adding questions on the page, important data is stored in data- attributes of the formed elements
    ansPage.innerHTML += `<div class = "user-question" data-questionID = "${
      current.questionID
    }"><div class = "user-question-div user-question-ans user-question-yes" data-anstype = "YES"><p>Yes</p></div><div class = "user-question-div user-question-ques"><p>${
      current.questionText
    }</p></div><div class = "user-question-div user-question-ans user-question-no" data-anstype = "NO"><p>No</p></div></div>`;
  });
  //Don't remove ansBtns variable from here.
  //Moving it from main.js to elements.js caused a bug
  const ansBtns = Array.from(
    document.getElementsByClassName("user-question-ans")
  );
  ansBtns.forEach(function(curAnsBtn) {
    const ans = curAnsBtn.getAttribute("data-anstype");
    //These values will be used in event listeners to change the YES and NO buttons accordingly
    const values = {
      mouseOverRotate: "rotate(0deg)",
      mouseOverSize: "60px",
      mouseOutRotate: ans === "YES" ? "rotate(-90deg)" : "rotate(90deg)",
      mouseOutSize: "25px"
    };
    const curAnsBtnChildren = curAnsBtn.childNodes;
    //Hover events for Answer buttons on questions
    curAnsBtn.addEventListener("mouseover", function(event) {
      curAnsBtnChildren.forEach(function(curChild) {
        uiChange.btnHoverAnimation(
          curChild,
          values.mouseOverRotate,
          values.mouseOverSize
        );
      });
    });
    curAnsBtn.addEventListener("mouseout", function(event) {
      curAnsBtnChildren.forEach(function(curChild) {
        if (curAnsBtn.style.width !== "100%") {
          uiChange.btnHoverAnimation(
            curChild,
            values.mouseOutRotate,
            values.mouseOutSize
          );
        }
      });
    });
    curAnsBtn.addEventListener("click", function(event) {
      ////////////////////////////////////Ajax Request////////////////////////////////////
      $.ajax({
        url: "/submitans",
        method: "POST",
        data: {
          questionID: curAnsBtn.parentNode.getAttribute("data-questionID"),
          answer: ans
        }
      }).done(function(data) {
        console.log(data);
      });
      ////////////////////////////////////Ajax Request////////////////////////////////////
      //The code below can be refactored
      //Unique values for the YES and NO buttons can be added in the values object to implement DRY
      if (ans === "YES") {
        //Deleting every element in the question div that is not the YES button that was clicked
        //This is part of the animation that occurs on answer click
        curAnsBtn.parentNode.childNodes.forEach(function(curNode) {
          if (curNode.nodeName !== "#text") {
            if (!curNode.classList.contains("user-question-yes")) {
              curNode.style.display = "none";
            }
          }
        });
        //Changing the YES button accordingly
        curAnsBtnChildren.forEach(function(curChild) {
          if ((curChild.nodeName = "P")) {
            if (window.screen.width <= 1024) {
              curChild.style.transform = "rotate(0deg)";
              curChild.style.fontSize = "150px";
              curChild.style.marginTop = "440px";
            }
          }
        });
        curAnsBtn.style.width = "100%";
        curAnsBtn.parentNode.style.transition = "1s linear";
        curAnsBtn.parentNode.style.opacity = "0";

        //Removing the question div after 1 second of an answer button being clicked
        setTimeout(function() {
          curAnsBtn.parentNode.parentNode.removeChild(curAnsBtn.parentNode);
        }, 1000);
      } else if (ans === "NO") {
        /*Adding a flexDirection of row-reverse because a No button is on the right side of the 
        question div and it needs to expand the right way(towards left) on being clicked*/
        curAnsBtn.parentNode.style.flexDirection = "row-reverse";
        //Removing every element from the question div that is not the NO button that was clicked
        //This is part of the animation that occurs on answer click
        curAnsBtn.parentNode.childNodes.forEach(function(curNode) {
          if (curNode.nodeName !== "#text") {
            if (!curNode.classList.contains("user-question-no")) {
              curNode.style.display = "none";
            }
          }
        });
        //Changing the NO button accordingly
        curAnsBtnChildren.forEach(function(curChild) {
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
        curAnsBtn.style.width = "100%";
        curAnsBtn.parentNode.style.transition = "1s linear";
        curAnsBtn.parentNode.style.opacity = "0";

        //Removing the question div after 1 second of an answer button being clicked
        setTimeout(function() {
          curAnsBtn.parentNode.parentNode.removeChild(curAnsBtn.parentNode);
        }, 1000);
      }
    });
  });
});
////////////////////////////////////Ajax Request////////////////////////////////////

////////////////////////Refactor the code below

//forEach method of every button on the bottom bar
pageBtnArray.forEach(function(curBtn) {
  curBtn.addEventListener("click", function(event) {
    //forEach method for every sub-page on the home page
    homePageArray.forEach(function(curPage) {
      //Switching to the page if the data attributes match (pageName === btnName)
      if (
        curPage.getAttribute("data-pageName") ===
        curBtn.getAttribute("data-btnName")
      ) {
        curPage.classList.remove("inactive-page");
      } else {
        curPage.classList.add("inactive-page");
      }
    });
    //Making the clicked button the active button
    pageBtnArray.forEach(function(curButton) {
      if (curButton === curBtn) {
        curButton.classList.add("active-home-page-button");
      } else {
        curButton.classList.remove("active-home-page-button");
      }
    });
  });
});

//Adding the Event Listeners to the buttons(menuBtn, closeMenuBtn) that toggle the overlay menu
menuBtn.addEventListener("click", function(event) {
  uiChange.toggleMenuOverlay();
});

closeMenuBtn.addEventListener("click", function(event) {
  uiChange.toggleMenuOverlay();
});

//forEach method for every button in the overlay menu
menuOverlayBtns.forEach(function(curMenuOvlBtn) {
  //Checking if the button is not the logout button
  if (curMenuOvlBtn.id !== "menu-overlay-logout-btn") {
    //Adding click Event Listener to the current button
    curMenuOvlBtn.addEventListener("click", function(event) {
      /*Fetching data from the server for every page depending upon the data attribute 
			fetchurl*/
      if (curMenuOvlBtn.getAttribute("data-fetchurl") === "myques") {
        ////////////////////////////////////Ajax Request////////////////////////////////////
        $.ajax({
          url: "/myques",
          method: "GET",
          dataType: "JSON"
        }).done(function(data) {
          console.log(data);
          //Add questions to the page
          /*
          <div class="myques">
					<div class="myques-ques">
						<p>Do you like football?</p>
					</div>
					<div class="myques-ans">
						<div class="myques-ans-yes" id="myques-ans-yes-1" style="width: 75%; opacity: 1">Yes: 75%</div>
						<div class="myques-ans-no" id="myques-ans-yes-2" style="width: 25%; opacity: 0.3">No: 25%</div>
					</div>
				</div>
           */
          myquesPage.innerHTML = "";
          data.forEach(function(current) {
            myquesPage.innerHTML += `<div class="myques">
            <div class="myques-ques">
              <p>${current.questionText}</p>
            </div>
            <div class="myques-ans">
              <div class="myques-ans-yes" style="width: ${
                current.perYes
              }%; opacity: ${current.perYes > current.perNo ? 1 : 0.3}">${
              current.perYes > current.perNo ? `Yes: ${current.perYes}%` : ``
            }</div>
              <div class="myques-ans-no" style="width: ${
                current.perNo
              }%; opacity: ${current.perNo > current.perYes ? 1 : 0.3}">${
              current.perNo > current.perYes ? `No: ${current.perNo}%` : ``
            }</div>
            </div>
          </div>`;
          });
        });
        ////////////////////////////////////Ajax Request////////////////////////////////////
      } else if (curMenuOvlBtn.getAttribute("data-fetchurl") === "myans") {
        ////////////////////////////////////Ajax Request////////////////////////////////////
        $.ajax({
          url: "/myans",
          method: "GET"
        }).done(function(data) {
          console.log(`myans request sent, data: ${data}`);
        });
        ////////////////////////////////////Ajax Request////////////////////////////////////
      }
      //Closing the overlay menu
      uiChange.toggleMenuOverlay();
      //forEach method for every page
      pageArray.forEach(function(curPage) {
        //Switching to the page if the data attributes match (pageName === btnName)
        if (
          curPage.getAttribute("data-pageName") !==
          curMenuOvlBtn.getAttribute("data-btnName")
        ) {
          curPage.classList.add("inactive-page");
        } else {
          curPage.classList.remove("inactive-page");
        }
      });
      //Toggling the bottom bar on button click
      /*The bottom bar is not visible if the current page is not home page(any of the sub 
			pages of the home page - the answer or the ask page)*/
      if (curMenuOvlBtn.getAttribute("data-btnName") !== "home") {
        uiChange.toggleBottomBar("none");
      } else {
        uiChange.toggleBottomBar("block");
      }
    });
  }
});

askSubmitBtn.addEventListener("click", function(event) {
  ////////////////////////////////////Ajax Request////////////////////////////////////
  $.ajax({
    url: "/submitques",
    method: "POST",
    data: {
      question: askTextarea.value
    }
    //.done() does not work when the dataType is set to JSON
  }).done(function(data) {
    askTextarea.value = "";
    alert(data);
    console.log(data);
  });
  ////////////////////////////////////Ajax Request////////////////////////////////////
});
