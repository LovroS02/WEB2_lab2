document.getElementById("checkbox").onchange = () => {
    if (document.getElementById("checkbox").checked) {
        document.getElementById("checkbox-text").innerHTML = "Ranjivost uključena";
    }
    else {
        document.getElementById("checkbox-text").innerHTML = "Ranjivost isključena";
    }
}

document.getElementById("submit").onclick = async () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const enabled = document.getElementById("checkbox").checked;

    const response = await fetch("https://web2-lab2-backend-5mzf.onrender.com/sql-injection",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {
                    username: username,
                    password: password,
                    enabled: enabled
                }
            )
        }
    );

    const data = await response.json();

    document.getElementById("sql").innerHTML = data.query;

    const users = document.getElementById("users");
    users.innerHTML = "";
    users.style.display = "flex";
    users.style.flexDirection = "column";
    data.users.forEach(user => {
        const user_div = document.createElement("div");

        const id_a = document.createElement("a");
        id_a.innerHTML = user.id + " ";
        const username_a = document.createElement("a");
        username_a.innerHTML = user.username + " ";
        const password_a = document.createElement("a");
        password_a.innerHTML = user.password;

        user_div.appendChild(id_a);
        user_div.appendChild(username_a);
        user_div.appendChild(password_a);

        users.appendChild(user_div);
    });
}