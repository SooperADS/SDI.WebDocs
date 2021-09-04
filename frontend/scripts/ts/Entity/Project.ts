/// <reference path="../ServerAPI.ts" />
/// <reference path="../Scrol.ts" />

namespace SDI {
	const refPrefixes = {
		"task": "tasks",
		"docs": "docs",
		"project": "project"
	}

	let _Project_First: boolean = true

	export interface ProjectButtonPack {
		docs: Element
		task: Element
		all: Element
	}

	export interface ProjectTokenItem {
		title: string
		uuid: string
	}
	export interface ProjectCardItem extends ProjectTokenItem {
		content?: string
		description: string
		github?: string
		image: string
	}

	export function projectReference(uuid: string, type: "docs" | "task" | "project"): string {
		return `/./${refPrefixes[type]}/${uuid}`
	}

	export function projectButtonPack(token: ProjectTokenItem): ProjectButtonPack {
		let r: ProjectButtonPack = {} as any

		function gen(): Element {
			let ra = document.createElement("button")
			ra.innerText = token.title
			ra.classList.add("project-button")
			return ra
		}

		r.all = gen()
		r.all.setAttribute("ref",
			projectReference(token.uuid, "project")
		)

		r.docs = gen()
		r.docs.setAttribute("ref",
			projectReference(token.uuid, "docs")
		)

		r.task = gen()
		r.task.setAttribute("ref",
			projectReference(token.uuid, "task")
		)

		return r
	}
	export function injectProjectButton(token: ProjectTokenItem): void {
		if (ProjectCard.injectPackValid()) {
			let il = ProjectCard.injectPack()
			let el = projectButtonPack(token)

			il.all.append(el.all)
			il.docs.append(el.docs)
			il.task.append(el.task)
		}
	}

	export class ProjectToken {
		protected item: ProjectTokenItem
		protected cachButton: ProjectButtonPack

		constructor(uuid: string) {
			this.item = ProjectToken.itemOf(uuid)
			this.cachButton = null
		}

		get meta(): ProjectTokenItem {
			return this.item
		}
		get uuid(): string {
			return this.item.uuid
		}

		button(): ProjectButtonPack {
			if (this.cachButton == null) {
				let r = SDI.projectButtonPack(this.item)
				this.cachButton = r
				return r
			}
			else {
				return this.cachButton
			}
		}

		refresh(): void {
			this.cachButton = null;
		}
		ref(type: "docs" | "task" | "project"): string {
			return SDI.projectReference(this.uuid, type)
		}

		inject(): boolean {
			if (ProjectCard.injectPackValid()) {
				SDI.injectProjectButton(this.item)
				return true
			}
			return false
		}

		static itemOf(uuid: string): ProjectTokenItem {
			let r: ProjectTokenItem = {} as any
			r.uuid = uuid
			r.title = uuid.toUpperCase()

			return r
		}
	}
	export class ProjectCard {
		protected item: ProjectCardItem

		protected cachButton: ProjectButtonPack
		protected cachElement: Element

		constructor(uuid: string | undefined) {
			this.item = ProjectCard.itemOf(uuid)
			this.cachElement = null
			this.cachButton = null
		}

		get meta(): ProjectCardItem {
			return this.item
		}
		get uuid(): string {
			return this.item.uuid
		}

		release(): boolean {
			if (this.canRelease()) {
				projectShell().append(this.element(
					projectUseDocs(),
					projectFullInfo()
				))
				projectsReleaseCount++
				return true
			}
			return false
		}
		canRelease(): boolean {
			return projectShell() && projectCapacity > projectsReleaseCount
		}

		refresh(): void {
			this.cachButton = null;
			this.cachElement = null;
		}

		inject(): boolean {
			if (ProjectCard.injectPackValid()) {
				SDI.injectProjectButton(this.tokenOf())
				return true
			}
			return false
		}

		button(): ProjectButtonPack {
			if (this.cachButton == null) {
				let r = SDI.projectButtonPack(this.item)
				this.cachButton = r
				return r
			}
			else {
				return this.cachButton
			}
		}
		element(useDocs: boolean, fullInfo: boolean): Element {
			let r: Element = null
			if (this.cachElement == null) {
				let item = this.item


				r = document.createElement("div")
				r.setAttribute("uuid", item.uuid)
				r.classList.add("project")

				if (_Project_First) {
					r.setAttribute("page", "")
					_Project_First = false
				}

				let image = document.createElement("img")
				image.src = item.image
				r.append(image)

				let header = document.createElement("h6")
				header.innerText = item.title
				r.append(header)

				let text = document.createElement("div")
				text.classList.add("project__text")

				let d = document.createElement("p")
				d.innerHTML = item.description
				text.append(d)

				if (item.content && fullInfo) {
					let c = document.createElement("p")
					c.innerHTML = item.content
					text.append(c)
				}

				r.append(text)

				let list = document.createElement("div")
				list.classList.add("project__buttons")

				let uuid = item.uuid
				let projectRef = this.ref("project")
				let taskRef = this.ref("task")

				let projectButton = document.createElement("button")
				projectButton.innerText = "Подробнее"
				projectButton.setAttribute("ref", projectRef)
				list.append(projectButton)

				let taskButton = document.createElement("button")
				taskButton.innerText = "Задачи"
				taskButton.setAttribute("ref", taskRef)
				list.append(taskButton)

				if (useDocs) {
					let docsRef = this.ref("docs")
					let docsButton = document.createElement("button")
					docsButton.innerText = "Docs"
					docsButton.title = "Документация"
					docsButton.setAttribute("ref", docsRef)
					list.append(docsButton)
				}

				if (this.item.github) {
					let githubRef = "https://github.com/" + this.item.github
					let githubButton = document.createElement("button")
					githubButton.innerText = "GitHub"
					githubButton.title = "Исходный код проекта"
					githubButton.setAttribute("ref", githubRef)
					githubButton.setAttribute("new", "")
					githubButton.classList.add("github")
					list.append(githubButton)
				}

				r.append(list)
				this.cachElement = r
			}
			else {
				r = this.cachElement
			}
			return r
		}

		tokenOf(): ProjectTokenItem {
			return this.item
		}

		ref(type: "docs" | "task" | "project"): string {
			return SDI.projectReference(this.uuid, type)
		}

		protected static cachButtons: ProjectButtonPack = null
		static injectPackValid(): boolean {
			let o = this.injectPack()
			let r = o.all && o.docs && o.task && true

			return r
		}
		static injectPack(newb: boolean = false): ProjectButtonPack {
			if (newb || !this.cachButtons) {
				let r: ProjectButtonPack = {
					all: document.getElementById("-menu__projects"),
					docs: document.getElementById("-menu__docs"),
					task: document.getElementById("-menu__task"),
				}
				if (r.all && r.docs && r.task) {
					this.cachButtons = r
				}
				return r
			}
			else {
				return this.cachButtons
			}
		}
		static itemOf(uuid: string | undefined): ProjectCardItem {
			let r: ProjectCardItem = {} as any
			r.uuid = uuid
			if (uuid != undefined) {
				r.image = "test.png"
				r.title = "SDI.???"
				r.description = "LLLLLLLLLLLLLLLLLLLLLLL"
				r.content = "45454545454"
			}

			return r
		}

		static empty(): ProjectCard {
			return new ProjectCard(undefined)
		}

		static fillOf(src: ProjectTokenItem): ProjectCardItem {
			let r: ProjectCardItem = {} as any
			r.uuid = src.uuid
			r.title = src.title

			r.image = "test.png"
			r.description = "LLLLLLLLLLLLLLLLLLLLLLL"
			r.content = "544444444444444444444444444 444444444444444444444444444444444444 444444444444444444444444444 444444444444444444444444444444444444"

			return r
		}

		static byToken(t: ProjectToken): ProjectCard {
			let r = this.empty()
			r.item = this.fillOf(t.meta)
			r.cachButton = t.button()
			return r
		}
	}

	let projectShellElement = null
	export const projectShell = (): Element => {
		if (!projectShellElement) {
			let r = document.getElementById("-project-list")
			if (r) {
				let cattr = r.getAttribute("capacity")
				projectCapacity = (cattr == "full"
					? Infinity
					: parseInt(cattr))
				if (isNaN(SDI.projectCapacity)) {
					SDI.projectCapacity = 1
				}
			}
			projectShellElement = r
			return r
		}

		return projectShellElement
	}
	let projectShellElementAction = null
	export const projectShellAction = (): ScrollAction => {
		if (!projectShellElementAction) {
			let re = projectShell()
			let r: ScrollAction = null
			if (re) {
				r = new ScrollAction(re)
			}

			projectShellElementAction = r
			return r
		}

		return projectShellElementAction
	}

	export const projectUseDocs = (): boolean => {
		let e = projectShell()
		if (!e) {
			return true
		}

		return e.hasAttribute("docs")
	}
	export const projectFullInfo = (): boolean => {
		let e = projectShell()
		if (!e) {
			return false
		}

		return e.hasAttribute("full")
	}

	let projectsReleaseCount: number = 0;
	export function projectReleaseCount(): number {
		return projectsReleaseCount
	}

	export let projectCapacity: number = 0
	export let projectCapacityStep: number = 3

	export const projectTokenList: ProjectToken[] = []
	export const requeTokenList: ProjectToken[] = []

	export function hasRequeProjects(): boolean {
		return requeTokenList.length > 0
	}
	export function addProjects(): boolean {
		function canAddProject(): boolean {
			return (projectTokenList.length - requeTokenList.length) < projectCapacity
		}

		if (canAddProject()) {
			let t = requeTokenList.pop()
			if (!t) {
				return false
			}
			let pi = ProjectCard.byToken(t)
			return pi.release()
		}
		return false
	}
	export function addToProjects(...add: ProjectToken[]): void {
		add.forEach(e => {
			e.inject()
			projectTokenList.push(e)
			requeTokenList.push(e)
		})
	}
}

SDI.projectShell()
SDI.addToProjects(
	new SDI.ProjectToken("10"),
	new SDI.ProjectToken("9"),
	new SDI.ProjectToken("8"),
	new SDI.ProjectToken("7"),
	new SDI.ProjectToken("6"),
	new SDI.ProjectToken("5"),
	new SDI.ProjectToken("4"),
	new SDI.ProjectToken("3"),
	new SDI.ProjectToken("2"),
	new SDI.ProjectToken("1"),
)

{
	function fillProjects(): void {
		while (SDI.addProjects()) { }
		if (SDI.projectShellAction()) {
			SDI.projectShellAction().refresh()
		}
	}

	function refreshButton(t: Element): void {
		if (SDI.hasRequeProjects()) {
			fillProjects()
		}

		if (!SDI.hasRequeProjects()) {
			t.setAttribute("disabled", "")
		}
	}

	let bm = document.getElementById("-project__more");
	bm.addEventListener("click", ev => {
		let t = ev.target as Element
		console.log("LLLLLLLL");
		SDI.projectCapacity += SDI.projectCapacityStep
		refreshButton(t)
	})
	refreshButton(bm)
}
