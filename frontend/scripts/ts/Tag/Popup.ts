/// <reference path="../Scrol.ts" />

namespace SDI {
	export const popupRootElement
		= document.getElementById("-popup")

	export class Popup {
		protected id: string
		protected block: Element

		protected state: boolean

		scrollAction: ScrollAction

		constructor(id: string) {
			this.id = id
			this.block = document.getElementById(
				this.curentId()
			)

			if (this.block) {
				const popup = this.block
				const lid = popup.getAttribute("id")

				this.scrollAction = SDI.elementSrollAction(popup)

				if (lid) {
					Popup.storage[id] = this
					this.state =
						popup.classList.contains("open")
					if (this.state) {
						if (Popup.open) {
							Popup.open.replace(this, false)
						}
						Popup.open = this
					}
				}
			}
		}

		get name(): string {
			return this.id
		}
		get element(): Element {
			return this.block
		}
		get isOpen(): boolean {
			return this.state
		}

		curentId(): string {
			return `-popup__item_${this.id}`
		}
		validId(): boolean {
			return this.element != null
		}

		protected terminateBy(box: boolean = true): void {
			if (this.validId() && this.isOpen) {
				SDI.bodyScrollAction.verticalOn()
				this.scrollAction.verticalOff()

				this.element.classList.remove("open")

				if (box) {
					popupRootElement.classList.remove("open")
				}

				Popup.open = null
				this.state = false
			}
		}
		protected closeBy(box: boolean): boolean {
			if (this.validId() && this.isOpen && !Popup.lock) {
				this.terminateBy(box)
				this.animate(["open"], "box$-")
				return true
			}
			return false
		}

		terminate(): void {
			this.terminateBy(true)
		}
		close(): boolean {
			return this.closeBy(true)
		}

		open(): boolean {
			if (this.validId() && !this.isOpen && !Popup.lock) {
				SDI.bodyScrollAction.verticalOff()

				function open(o: Popup): void {
					Popup.open = o

					o.scrollAction.verticalOn()

					if (popupRootElement.classList.contains("open")) {
						popupRootElement.classList.add("open")
					}
					o.element.classList.add("open")
					o.animate(["open"], "box$-")
					o.state = true
				}

				if (Popup.open) {
					if (!Popup.open.close()) {
						return false
					}
					setTimeout(
						() => open(this),
						this.animateTime(["close"], "box$-") + 1
					)
				}
				else {
					popupRootElement.classList.add("open")
					open(this)
				}

				return true
			}
			return false
		}
		openAuto(): boolean {
			if (Popup.open) {
				return Popup.replace(this, true)
			}
			else {
				return this.open()
			}
		}

		animateTime(
			anim: string[], ...prefix: string[]
		): number {
			let caTime: number[] = []
			anim.forEach(aid => {
				caTime.push(popupAnimationList[aid] || 0)
				prefix.forEach(p => {
					caTime.push(popupAnimationList[p + aid] || 0)
				})
			})

			return Math.max(...caTime)
		}
		animate(animation: string[], ...prefix: string[]) {
			Popup.lock = true
			setTimeout(() => {
				Popup.lock = false
			}, this.animateTime(animation, ...prefix))
		}

		replace(popup: Popup, anim: boolean): boolean {
			if (Popup.open == this &&
				this.validId() && this.isOpen) {

				return Popup.replace(popup, anim)
			}
			return false
		}

		static replace(popup: Popup, anim: boolean): boolean {
			if (Popup.open) {
				if (anim) {
					if (!Popup.open.closeBy(false)) {
						return false
					}
				}
				else {
					Popup.open.terminateBy(false)
				}

				return popup.open()
			}
			return false
		}
		static close(): boolean {
			if (Popup.open) {
				return Popup.open.close()
			}
			return true
		}
		static hasOpen(): boolean {
			return Popup.open != null
		}
		static popup(id: string): Popup | null {
			return Popup.storage[id]
		}

		static readonly storage: {
			[v: string]: Popup
		} = { }

		private static open: Popup | null = null
		private static lock: boolean = false
	}

	export const popupAnimationList: {
		[v: string]: number
	} = {
		"box$-open": 800,
		"open": 800,

		"box$-close": 800,
		"close": 800
	}

	let popupTriggers = document.querySelectorAll(
		"*[popup]"
	)
	let popupTriggersList: Element[] = [
		...popupTriggers
	]

	function popupTrigerEvent(e: Event) {
		const obj = e.target as Element

		const p = obj.getAttribute("popup")
		if (p) {
			const popup = Popup.popup(p)

			if (popup) {
				popup.open()
				e.preventDefault()
			}
		}
	}

	export function disablePopupTrigers(): void {
		popupTriggersList.forEach(e => {
			e.removeEventListener(
				"click", popupTrigerEvent
			)
		})
	}
	export function activePopupTrigers() {
		disablePopupTrigers()
		popupTriggersList.forEach(e => {
			e.addEventListener(
				"click", popupTrigerEvent
			)
		})
	}
}

{
	let popupList = document.querySelectorAll(
		"#-popup>div"
	)

	for (let i = 0; i < popupList.length; i++) {
		const popup = popupList.item(i);
		const lid = popup.getAttribute("id")

		const pattern = /(?<=-popup__item_)([^ ]+)/g
		const cid = pattern.exec(lid)
		if (cid) {
			new SDI.Popup(cid[0])
		}
	}
}

SDI.popupRootElement.addEventListener("click", (ev) => {
	const el = (ev.target as Element)
	if (el.closest(
		"#-popup>popup:not([img])"
	) || !el.closest("#-popup>div")) {
		SDI.Popup.close()
	}
})
window.addEventListener("keydown", (ev) => {
	if (ev.key == "Escape") {
		SDI.Popup.close()
	}
})

SDI.activePopupTrigers()