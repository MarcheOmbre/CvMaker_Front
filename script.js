const emailInput = document.getElementById("email_input");
const passwordInput = document.getElementById("password_input");
const loginButton = document.getElementById("login_button");
const message = document.getElementById("message");

class LoginDto {
    constructor(email, password) {
        
        if(!isMatchingMailPattern(email))
            throw new Error("Invalid email pattern");
        
        if(!isString(password))
            throw new Error("Password must be a string");
        
        if(password === "")
            throw new Error("Password can't be null");
        
        this.email = email;
        this.password = password;
    }
}

document.addEventListener("DOMContentLoaded", async function () 
{
    if(checkIsLogged())
    {
        location.assign("./Listing/index.html")
        return;
    }
    
    loginButton.onclick = async _ => {
        
        if(!isMatchingMailPattern(emailInput.value))
        {
            showMessage(message, "email pattern incorrect", MessageClass.Error);
            return;
        }

        if (passwordInput.value === "") {
            showMessage(message, "Password can't be null", MessageClass.Error);
            return;
        }

        loginButton.disabled = true;

        await SendRequest("POST", null, null,
            APILink + "Authentification/Log",
            new LoginDto(emailInput.value, passwordInput.value),
            res => {
                window.localStorage.setItem(TokenKey, res);
                location.assign("./Listing/index.html")
            },
            response => {
                showMessage(message, response, MessageClass.Error);
                loginButton.disabled = false;
            });
    }

})