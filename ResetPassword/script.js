const passwordInput = document.getElementById("password_input");
const passwordConfirmationInput = document.getElementById("password-confirmation_input");
const resetButton = document.getElementById("reset_button");
const message = document.getElementById("message");

class ResetPasswordDto {
    constructor(password, passwordConfirmation) {

        if (isNullOrEmptyString(password))
            throw new Error("Password must be a string");

        if (password !== passwordConfirmation)
            throw new Error("Passwords doesn't match");

        this.password = password;
        this.passwordConfirmation = passwordConfirmation;
    }
}

document.addEventListener("DOMContentLoaded", async function () {

    passwordInput.maxLength = MaxPasswordLength;
    passwordConfirmationInput.maxLength = MaxPasswordLength;

    resetButton.onclick = async _ => {

        if (isNullOrEmptyString(passwordInput.value)) {
            showMessage(message, "Password can't be null", MessageEnums.Error);
            return;
        }

        if (passwordConfirmationInput.value !== passwordInput.value) {
            showMessage(message, "Passwords doesn't match", MessageEnums.Error);
            return;
        }

        let params = new URLSearchParams(document.location.search);
        let token = params.get("token");
        if (!token || !isString(token))
            throw new Error("Token must be a string");

        resetButton.disabled = true;

        if (!passwordInput.value) {
            showMessage(message, "Password can't be null", MessageEnums.Error);
            resetButton.disabled = false;
            return;
        }

        if (passwordInput.value !== passwordConfirmationInput.value) {
            showMessage(message, "Passwords doesn't match", MessageEnums.Error);
            resetButton.disabled = false;
            return;
        }

        await SendRequest("POST", token, null,
            APILink + "Authentification/ResetPassword",
            new ResetPasswordDto(passwordInput.value, passwordConfirmationInput.value),
            _ => location.assign("../"),
            response => {
                resetButton.disabled = false;

                if (response.status === 401)
                    showMessage(message, "Unauthorized : the token is invalid", MessageEnums.Error);
                else
                    showMessage(message, response, MessageEnums.Error);
            });
    }

})