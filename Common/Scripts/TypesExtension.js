class KeyPairValue{
    constructor(key, value) {

        if(!isString(key))
            throw new Error("Key must be a string");

        this.key = key;
        this.value = value;
    }
}

class FunctionFeedback{
    constructor(success, error){

        if(!(success.type !== "boolean") || (error && !isString(error)))
            throw new Error("Type mismatch");

        this.success = success;
        this.message = error;
    }
}

function isNumeric(num) 
{
    return (typeof(num) === 'number' || typeof(num) === "string" && num.trim() !== '') && !isNaN(num);
}

function isString(str) 
{
    return typeof(str) === 'string' || str === "";
}

function isNotStringOrEmpty(str){
    return !isString(str) || str.trim() === "";
}

function isEmailEntry(str){
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