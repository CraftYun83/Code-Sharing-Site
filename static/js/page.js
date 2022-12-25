function ellipsify (str, length) {
    if (str.length > length) {
        return (str.substring(0, length) + "...");
    }
    else {
    return str;
}
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

function getTimeOfPost(time) {

    var elapsedTime = new Date(Date.now()-time);

    var years = elapsedTime.getFullYear()-1970;
    var months = elapsedTime.getUTCMonth();
    var days = elapsedTime.getUTCDate()-1
    var hours = elapsedTime.getUTCHours();
    var minutes = elapsedTime.getUTCMinutes();
    var seconds = elapsedTime.getUTCSeconds();

    if (years != 0) {
        if (years == 1) {
            return "1 year"
        } else {
            return years +" years"
        }
    }if (months != 0) {
        if (months == 1) {
            return "1 month"
        } else {
            return months +" months"
        }
    }if (days != 0) {
        if (days == 1) {
            return "1 day"
        } else {
            return days +" days"
        }
    }if (hours != 0) {
        if (hours == 1) {
            return "1 hour"
        } else {
            return hours +" hours"
        }
    }if (minutes != 0) {
        if (minutes == 1) {
            return "1 minute"
        } else {
            return minutes +" minute"
        }
    } else {
        if (seconds == 1) {
            return "1 second"
        } else {
            return seconds +" seconds"
        }
    }
    
}

function getQueryParams(qs) {
    qs = qs.split('+').join(' ');

    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}

function renderPost(title, caption, code, author, time, id) {

    time = getTimeOfPost(time);

    var postInfoLabel = document.createElement("span")
    postInfoLabel.classList.add("postInfoLabel")
    postInfoLabel.textContent = "Posted by "+author+" "+time+" ago."
    var postDiv = document.createElement("div")
    postDiv.classList.add("post")
    var titleLabel = document.createElement("h1")
    titleLabel.textContent = ellipsify(title, 19);
    titleLabel.setAttribute("actualText", title)
    var captionLabel = document.createElement("p")
    captionLabel.textContent = ellipsify(caption, 40);
    captionLabel.setAttribute("actualText", caption)
    var codeDiv = document.createElement("div")
    codeDiv.classList.add("code")
    var codePre = document.createElement("pre")
    codePre.classList.add("prettyprint")
    codePre.innerHTML = code.replaceAll("<0x0A>", "<br>")

    var expandButton = document.createElement("button")
    expandButton.classList.add("expandButton")
    expandButton.textContent = "Click to expand!"
    expandButton.onclick = function() {
        expandPost(expandButton)
    }

    var rawButton = document.createElement("button")
    rawButton.classList.add("rawButton")
    rawButton.textContent = "Show raw file"
    rawButton.onclick = function() {
        document.location.href = "/raw?id="+id
    }

    postDiv.appendChild(postInfoLabel)
    postDiv.appendChild(titleLabel)
    postDiv.appendChild(captionLabel)

    codeDiv.appendChild(codePre)

    postDiv.appendChild(codeDiv)

    postDiv.appendChild(expandButton)
    codeDiv.appendChild(rawButton)

    document.body.appendChild(postDiv)

    PR.prettyPrint()
}

function expandPost(element) {

    var divheight = "70%"

    var expandCode = anime({
        targets: element.parentElement.querySelector("div"),
        height: divheight,
        delay: function(el, i) { return i * 100; },
        direction: 'alternate',
        loop: false,
        autoplay: false,
        easing: 'easeInOutSine'
    });

    var expand = anime({
        targets: element.parentElement,
        width: "70vw",
        height: "75vh",
        borderRadius: ['6%/8%', '4%/8%'],
        delay: function(el, i) { return i * 100; },
        direction: 'alternate',
        update: function(anim) {
            if (element.parentElement.querySelector("h1").getAttribute("actualText").length >= 19) {
                element.parentElement.querySelector("h1").textContent = ellipsify(element.parentElement.querySelector("h1").getAttribute("actualText"), 19+Math.round((element.parentElement.querySelector("h1").getAttribute("actualText").length-19)/100*anim.progress))
            }
            ;
            if (element.parentElement.querySelector("p").getAttribute("actualText").length >= 40) {
                element.parentElement.querySelector("p").textContent = ellipsify(element.parentElement.querySelector("p").getAttribute("actualText"), 40+Math.round((element.parentElement.querySelector("p").getAttribute("actualText").length-40)/100*anim.progress))
            }
        },
        complete: function(anim) {
            element.textContent = "Click to minimise!"
            element.parentElement.querySelector("h1").textContent = element.parentElement.querySelector("h1").getAttribute("actualText")
            element.parentElement.querySelector("p").textContent = element.parentElement.querySelector("p").getAttribute("actualText")
          },
        loop: false,
        autoplay: false,
        easing: 'easeInOutSine'
    });

    var inpandCode = anime({
        targets: element.parentElement.querySelector("div"),
        height: "60%",
        delay: function(el, i) { return i * 100; },
        direction: 'alternate',
        loop: false,
        autoplay: false,
        easing: 'easeOutInSine',
    });

    var inpand = anime({
        targets: element.parentElement,
        width: "33vw",
        height: "50vh",
        borderRadius: ['4%/8%', '6%/8%'],
        delay: function(el, i) { return i * 100; },
        direction: 'alternate',
        update: function(anim) {
            element.parentElement.querySelector("h1").textContent = ellipsify(element.parentElement.querySelector("h1").getAttribute("actualText"), element.parentElement.querySelector("h1").getAttribute("actualText").length-Math.round((element.parentElement.querySelector("h1").getAttribute("actualText").length-19)/100*anim.progress))
            element.parentElement.querySelector("p").textContent = ellipsify(element.parentElement.querySelector("p").getAttribute("actualText"), element.parentElement.querySelector("p").getAttribute("actualText").length-Math.round((element.parentElement.querySelector("p").getAttribute("actualText").length-40)/100*anim.progress))
        },
        complete: function(anim) {
            element.textContent = "Click to expand!"
          },
        loop: false,
        autoplay: false,
        easing: 'easeInOutSine'
    });

    if (element.textContent.includes("minimise")) {
        inpand.play()
        inpandCode.play()
        
    } else {
        expand.play()
        expandCode.play()
    }
}

var requestOptions = {
    method: 'POST',
    redirect: 'follow'
  };

if (getQueryParams(document.location.search).author == undefined) {
    var author = getCookie("un")
    document.getElementById("profileTag").textContent = "Your Posts"
} else {
    var author = getQueryParams(document.location.search).author
    document.getElementById("profileTag").textContent = author+"'s Posts"
    if (author == getCookie("un")) {
        document.getElementById("profileTag").textContent = "Your Posts"
    }
}
fetch("getPosts?author="+author, requestOptions)
    .then(response => response.text())
    .then(result => {
        var parsedJSON = JSON.parse(result)
        parsedJSON["posts"].forEach((post) => {
            renderPost(post["title"], post["caption"], post["code"], post["author"], new Date(post["time"]), post["_id"])
        })
    })
    .catch(error => console.log('error', error));


tippy('#user-icon', {
        content: `
        <button onclick="window.location.href='home'" style="grey: white;font-size: 1.5vw; width: 100%; border-color: white; border-style: none;">Home</button>
        <button onclick="window.location.href='setting'" style="grey: white;font-size: 1.5vw; width: 100%; border-color: white; border-style: none;">Setting</button>
        <button onclick="window.location.href='logout'" style="grey: white;font-size: 1.5vw; width: 100%; border-color: white; border-style: none;">Log Out</button>
        `,
        allowHTML: true,
        arrow: false,
        interactive: true,
      });

document.querySelector("svg").onclick = function() {
    document.location.href = "home"
}