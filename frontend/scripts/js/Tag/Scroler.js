"use strict";
var SDI;
(function (SDI) {
    SDI.scrolerElement = document.getElementById("-scroler");
    SDI.timeToFullScrol = 500;
    let inScrol = false;
    function smoothScrol(top) {
        let i = 0;
        const add = top / SDI.timeToFullScrol;
        SDI.bodyScrollAction.verticalOff();
        inScrol = true;
        let int = setInterval(() => {
            if (i >= top) {
                setTimeout(() => {
                    SDI.bodyScrollAction.verticalOn();
                    inScrol = false;
                    window.scrollBy(0, window.pageYOffset - top);
                }, 250);
                clearInterval(int);
            }
            else {
                window.scrollBy(0, -add);
                i += add;
            }
        }, 1);
    }
    SDI.smoothScrol = smoothScrol;
    SDI.scrolerElement.addEventListener("click", () => {
        SDI.scrolerElement.classList.add("hidden");
        if (!inScrol) {
            smoothScrol(window.scrollY + 10);
        }
    });
    SDI.scrolerElement.classList.add("hidden");
    window.addEventListener("scroll", () => {
        if (!inScrol) {
            if (window.scrollY > (window.innerHeight * 1.15)) {
                SDI.scrolerElement.classList.remove("hidden");
            }
            else {
                SDI.scrolerElement.classList.add("hidden");
            }
        }
    });
})(SDI || (SDI = {}));
//# sourceMappingURL=Scroler.js.map