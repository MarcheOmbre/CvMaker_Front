const emailInput = document.getElementById("email_input");
const retrieveButton = document.getElementById("retrieve_button");
const message = document.getElementById("message");

class RetrievePasswordDto {
    constructor(email, pagePathInput) 
    {
        if(!isMatchingMailPattern(email))
            throw new Error("Invalid email pattern");
        
        if(!isString(pagePathInput))
            throw new Error("Page path must be a string");
        
        if(pagePathInput.trim() === "")
            throw new Error("Page path can't be empty");
        
        this.email = email;
        this.pagePath = pagePathInput;
    }
}

document.addEventListener("DOMContentLoaded", async function () {

    emailInput.maxLength = MaxEmailLength;
    
    // Link buttons
    retrieveButton.onclick = async function() {

        if (!isMatchingMailPattern(emailInput.value)) {
            showMessage(message, "email pattern incorrect", MessageClass.Error);
            return;
        }

        retrieveButton.disabled = true;

        await SendRequest("POST", null, null,
            APILink + "Authentification/ForgotPassword",
            new RetrievePasswordDto(emailInput.value, "https://green-moss-02220040f.1.azurestaticapps.net/ResetPassword/index.html"),
            _ => {
                showMessage(message, "Email sent", MessageClass.Info);
                retrieveButton.disabled = false;
            }, res => {
                retrieveButton.disabled = false;
                showMessage(message, res, MessageClass.Error);
            }
        )
    }
})