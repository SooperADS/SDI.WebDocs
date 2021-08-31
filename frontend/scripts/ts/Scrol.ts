namespace SDI {
	export function hasVerticalScrol(element: Element): boolean {
		return element.scrollHeight > element.clientHeight;
	}
	export function hasHorizontalScrol(element: Element): boolean {
		return element.scrollWidth > element.clientWidth;
	}
	export function hasAnyScrol(element: Element): boolean {
		return hasHorizontalScrol(element) || hasVerticalScrol(element)
	}
	export function hasDoubleScrol(element: Element): boolean {
		return hasHorizontalScrol(element) && hasVerticalScrol(element)
	}

	export function canScrollUp(element: Element): boolean {
		return element.scrollTop > 0
	}
	export function canScrollDown(element: Element): boolean {
		return !(element.scrollHeight -
			Math.round(element.scrollTop)
			== element.clientHeight)
	}
	export function canScrollLeft(element: Element): boolean {
		return element.scrollLeft > 0
	}
	export function canScrollRight(element: Element): boolean {
		return !(element.scrollWidth -
			Math.round(element.scrollLeft)
			== element.clientWidth)
	}

	export function defaultScrollState(): ScrollState {
		return {
			vertical: true,
			horizontal: false
		}
	}
	export function nullScrollState(): ScrollState {
		return {
			vertical: null,
			horizontal: null
		}
	}

	export function makeScrolState(
		v: boolean | null, h: boolean | null
	): ScrollState {
		return {
			vertical: v,
			horizontal: h
		}
	}

	export interface ScrollState {
		vertical: boolean | null
		horizontal: boolean | null
	}
	export class ScrollStateNode {
		state: ScrollState
		protected block: Element

		protected parant: ScrollStateNode | null
		protected childrens: ScrollStateNode[]

		constructor(
			block: Element,
			state: ScrollState = null
		) {
			if (!state) {
				state = nullScrollState()
			}
			this.state = state

			this.parant = null
			this.restore(block)
		}

		get childrenLiust(): ScrollStateNode[] {
			return this.childrens
		}
		get parantNode(): ScrollStateNode | null {
			return this.parant
		}
		get element(): Element {
			return this.block
		}

		get setElement(): Element | null {
			if (this.isRewrite()) {
				return this.block
			}

			if (!this.parant) {
				return null
			}

			return this.parant.setElement
		}

		root(): ScrollStateNode {
			if (this.parant) {
				return this.parant.root()
			}
			return this
		}

		isRewrite(): boolean {
			return this.state.horizontal != null
				|| this.state.vertical != null
		}
		isFull(): boolean {
			return this.state.horizontal != null
				&& this.state.vertical != null
		}

		getState(): ScrollState {
			let r: ScrollState = nullScrollState()
			r.horizontal = this.state.horizontal
			r.vertical = this.state.vertical

			let co = this.parant
			while (co) {
				if (r.horizontal != null
					&& r.vertical != null) {
					break
				}

				if (r.horizontal == null) {
					r.horizontal = co.state.horizontal
				}
				if (r.vertical == null) {
					r.vertical = co.state.vertical
				}

				co = co.parant
			}

			return r
		}
		stateOf(): ScrollState {
			let r = this.getState()
			const d = defaultScrollState()
			if (r.horizontal == null) {
				r.horizontal = d.horizontal
			}
			if (r.vertical == null) {
				r.vertical = d.vertical
			}

			return r
		}

		searchChild(element: Element): null | ScrollStateNode {
			for (let i = 0; i < this.childrens.length; i++) {
				const my = this.childrens[i];
				if (my.block == element) {
					return my
				}

				let r = my.searchChild(element)
				if (r) {
					return r
				}
			}
			return null
		}
		searchParant(element: Element): null | ScrollStateNode {
			if (this.parant) {
				if (this.parant.block == element) {
					return this.parant
				}
				return this.parant.searchParant(element)
			}
			return null

		}
		searchIn(element: Element): null | ScrollStateNode {
			if (this.block == element) {
				return this
			}
			for (let i = 0; i < this.childrens.length; i++) {
				const my = this.childrens[i];

				let r = my.searchIn(element)
				if (r) {
					return r
				}
			}
			return null
		}
		searchOut(element: Element): null | ScrollStateNode {
			if (this.block == element) {
				return this
			}

			if (this.parant) {
				return this.parant.searchOut(element)
			}
			return null
		}

		findChild(element: Element): null | ScrollStateNode {
			for (let i = 0; i < this.childrens.length; i++) {
				const my = this.childrens[i];
				if (my.block == element) {
					return my
				}
			}
			return null
		}
		findIn(element: Element): null | ScrollStateNode {
			if (this.block == element) {
				return this
			}
			for (let i = 0; i < this.childrens.length; i++) {
				const my = this.childrens[i];
				if (my.block == element) {
					return my
				}
			}
			return null
		}

		search(element: Element): null | ScrollStateNode {
			let r = this.searchOut(element)
			if (!r) {
				r = this.searchChild(element)
			}

			return r
		}
		find(element: Element): null | ScrollStateNode {
			let r = this.parant
				? this.parant.block == element
					? this.parant
					: null
				: null
			if (!r) {
				r = this.findIn(element)
			}

			return r
		}

		restore(element: Element): void {
			this.childrens = []
			this.block = element

			let childrens = element.children
			for (let i = 0; i < childrens.length; i++) {
				const e = childrens.item(i);
				let ch = new ScrollStateNode(e)
				ch.parant = this
				this.childrens.push(ch)
			}
		}
		restoreThis(): void {
			this.restore(this.block)
		}

		refresh(): void {
			let nchildrens: ScrollStateNode[] = []
			let childrens = this.block.children

			for (let i = 0; i < childrens.length; i++) {
				const e = childrens.item(i);
				const ne = this.findChild(e)
				if (!ne) {
					let nch = new ScrollStateNode(e)
					nch.parant = this
					nchildrens.push(nch)
				}
				else {
					ne.refresh()
					nchildrens.push(ne)
				}
			}
			this.childrens = nchildrens
		}

		action(): ScrollAction {
			let r = new ScrollAction(undefined)
			r.redirect(this)
			return r
		}
	}

	export class ScrollAction {
		protected node: ScrollStateNode | null

		get branch(): ScrollStateNode {
			return this.node
		}
		get root(): ScrollStateNode {
			return this.node.root()
		}

		redirect(node: ScrollStateNode): void {
			this.node = node
		}

		constructor(element: Element) {
			if (element != undefined) {
				let n = scrollTree.root().searchIn(element)
				if (!n) {
					console.log("REFRECS BY", element);
					scrollTree.root().refresh()
					n = scrollTree.root().searchIn(element)
				}
				this.node = n
			}
			else {
				this.node = null
			}
		}

		isValid(): boolean {
			return this.node != null
		}
		inTree(): boolean {
			if (!this.isValid()) {
				if (!this.node.parantNode) {
					return true
				}

				if (this.node.parantNode.findChild(
					this.node.element
				)) {
					return true
				}
			}
			return false
		}

		get state(): ScrollState {
			return this.node.state;
		}
		set state(v: ScrollState) {
			this.node.state = v;
		}

		get vertical(): boolean | null {
			return this.state.vertical;
		}
		set vertical(v: boolean | null) {
			this.node.state.vertical = v;
		}

		get horizontal(): boolean | null {
			return this.state.horizontal;
		}
		set horizontal(v: boolean | null) {
			this.node.state.horizontal = v;
		}

		reset(): void {
			this.state = nullScrollState()
		}
		on(): void {
			this.state = makeScrolState(true, true)
		}
		off(): void {
			this.state = makeScrolState(false, false)
		}

		horizontalReset(): void {
			this.horizontal = null
		}
		horizontalOn(): void {
			this.horizontal = true
		}
		horizontalOff(): void {
			this.horizontal = false
		}

		verticalReset(): void {
			this.vertical = null
		}
		verticalOn(): void {
			this.vertical = true
		}
		verticalOff(): void {
			this.vertical = false
		}
	}

	export const scrollTree: ScrollStateNode
		= new ScrollStateNode(
			document.body,
			defaultScrollState()
		)

	export function elementSrollAction(
		element: Element
	): ScrollAction {
		return new ScrollAction(element)
	}
	export function elementSrollNode(
		element: Element
	): ScrollStateNode {
		return scrollTree.root().search(element)
	}

	export const bodyScrollAction = elementSrollAction(
		document.body
	)

	export function isEnableScerol(s: ScrollStateNode): boolean {
		let se = s.stateOf()
		return se.horizontal || se.vertical
	}
}

window.addEventListener("wheel", event => {
	let isHorizontal = event.deltaX != 0
	let isVertical = event.deltaY != 0

	let target = event.target as Element
	let node = SDI.elementSrollNode(target)
	let element = node.setElement

	if (!element) {
		console.error("Incorect scroll tree: ", node);
	}

	let state = node.stateOf()
	if ((!state.horizontal && isHorizontal) ||
		(!state.vertical && isVertical)) {
		event.preventDefault()
		return
	}

	if (isHorizontal) {
		if (event.deltaX < 0) {
			if (!SDI.canScrollLeft(element)) {
				event.preventDefault()
			}
		}
		else {
			if (!SDI.canScrollRight(element)) {
				event.preventDefault()
			}
		}
	}

	if (isVertical) {
		if (event.deltaY < 0) {
			if (!SDI.canScrollUp(element)) {
				event.preventDefault()
			}
		}
		else {
			if (!SDI.canScrollDown(element)) {
				event.preventDefault()
			}
		}
	}
}, { passive: false })
