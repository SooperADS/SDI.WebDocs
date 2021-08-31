/// <reference path="../Scrol.ts" />

namespace SDI {
	export let scrolerElement = document.getElementById("-scroler")
	export const timeToFullScrol = 500

	let inScrol = false

	export function smoothScrol(top: number): void {
		let i: number = 0
		const add = top / timeToFullScrol

		bodyScrollAction.verticalOff()
		inScrol = true
		let int = setInterval(() => {
			if (i >= top) {
				setTimeout(() => {
					bodyScrollAction.verticalOn()
					inScrol = false
					window.scrollBy(0, window.pageYOffset - top)
				}, 250)
				clearInterval(int)
			}
			else {
				window.scrollBy(0, -add)
				i += add
			}
		}, 1)
	}

	scrolerElement.addEventListener("click", () => {
		scrolerElement.classList.add("hidden")
		if (!inScrol) {
			smoothScrol(window.scrollY + 10)
		}
	})
	scrolerElement.classList.add("hidden")

	window.addEventListener("scroll", () => {
		if (!inScrol) {
			if (window.scrollY > (window.innerHeight * 1.15)) {
				scrolerElement.classList.remove("hidden")
			}
			else {
				scrolerElement.classList.add("hidden")
			}
		}
	})
}