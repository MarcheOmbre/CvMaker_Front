const systemLanguageSelect = document.getElementById("system-language");
const removePhotoButton = document.getElementById("photo-remove_button");
const photoInput = document.getElementById("photo-input");
const photoReader = document.getElementById("photo-reader");
const titleInput = document.getElementById("title_input");
const professionInput = document.getElementById("profession_input");
const aboutMeInput = document.getElementById("about-me_input");
const contactsDiv = document.getElementById("contacts");
const linksDiv = document.getElementById("links");
const skillsDiv = document.getElementById("skills");
const worksDiv = document.getElementById("works");
const educationsDiv = document.getElementById("educations");
const languagesDiv = document.getElementById("languages");
const projectsDiv = document.getElementById("projects");
const hobbiesDiv = document.getElementById("hobbies");
const removeCssButton = document.getElementById("css-remove_button");
const customCssInput = document.getElementById("custom-css_input");
const removeHtmlButton = document.getElementById("html-remove_button");
const customHtmlInput = document.getElementById("custom-html_input");
const message = document.getElementById("message");
const frame = document.getElementById("preview");

const addContactButton = document.getElementById("add-contact");
const addLinkButton = document.getElementById("add-link");
const addWorkButton = document.getElementById("add-work");
const addEducationButton = document.getElementById("add-education");
const addProjectButton = document.getElementById("add-project");
const addLanguageButton = document.getElementById("add-language");
const addSkillButton = document.getElementById("add-skill");
const addHobbyButton = document.getElementById("add-hobby");

const encapsulationArrowTemplate = document.getElementById("encapsulation-arrow_template");
const contactItemTemplate = document.getElementById("contact-item_template");
const linkItemTemplate = document.getElementById("link-item_template");
const skillItemTemplate = document.getElementById("skill-item_template");
const workItemTemplate = document.getElementById("work-item_template");
const educationItemTemplate = document.getElementById("education-item_template");
const languageItemTemplate = document.getElementById("language-item_template");
const projectItemTemplate = document.getElementById("project-item_template");
const hobbyItemTemplate = document.getElementById("hobby-item_template");

let languageSystem;


async function importFromJson(dataJson) {

    document.body.style.display = "none";

    // Clear the fields
    contactsDiv.innerHTML = "";
    linksDiv.innerHTML = "";
    skillsDiv.innerHTML = "";
    worksDiv.innerHTML = "";
    educationsDiv.innerHTML = "";
    languagesDiv.innerHTML = "";
    projectsDiv.innerHTML = "";
    hobbiesDiv.innerHTML = "";

    // Get the system language
    let systemLanguagePath = systemLanguageSelect.value;
    if(!isNotStringOrEmpty(dataJson.systemLanguage))
        systemLanguagePath = dataJson.systemLanguage;
    languageSystem = await fetch(systemLanguagePath).then(response => response.json());
    
    // Fill the fields
    titleInput.value = DOMPurify.sanitize(dataJson.title);
    professionInput.value = DOMPurify.sanitize(dataJson.profession);
    aboutMeInput.value = DOMPurify.sanitize(dataJson.aboutMe);
    dataJson.contacts.forEach(element => addContact(new Contact(element)));
    dataJson.links.forEach(element => addLink(new Link(element)));
    dataJson.works.forEach(element => addWork(new Work(element)));
    dataJson.educations.forEach(element => addEducation(new Education(element)));
    dataJson.projects.forEach(element => addProject(new Project(element)));
    dataJson.languages.forEach(element => addLanguage(new Language(element)));
    dataJson.skills.forEach(element => addSkill(new Skill(element)));
    dataJson.hobbies.forEach(element => addHobby(new Hobby(element)));
    if (!isNotStringOrEmpty(dataJson.image)) {
        
        const sanitizedImage = DOMPurify.sanitize(dataJson.image);
        const blob = await fetch(sanitizedImage).then(response => response.blob());
        if (blob) {
            const dt = new DataTransfer();
            dt.items.add(new File([blob], 'image.jpg'));
            photoInput.files = dt.files;
            refreshImage(photoInput.files[0]);
        }
    }
    if (!isNotStringOrEmpty(dataJson.customCss)) {
        
        const sanitizedCss = DOMPurify.sanitize(dataJson.customCss);
        const blob = new Blob([sanitizedCss], {type: 'text/css'});
        if (blob) {
            const dt = new DataTransfer();

            dt.items.add(new File([blob], 'customCss.css'));
            customCssInput.files = dt.files;
        }
        await refreshCustomCss(sanitizedCss);
    }
    
    if (!isNotStringOrEmpty(dataJson.customHtml)) {
       
       const sanitizedHtml = DOMPurify.sanitize(dataJson.customHtml);
        const blob = new Blob([sanitizedHtml], {type: 'text/html'});
        if (blob) {
            const dt = new DataTransfer();

            dt.items.add(new File([blob], 'customHtml.html'));
            customHtmlInput.files = dt.files;
        }
        await refreshCustomHtml(sanitizedHtml);
    }

    document.body.style.display = "block";
}

async function generateJson() {
    
    const jsonObject = {};
    jsonObject.systemLanguage = DOMPurify.sanitize(systemLanguageSelect.value);
    jsonObject.title = extractTitle();
    jsonObject.profession = extractProfession();
    jsonObject.aboutMe = extractAboutMe();
    jsonObject.contacts = extractContacts();
    jsonObject.links = extractLinks();
    jsonObject.works = extractWorks();
    jsonObject.educations = extractEducations();
    jsonObject.projects = extractProjects();
    jsonObject.languages = extractLanguages();
    jsonObject.skills = extractSkills();
    jsonObject.hobbies = extractHobbies();

    /*
     *
     * Image
     * 
     */
    jsonObject.image = "";
    if (photoInput.files.length > 0 && photoInput.files[0])
        jsonObject.image = DOMPurify.sanitize(await convertFileToBase64(photoInput.files[0]));

    /*
     *
     * Custom CSS
     * 
     */
    jsonObject.customCss = "";
    if(customCssInput.files.length > 0 && customCssInput.files[0])
        jsonObject.customCss = DOMPurify.sanitize(await customCssInput.files[0].text());
    
    /*
     *
     * Custom HTML
     * 
     */
    jsonObject.customHtml = "";
    if(customHtmlInput.files.length > 0 && customHtmlInput.files[0])
        jsonObject.customHtml = DOMPurify.sanitize(await customHtmlInput.files[0].text());
    
    return jsonObject;
}


function extractTitle() {return DOMPurify.sanitize(titleInput.value);}

function extractProfession() {return DOMPurify.sanitize(professionInput.value);}

function extractAboutMe() {return DOMPurify.sanitize(aboutMeInput.value);}

function extractContacts() {

    const contacts = [];
    [...contactsDiv.children].forEach(element => {
        const children = element.children[1].children;
        
        const data = {};
        data.type = children[0].selectedIndex;
        data.value = DOMPurify.sanitize(children[1].value);
        contacts.push(new Contact(data));
    });

    return contacts;
}

function extractLinks() {

    const links = [];
    [...linksDiv.children].forEach(element => {
        const children = element.children[1].children;
        
        const data = {};
        data.name = DOMPurify.sanitize(children[0].value);
        data.url = DOMPurify.sanitize(children[1].value);
        links.push(new Link(data));
    });

    return links;
}

function extractWorks() {
    const works = [];
    [...worksDiv.children].forEach((element, index) => {
        const children = element.children[1].children;

        const data = {};
        data.title = DOMPurify.sanitize(children[1].children[0].value);
        data.company = DOMPurify.sanitize(children[3].value);
        data.from = new Date(children[5].children[0].value);
        data.to = new Date(children[5].children[1].value);
        data.description = DOMPurify.sanitize(children[7].value);
        works.push(new Work(data));
    })

    return works;
}

function extractEducations() {

    const educations = [];
    [...educationsDiv.children].forEach(element => {
        const children = element.children[1].children;

        const data = {};
        data.title = DOMPurify.sanitize(children[0].value);
        data.date = new Date(children[1].value);
        educations.push(new Education(data));
    })

    return educations;
}

function extractProjects() {
    const projects = [];
    [...projectsDiv.children].forEach((element, index) => {
        const children = element.children[1].children;

        const data = {};
        data.title = DOMPurify.sanitize(children[1].children[0].value);
        data.date = new Date(children[3].value);
        data.description = DOMPurify.sanitize(children[4].value);
        projects.push(new Project(data));
    })

    return projects;
}

function extractLanguages() {
    const languages = [];
    [...languagesDiv.children].forEach(element => {
        const children = element.children[1].children;

        const data = {};
        data.name = DOMPurify.sanitize(children[0].value);
        data.level = children[1].selectedIndex;
        languages.push(new Language(data));
    })

    return languages;
}

function extractSkills() {

    const skills = [];
    [...skillsDiv.children].forEach(element => {

        const data = {};
        data.name = DOMPurify.sanitize(element.children[1].children[0].value);
        skills.push(data);
    })

    return skills;
}

function extractHobbies() {

    const hobbies = [];
    [...hobbiesDiv.children].forEach(element => {

        const data = {};
        data.name = DOMPurify.sanitize(element.children[1].children[0].value);
        hobbies.push(data);
    })

    return hobbies;
}

function refreshImage(image = null) {
    
    photoReader.style.display = image ?  "block" : "none";
    removePhotoButton.style.display = image ?  "block" : "none";
    
    if (image) {

        const fileReader = new FileReader();
        fileReader.onload = function (e) {
            photoReader.src = e.target.result;
        };
        fileReader.readAsDataURL(image);

    } else
        photoReader.src = '';
}

function refreshImagePreview(image = null){
    
    if(image)
    {
        const fileReader = new FileReader();
        fileReader.onload = function (e) {
            frame.contentWindow.refreshImage(e.target.result);
        };
        fileReader.readAsDataURL(image);
    }
    else
        frame.contentWindow.refreshImage(null);
}

async function refreshCustomCss(customCss = "") 
{
    const hasCss = !isNotStringOrEmpty(customCss);
    removeCssButton.style.display = hasCss ? "block" : "none";
    await frame.contentWindow.refreshCss(customCss);
}

async function refreshCustomHtml(customHtml = "")  {
    const hasHtml = !isNotStringOrEmpty(customHtml);
    removeHtmlButton.style.display = hasHtml ? "block" : "none";
    await frame.contentWindow.refreshCss(customHtml);
}

function refreshElementsArrows(movableElementsParent) {
    for (let i = 0; i < movableElementsParent.children.length; i++) {
        const arrowsDiv = movableElementsParent.children[i].children[0];
        arrowsDiv.children[0].style.display = i === 0 ? "none" : "block";
        arrowsDiv.children[1].style.display = i === movableElementsParent.children.length - 1 ? "none" : "block";
    }
}

async function refreshViewerJson() {
    const json = await generateJson();
    await frame.contentWindow.refreshFromJson(json)
}


function encapsulateInMovable(htmlElement, refreshFunction) {
    
    const template = document.importNode(encapsulationArrowTemplate.content, true).children[0];
    template.append(htmlElement);
    template.children[0].children[0].addEventListener('click', _ => {
        const divParent = template.parentNode;
        divParent.insertBefore(template, template.previousElementSibling);
        refreshElementsArrows(template.parentElement);
        refreshFunction();
    });
    template.children[0].children[1].addEventListener('click', _ => {
        const divParent = template.parentNode;
        divParent.insertBefore(template, template.nextElementSibling.nextElementSibling);
        refreshElementsArrows(template.parentElement);
        refreshFunction();
    });

    return template;
}


function addContact(contact = new Contact()) {

    if(!(contact instanceof Contact) || !languageSystem)
        return;
    
    
    const refreshView = () => frame.contentWindow.refreshContacts(extractContacts());
    const refreshCreateButton = () => addContactButton.style.display = contactsDiv.children.length < MaxItems ? 'block' : 'none';

    const template = document.importNode(contactItemTemplate.content, true).children[0];
    const children = template.children;

    children[0].onchange = refreshView;
    children[1].maxLength = MaxEmailLength;
    children[1].oninput = refreshView;

    languageSystem.contactTypes.forEach(element => {
        const option = document.createElement("option");
        option.textContent = element;
        children[0].append(option);
    });

    if (contact.type <= children[0].options.length)
        children[0].selectedIndex = contact.type;

    children[1].value = DOMPurify.sanitize(contact.value);

    const encapsulated = encapsulateInMovable(template, refreshView);
    children[2].onclick = _ => {
        encapsulated.remove();
        refreshView();
        refreshCreateButton();
    }

    contactsDiv.append(encapsulated);
    refreshElementsArrows(contactsDiv);
    refreshCreateButton();
}

function addLink(link = new Link()) {

    if(!Link.IsTypeLink(link))
        return;
    
    const refreshView = () => frame.contentWindow.refreshLinks(extractLinks());
    const refreshCreateButton = () => addLinkButton.style.display = linksDiv.children.length < MaxItems ? 'block' : 'none';
    

    const template = document.importNode(linkItemTemplate.content, true).children[0];
    const children = template.children;

    children[0].maxLength = MaxNameLength;
    children[0].oninput = refreshView;
    children[1].maxLength = MaxUrlLength;
    children[1].oninput = refreshView;

    children[0].value = DOMPurify.sanitize(link.name);
    children[1].value = DOMPurify.sanitize(link.url)

    const encapsulated = encapsulateInMovable(template, refreshView);
    children[2].onclick = _ => {
        encapsulated.remove();
        refreshView();
        refreshElementsArrows(linksDiv);
        refreshCreateButton();
    }

    linksDiv.append(encapsulated);
    refreshElementsArrows(linksDiv);
    refreshCreateButton();
}

function addWork(work = new Work()) {

    if(!Work.IsTypeWork(work) || !languageSystem)
        return;
    
    const refreshView = () => frame.contentWindow.refreshWorks(languageSystem.workTitle, extractWorks());
    const refreshCreateButton = () => addWorkButton.style.display = worksDiv.children.length < MaxItems ? 'block' : 'none';
    
    const templateClone = document.importNode(workItemTemplate.content, true).children[0];
    const children = templateClone.children;

    const titleInput = children[1].children[0];
    titleInput.maxLength = MaxNameLength;
    titleInput.value = DOMPurify.sanitize(work.title);
    titleInput.oninput = refreshView;
    
    const companyInput = children[3];
    companyInput.maxLength = MaxNameLength;
    companyInput.value = DOMPurify.sanitize(work.company);
    companyInput.oninput = refreshView;
    
    const fromDateInput = children[5].children[0];
    fromDateInput.valueAsDate = work.from;
    fromDateInput.onchange = refreshView;
    
    const toDateInput = children[5].children[1];
    toDateInput.valueAsDate = work.to;
    toDateInput.onchange = refreshView;
    
    const descriptionInput = children[7];
    descriptionInput.maxLength = MaxDescriptionLength;
    descriptionInput.value = DOMPurify.sanitize(work.description);
    descriptionInput.oninput = refreshView;
    
    worksDiv.append(templateClone);

    const encapsulated = encapsulateInMovable(templateClone, refreshView);
    children[1].children[1].onclick = _ => {
        encapsulated.remove();
        refreshView()
        refreshElementsArrows(worksDiv);
        refreshCreateButton();
    }

    worksDiv.append(encapsulated);
    refreshElementsArrows(worksDiv);
    refreshCreateButton();
}

function addEducation(education = new Education()) {

    if(!Education.IsTypeEducation(education) || !languageSystem)
        return;
    
    const refreshFunction = () => frame.contentWindow.refreshEducations(languageSystem.educationTitle, extractEducations());
    const refreshCreateButton = () => addEducationButton.style.display = educationsDiv.children.length < MaxItems ? 'block' : 'none';
    

    const templateClone = document.importNode(educationItemTemplate.content, true).children[0];
    const children = templateClone.children;

    const nameInput = children[0];
    nameInput.maxLength = MaxNameLength;
    nameInput.value = DOMPurify.sanitize(education.title);
    nameInput.oninput = refreshFunction;
    
    const dateInput = children[1];
    dateInput.valueAsDate = education.date;
    dateInput.onchange = refreshFunction;

    const encapsulated = encapsulateInMovable(templateClone, refreshFunction);
    children[2].onclick = _ => {
        encapsulated.remove();
        refreshFunction();
        refreshElementsArrows(educationsDiv);
        refreshCreateButton();
    }

    educationsDiv.append(encapsulated);
    refreshElementsArrows(educationsDiv);
    refreshCreateButton();
}

function addLanguage(language = new Language()) 
{
    if(!Language.IsTypeLanguage(language) || !languageSystem)
        return;
    
    const refreshFunction = () => frame.contentWindow.refreshLanguages(languageSystem.languagesTitle, extractLanguages(), languageSystem.languageLevels);
    const refreshCreateButton = () => addLanguageButton.style.display = languagesDiv.children.length < MaxItems ? 'block' : 'none';
    

    const templateClone = document.importNode(languageItemTemplate.content, true).children[0];
    const children = templateClone.children;

    const nameInput = children[0];
    nameInput.maxLength = MaxNameLength;
    nameInput.value = DOMPurify.sanitize(language.name);
    nameInput.oninput = refreshFunction;
    
    const levelSelect = children[1];
    languageSystem.languageLevels.forEach(element => {

        const option = document.createElement("option");
        option.textContent = element;
        levelSelect.append(option);
    });
    if (language.level <= levelSelect.options.length)
        levelSelect.selectedIndex = language.level;
    levelSelect.onchange = refreshFunction;
    

    const encapsulated = encapsulateInMovable(templateClone, refreshFunction);
    children[2].onclick = _ => {
        encapsulated.remove();
        refreshFunction();
        refreshElementsArrows(languagesDiv);
        refreshCreateButton();
    }

    languagesDiv.append(encapsulated);
    refreshElementsArrows(languagesDiv);
    refreshCreateButton();
}

function addProject(project = new Project()) {

    if(!Project.IsTypeProject(project) || !languageSystem)
        return;
    
    const refreshFunction = () => frame.contentWindow.refreshProjects(languageSystem.projectsTitle, extractProjects());
    const refreshCreateButton = () => addProjectButton.style.display = projectsDiv.children.length < MaxItems ? 'block' : 'none';
    

    const templateClone = document.importNode(projectItemTemplate.content, true).children[0];
    const children = templateClone.children;

    const nameInput = children[1].children[0];
    nameInput.maxLength = MaxNameLength;
    nameInput.value = DOMPurify.sanitize(project.title);
    nameInput.oninput = refreshFunction;
    
    const dateInput = children[3];
    dateInput.valueAsDate = project.date;
    dateInput.onchange = refreshFunction;
    
    const descriptionInput = children[4];
    descriptionInput.maxLength = MaxDescriptionLength;
    descriptionInput.value = DOMPurify.sanitize(project.description);
    descriptionInput.oninput = refreshFunction;

    const encapsulated = encapsulateInMovable(templateClone, refreshFunction);
    children[1].children[1].onclick = _ => {
        encapsulated.remove();
        refreshFunction();
        refreshElementsArrows(projectsDiv);
        refreshCreateButton();
    }

    projectsDiv.append(encapsulated);
    refreshElementsArrows(projectsDiv);
    refreshCreateButton();
}

function addSkill(skill = new Skill()) {
    
    if(!Skill.IsTypeSkill(skill) || !languageSystem)
        return;
    
    const refreshFunction = () => frame.contentWindow.refreshSkills(languageSystem.skillsTitle, extractSkills());
    const refreshCreateButton = () => addSkillButton.style.display = skillsDiv.children.length < MaxItems ? 'block' : 'none';
    

    const template = document.importNode(skillItemTemplate.content, true).children[0];
    const children = template.children;

    const nameInput = children[0];
    nameInput.maxLength = MaxNameLength;
    nameInput.value = DOMPurify.sanitize(skill.name);
    nameInput.oninput = refreshFunction;

    const encapsulated = encapsulateInMovable(template, refreshFunction);
    children[1].onclick = _ => {
        encapsulated.remove();
        refreshFunction();
        refreshElementsArrows(skillsDiv);
        refreshCreateButton();
    }

    skillsDiv.append(encapsulated);
    refreshElementsArrows(skillsDiv);
    refreshCreateButton();
}

function addHobby(hobby = new Hobby()) {

    if(!Hobby.IsTypeHobby(hobby) || !languageSystem)
        return;
    
    const refreshFunction = () => frame.contentWindow.refreshHobbies(languageSystem.hobbiesTitle, extractHobbies());
    const refreshCreateButton = () => addHobbyButton.style.display = hobbiesDiv.children.length < MaxItems ? 'block' : 'none';

    const templateClone = document.importNode(hobbyItemTemplate.content, true).children[0];
    const children = templateClone.children;

    const nameInput = children[0];
    nameInput.maxLength = MaxNameLength;
    nameInput.value = DOMPurify.sanitize(hobby.name);
    nameInput.oninput = refreshFunction;

    const encapsulated = encapsulateInMovable(templateClone, refreshFunction);
    children[1].onclick = _ => {
        encapsulated.remove();
        refreshFunction();
        refreshElementsArrows(hobbiesDiv);
        refreshCreateButton();
    }

    hobbiesDiv.append(encapsulated);
    refreshElementsArrows(hobbiesDiv);
    refreshCreateButton();
}


document.addEventListener("DOMContentLoaded", async function () {

        if (!checkIsLogged()) {
            location.assign("../index.html")
            return;
        }

        document.getElementById("back_button").onclick = _ => location.assign("../Listing/index.html");
        systemLanguageSelect.onchange = async function (event) {
            let index = 0;
            for (let i = 0; i < systemLanguageSelect.options.length; i++) {
                
                if (systemLanguageSelect.options[i].value !== event.target.value) 
                    continue;
                
                index = i;
                break;
            }
            systemLanguageSelect.selectedIndex = index;

            await importFromJson(await generateJson());
            await refreshViewerJson();
        };
        removePhotoButton.onclick = _ => {
            photoInput.value = '';
            refreshImage();
            refreshImagePreview();
        };
        photoInput.onchange = event => {
            refreshImage();
            
            let image = null;
            
            if(event.target.files.length > 0 && event.target.files[0])
            {
                if(event.target.files[0].type.includes("image") === false){
                    showMessage(message, "The selected file is not an image", MessageClass.Error);
                    event.target.value = '';
                    return;
                }
                
                if(event.target.files[0].size > MaxFileSize){
                    showMessage(message, "The selected file is too big", MessageClass.Error);
                    event.target.value = '';
                    return;
                }

                image = event.target.files[0];
            }
            
            refreshImagePreview(image);
        };
        titleInput.maxLength = MaxNameLength;
        titleInput.oninput = _ => frame.contentWindow.refreshTitle(extractTitle());
        professionInput.maxLength = MaxNameLength;
        professionInput.oninput = _ => frame.contentWindow.refreshProfession(extractProfession());
        aboutMeInput.maxLength = MaxDescriptionLength;
        aboutMeInput.oninput = _ => frame.contentWindow.refreshAboutMe(languageSystem.aboutMeTitle, extractAboutMe());
        addContactButton.onclick = _ => addContact();
        addLinkButton.onclick = _ => addLink();
        addWorkButton.onclick = _ => addWork();
        addEducationButton.onclick = _ => addEducation();
        addProjectButton.onclick = _ => addProject();
        addLanguageButton.onclick = _ => addLanguage();
        addSkillButton.onclick = _ => addSkill();
        addHobbyButton.onclick = _ => addHobby();
        removeCssButton.onclick = _ => {
            customCssInput.value = ''
            refreshCustomCss();
        };
        customCssInput.onchange = async function(event) {

            let css = "";
            
            if(event.target.files.length > 0 && event.target.files[0])
            {
                if(event.target.files[0].type.includes("css") === false){
                    showMessage(message, "The selected file is not a css file", MessageClass.Error);
                    event.target.value = '';
                    return;
                }

                if(event.target.files[0].size > MaxFileSize){
                    showMessage(message, "The selected file is too big", MessageClass.Error);
                    event.target.value = '';
                    return;
                }

                css = await event.target.files[0].text();
            }
            
            await refreshCustomCss(css);
        }
        
        removeHtmlButton.onclick = () => {
            customHtmlInput.value = ''
            refreshCustomHtml();
        }
        
        customHtmlInput.onchange= async function(event) {
            
            let html = "";
            
            if(event.target.files.length > 0 && event.target.files[0])
            {
                if(event.target.files[0].type.includes("html") === false){
                    showMessage(message, "The selected file is not a html file", MessageClass.Error);
                    event.target.value = '';
                    return;
                }
                
                if(event.target.files[0].size > MaxFileSize){
                    showMessage(message, "The selected file is too big", MessageClass.Error);
                    event.target.value = '';
                    return;
                }
                
                html = await event.target.files[0].text();   
            }

            await refreshCustomHtml(html);
        }
        
        
        document.getElementById("download_template_button").onclick = async function () {

            document.getElementById("download_template_button").onclick = _ => {
                const templateLink = document.createElement("a");
                templateLink.download = "template.css";
                templateLink.href = "../Common/Template/style.css";
                templateLink.click();
            }
        };

        const saveButton = document.getElementById("save_button");
        saveButton.onclick = async function () {
            saveButton.disabled = true;
            
            const cv = await generateJson();
            cv.id = sessionStorage.getItem(CvIdItemKey);
            await SendRequest("POST", localStorage.getItem(TokenKey), null, APILink + "Cv/Modify",
                cv, null, err => showMessage(message, err, MessageClass.Error));
            
            saveButton.disabled = false;
        };

        // Download cv data
        const cvId = sessionStorage.getItem(CvIdItemKey);
        const parameters = [];
        parameters.push(new KeyPairValue("id", cvId));

        // Hide the page during loading
        document.body.style.display = "none";

        await SendRequest("GET", localStorage.getItem(TokenKey), parameters, APILink + `Cv/Get`, null, async function (res) {

            const file = JSON.parse(res);
            await importFromJson(file);
            await refreshViewerJson();
        }, res => showMessage(message, res, MessageClass.Error));
    }
)