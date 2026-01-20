function showMessage(element, message, type) {
    
    if (element === null)
        return;

    element.className = type;
    element.style.display = "block";
    element.textContent = message;

    setTimeout(() => {
        element.style.display = "none"
    }, 3000);
}

function isMatchingMailPattern(str){
    return str.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
}

function checkIsLogged(){
    return localStorage.getItem(TokenKey) !== null;
}

function isNotStringOrEmpty(str){
    return !isString(str) || str.trim() === "";
}