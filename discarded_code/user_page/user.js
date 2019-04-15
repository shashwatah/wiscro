var bar = document.getElementById('user-navbar');
var btn = document.getElementById('user-navbar-main-button');
var btnCon = document.getElementById('navbar-main-button')

btn.addEventListener('click', function() {
	if(btn.getAttribute('data-state') === 'ask') {
		btn.setAttribute('data-state', 'ans');
		bar.style.bottom = "0px";
		bar.style.top = `calc(100% - 60px)`;
		btnCon.innerHTML = "Answer";
		btn.style.marginTop = "-15px";
		btn.style.lineHeight = "82px";
		btn.style.borderBottomLeftRadius = "0px";
		btn.style.borderBottomRightRadius = "0px";
		btn.style.borderTopLeftRadius = "72px";
		btn.style.borderTopRightRadius = "72px";
		// document.body.style.background = "grey";
	} else {
		btn.setAttribute('data-state', 'ask');
		bar.style.top = "0px";
		bar.style.bottom = "100%";
		btnCon.innerHTML = "Ask";
		//btn.style.marginTop = "15px";
		btn.style.marginTop = "0px";
		btn.style.lineHeight = "65px";
		btn.style.borderBottomLeftRadius = "72px";
		btn.style.borderBottomRightRadius = "72px";
		btn.style.borderTopLeftRadius = "0px";
		btn.style.borderTopRightRadius = "0px";
		// document.body.style.background = "white";
	}
});