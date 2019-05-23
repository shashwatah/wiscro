var snackbar = document.getElementById("snackbar");

function snackbarController(data) {
  if (data.type === "success") {
    snackbar.style.backgroundColor = "#019587";
  } else if (data.type === "error") {
    snackbar.style.backgroundColor = "#c5002f";
  }
  snackbar.innerHTML = `<p>${data.message}</p>`;
  snackbar.classList.add("snackbar-visible");
  setTimeout(function() {
    snackbar.classList.remove("snackbar-visible");
  }, 3001);
}
