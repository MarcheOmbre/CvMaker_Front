class Contact {
    constructor(obj = {}) {

        obj.type ??= 0;
        obj.value ??= "";
        
        if (!isNumericOrNumericString(obj.type) || !isString(obj.value))
            throw new Error("Type mismatch");

        this.type = obj.type;
        this.value = obj.value;
    }

    static IsTypeContact(obj) {
        return obj.type  && isNumericOrNumericString(obj.type) && obj.value && isString(obj.value);
    }
}

class Link {
    constructor(obj = {}) {

        obj.name ??= "";
        obj.url ??= "";

        if (!isString(obj.name) || !isString(obj.url))
            throw new Error("Type mismatch");

        this.name = obj.name;
        this.url = obj.url;
    }

    static IsTypeLink(obj) {
        return obj.name && isString(obj.name) && obj.url && isString(obj.url);
    }
}

class Work {
    constructor(obj = {}) {


        obj.title ??= "";
        obj.company ??= "";
        obj.from ??= new Date();
        if (obj.from && isString(obj.from))
            obj.from = new Date(obj.from);
        obj.to ??= new Date();
        if (obj.to && isString(obj.to))
            obj.to = new Date(obj.to);
        obj.description ??= "";

        if (!isString(obj.title) || !isString(obj.company) || !isValidDate(obj.from) || !isValidDate(obj.to) || !isString(obj.description))
            throw new Error("Type mismatch");

        this.title = obj.title;
        this.company = obj.company;
        this.from = obj.from;
        this.to = obj.to;
        this.description = obj.description;
    }

    static IsTypeWork(obj) {
        return obj.title && isString(obj.title) && obj.company && isString(obj.company) && 
            isValidDate(obj.from) && isValidDate(obj.to) && obj.description && isString(obj.description);
    }
}

class Education {
    constructor(obj = {}) {

        obj.title ??= "";
        obj.date ??= new Date();
        if (obj.date && isString(obj.date))
            obj.date = new Date(obj.date);

        if (!isString(obj.title) || !isValidDate(obj.date))
            throw new Error("Type mismatch");

        this.title = obj.title;
        this.date = obj.date;
    }

    static IsTypeEducation(obj) {
        return obj.title && isString(obj.title) && isValidDate(obj.date);
    }
}

class Project {

    constructor(obj = {}) {

        obj.title ??= "";
        obj.date ??= new Date();
        if (obj.date && isString(obj.date))
            obj.date = new Date(obj.date);
        obj.description ??= "";

        if (!isString(obj.title) || !isValidDate(obj.date) || !isString(obj.description))
            throw new Error("Type mismatch");

        this.title = obj.title;
        this.date = obj.date;
        this.description = obj.description;
    }

    static IsTypeProject(obj) {
        return obj.title && isString(obj.title) && isValidDate(obj.date) && obj.description && isString(obj.description);
    }
}

class Language {
    constructor(obj = {}) {

        obj.name ??= "";
        obj.level ??= 0;

        if (!isString(obj.name) || !isNumericOrNumericString(obj.level))
            throw new Error("Type mismatch");

        this.name = obj.name;
        this.level = obj.level;
    }

    static IsTypeLanguage(obj) {
        return obj.name && isString(obj.name) && obj.level && isNumericOrNumericString(obj.level);
    }
}

class Skill {

    constructor(obj = {}) {

        obj.name ??= "";
        obj.level ??= 0;

        if (!isString(obj.name) || !isNumericOrNumericString(obj.level))
            throw new Error("Type mismatch");

        this.name = obj.name;
        this.level = obj.level;
    }

    static IsTypeSkill(obj) {
        return obj.name && isString(obj.name) && obj.level && isNumericOrNumericString(obj.level);
    }
}

class Hobby {
    constructor(obj = null) {

        if (!obj) {
            this.name = "";
            return;
        }

        if (!isString(obj.name))
            throw new Error("Type mismatch");

        this.name = obj.name;
    }

    static IsTypeHobby(obj) {
        return obj.name && isString(obj.name);
    }
}