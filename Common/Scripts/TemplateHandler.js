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
    
    #getOrCreateTemplate(id, container)
    {
        if(!isString(id))
            throw new Error("Invalid arguments");
        
        if(!(container instanceof HTMLElement))
            throw new Error("Invalid container");

        let template = this.#elementsCache.get(id);
        
        if(template == null)
        {
            template = document.createElement("template");
            template.id = id;
            container.append(template);
            this.#elementsCache.set(id, template);
        }

        return template;
    }

    #checkSection(section)
    {
        return !(section === null || section.querySelector(sectionTitleClassKey) == null ||
            section.querySelector(sectionContentClassKey) == null);
    }
    
    tryImport(html, container)
    {
        if(!(container instanceof HTMLElement))
            throw new Error("Invalid container");
        
        container.innerHTML = html;
        
        this.#elementsCache.clear();
        const brokenElements =  new Set();

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
        if(!this.#checkSection(this.#elementsCache.get(aboutMeSectionIdKey)))
            brokenElements.add(aboutMeSectionIdKey);
        this.#elementsCache.set(worksSectionIdKey, container.querySelector(worksSectionIdKey));
        if(!this.#checkSection(this.#elementsCache.get(worksSectionIdKey)))
            brokenElements.add(worksSectionIdKey);
        this.#elementsCache.set(educationSectionIdKey, container.querySelector(educationSectionIdKey));
        if(!this.#checkSection(this.#elementsCache.get(educationSectionIdKey)))
            brokenElements.add(educationSectionIdKey);
        this.#elementsCache.set(languagesSectionIdKey, container.querySelector(languagesSectionIdKey));
        if(!this.#checkSection(this.#elementsCache.get(languagesSectionIdKey)))
            brokenElements.add(languagesSectionIdKey);
        this.#elementsCache.set(projectsSectionIdKey, container.querySelector(projectsSectionIdKey));
        if(!this.#checkSection(this.#elementsCache.get(projectsSectionIdKey)))
            brokenElements.add(projectsSectionIdKey);
        this.#elementsCache.set(skillsSectionIdKey, container.querySelector(skillsSectionIdKey));
        if(!this.#checkSection(this.#elementsCache.get(skillsSectionIdKey)))
            brokenElements.add(skillsSectionIdKey);
        this.#elementsCache.set(hobbiesSectionIdKey, container.querySelector(hobbiesSectionIdKey));
        if(!this.#checkSection(this.#elementsCache.get(hobbiesSectionIdKey)))
            brokenElements.add(hobbiesSectionIdKey);
        
        
        /*
         *
         * Templates injection
         * 
         */
        
        // Contacts
        const contactTemplate = this.#getOrCreateTemplate(contactTemplateNameKey, container);
        const contactItem = container.querySelector(contactTemplateChildKey);
        if(contactItem !== null && 
            contactItem.querySelector(contactTemplateTypeClassKey) !== null && 
            contactItem.querySelector(contactTemplateValueClassKey) !== null)
            contactTemplate.content.append(contactItem);
        else 
            brokenElements.add(contactTemplateChildKey);

        // Links
        const linkTemplate = this.#getOrCreateTemplate(linkTemplateNameKey, container);
        const linkItem = container.querySelector(linkTemplateChildClassKey);
        if(linkItem !== null && 
            linkItem.querySelector(linkTemplateNameClassKey) !== null && 
            linkItem.querySelector(linkTemplateUrlClassKey) !== null)
            linkTemplate.content.append(linkItem);
        else 
            brokenElements.add(linkTemplateChildClassKey);
        
        // Works
        const workTemplate = this.#getOrCreateTemplate(workTemplateNameKey, container);
        const workItem = container.querySelector(workTemplateChildClassKey);
        if (workItem !== null &&
            workItem.querySelector(workTemplateTitleClassKey) !== null &&
            workItem.querySelector(workTemplateCompanyClassKey) !== null &&
            workItem.querySelector(workTemplateDateClassKey) !== null &&
            workItem.querySelector(workTemplateDescriptionClassKey) !== null)
            workTemplate.content.append(workItem);
        else 
            brokenElements.add(workTemplateChildClassKey);
        
        // Educations
        const educationTemplate = this.#getOrCreateTemplate(educationTemplateNameKey, container);
        const educationItem = container.querySelector(educationTemplateChildClassKey);
        if (educationItem !== null &&
            educationItem.querySelector(educationTemplateNameClassKey) !== null &&
            educationItem.querySelector(educationTemplateDateClassKey) !== null)
            educationTemplate.content.append(educationItem);
        else brokenElements.add(educationTemplateChildClassKey);
        
        // Languages
        const languageTemplate = this.#getOrCreateTemplate(languageTemplateNameKey, container);
        const languageItem = container.querySelector(languageTemplateChildClassKey);
        if (languageItem !== null &&
            languageItem.querySelector(languageTemplateNameClassKey) !== null &&
            languageItem.querySelector(languageTemplateLevelClassKey) !== null)
            languageTemplate.content.append(languageItem);       
        else 
            brokenElements.add(languageTemplateChildClassKey);
        
        // Projects
        const projectTemplate = this.#getOrCreateTemplate(projectTemplateNameKey, container);
        const projectItem = container.querySelector(projectTemplateChildClassKey);
        if (projectItem !== null &&
        projectItem.querySelector(projectTemplateTitleClassKey) !== null &&
        projectItem.querySelector(projectTemplateDateClassKey) !== null &&
        projectItem.querySelector(projectTemplateDescriptionClassKey) !== null)
            projectTemplate.content.append(projectItem);      
        else brokenElements.add(projectTemplateChildClassKey);
        
        // Skills
        const skillTemplate = this.#getOrCreateTemplate(skillTemplateNameKey, container);
        const skillItem = container.querySelector(skillTemplateChildClassKey);
        if (skillItem !== null &&
            skillItem.querySelector(skillTemplateNameClassKey) !== null &&
            skillItem.querySelector(skillTemplateLevelClassKey) !== null)
            skillTemplate.content.append(skillItem);
        else 
            brokenElements.add(skillTemplateChildClassKey);
        
        // Hobbies
        const hobbyTemplate = this.#getOrCreateTemplate(hobbyTemplateNameKey, container);
        const hobbyItem = container.querySelector(hobbyTemplateChildClassKey);
        if (hobbyItem !== null &&
            hobbyItem.querySelector(hobbyTemplateNameClassKey) !== null)
            hobbyTemplate.content.append(hobbyItem);
        else brokenElements.add(hobbyTemplateChildClassKey);

        /*
         *
         * Generate error
         * 
         */
        this.#elementsCache.forEach((value, key) => {
            if(value == null)
                brokenElements.add(key);
        });

        this.#templateLoaded = brokenElements.size === 0;
        
        return new FunctionFeedback
        (
            brokenElements.size === 0, 
            brokenElements.size > 0 ? " -> " + [...brokenElements].join("\n -> ") : null
        );
    }
    
    get(key) 
    {
        if(!this.#templateLoaded)
            throw new Error("Template not loaded, please call tryImport() before trying to get an element");
        
        return this.#elementsCache.get(key); 
    }
}