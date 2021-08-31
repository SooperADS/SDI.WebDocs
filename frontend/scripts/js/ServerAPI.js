"use strict";
var SDI;
(function (SDI) {
    SDI.projectItemList = [];
})(SDI || (SDI = {}));
var Server;
(function (Server) {
    function addProject(uuid, title, image, github, ...lore) {
        let p = {
            uuid: uuid,
            title: title,
            image: "/./img/" + image,
            description: lore,
        };
        if (github) {
            p.github = github;
        }
        SDI.projectItemList.push(p);
    }
    Server.addProject = addProject;
})(Server || (Server = {}));
//# sourceMappingURL=ServerAPI.js.map