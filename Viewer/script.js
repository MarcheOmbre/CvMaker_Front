const printButton = document.getElementById("print_button");
const markdownToHtmlConverter = new showdown.Converter({simpleLineBreaks: true})
const styleContainer = document.getElementById("template_style");
const structureContainer = document.getElementById("template_structure");
const templateHandler = new Template();
const previewPaddingClassName = "preview-no-print";
const imagePaddingClassName = "image-no-print";
const printButtonDisplay = printButton.style.display;


function fillSection(section, title, fillSection) {
    if (!section)
        return;

    section.querySelector(sectionTitleClassKey).textContent = title;
    fillSection(section.querySelector(sectionContentClassKey));
}

async function refreshHtml(html) {
    async function loadDefaultStructure() {
        const html = await fetch("../Common/Template/structure.html").then(response => response.text());
        const loadReferencesFeedback = templateHandler.tryImport(html, structureContainer);
        if (!loadReferencesFeedback.success)
            throw new Error("Internal error : Failed to load the default structure :\n" + loadReferencesFeedback.message);
    }

    if (!isNotStringOrEmpty(html)) {
        structureContainer.innerHTML = DOMPurify.sanitize(html);
        const loadReferencesFeedback = templateHandler.tryImport(html, structureContainer);
        if (!loadReferencesFeedback.success) {
            alert("The custom structure template failed to load.\nThe default template is loaded instead.\n" + loadReferencesFeedback.message)
            await loadDefaultStructure();
        }
    } else
        await loadDefaultStructure();

    SetNoPrint();
}

async function refreshCss(css) {
    let cssContent = DOMPurify.sanitize(css);
    if (isNotStringOrEmpty(cssContent))
        cssContent = await fetch("../Common/Template/style.css").then(response => response.text());

    styleContainer.textContent = cssContent;
}

function refreshSystemLanguage(language) {
    if (!isNotStringOrEmpty(language))
        document.documentElement.lang = DOMPurify.sanitize(language);
}

function refreshTitle(title) {
    if (isString(title)) {
        templateHandler.get(titleIdKey).innerHTML = DOMPurify.sanitize(title);
    }
}

function refreshProfession(profession) {
    if (isString(profession))
        templateHandler.get(professionIdKey).innerHTML = DOMPurify.sanitize(profession);
}

function refreshImage(image) {

    const imageEntry = templateHandler.get(imageIdKey);
    if (isString(image))
        imageEntry.src = DOMPurify.sanitize(image);

    imageEntry.style.display = image ? "block" : "none";
}

function refreshContacts(contacts, contactTypes) {

    if (!contacts || !Array.isArray(contacts) || !contactTypes || !Array.isArray(contactTypes))
        return;

    const section = templateHandler.get(contactsSectionIdKey);
    section.innerHTML = "";

    const template = templateHandler.get(contactTemplateNameKey);
    contacts.forEach(element => {

        if (!Contact.IsTypeContact(element))
            return;

        const type = element.type < contactTypes.length ? contactTypes[element.type] : "Unknown";
        const templateClone = document.importNode(template.content, true);
        templateClone.querySelector(contactTemplateTypeClassKey).innerHTML = type;
        templateClone.querySelector(contactTemplateValueClassKey).innerHTML = DOMPurify.sanitize(element.value);
        section.appendChild(templateClone);
    });
}

function refreshLinks(links) {

    if (!links || !Array.isArray(links))
        return;

    const section = templateHandler.get(linksSectionIdKey);
    section.innerHTML = "";

    const template = templateHandler.get(linkTemplateNameKey);
    links.forEach(element => {

        if (!Link.IsTypeLink(element))
            return;

        const templateClone = document.importNode(template.content, true);
        templateClone.querySelector(linkTemplateNameClassKey).innerHTML = DOMPurify.sanitize(element.name);
        const link = DOMPurify.sanitize(element.url);
        const linkUrlElement = templateClone.querySelector(linkTemplateUrlClassKey);
        linkUrlElement.href = link;
        linkUrlElement.textContent = link;
        section.appendChild(templateClone);
    });
}

function refreshAboutMe(title, text) {

    if (!isString(title))
        return;

    fillSection(templateHandler.get(aboutMeSectionIdKey), title, content => {
        content.innerHTML = DOMPurify.sanitize(markdownToHtmlConverter.makeHtml(text));
    });
}

function refreshWorks(title, works) {

    if (!isString(title) || !works || !Array.isArray(works))
        return;

    const section = templateHandler.get(worksSectionIdKey);
    section.children[1].innerHTML = "";

    const template = templateHandler.get(workTemplateNameKey);
    this.fillSection(section, title, content => {
        works.forEach(element => {

            if (!Work.IsTypeWork(element))
                return;

            // Format month to force xx/yyyy format
            let month = (element.from.getMonth() + 1).toString();
            if (month.length === 1)
                month = "0" + month;

            let stringDate = `${month}/${element.from.getFullYear()}`;
            if (element.to) {
                if (stringDate !== "")
                    stringDate += " - ";

                // Format month to force xx/yyyy format
                month = (element.to.getMonth() + 1).toString();
                if (month.length === 1)
                    month = "0" + month;

                stringDate += `${month}/${element.to.getFullYear()}`;
            }

            const templateClone = document.importNode(template.content, true);
            templateClone.querySelector(workTemplateTitleClassKey).innerHTML = DOMPurify.sanitize(element.title);
            templateClone.querySelector(workTemplateCompanyClassKey).innerHTML = DOMPurify.sanitize(element.company);
            templateClone.querySelector(workTemplateDateClassKey).textContent = stringDate;
            templateClone.querySelector(workTemplateDescriptionClassKey).innerHTML = DOMPurify.sanitize(markdownToHtmlConverter.makeHtml(element.description));

            content.appendChild(templateClone);
        })
    });

}

function refreshEducations(title, educations) {
    if (!isString(title) || !educations || !Array.isArray(educations))
        return;

    const section = templateHandler.get(educationSectionIdKey);
    section.children[1].innerHTML = "";

    const template = templateHandler.get(educationTemplateNameKey);
    fillSection(section, title, content => {
        educations.forEach(element => {

            if (!Education.IsTypeEducation(element))
                return;

            const templateClone = document.importNode(template.content, true);
            templateClone.querySelector(educationTemplateNameClassKey).innerHTML = DOMPurify.sanitize(element.title);
            templateClone.querySelector(educationTemplateDateClassKey).textContent = element.date.getFullYear();

            content.appendChild(templateClone);
        })
    });

}

function refreshLanguages(title, languages, languageLevels) {
    if (!isString(title) || !languages || !Array.isArray(languages) || !languageLevels || !Array.isArray(languageLevels))
        return;

    const section = templateHandler.get(languagesSectionIdKey);
    section.children[1].innerHTML = "";

    const template = templateHandler.get(languageTemplateNameKey);
    fillSection(section, title, content => {
        languages.forEach(element => {

            if (!Language.IsTypeLanguage(element))
                return;

            const level = element.level < languageLevels.length ? languageLevels[element.level] : "Unknown";

            const templateClone = document.importNode(template.content, true);
            templateClone.querySelector(languageTemplateNameClassKey).innerHTML = DOMPurify.sanitize(element.name);
            templateClone.querySelector(languageTemplateLevelClassKey).innerHTML = level;
            content.appendChild(templateClone);
        })
    });

}

function refreshProjects(title, projects) {

    if (!isString(title) || !projects || !Array.isArray(projects))
        return;

    const section = templateHandler.get(projectsSectionIdKey);
    section.children[1].innerHTML = "";

    const template = templateHandler.get(projectTemplateNameKey);
    fillSection(section, title, content => {
        projects.forEach(element => {

            if (!Project.IsTypeProject(element))
                return;

            const templateClone = document.importNode(template.content, true);
            templateClone.querySelector(projectTemplateTitleClassKey).innerHTML = DOMPurify.sanitize(element.title);
            templateClone.querySelector(projectTemplateDateClassKey).textContent = element.date.getFullYear();
            templateClone.querySelector(projectTemplateDescriptionClassKey).innerHTML = DOMPurify.sanitize(markdownToHtmlConverter.makeHtml(element.description));

            content.appendChild(templateClone);
        })
    });

}

function refreshSkills(title, skills) {
    if (!isString(title) || !skills || !Array.isArray(skills))
        return;

    const section = templateHandler.get(skillsSectionIdKey);
    section.children[1].innerHTML = "";

    const template = templateHandler.get(skillTemplateNameKey);
    fillSection(section, title, content =>
        skills.forEach(element => {

            if (!Skill.IsTypeSkill(element))
                return;

            const templateClone = document.importNode(template.content, true);
            templateClone.querySelector(skillTemplateNameClassKey).innerHTML = DOMPurify.sanitize(element.name);
            const progressBar = templateClone.querySelector(skillTemplateLevelClassKey);
            progressBar.min = 0;
            progressBar.max = SkillMaxLevel;
            progressBar.value = element.level;
            content.appendChild(templateClone);
        }));

}

function refreshHobbies(title, hobbies) {

    if (!isString(title) || !hobbies || !Array.isArray(hobbies))
        return;

    const section = templateHandler.get(hobbiesSectionIdKey);
    section.children[1].innerHTML = "";

    const template = templateHandler.get(hobbyTemplateNameKey);
    fillSection(section, title, content => {
        hobbies.forEach(element => {

            if (!Hobby.IsTypeHobby(element))
                return;

            const templateClone = document.importNode(template.content, true);
            templateClone.querySelector(hobbyTemplateNameClassKey).innerHTML = DOMPurify.sanitize(element.name);
            content.appendChild(templateClone);
        })
    });

}

async function refreshFromJson(dataJson) {

    if (!dataJson)
        return

    document.title = dataJson.name;

    const systemLanguage = await fetch(dataJson.systemLanguage).then(response => response.json());
    await refreshHtml(dataJson.customHtml);
    await refreshCss(dataJson.customCss);

    refreshSystemLanguage(systemLanguage.key);
    refreshTitle(dataJson.title);
    refreshProfession(dataJson.profession);
    refreshImage(dataJson.image);
    refreshAboutMe(systemLanguage.aboutMeTitle, dataJson.aboutMe);
    refreshContacts(dataJson.contacts, systemLanguage.contactTypes);
    refreshLinks(dataJson.links);
    refreshSkills(systemLanguage.skillsTitle, dataJson.skills);
    refreshWorks(systemLanguage.workTitle, dataJson.works);
    refreshEducations(systemLanguage.educationTitle, dataJson.educations);
    refreshLanguages(systemLanguage.languagesTitle, dataJson.languages, systemLanguage.languageLevels);
    refreshProjects(systemLanguage.projectsTitle, dataJson.projects);
    refreshHobbies(systemLanguage.hobbiesTitle, dataJson.hobbies);
}

function SetNoPrint() {
    printButton.style.display = printButtonDisplay;
    structureContainer?.classList.add(previewPaddingClassName);
    templateHandler?.get(imageIdKey).classList.add(imagePaddingClassName);
}

function SetPrint() {
    printButton.style.display = "none";
    structureContainer?.classList.remove(previewPaddingClassName);
    templateHandler?.get(imageIdKey).classList.remove(imagePaddingClassName);
}

document.addEventListener("DOMContentLoaded", () => {

    printButton.onclick = _ => {
        SetPrint();
        this.print();
        SetNoPrint();
    }
});
