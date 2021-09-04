"use strict";
var SDI;
(function (SDI) {
    const refPrefixes = {
        "task": "tasks",
        "docs": "docs",
        "project": "project"
    };
    let _Project_First = true;
    function projectReference(uuid, type) {
        return `/./${refPrefixes[type]}/${uuid}`;
    }
    SDI.projectReference = projectReference;
    function projectButtonPack(token) {
        let r = {};
        function gen() {
            let ra = document.createElement("button");
            ra.innerText = token.title;
            ra.classList.add("project-button");
            return ra;
        }
        r.all = gen();
        r.all.setAttribute("ref", projectReference(token.uuid, "project"));
        r.docs = gen();
        r.docs.setAttribute("ref", projectReference(token.uuid, "docs"));
        r.task = gen();
        r.task.setAttribute("ref", projectReference(token.uuid, "task"));
        return r;
    }
    SDI.projectButtonPack = projectButtonPack;
    function injectProjectButton(token) {
        if (ProjectCard.injectPackValid()) {
            let il = ProjectCard.injectPack();
            let el = projectButtonPack(token);
            il.all.append(el.all);
            il.docs.append(el.docs);
            il.task.append(el.task);
        }
    }
    SDI.injectProjectButton = injectProjectButton;
    class ProjectToken {
        constructor(uuid) {
            this.item = ProjectToken.itemOf(uuid);
            this.cachButton = null;
        }
        get meta() {
            return this.item;
        }
        get uuid() {
            return this.item.uuid;
        }
        button() {
            if (this.cachButton == null) {
                let r = SDI.projectButtonPack(this.item);
                this.cachButton = r;
                return r;
            }
            else {
                return this.cachButton;
            }
        }
        refresh() {
            this.cachButton = null;
        }
        ref(type) {
            return SDI.projectReference(this.uuid, type);
        }
        inject() {
            if (ProjectCard.injectPackValid()) {
                SDI.injectProjectButton(this.item);
                return true;
            }
            return false;
        }
        static itemOf(uuid) {
            let r = {};
            r.uuid = uuid;
            r.title = uuid.toUpperCase();
            return r;
        }
    }
    SDI.ProjectToken = ProjectToken;
    class ProjectCard {
        constructor(uuid) {
            this.item = ProjectCard.itemOf(uuid);
            this.cachElement = null;
            this.cachButton = null;
        }
        get meta() {
            return this.item;
        }
        get uuid() {
            return this.item.uuid;
        }
        release() {
            if (this.canRelease()) {
                SDI.projectShell().append(this.element(SDI.projectUseDocs(), SDI.projectFullInfo()));
                projectsReleaseCount++;
                return true;
            }
            return false;
        }
        canRelease() {
            return SDI.projectShell() && SDI.projectCapacity > projectsReleaseCount;
        }
        refresh() {
            this.cachButton = null;
            this.cachElement = null;
        }
        inject() {
            if (ProjectCard.injectPackValid()) {
                SDI.injectProjectButton(this.tokenOf());
                return true;
            }
            return false;
        }
        button() {
            if (this.cachButton == null) {
                let r = SDI.projectButtonPack(this.item);
                this.cachButton = r;
                return r;
            }
            else {
                return this.cachButton;
            }
        }
        element(useDocs, fullInfo) {
            let r = null;
            if (this.cachElement == null) {
                let item = this.item;
                r = document.createElement("div");
                r.setAttribute("uuid", item.uuid);
                r.classList.add("project");
                if (_Project_First) {
                    r.setAttribute("page", "");
                    _Project_First = false;
                }
                let image = document.createElement("img");
                image.src = item.image;
                r.append(image);
                let header = document.createElement("h6");
                header.innerText = item.title;
                r.append(header);
                let text = document.createElement("div");
                text.classList.add("project__text");
                let d = document.createElement("p");
                d.innerHTML = item.description;
                text.append(d);
                if (item.content && fullInfo) {
                    let c = document.createElement("p");
                    c.innerHTML = item.content;
                    text.append(c);
                }
                r.append(text);
                let list = document.createElement("div");
                list.classList.add("project__buttons");
                let uuid = item.uuid;
                let projectRef = this.ref("project");
                let taskRef = this.ref("task");
                let projectButton = document.createElement("button");
                projectButton.innerText = "Подробнее";
                projectButton.setAttribute("ref", projectRef);
                list.append(projectButton);
                let taskButton = document.createElement("button");
                taskButton.innerText = "Задачи";
                taskButton.setAttribute("ref", taskRef);
                list.append(taskButton);
                if (useDocs) {
                    let docsRef = this.ref("docs");
                    let docsButton = document.createElement("button");
                    docsButton.innerText = "Docs";
                    docsButton.title = "Документация";
                    docsButton.setAttribute("ref", docsRef);
                    list.append(docsButton);
                }
                if (this.item.github) {
                    let githubRef = "https://github.com/" + this.item.github;
                    let githubButton = document.createElement("button");
                    githubButton.innerText = "GitHub";
                    githubButton.title = "Исходный код проекта";
                    githubButton.setAttribute("ref", githubRef);
                    githubButton.setAttribute("new", "");
                    githubButton.classList.add("github");
                    list.append(githubButton);
                }
                r.append(list);
                this.cachElement = r;
            }
            else {
                r = this.cachElement;
            }
            return r;
        }
        tokenOf() {
            return this.item;
        }
        ref(type) {
            return SDI.projectReference(this.uuid, type);
        }
        static injectPackValid() {
            let o = this.injectPack();
            let r = o.all && o.docs && o.task && true;
            return r;
        }
        static injectPack(newb = false) {
            if (newb || !this.cachButtons) {
                let r = {
                    all: document.getElementById("-menu__projects"),
                    docs: document.getElementById("-menu__docs"),
                    task: document.getElementById("-menu__task"),
                };
                if (r.all && r.docs && r.task) {
                    this.cachButtons = r;
                }
                return r;
            }
            else {
                return this.cachButtons;
            }
        }
        static itemOf(uuid) {
            let r = {};
            r.uuid = uuid;
            if (uuid != undefined) {
                r.image = "test.png";
                r.title = "SDI.???";
                r.description = "LLLLLLLLLLLLLLLLLLLLLLL";
                r.content = "45454545454";
            }
            return r;
        }
        static empty() {
            return new ProjectCard(undefined);
        }
        static fillOf(src) {
            let r = {};
            r.uuid = src.uuid;
            r.title = src.title;
            r.image = "test.png";
            r.description = "LLLLLLLLLLLLLLLLLLLLLLL";
            r.content = "544444444444444444444444444 444444444444444444444444444444444444 444444444444444444444444444 444444444444444444444444444444444444";
            return r;
        }
        static byToken(t) {
            let r = this.empty();
            r.item = this.fillOf(t.meta);
            r.cachButton = t.button();
            return r;
        }
    }
    ProjectCard.cachButtons = null;
    SDI.ProjectCard = ProjectCard;
    let projectShellElement = null;
    SDI.projectShell = () => {
        if (!projectShellElement) {
            let r = document.getElementById("-project-list");
            if (r) {
                let cattr = r.getAttribute("capacity");
                SDI.projectCapacity = (cattr == "full"
                    ? Infinity
                    : parseInt(cattr));
                if (isNaN(SDI.projectCapacity)) {
                    SDI.projectCapacity = 1;
                }
            }
            projectShellElement = r;
            return r;
        }
        return projectShellElement;
    };
    let projectShellElementAction = null;
    SDI.projectShellAction = () => {
        if (!projectShellElementAction) {
            let re = SDI.projectShell();
            let r = null;
            if (re) {
                r = new SDI.ScrollAction(re);
            }
            projectShellElementAction = r;
            return r;
        }
        return projectShellElementAction;
    };
    SDI.projectUseDocs = () => {
        let e = SDI.projectShell();
        if (!e) {
            return true;
        }
        return e.hasAttribute("docs");
    };
    SDI.projectFullInfo = () => {
        let e = SDI.projectShell();
        if (!e) {
            return false;
        }
        return e.hasAttribute("full");
    };
    let projectsReleaseCount = 0;
    function projectReleaseCount() {
        return projectsReleaseCount;
    }
    SDI.projectReleaseCount = projectReleaseCount;
    SDI.projectCapacity = 0;
    SDI.projectCapacityStep = 3;
    SDI.projectTokenList = [];
    SDI.requeTokenList = [];
    function hasRequeProjects() {
        return SDI.requeTokenList.length > 0;
    }
    SDI.hasRequeProjects = hasRequeProjects;
    function addProjects() {
        function canAddProject() {
            return (SDI.projectTokenList.length - SDI.requeTokenList.length) < SDI.projectCapacity;
        }
        if (canAddProject()) {
            let t = SDI.requeTokenList.pop();
            if (!t) {
                return false;
            }
            let pi = ProjectCard.byToken(t);
            return pi.release();
        }
        return false;
    }
    SDI.addProjects = addProjects;
    function addToProjects(...add) {
        add.forEach(e => {
            e.inject();
            SDI.projectTokenList.push(e);
            SDI.requeTokenList.push(e);
        });
    }
    SDI.addToProjects = addToProjects;
})(SDI || (SDI = {}));
SDI.projectShell();
SDI.addToProjects(new SDI.ProjectToken("10"), new SDI.ProjectToken("9"), new SDI.ProjectToken("8"), new SDI.ProjectToken("7"), new SDI.ProjectToken("6"), new SDI.ProjectToken("5"), new SDI.ProjectToken("4"), new SDI.ProjectToken("3"), new SDI.ProjectToken("2"), new SDI.ProjectToken("1"));
{
    function fillProjects() {
        while (SDI.addProjects()) { }
        if (SDI.projectShellAction()) {
            SDI.projectShellAction().refresh();
        }
    }
    function refreshButton(t) {
        if (SDI.hasRequeProjects()) {
            fillProjects();
        }
        if (!SDI.hasRequeProjects()) {
            t.setAttribute("disabled", "");
        }
    }
    let bm = document.getElementById("-project__more");
    bm.addEventListener("click", ev => {
        let t = ev.target;
        console.log("LLLLLLLL");
        SDI.projectCapacity += SDI.projectCapacityStep;
        refreshButton(t);
    });
    refreshButton(bm);
}
//# sourceMappingURL=Project.js.map