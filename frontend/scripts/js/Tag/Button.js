"use strict";
var SDI;
(function (SDI) {
    SDI.buttons = document.querySelectorAll("button[ref]");
    SDI.groupButtons = document.querySelectorAll(".button-group:not([sub]):not([no-fixed])>button[group]");
})(SDI || (SDI = {}));
SDI.buttons.forEach(e => {
    e.addEventListener("click", ev => {
        let el = ev.target;
        let ref = el.getAttribute("ref");
        if (ref.length > 0) {
            if (el.hasAttribute("new")) {
                window.open(ref, "_black");
            }
            else {
                window.location.href = ref;
            }
        }
    });
});
SDI.groupButtons.forEach(e => {
    e.addEventListener("click", ev => {
        let el = ev.currentTarget.parentElement;
        if (el.hasAttribute("fixed")) {
            el.removeAttribute("fixed");
        }
        else {
            el.setAttribute("fixed", "");
        }
    });
});
//# sourceMappingURL=Button.js.map