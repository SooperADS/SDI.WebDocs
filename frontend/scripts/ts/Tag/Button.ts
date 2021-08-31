namespace SDI {
	export let buttons = document.querySelectorAll(
		"button[ref]"
	)

	export let groupButtons =
		document.querySelectorAll(
			".button-group:not([sub]):not([no-fixed])>button[group]"
		);
}

SDI.buttons.forEach(e => {
	e.addEventListener("click", ev => {
		let el: Element = ev.target as Element
		let ref = el.getAttribute("ref")
		if (ref.length > 0) {
			if (el.hasAttribute("new")) {
				window.open(ref, "_black")
			}
			else {
				window.location.href = ref
			}
		}
	})
})
SDI.groupButtons.forEach(e => {
	e.addEventListener("click", ev => {
		let el: Element = (ev.currentTarget as Element).parentElement
		if (el.hasAttribute("fixed")) {
			el.removeAttribute("fixed")
		}
		else {
			el.setAttribute("fixed", "")
		}
	})
})