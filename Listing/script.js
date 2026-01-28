class SetNameDto {
    constructor(cvId, name) {
        if (!isNumericOrNumericString(cvId))
            throw new Error("Id must be a number");

        if (isNullOrEmptyString(name))
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
    if (isNullOrEmptyString(cv.name))
        throw new Error("Name can't be empty")

    const templateClone = document.importNode(cvItemTemplate.content, true).children[0];
    const children = templateClone.children;

    const nameInput = children[0].children[1];
    nameInput.maxLength = MaxNameLength;
    nameInput.value = cv.name;
    nameInput.onchange = async function () {
        if (isNullOrEmptyString(nameInput.value)) {
            nameInput.value = cv.name;
            return;
        }

        await SendRequest("POST", localStorage.getItem(TokenKey), null,
            APILink + "Cv/SetName", new SetNameDto(cv.id, nameInput.value), null,
            response => {
                nameInput.value = cv.name
                showMessage(message, response, MessageEnums.Error)
            });
    }
    children[1].onclick = async function () 
    {
        children[1].disabled = true;
        
        const parameters = [];
        parameters.push(new KeyPairValue("id", cv.id));
        await SendRequest("PUT", localStorage.getItem(TokenKey), parameters,
            APILink + "Cv/Duplicate", null,
            _ => {
                children[1].disabled = false;
                reloadCvs()
            },
            response => {
                showMessage(message, response, MessageEnums.Error);
                children[1].disabled = false;
            });
    }
    children[2].onclick = () => {
        sessionStorage.setItem(CvIdItemKey, cv.id);
        location.assign("../Generator/");
    }
    children[3].onclick = async function () {
        if (confirm("Are you sure you want to delete this CV?")) {
            const parameters = [];
            parameters.push(new KeyPairValue("id", cv.id));

            await SendRequest("DELETE", localStorage.getItem(TokenKey), parameters,
                APILink + `Cv/Delete/`, null,
                _ => {
                    templateClone.remove()

                    if (cvsParent.children.length === 1)
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
    for (let i = children.length - 1; i >= 0; i--) {
        if (children[i].tagName !== "P")
            children[i].remove();
    }

    createButton.style.display = "none";

    await SendRequest("GET", localStorage.getItem(TokenKey), null, APILink + "Cv/GetAll", null,
        async function (response) {
            const cvs = JSON.parse(response);

            for (const cv of cvs)
                await addCv(cv);

            cvFeedback.textContent = cvs.length === 0 ? noCVContent : "";
            createButton.style.display = cvs.length < MaxCvCount ? "block" : "none";

        }, response => showMessage(message, response, MessageEnums.Error));
}

document.addEventListener("DOMContentLoaded", async function () {

    await checkIsLogged();

    // Load all the cvs
    await reloadCvs();

    createButton.onclick = async function () {
        createButton.disabled = true;

        const parameters = [];
        parameters.push(new KeyPairValue("name", "CV"));
        await SendRequest("PUT", localStorage.getItem(TokenKey), parameters,
            APILink + "Cv/Create", null,
            _ => {
                createButton.disabled = false;
                reloadCvs()
            },
            response => {
                showMessage(message, response, MessageEnums.Error);
                createButton.disabled = false;
            });
    };
})