"use strict";
var SDI;
(function (SDI) {
    function hasVerticalScrol(element) {
        return element.scrollHeight > element.clientHeight;
    }
    SDI.hasVerticalScrol = hasVerticalScrol;
    function hasHorizontalScrol(element) {
        return element.scrollWidth > element.clientWidth;
    }
    SDI.hasHorizontalScrol = hasHorizontalScrol;
    function hasAnyScrol(element) {
        return hasHorizontalScrol(element) || hasVerticalScrol(element);
    }
    SDI.hasAnyScrol = hasAnyScrol;
    function hasDoubleScrol(element) {
        return hasHorizontalScrol(element) && hasVerticalScrol(element);
    }
    SDI.hasDoubleScrol = hasDoubleScrol;
    function canScrollUp(element) {
        return element.scrollTop > 0;
    }
    SDI.canScrollUp = canScrollUp;
    function canScrollDown(element) {
        return !(element.scrollHeight -
            Math.round(element.scrollTop)
            == element.clientHeight);
    }
    SDI.canScrollDown = canScrollDown;
    function canScrollLeft(element) {
        return element.scrollLeft > 0;
    }
    SDI.canScrollLeft = canScrollLeft;
    function canScrollRight(element) {
        return !(element.scrollWidth -
            Math.round(element.scrollLeft)
            == element.clientWidth);
    }
    SDI.canScrollRight = canScrollRight;
    function defaultScrollState() {
        return {
            vertical: true,
            horizontal: false
        };
    }
    SDI.defaultScrollState = defaultScrollState;
    function nullScrollState() {
        return {
            vertical: null,
            horizontal: null
        };
    }
    SDI.nullScrollState = nullScrollState;
    function makeScrolState(v, h) {
        return {
            vertical: v,
            horizontal: h
        };
    }
    SDI.makeScrolState = makeScrolState;
    class ScrollStateNode {
        constructor(block, state = null) {
            if (!state) {
                state = nullScrollState();
            }
            this.state = state;
            this.parant = null;
            this.restore(block);
        }
        get childrenLiust() {
            return this.childrens;
        }
        get parantNode() {
            return this.parant;
        }
        get element() {
            return this.block;
        }
        get setElement() {
            if (this.isRewrite()) {
                return this.block;
            }
            if (!this.parant) {
                return null;
            }
            return this.parant.setElement;
        }
        root() {
            if (this.parant) {
                return this.parant.root();
            }
            return this;
        }
        isRewrite() {
            return this.state.horizontal != null
                || this.state.vertical != null;
        }
        isFull() {
            return this.state.horizontal != null
                && this.state.vertical != null;
        }
        getState() {
            let r = nullScrollState();
            r.horizontal = this.state.horizontal;
            r.vertical = this.state.vertical;
            let co = this.parant;
            while (co) {
                if (r.horizontal != null
                    && r.vertical != null) {
                    break;
                }
                if (r.horizontal == null) {
                    r.horizontal = co.state.horizontal;
                }
                if (r.vertical == null) {
                    r.vertical = co.state.vertical;
                }
                co = co.parant;
            }
            return r;
        }
        stateOf() {
            let r = this.getState();
            const d = defaultScrollState();
            if (r.horizontal == null) {
                r.horizontal = d.horizontal;
            }
            if (r.vertical == null) {
                r.vertical = d.vertical;
            }
            return r;
        }
        searchChild(element) {
            for (let i = 0; i < this.childrens.length; i++) {
                const my = this.childrens[i];
                if (my.block == element) {
                    return my;
                }
                let r = my.searchChild(element);
                if (r) {
                    return r;
                }
            }
            return null;
        }
        searchParant(element) {
            if (this.parant) {
                if (this.parant.block == element) {
                    return this.parant;
                }
                return this.parant.searchParant(element);
            }
            return null;
        }
        searchIn(element) {
            if (this.block == element) {
                return this;
            }
            for (let i = 0; i < this.childrens.length; i++) {
                const my = this.childrens[i];
                let r = my.searchIn(element);
                if (r) {
                    return r;
                }
            }
            return null;
        }
        searchOut(element) {
            if (this.block == element) {
                return this;
            }
            if (this.parant) {
                return this.parant.searchOut(element);
            }
            return null;
        }
        findChild(element) {
            for (let i = 0; i < this.childrens.length; i++) {
                const my = this.childrens[i];
                if (my.block == element) {
                    return my;
                }
            }
            return null;
        }
        findIn(element) {
            if (this.block == element) {
                return this;
            }
            for (let i = 0; i < this.childrens.length; i++) {
                const my = this.childrens[i];
                if (my.block == element) {
                    return my;
                }
            }
            return null;
        }
        search(element) {
            let r = this.searchOut(element);
            if (!r) {
                r = this.searchChild(element);
            }
            return r;
        }
        find(element) {
            let r = this.parant
                ? this.parant.block == element
                    ? this.parant
                    : null
                : null;
            if (!r) {
                r = this.findIn(element);
            }
            return r;
        }
        restore(element) {
            this.childrens = [];
            this.block = element;
            let childrens = element.children;
            for (let i = 0; i < childrens.length; i++) {
                const e = childrens.item(i);
                let ch = new ScrollStateNode(e);
                ch.parant = this;
                this.childrens.push(ch);
            }
        }
        restoreThis() {
            this.restore(this.block);
        }
        refresh() {
            let nchildrens = [];
            let childrens = this.block.children;
            for (let i = 0; i < childrens.length; i++) {
                const e = childrens.item(i);
                const ne = this.findChild(e);
                if (!ne) {
                    let nch = new ScrollStateNode(e);
                    nch.parant = this;
                    nchildrens.push(nch);
                }
                else {
                    ne.refresh();
                    nchildrens.push(ne);
                }
            }
            this.childrens = nchildrens;
        }
        action() {
            let r = new ScrollAction(undefined);
            r.redirect(this);
            return r;
        }
    }
    SDI.ScrollStateNode = ScrollStateNode;
    class ScrollAction {
        constructor(element) {
            if (element != undefined) {
                let n = SDI.scrollTree.root().searchIn(element);
                if (!n) {
                    console.log("REFRECS BY", element);
                    SDI.scrollTree.root().refresh();
                    n = SDI.scrollTree.root().searchIn(element);
                }
                this.node = n;
            }
            else {
                this.node = null;
            }
        }
        get branch() {
            return this.node;
        }
        get root() {
            return this.node.root();
        }
        redirect(node) {
            this.node = node;
        }
        isValid() {
            return this.node != null;
        }
        inTree() {
            if (!this.isValid()) {
                if (!this.node.parantNode) {
                    return true;
                }
                if (this.node.parantNode.findChild(this.node.element)) {
                    return true;
                }
            }
            return false;
        }
        get state() {
            return this.node.state;
        }
        set state(v) {
            this.node.state = v;
        }
        get vertical() {
            return this.state.vertical;
        }
        set vertical(v) {
            this.node.state.vertical = v;
        }
        get horizontal() {
            return this.state.horizontal;
        }
        set horizontal(v) {
            this.node.state.horizontal = v;
        }
        reset() {
            this.state = nullScrollState();
        }
        on() {
            this.state = makeScrolState(true, true);
        }
        off() {
            this.state = makeScrolState(false, false);
        }
        horizontalReset() {
            this.horizontal = null;
        }
        horizontalOn() {
            this.horizontal = true;
        }
        horizontalOff() {
            this.horizontal = false;
        }
        verticalReset() {
            this.vertical = null;
        }
        verticalOn() {
            this.vertical = true;
        }
        verticalOff() {
            this.vertical = false;
        }
    }
    SDI.ScrollAction = ScrollAction;
    SDI.scrollTree = new ScrollStateNode(document.body, defaultScrollState());
    function elementSrollAction(element) {
        return new ScrollAction(element);
    }
    SDI.elementSrollAction = elementSrollAction;
    function elementSrollNode(element) {
        return SDI.scrollTree.root().search(element);
    }
    SDI.elementSrollNode = elementSrollNode;
    SDI.bodyScrollAction = elementSrollAction(document.body);
    function isEnableScerol(s) {
        let se = s.stateOf();
        return se.horizontal || se.vertical;
    }
    SDI.isEnableScerol = isEnableScerol;
})(SDI || (SDI = {}));
window.addEventListener("wheel", event => {
    let isHorizontal = event.deltaX != 0;
    let isVertical = event.deltaY != 0;
    let target = event.target;
    let node = SDI.elementSrollNode(target);
    let element = node.setElement;
    if (!element) {
        console.error("Incorect scroll tree: ", node);
    }
    let state = node.stateOf();
    if ((!state.horizontal && isHorizontal) ||
        (!state.vertical && isVertical)) {
        event.preventDefault();
        return;
    }
    if (isHorizontal) {
        if (event.deltaX < 0) {
            if (!SDI.canScrollLeft(element)) {
                event.preventDefault();
            }
        }
        else {
            if (!SDI.canScrollRight(element)) {
                event.preventDefault();
            }
        }
    }
    if (isVertical) {
        if (event.deltaY < 0) {
            if (!SDI.canScrollUp(element)) {
                event.preventDefault();
            }
        }
        else {
            if (!SDI.canScrollDown(element)) {
                event.preventDefault();
            }
        }
    }
}, { passive: false });
//# sourceMappingURL=Scrol.js.map