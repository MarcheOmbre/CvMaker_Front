class KeyPairValue {
    constructor(key, value) {

        if (isNullOrEmptyString(key))
            throw new Error("Key must be a string");

        this.key = key;
        this.value = value;
    }
    
    static IsTypeKeyPairValue(obj) {
        return obj.key && isString(obj.key) && obj.value;
    }
}

class FunctionFeedback {
    constructor(success, error) {

        if (typeof success !== "boolean" || (error && !isString(error)))
            throw new Error("Type mismatch");

        this.success = success;
        this.message = error;
    }
}

function isNumericOrNumericString(num) {
    
    if(typeof (num) === 'number')
        return true;
    
    return isString(num) && (!isNaN(parseInt(num)) || !isNaN(parseFloat(num)));
}

function isString(str) {
    return typeof (str) === 'string' || str === "";
}

function isNullOrEmptyString(str)
{
    return !isString(str) || str.length === 0;
}

function isEmailEntry(str) {
    
    if(isNullOrEmptyString(str))
        return false;
    
    return str.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
}

function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
        }
    )
}

function isValidDate(date) {
    return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
}

function isValidHtmlElement(element) {
    if(!element)
        return false;
    
    const prototype = Object.prototype.toString.call(element);
    return !(!prototype.includes("HTML") || !prototype.includes("Element"));
}