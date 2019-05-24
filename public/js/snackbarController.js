const snackbar = document.getElementById("snackbar");
const snackbarText = document.getElementById("snackbar-text");

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
  setTimeout(function() {
    snackbar.classList.remove("snackbar-visible");
  }, 2500);
}
