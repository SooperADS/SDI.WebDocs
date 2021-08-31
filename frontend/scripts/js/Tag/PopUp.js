"use strict";
var SDI;
(function (SDI) {
    SDI.popupRootElement = document.getElementById("-popup");
    class Popup {
        constructor(id) {
            this.id = id;
            this.block = document.getElementById(this.curentId());
            if (this.block) {
                const popup = this.block;
                const lid = popup.getAttribute("id");
                this.scrollAction = SDI.elementSrollAction(popup);
                if (lid) {
                    Popup.storage[id] = this;
                    this.state =
                        popup.classList.contains("open");
                    if (this.state) {
                        if (Popup.open) {
                            Popup.open.replace(this, false);
                        }
                        Popup.open = this;
                    }
                }
            }
        }
        get name() {
            return this.id;
        }
        get element() {
            return this.block;
        }
        get isOpen() {
            return this.state;
        }
        curentId() {
            return `-popup__item_${this.id}`;
        }
        validId() {
            return this.element != null;
        }
        terminateBy(box = true) {
            if (this.validId() && this.isOpen) {
                SDI.bodyScrollAction.verticalOn();
                this.scrollAction.verticalOff();
                this.element.classList.remove("open");
                if (box) {
                    SDI.popupRootElement.classList.remove("open");
                }
                Popup.open = null;
                this.state = false;
            }
        }
        closeBy(box) {
            if (this.validId() && this.isOpen && !Popup.lock) {
                this.terminateBy(box);
                this.animate(["open"], "box$-");
                return true;
            }
            return false;
        }
        terminate() {
            this.terminateBy(true);
        }
        close() {
            return this.closeBy(true);
        }
        open() {
            if (this.validId() && !this.isOpen && !Popup.lock) {
                SDI.bodyScrollAction.verticalOff();
                function open(o) {
                    Popup.open = o;
                    o.scrollAction.verticalOn();
                    if (SDI.popupRootElement.classList.contains("open")) {
                        SDI.popupRootElement.classList.add("open");
                    }
                    o.element.classList.add("open");
                    o.animate(["open"], "box$-");
                    o.state = true;
                }
                if (Popup.open) {
                    if (!Popup.open.close()) {
                        return false;
                    }
                    setTimeout(() => open(this), this.animateTime(["close"], "box$-") + 1);
                }
                else {
                    SDI.popupRootElement.classList.add("open");
                    open(this);
                }
                return true;
            }
            return false;
        }
        openAuto() {
            if (Popup.open) {
                return Popup.replace(this, true);
            }
            else {
                return this.open();
            }
        }
        animateTime(anim, ...prefix) {
            let caTime = [];
            anim.forEach(aid => {
                caTime.push(SDI.popupAnimationList[aid] || 0);
                prefix.forEach(p => {
                    caTime.push(SDI.popupAnimationList[p + aid] || 0);
                });
            });
            return Math.max(...caTime);
        }
        animate(animation, ...prefix) {
            Popup.lock = true;
            setTimeout(() => {
                Popup.lock = false;
            }, this.animateTime(animation, ...prefix));
        }
        replace(popup, anim) {
            if (Popup.open == this &&
                this.validId() && this.isOpen) {
                return Popup.replace(popup, anim);
            }
            return false;
        }
        static replace(popup, anim) {
            if (Popup.open) {
                if (anim) {
                    if (!Popup.open.closeBy(false)) {
                        return false;
                    }
                }
                else {
                    Popup.open.terminateBy(false);
                }
                return popup.open();
            }
            return false;
        }
        static close() {
            if (Popup.open) {
                return Popup.open.close();
            }
            return true;
        }
        static hasOpen() {
            return Popup.open != null;
        }
        static popup(id) {
            return Popup.storage[id];
        }
    }
    Popup.storage = {};
    Popup.open = null;
    Popup.lock = false;
    SDI.Popup = Popup;
    SDI.popupAnimationList = {
        "box$-open": 800,
        "open": 800,
        "box$-close": 800,
        "close": 800
    };
    let popupTriggers = document.querySelectorAll("*[popup]");
    let popupTriggersList = [
        ...popupTriggers
    ];
    function popupTrigerEvent(e) {
        const obj = e.target;
        const p = obj.getAttribute("popup");
        if (p) {
            const popup = Popup.popup(p);
            if (popup) {
                popup.open();
                e.preventDefault();
            }
        }
    }
    function disablePopupTrigers() {
        popupTriggersList.forEach(e => {
            e.removeEventListener("click", popupTrigerEvent);
        });
    }
    SDI.disablePopupTrigers = disablePopupTrigers;
    function activePopupTrigers() {
        disablePopupTrigers();
        popupTriggersList.forEach(e => {
            e.addEventListener("click", popupTrigerEvent);
        });
    }
    SDI.activePopupTrigers = activePopupTrigers;
})(SDI || (SDI = {}));
{
    let popupList = document.querySelectorAll("#-popup>div");
    for (let i = 0; i < popupList.length; i++) {
        const popup = popupList.item(i);
        const lid = popup.getAttribute("id");
        const pattern = /(?<=-popup__item_)([^ ]+)/g;
        const cid = pattern.exec(lid);
        if (cid) {
            new SDI.Popup(cid[0]);
        }
    }
}
SDI.popupRootElement.addEventListener("click", (ev) => {
    const el = ev.target;
    if (el.closest("#-popup>popup:not([img])") || !el.closest("#-popup>div")) {
        SDI.Popup.close();
    }
});
window.addEventListener("keydown", (ev) => {
    if (ev.key == "Escape") {
        SDI.Popup.close();
    }
});
SDI.activePopupTrigers();
//# sourceMappingURL=Popup.js.map