const snackbar = document.getElementById("snackbar");
const snackbarText = document.getElementById("snackbar-text");

//If the page is rendered after an error is encountered this will make the snackbar visible to show that error
if (snackbarText.innerHTML.length > 0) {
  snackbar.style.backgroundColor = "#c5002f";
  snackbarVisible();
}

function snackbarController(data) {
  if (data.type === "success") {
    snackbar.style.backgroundColor = "#019587";
  } else if (data.type === "error") {
    snackbar.style.backgroundColor = "#c5002f";
  }
  snackbarText.innerHTML = `${data.message}`;
  snackbarVisible();
}

function snackbarVisible() {
  snackbar.classList.add("snackbar-visible");
  //This will hide the snackbar right after the fadeOut animation ends
  setTimeout(function() {
    snackbar.classList.remove("snackbar-visible");
  }, 2500);
}
