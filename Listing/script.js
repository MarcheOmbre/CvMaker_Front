class SetNameDto {
    constructor(cvId, name) {
        if (!isNumeric(cvId))
            throw new Error("Id must be a number");

        if (!isString(name))
            throw new Error("Name must be a string");

        if (name.trim() === "")
            throw new Error("Name can't be empty");

        this.cvId = cvId;
        this.name = name;
    }
}

const cvsParent = document.getElementById("cvs");
const message = document.getElementById("message");
const createButton = document.getElementById("create_button");
const cvItemTemplate = document.getElementById("cv-item_template");
const cvFeedback = document.getElementById("cv_feedback");
const noCVContent = "No cv uploaded, please create one";
const loadingContent = "Loading...";


async function addCv(cv) {
    if (isNotStringOrEmpty(cv.name))
        throw new Error("Name can't be empty")

    const templateClone = document.importNode(cvItemTemplate.content, true).children[0];
    const children = templateClone.children;
    children[0].maxLength = MaxNameLength;
    children[0].value = cv.name;
    children[0].onchange = async function()
    {
        if (isNotStringOrEmpty(children[0].value)) {
            children[0].value = cv.name;
            return;
        }

        await SendRequest("POST", localStorage.getItem(TokenKey), null,
            APILink + "Cv/SetName", new SetNameDto(cv.id, children[0].value), null,
            reponse => {
                children[0].value = cv.name
                showMessage(message, reponse, MessageEnums.Error)
            });
    }
    children[1].onclick = () => {
        sessionStorage.setItem(CvIdItemKey, cv.id);
        location.assign("../Generator/");
    }
    children[2].onclick = async function() {
        if (confirm("Are you sure you want to delete this CV?")) {
            const parameters = [];
            parameters.push(new KeyPairValue("id", cv.id));

            await SendRequest("DELETE", localStorage.getItem(TokenKey), parameters,
                APILink + `Cv/Delete/`, null,
                _ => {
                    templateClone.remove()
                    
                    if(cvsParent.children.length === 1)
                        cvFeedback.textContent = noCVContent;
                },
                response => showMessage(message, response, MessageEnums.Error));
        }
    }

    cvsParent.appendChild(templateClone);
}

async function reloadCvs() {

    cvFeedback.textContent = loadingContent;
    const children = cvsParent.children;
    for(let i = children.length-1; i >= 0; i--){
        if(children[i].tagName !== "P")
            children[i].remove();
    }

    createButton.style.display = "none";
    
    await SendRequest("GET", localStorage.getItem(TokenKey), null, APILink + "Cv/GetAll", null,
        async function(response)
        {
            const cvs = JSON.parse(response);

            for (const cv of cvs)
                await addCv(cv);

            cvFeedback.textContent = cvs.length === 0 ? noCVContent : "";
            createButton.style.display = cvs.length < MaxCvCount ? "block" : "none";

        }, response => showMessage(message, response, MessageEnums.Error));
}

document.addEventListener("DOMContentLoaded", async function () {

    if (!await checkIsLogged())
        return;

    // Load all the cvs
    await reloadCvs();

    const parameters = [];
    parameters.push(new KeyPairValue("name", "CV"));
    createButton.onclick = async function() 
    {
        createButton.disabled = true;
        
        await SendRequest("PUT", localStorage.getItem(TokenKey), parameters,
            APILink + "Cv/Create", null,
            _ =>{
                createButton.disabled = false;
                reloadCvs()
            },
            response =>{
                showMessage(message, response, MessageEnums.Error);
                createButton.disabled = false;
            });
    };
})