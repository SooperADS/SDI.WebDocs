/// <reference path="../ServerAPI.ts" />

namespace SDI {
	export const mainPrefix = "/./server/"
	export const sdiPrefixes = {
		"task": "tasks.php",
		"docs": "docs.php",
		"project": "project.php"
	}

	export function makeProjectReference(
		prefix: "docs" | "task" | "project",
		uuid: string
	): string {
		return mainPrefix + sdiPrefixes[prefix]
			+ "?uuid=" + uuid
	}
	export interface ProjectButton {
		all: Element,
		docs: Element,
		task: Element
	}

	export function getProjectList(
		getnum: number, full: boolean
	): ProjectItem[] {
		let items: ProjectItem[] = [...projectItemList]

		let itemsToRemove = items.length -
			(getnum == Infinity
				? items.length
				: getnum)
		let clen = items.length
		for (let i = 0; i < itemsToRemove && i < clen; i++) {
			items.pop();
		}

		if (!full) {
			for (let i = 0; i < items.length; i++) {
				const item = items[i];

				let rv = Math.max(
					item.description.length - 1, 0
				)
				for (let j = 0; j < item.description.length && j < rv; j++) {
					item.description.pop()
				}
			}
		}
		return items
	}
	export function createProjectButton(
		item: ProjectItem
	): ProjectButton {
		let r: ProjectButton = { } as any

		function gen(): Element {
			let ra = document.createElement("button")
			ra.innerText = item.title
			ra.classList.add("project-button")
			return ra
		}

		r.all = gen()
		r.all.setAttribute("ref",
			makeProjectReference("project", item.uuid)
		)

		r.docs = gen()
		r.docs.setAttribute("ref",
			makeProjectReference("docs", item.uuid)
		)

		r.task = gen()
		r.task.setAttribute("ref",
			makeProjectReference("task", item.uuid)
		)

		return r
	}
	export function clearProjectButtons(): void {
		{
			let tempTask = savedProjectButtons.task.children

			for (let i = 1; i < tempTask.length; i++) {
				tempTask[i].remove();
			}
		}
		{
			let tempDocs = savedProjectButtons.docs.children

			for (let i = 1; i < tempDocs.length; i++) {
				tempDocs[i].remove();
			}
		}
		{
			let temp = savedProjectButtons.all.children

			for (let i = 4; i < temp.length; i++) {
				temp[i].remove();
			}
		}
	}

	export function createProjectCard(
		item: ProjectItem, docs: boolean
	): Element {
		let r = document.createElement("div")
		r.setAttribute("uuid", item.uuid)
		r.classList.add("project")

		let image = document.createElement("img")
		image.src = item.image
		r.append(image)

		let header = document.createElement("h6")
		header.innerText = item.title
		r.append(header)

		let text = document.createElement("div")
		text.classList.add("project__text")

		item.description.forEach((e) => {
			let p = document.createElement("p")
			p.innerHTML = e
			text.append(p)
		})

		r.append(text)

		let list = document.createElement("div")
		list.classList.add("project__buttons")

		let uuid = item.uuid
		let projectRef = makeProjectReference("project", uuid)
		let taskRef = makeProjectReference("task", uuid)

		let projectButton = document.createElement("button")
		projectButton.innerText = "Подробнее"
		projectButton.setAttribute("ref", projectRef)
		list.append(projectButton)

		let taskButton = document.createElement("button")
		taskButton.innerText = "Задачи"
		taskButton.setAttribute("ref", taskRef)
		list.append(taskButton)

		if (docs) {
			let docsRef = makeProjectReference("docs", uuid)
			let docsButton = document.createElement("button")
			docsButton.innerText = "Docs"
			docsButton.title = "Документация"
			docsButton.setAttribute("ref", docsRef)
			list.append(docsButton)
		}

		if (item.github) {
			let githubRef = "https://github.com/" + item.github
			let githubButton = document.createElement("button")
			githubButton.innerText = "GitHub"
			githubButton.title = "Исходный код проекта"
			githubButton.setAttribute("ref", githubRef)
			githubButton.setAttribute("new", "")
			githubButton.classList.add("github")
			list.append(githubButton)
		}

		r.append(list)
		return r
	}

	export const projectShell = document.getElementById("-project-list")
	let c = projectShell.getAttribute("capacity")
	export const moreProjectButton
		= document.getElementById("-projrct-more")
	export let projectCapacity = c == "full"
		? Infinity
		: parseInt(c)
	if (isNaN(SDI.projectCapacity)) {
		SDI.projectCapacity = 1
	}
	export const projectCardList: Element[] = []
	export let addCapacity: number = 2
	let ProjectShellAction
		= new ScrollAction(projectShell);

	export const savedProjectButtons:
		Readonly<ProjectButton> = {
		all: document.getElementById("-menu__projects"),
		docs: document.getElementById("-menu__docs"),
		task: document.getElementById("-menu__task"),
	}

	export let projectsList = getProjectList(
		projectCapacity, projectShell.hasAttribute("full")
	)
	export function refreshProjectList(): void {
		projectsList = getProjectList(
			projectCapacity, projectShell.hasAttribute("full")
		)
	}

	export function refreshProjects(): void {
		refreshProjectList()
		projectCardList.length = 0
		projectShell.innerHTML = ""

		SDI.projectsList.forEach(p => {
			let e = SDI.createProjectCard(
				p, SDI.projectShell.hasAttribute("docs")
			)
			SDI.projectCardList.push(e)
			SDI.projectShell.append(e)
		})

		if (SDI.projectCardList.length) {
			SDI.projectCardList[0].setAttribute("page", "")
		}

		if (SDI.moreProjectButton) {
			if (SDI.projectCapacity < SDI.projectItemList.length) {
				SDI.moreProjectButton.removeAttribute("hidden")
			}
			else {
				SDI.moreProjectButton.setAttribute("hidden", "")
			}
		}
		ProjectShellAction.branch.refresh()
	}
}

SDI.refreshProjects()
SDI.moreProjectButton.addEventListener("click", () => {
	if (isNaN(SDI.addCapacity)) {
		SDI.addCapacity = 1
	}

	SDI.projectCapacity += SDI.addCapacity
	SDI.refreshProjects()
})

SDI.clearProjectButtons()

SDI.projectItemList.forEach(i => {
	let el = SDI.createProjectButton(i)

	SDI.savedProjectButtons.all.append(el.all)
	SDI.savedProjectButtons.docs.append(el.docs)
	SDI.savedProjectButtons.task.append(el.task)
})

SDI.scrollTree.root().refresh()
