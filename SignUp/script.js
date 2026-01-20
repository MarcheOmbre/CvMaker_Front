const emailInput = document.getElementById("email_input");
const passwordInput = document.getElementById("password_input");
const passwordConfirmationInput = document.getElementById("password-confirmation_input");
const signupButton = document.getElementById("signup_button");
const message = document.getElementById("message");


class RegisterDto {
    constructor(email, password) {
        
        if(!isMatchingMailPattern(email))
            throw new Error("Invalid email pattern");
        
        if(!isString(password))
            throw new Error("Password must be a string");
        
        if(password === "")
            throw new Error("Password can't be null");
        
        if(passwordConfirmationInput.value !== passwordInput.value)
            throw new Error("Passwords doesn't match");
        
        this.email = email;
        this.password = password;
        this.passwordConfirmation = password;
    }
}

document.addEventListener("DOMContentLoaded", async function () {

    if(checkIsLogged())
    {
        location.assign("./Listing/index.html")
        return;
    }
    
    emailInput.maxLength = MaxEmailLength;
    passwordInput.maxLength = MaxPasswordLength;
    passwordConfirmationInput.maxLength = MaxPasswordLength;
    
    signupButton.onclick = async _ => {
        
        if(!isMatchingMailPattern(emailInput.value))
        {
            showMessage(message, "email pattern incorrect", MessageClass.Error);
            return;
        }

        if(passwordInput.value === ""){
            showMessage(message, "Password can't be null", MessageClass.Error);
            return;
        }
        
        if(passwordConfirmationInput.value !== passwordInput.value){
            showMessage(message, "Passwords doesn't match", MessageClass.Error);
            return;
        }

        await SendRequest("POST", null, null,
            APILink + "Authentification/Register",
            new RegisterDto(emailInput.value, passwordInput.value, passwordConfirmationInput.value),
            _ => location.assign("../index.html"),
            res => showMessage(message, res, MessageClass.Error));
    }

})