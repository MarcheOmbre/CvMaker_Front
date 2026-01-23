const titleIdKey = "#header_title";
const professionIdKey = "#header_profession";
const imageIdKey = "#header_image";
const contactsSectionIdKey = "#header_contacts";
const linksSectionIdKey = "#header_links";
const aboutMeSectionIdKey = "#about-me";
const worksSectionIdKey = "#work";
const educationSectionIdKey = "#education";
const languagesSectionIdKey = "#languages";
const projectsSectionIdKey = "#projects";
const skillsSectionIdKey = "#skills";
const hobbiesSectionIdKey = "#hobbies";
const contactTemplateNameKey = "contact-item_template";
const contactTemplateChildKey = ".contact-item";
const contactTemplateTypeClassKey = ".type";
const contactTemplateValueClassKey = ".value";
const linkTemplateNameKey = "link-item_template";
const linkTemplateChildClassKey = ".link-item";
const linkTemplateNameClassKey = ".name";
const linkTemplateUrlClassKey = ".url";
const workTemplateNameKey = "work-item_template";
const workTemplateChildClassKey = ".work-item";
const workTemplateTitleClassKey = ".title";
const workTemplateCompanyClassKey = ".company";
const workTemplateDateClassKey = ".date";
const workTemplateDescriptionClassKey = ".description";
const educationTemplateNameKey = "education-item_template";
const educationTemplateChildClassKey = ".education-item";
const educationTemplateNameClassKey = ".name";
const educationTemplateDateClassKey = ".date";
const languageTemplateNameKey = "language-item_template";
const languageTemplateChildClassKey = ".language-item";
const languageTemplateNameClassKey = ".name";
const languageTemplateLevelClassKey = ".level";
const projectTemplateNameKey = "project-item_template";
const projectTemplateChildClassKey = ".project-item";
const projectTemplateTitleClassKey = ".title";
const projectTemplateDateClassKey = ".date";
const projectTemplateDescriptionClassKey = ".description";
const skillTemplateNameKey = "skill-item_template";
const skillTemplateChildClassKey = ".skill-item";
const skillTemplateNameClassKey = ".name";
const skillTemplateLevelClassKey = ".level";
const hobbyTemplateNameKey = "hobby-item_template";
const hobbyTemplateChildClassKey = ".hobby-item";
const hobbyTemplateNameClassKey = ".name";
const sectionTitleClassKey = ".title";
const sectionContentClassKey = ".content";

class Template {

    #elementsCache = new Map();
    #templateLoaded = false;

    #getOrCreateTemplate(id, container) {
        if (!isString(id))
            throw new Error("Invalid arguments");

        if (!isValidHtmlElement(container))
            throw new Error("Invalid container");

        let template = this.#elementsCache.get(id);

        if (!template) {
            template = document.createElement("template");
            template.id = id;
            container.append(template);
            this.#elementsCache.set(id, template);
        }

        return template;
    }

    #checkSection(section) {
        return (section && section.querySelector(sectionTitleClassKey) &&
            section.querySelector(sectionContentClassKey));
    }

    tryImport(html, container) {
        if (!isValidHtmlElement(container))
            throw new Error("Invalid container");

        container.innerHTML = html;

        this.#elementsCache.clear();
        const brokenElements = new Set();

        /*
         *
         * General structure
         * 
         */
        this.#elementsCache.set(titleIdKey, container.querySelector(titleIdKey));
        this.#elementsCache.set(professionIdKey, container.querySelector(professionIdKey));
        this.#elementsCache.set(imageIdKey, container.querySelector(imageIdKey));
        this.#elementsCache.set(contactsSectionIdKey, container.querySelector(contactsSectionIdKey));
        this.#elementsCache.set(linksSectionIdKey, container.querySelector(linksSectionIdKey));
        this.#elementsCache.set(aboutMeSectionIdKey, container.querySelector(aboutMeSectionIdKey));

        /*
         *
         * Sections structure
         * 
         */
        this.#elementsCache.set(aboutMeSectionIdKey, container.querySelector(aboutMeSectionIdKey));
        if (!this.#checkSection(this.#elementsCache.get(aboutMeSectionIdKey)))
            brokenElements.add(aboutMeSectionIdKey);
        this.#elementsCache.set(worksSectionIdKey, container.querySelector(worksSectionIdKey));
        if (!this.#checkSection(this.#elementsCache.get(worksSectionIdKey)))
            brokenElements.add(worksSectionIdKey);
        this.#elementsCache.set(educationSectionIdKey, container.querySelector(educationSectionIdKey));
        if (!this.#checkSection(this.#elementsCache.get(educationSectionIdKey)))
            brokenElements.add(educationSectionIdKey);
        this.#elementsCache.set(languagesSectionIdKey, container.querySelector(languagesSectionIdKey));
        if (!this.#checkSection(this.#elementsCache.get(languagesSectionIdKey)))
            brokenElements.add(languagesSectionIdKey);
        this.#elementsCache.set(projectsSectionIdKey, container.querySelector(projectsSectionIdKey));
        if (!this.#checkSection(this.#elementsCache.get(projectsSectionIdKey)))
            brokenElements.add(projectsSectionIdKey);
        this.#elementsCache.set(skillsSectionIdKey, container.querySelector(skillsSectionIdKey));
        if (!this.#checkSection(this.#elementsCache.get(skillsSectionIdKey)))
            brokenElements.add(skillsSectionIdKey);
        this.#elementsCache.set(hobbiesSectionIdKey, container.querySelector(hobbiesSectionIdKey));
        if (!this.#checkSection(this.#elementsCache.get(hobbiesSectionIdKey)))
            brokenElements.add(hobbiesSectionIdKey);


        /*
         *
         * Templates injection
         * 
         */

        // Contacts
        const contactTemplate = this.#getOrCreateTemplate(contactTemplateNameKey, container);
        const contactItem = container.querySelector(contactTemplateChildKey);
        if (contactItem &&
            contactItem.querySelector(contactTemplateTypeClassKey) &&
            contactItem.querySelector(contactTemplateValueClassKey))
            contactTemplate.content.append(contactItem);
        else
            brokenElements.add(contactTemplateChildKey);

        // Links
        const linkTemplate = this.#getOrCreateTemplate(linkTemplateNameKey, container);
        const linkItem = container.querySelector(linkTemplateChildClassKey);
        if (linkItem &&
            linkItem.querySelector(linkTemplateNameClassKey) &&
            linkItem.querySelector(linkTemplateUrlClassKey))
            linkTemplate.content.append(linkItem);
        else
            brokenElements.add(linkTemplateChildClassKey);

        // Works
        const workTemplate = this.#getOrCreateTemplate(workTemplateNameKey, container);
        const workItem = container.querySelector(workTemplateChildClassKey);
        if (workItem &&
            workItem.querySelector(workTemplateTitleClassKey) &&
            workItem.querySelector(workTemplateCompanyClassKey) &&
            workItem.querySelector(workTemplateDateClassKey) &&
            workItem.querySelector(workTemplateDescriptionClassKey))
            workTemplate.content.append(workItem);
        else
            brokenElements.add(workTemplateChildClassKey);

        // Educations
        const educationTemplate = this.#getOrCreateTemplate(educationTemplateNameKey, container);
        const educationItem = container.querySelector(educationTemplateChildClassKey);
        if (educationItem &&
            educationItem.querySelector(educationTemplateNameClassKey) &&
            educationItem.querySelector(educationTemplateDateClassKey))
            educationTemplate.content.append(educationItem);
        else brokenElements.add(educationTemplateChildClassKey);

        // Languages
        const languageTemplate = this.#getOrCreateTemplate(languageTemplateNameKey, container);
        const languageItem = container.querySelector(languageTemplateChildClassKey);
        if (languageItem &&
            languageItem.querySelector(languageTemplateNameClassKey) &&
            languageItem.querySelector(languageTemplateLevelClassKey))
            languageTemplate.content.append(languageItem);
        else
            brokenElements.add(languageTemplateChildClassKey);

        // Projects
        const projectTemplate = this.#getOrCreateTemplate(projectTemplateNameKey, container);
        const projectItem = container.querySelector(projectTemplateChildClassKey);
        if (projectItem &&
            projectItem.querySelector(projectTemplateTitleClassKey) &&
            projectItem.querySelector(projectTemplateDateClassKey)  &&
            projectItem.querySelector(projectTemplateDescriptionClassKey))
            projectTemplate.content.append(projectItem);
        else brokenElements.add(projectTemplateChildClassKey);

        // Skills
        const skillTemplate = this.#getOrCreateTemplate(skillTemplateNameKey, container);
        const skillItem = container.querySelector(skillTemplateChildClassKey);
        if (skillItem &&
            skillItem.querySelector(skillTemplateNameClassKey) &&
            skillItem.querySelector(skillTemplateLevelClassKey))
            skillTemplate.content.append(skillItem);
        else
            brokenElements.add(skillTemplateChildClassKey);

        // Hobbies
        const hobbyTemplate = this.#getOrCreateTemplate(hobbyTemplateNameKey, container);
        const hobbyItem = container.querySelector(hobbyTemplateChildClassKey);
        if (hobbyItem &&
            hobbyItem.querySelector(hobbyTemplateNameClassKey))
            hobbyTemplate.content.append(hobbyItem);
        else brokenElements.add(hobbyTemplateChildClassKey);

        /*
         *
         * Generate error
         * 
         */
        this.#elementsCache.forEach((value, key) => {
            if (!value)
                brokenElements.add(key);
        });

        this.#templateLoaded = brokenElements.size === 0;

        return new FunctionFeedback
        (
            brokenElements.size === 0,
            brokenElements.size > 0 ? " -> " + [...brokenElements].join("\n -> ") : null
        );
    }

    get(key) {
        if (!this.#templateLoaded)
            throw new Error("Template not loaded, please call tryImport() before trying to get an element");

        return this.#elementsCache.get(key);
    }
}