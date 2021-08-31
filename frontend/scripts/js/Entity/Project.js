"use strict";
var SDI;
(function (SDI) {
    SDI.mainPrefix = "/./server/";
    SDI.sdiPrefixes = {
        "task": "tasks.php",
        "docs": "docs.php",
        "project": "project.php"
    };
    function makeProjectReference(prefix, uuid) {
        return SDI.mainPrefix + SDI.sdiPrefixes[prefix]
            + "?uuid=" + uuid;
    }
    SDI.makeProjectReference = makeProjectReference;
    function getProjectList(getnum, full) {
        let items = [...SDI.projectItemList];
        let itemsToRemove = items.length -
            (getnum == Infinity
                ? items.length
                : getnum);
        let clen = items.length;
        for (let i = 0; i < itemsToRemove && i < clen; i++) {
            items.pop();
        }
        if (!full) {
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                let rv = Math.max(item.description.length - 1, 0);
                for (let j = 0; j < item.description.length && j < rv; j++) {
                    item.description.pop();
                }
            }
        }
        return items;
    }
    SDI.getProjectList = getProjectList;
    function createProjectButton(item) {
        let r = {};
        function gen() {
            let ra = document.createElement("button");
            ra.innerText = item.title;
            ra.classList.add("project-button");
            return ra;
        }
        r.all = gen();
        r.all.setAttribute("ref", makeProjectReference("project", item.uuid));
        r.docs = gen();
        r.docs.setAttribute("ref", makeProjectReference("docs", item.uuid));
        r.task = gen();
        r.task.setAttribute("ref", makeProjectReference("task", item.uuid));
        return r;
    }
    SDI.createProjectButton = createProjectButton;
    function clearProjectButtons() {
        {
            let tempTask = SDI.savedProjectButtons.task.children;
            for (let i = 1; i < tempTask.length; i++) {
                tempTask[i].remove();
            }
        }
        {
            let tempDocs = SDI.savedProjectButtons.docs.children;
            for (let i = 1; i < tempDocs.length; i++) {
                tempDocs[i].remove();
            }
        }
        {
            let temp = SDI.savedProjectButtons.all.children;
            for (let i = 4; i < temp.length; i++) {
                temp[i].remove();
            }
        }
    }
    SDI.clearProjectButtons = clearProjectButtons;
    function createProjectCard(item, docs) {
        let r = document.createElement("div");
        r.setAttribute("uuid", item.uuid);
        r.classList.add("project");
        let image = document.createElement("img");
        image.src = item.image;
        r.append(image);
        let header = document.createElement("h6");
        header.innerText = item.title;
        r.append(header);
        let text = document.createElement("div");
        text.classList.add("project__text");
        item.description.forEach((e) => {
            let p = document.createElement("p");
            p.innerHTML = e;
            text.append(p);
        });
        r.append(text);
        let list = document.createElement("div");
        list.classList.add("project__buttons");
        let uuid = item.uuid;
        let projectRef = makeProjectReference("project", uuid);
        let taskRef = makeProjectReference("task", uuid);
        let projectButton = document.createElement("button");
        projectButton.innerText = "Подробнее";
        projectButton.setAttribute("ref", projectRef);
        list.append(projectButton);
        let taskButton = document.createElement("button");
        taskButton.innerText = "Задачи";
        taskButton.setAttribute("ref", taskRef);
        list.append(taskButton);
        if (docs) {
            let docsRef = makeProjectReference("docs", uuid);
            let docsButton = document.createElement("button");
            docsButton.innerText = "Docs";
            docsButton.title = "Документация";
            docsButton.setAttribute("ref", docsRef);
            list.append(docsButton);
        }
        if (item.github) {
            let githubRef = "https://github.com/" + item.github;
            let githubButton = document.createElement("button");
            githubButton.innerText = "GitHub";
            githubButton.title = "Исходный код проекта";
            githubButton.setAttribute("ref", githubRef);
            githubButton.setAttribute("new", "");
            githubButton.classList.add("github");
            list.append(githubButton);
        }
        r.append(list);
        return r;
    }
    SDI.createProjectCard = createProjectCard;
    SDI.projectShell = document.getElementById("-project-list");
    let c = SDI.projectShell.getAttribute("capacity");
    SDI.moreProjectButton = document.getElementById("-projrct-more");
    SDI.projectCapacity = c == "full"
        ? Infinity
        : parseInt(c);
    if (isNaN(SDI.projectCapacity)) {
        SDI.projectCapacity = 1;
    }
    SDI.projectCardList = [];
    SDI.addCapacity = 2;
    let ProjectShellAction = new SDI.ScrollAction(SDI.projectShell);
    SDI.savedProjectButtons = {
        all: document.getElementById("-menu__projects"),
        docs: document.getElementById("-menu__docs"),
        task: document.getElementById("-menu__task"),
    };
    SDI.projectsList = getProjectList(SDI.projectCapacity, SDI.projectShell.hasAttribute("full"));
    function refreshProjectList() {
        SDI.projectsList = getProjectList(SDI.projectCapacity, SDI.projectShell.hasAttribute("full"));
    }
    SDI.refreshProjectList = refreshProjectList;
    function refreshProjects() {
        refreshProjectList();
        SDI.projectCardList.length = 0;
        SDI.projectShell.innerHTML = "";
        SDI.projectsList.forEach(p => {
            let e = SDI.createProjectCard(p, SDI.projectShell.hasAttribute("docs"));
            SDI.projectCardList.push(e);
            SDI.projectShell.append(e);
        });
        if (SDI.projectCardList.length) {
            SDI.projectCardList[0].setAttribute("page", "");
        }
        if (SDI.moreProjectButton) {
            if (SDI.projectCapacity < SDI.projectItemList.length) {
                SDI.moreProjectButton.removeAttribute("hidden");
            }
            else {
                SDI.moreProjectButton.setAttribute("hidden", "");
            }
        }
        ProjectShellAction.branch.refresh();
    }
    SDI.refreshProjects = refreshProjects;
})(SDI || (SDI = {}));
SDI.refreshProjects();
SDI.moreProjectButton.addEventListener("click", () => {
    if (isNaN(SDI.addCapacity)) {
        SDI.addCapacity = 1;
    }
    SDI.projectCapacity += SDI.addCapacity;
    SDI.refreshProjects();
});
SDI.clearProjectButtons();
SDI.projectItemList.forEach(i => {
    let el = SDI.createProjectButton(i);
    SDI.savedProjectButtons.all.append(el.all);
    SDI.savedProjectButtons.docs.append(el.docs);
    SDI.savedProjectButtons.task.append(el.task);
});
SDI.scrollTree.root().refresh();
//# sourceMappingURL=Project.js.map