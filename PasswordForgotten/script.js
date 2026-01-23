const emailInput = document.getElementById("email_input");
const retrieveButton = document.getElementById("retrieve_button");
const message = document.getElementById("message");

class RetrievePasswordDto {
    constructor(email, pagePathInput) {
        if (!isEmailEntry(email))
            throw new Error("Invalid email pattern");

        if (isNullOrEmptyString(pagePathInput))
            throw new Error("Page path must be a string");

        this.email = email;
        this.pagePath = pagePathInput;
    }
}

document.addEventListener("DOMContentLoaded", async function () {

    emailInput.maxLength = MaxEmailLength;

    // Link buttons
    retrieveButton.onclick = async function () {

        if (!isEmailEntry(emailInput.value)) {
            showMessage(message, "email pattern incorrect", MessageEnums.Error);
            return;
        }

        retrieveButton.disabled = true;

        await SendRequest("POST", null, null,
            APILink + "Authentification/ForgotPassword",
            new RetrievePasswordDto(emailInput.value, window.location.protocol + "//" + window.location.host + "/ResetPassword/"),
            _ => {
                showMessage(message, "Email sent", MessageEnums.Info);
                retrieveButton.disabled = false;
            }, res => {
                retrieveButton.disabled = false;
                showMessage(message, res, MessageEnums.Error);
            }
        )
    }
})