function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function login() {
    var requestOptions = {
        method: 'POST',
        redirect: 'follow'
    };

    var username = document.getElementById("username").value
    var password = document.getElementById("password").value

    fetch("login?un="+username+"&pw="+password, requestOptions)
        .then(response => response.text())
        .then(result => {
            if (result == "<redirect>") {
                setCookie("un", username, 1)
                setCookie("pw", password, 1)
                window.location.href = "home"
            } else {
                alert("I'm sorry, your credentials were incorrect.")
            }
        })
        .catch(error => console.log('error', error));
}