const MessageEnums = {
    Error: "error-message", Success: "success-message", Info: "info-message"
}

function showMessage(element, message, type) {
    
    if (!element || !type || isNullOrEmptyString(type))
        throw new Error("Parameters mismatch");
    
    if(isNullOrEmptyString(message) && type === MessageEnums.Error)
        message = "An unknown error occured";

    element.className = type;
    element.style.display = "block";
    element.textContent = message;

    element.classList.toggle(".error-message", type === MessageEnums.Error);
    element.classList.toggle(".success-message", type === MessageEnums.Success);
    element.classList.toggle(".info-message", type === MessageEnums.Info);

    setTimeout(() => {
        element.style.display = "none"
    }, 3000);
}

async function checkIsLogged() {
    // If no token
    const token = localStorage.getItem(TokenKey);
    if (!token) 
        return false;

    // Try to refresh the token
    let succeed;
    await SendRequest("GET", token, null, APILink + "Authentification/RefreshToken", null, response => {
        window.localStorage.setItem(TokenKey, response);
        succeed = true;
    }, () => succeed = false);

    return succeed;
}