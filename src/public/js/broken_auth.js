const form = document.getElementById("form");

document.getElementById("checkbox").onchange = () => {
    if (document.getElementById("checkbox").checked) {
        document.getElementById("captcha").style.display = "inline";
        document.getElementById("checkbox-text").innerHTML = "Ranjivost uključena";
    }
    else {
        document.getElementById("captcha").style.display = "none";
        document.getElementById("checkbox-text").innerHTML = "Ranjivost isključena";
    }
}

form.onsubmit = async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const enabled = document.getElementById("checkbox").checked;
    const captchaResponse = grecaptcha.getResponse();

    if (!captchaResponse) {
        document.getElementById("message").innerHTML = "Potvrdi da nisi robot";
        
        throw new Error("Captcha nije odobrena");
    }

    const response = await fetch("https://web2-lab2-backend-5mzf.onrender.com/broken-authentication",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {
                    username: username,
                    password: password,
                    enabled: enabled,
                    captchaResponse: captchaResponse
                }
            )
        }
    );

    const data = await response.json();
    
    document.getElementById("message").innerHTML = data.message;
}