const emailInput = document.getElementById("email_input");
const passwordInput = document.getElementById("password_input");
const loginButton = document.getElementById("login_button");
const message = document.getElementById("message");

class LoginDto {
    constructor(email, password) {

        if (!isEmailEntry(email))
            throw new Error("Invalid email pattern");

        if (!isString(password))
            throw new Error("Password must be a string");

        if (password === "")
            throw new Error("Password can't be null");

        this.email = email;
        this.password = password;
    }
}

document.addEventListener("DOMContentLoaded", async function () {
    if (await checkIsLogged()) {
        location.assign("./Listing/index.html")
        return;
    }

    emailInput.maxLength = MaxEmailLength;
    passwordInput.maxLength = MaxPasswordLength;

    loginButton.onclick = async _ => {

        if (!isEmailEntry(emailInput.value)) {
            showMessage(message, "email pattern incorrect", MessageEnums.Error);
            return;
        }

        if (passwordInput.value === "") {
            showMessage(message, "Password can't be null", MessageEnums.Error);
            return;
        }

        loginButton.disabled = true;
        

        await SendRequest("POST", null, null,
            APILink + "Authentification/Log",
            new LoginDto(emailInput.value, passwordInput.value),
            response => {
                window.localStorage.setItem(TokenKey, response);
                location.assign("./Listing/index.html")
            },
            response => {
                showMessage(message, response, MessageEnums.Error);
                loginButton.disabled = false;
            });

    }

})