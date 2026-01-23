async function SendRequest(type, tokenToInject, parameters, link, data, onSucceed, onFailed) {

    if (type !== "GET" && type !== "POST" && type !== "PUT" && type !== "DELETE")
        throw new Error("Invalid request type");

    if (isStringNullOrEmpty(link))
        throw new Error("Link must be a string")

    // Inject parameters if there are any
    if (parameters) {
        let parametersString = "";
        for (let i = 0; i < parameters.length; i++) {
            if (!KeyPairValue.IsTypeKeyPairValue(parameters[i]))
                throw new Error("Parameters must be KeyPairValue");

            parametersString += parameters[i].key + "=" + parameters[i].value;
            if (i !== parameters.length - 1)
                parametersString += "&";
        }

        link += "?" + parametersString;
    }

    // Create the request
    const options = {
        method: type,
        headers: {"Content-Type": data ? "application/json" : "text/plain; charset=utf-8"},
        mode: "cors",
        credentials: "include"
    };

    if (tokenToInject) {
        options.headers["Authorization"] = "Bearer " + tokenToInject;
    }

    if (data) {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(link, options);
    const textResponse = await response.text();

    if (response.ok) {
        if (onSucceed)
            onSucceed(textResponse);
    } else {
        if (onFailed)
            onFailed(textResponse);
    }
}