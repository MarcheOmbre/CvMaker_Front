class Contact {
    constructor(obj = {}) {

        obj.type ??= 0;
        obj.value ??= "";
        
        if(!isNumeric(obj.type) || !isString(obj.value))
            throw new Error("Type mismatch");

        this.type = obj.type;
        this.value = obj.value;
    }

    static IsTypeContact(obj) {
        return obj.type !== undefined && obj.value !== undefined;
    }
}

class Link {
    constructor(obj = {}) {

        obj.name ??= "";
        obj.url ??= "";
        
        if(!isString(obj.name) || !isString(obj.url))
            throw new Error("Type mismatch");

        this.name = obj.name;
        this.url = obj.url;
    }
    
    static IsTypeLink(obj) {
        return obj.name !== undefined && obj.url !== undefined;
    }
}

class Work {
    constructor(obj = {}) {
        

        obj.title ??= "";
        obj.company ??= "";
        obj.from ??= new Date();
        if(isString(obj.from))
            obj.from = new Date(obj.from);
        obj.to ??= new Date();
        if(isString(obj.to))
            obj.to = new Date(obj.to);
        obj.description ??= "";
        
        if(!isString(obj.title) || !isString(obj.company) || !(obj.from instanceof Date) || !(obj.to instanceof Date) || !isString(obj.description))
            throw new Error("Type mismatch");

        this.title = obj.title;
        this.company = obj.company;
        this.from = obj.from;
        this.to = obj.to;
        this.description = obj.description;
    }
    
    static IsTypeWork(obj) {
        return obj.title !== undefined && obj.company !== undefined && obj.from !== undefined && obj.to !== undefined && obj.description !== undefined;
    }
}

class Education {
    constructor(obj = {}) {

        obj.title ??= "";
        obj.date ??= new Date();
        if(isString(obj.date))
            obj.date = new Date(obj.date);
        
        if(!isString(obj.title) || !(obj.date instanceof Date))
            throw new Error("Type mismatch");
        
        this.title = obj.title;
        this.date = obj.date;
    }
    
    static IsTypeEducation(obj) {
        return obj.title !== undefined && obj.date !== undefined;
    }
}

class Project {
    
    constructor(obj = {}) {

        obj.title ??= "";
        obj.date ??= new Date();
        if(isString(obj.date))
            obj.date = new Date(obj.date);
        obj.description ??= "";
        
        if(!isString(obj.title) || !(obj.date instanceof Date) || !isString(obj.description))
            throw new Error("Type mismatch");
        
        this.title = obj.title;
        this.date = obj.date;
        this.description = obj.description;
    }
    
    static IsTypeProject(obj) {
        return obj.title !== undefined && obj.date !== undefined && obj.description !== undefined;
    }
}

class Language {
    constructor(obj = {}) {

        obj.name ??= "";
        obj.level ??= 0;

        if(!isString(obj.name) || !isNumeric(obj.level))
            throw new Error("Type mismatch");
        
        this.name = obj.name;
        this.level = obj.level;
    }
    
    static IsTypeLanguage(obj) {
        return obj.name !== undefined && obj.level !== undefined;
    }
}

class Skill {
    
    constructor(obj = {}) {

        obj.name ??= "";
        obj.level ??= 0;
         
        if(!isString(obj.name) || !isNumeric(obj.level))
            throw new Error("Type mismatch");
        
        this.name = obj.name;
        this.level = obj.level;
    }
    
    static IsTypeSkill(obj) {
        return obj.name !== undefined;
    }
}

class Hobby {
    constructor(obj = null) {

        if(obj === null){
            this.name = "";
            return;
        }
        
        if(!isString(obj.name))
            throw new Error("Type mismatch");
        
        this.name = obj.name;
    }
    
    static IsTypeHobby(obj) {
        return obj.name !== undefined;
    }
}