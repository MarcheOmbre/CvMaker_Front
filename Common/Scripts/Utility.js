const MessageEnums = {
    Error: "error-message", Success: "success-message", Info: "info-message"
}

function showMessage(element, message, type) {
    
    if (!element || !message || !type ||
        isStringNullOrEmpty(message) || !type) 
        throw new Error("Parameters mismatch");

    element.className = type;
    element.style.display = "block";
    element.textContent = message;
    
    if(type === MessageEnums.Error)
        element.style.color = "red";
    else if(type === MessageEnums.Success)
        element.style.color = "green";
    else
        element.style.color = "black";

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