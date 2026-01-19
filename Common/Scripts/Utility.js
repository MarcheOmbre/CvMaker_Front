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