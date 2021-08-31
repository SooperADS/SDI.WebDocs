namespace SDI {
	export interface ProjectItem {
		uuid: string

		github?: string
		description: string[]
		title: string
		image: string
	}

	//export interface UserPermision {
	//	readonly user: {
	//		readonly contridution: boolean,
	//		readonly editDocs: boolean,
	//		readonly deleteDocs: boolean,
	//		readonly editTask: boolean,
	//		readonly deleteTask: boolean,
	//	},
	//	readonly admin: {
	//		readonly register: boolean,
	//		readonly accountEdit: boolean,
	//		readonly accountDelete: boolean,
	//		readonly projectEdit: boolean,
	//		readonly projectDelete: boolean
	//	}
	//	readonly other: {
	//		readonly role: string,
	//		readonly privateView: boolean,
	//		readonly privateEdit: boolean
	//		readonly projects: string[]
	//	}
	//}

	//let savedUserPermision: UserPermision = null

	//export function getUserPermision(): UserPermision {
	//	return savedUserPermision
	//}
	export const projectItemList: ProjectItem[] = []
}

namespace Server {
	export function addProject(
		uuid: string,
		title: string,
		image: string,
		github: string | undefined,
		...lore: string[]
	): void {
		let p: SDI.ProjectItem = {
			uuid: uuid,
			title: title,
			image: "/./img/" + image,
			description: lore,
		}

		if (github) {
			p.github = github
		}
		SDI.projectItemList.push(p)
	}

	//export function regUser(
	//	user_cbt: boolean,
	//	user_docs_edit: boolean,
	//	user_docs_del: boolean,
	//	user_task_edit: boolean,
	//	user_task_del: boolean,
	//	admin_reg: boolean,
	//	admin_ac_edit: boolean,
	//	admin_ac_del: boolean,
	//	admin_projec_edit: boolean,
	//	admin_projec_del: boolean,
	//	other_role: string,
	//	other_pr_view: boolean,
	//	other_pr_edit: boolean,
	//) {

	//}
}
