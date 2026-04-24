async function getConfig() {
	const {
		default: {
			utils: { getProjects },
		},
	} = await import("@commitlint/config-nx-scopes");

	const projects = await getProjects();
	projects.push("workspace");

	//TODO: ticket number

	return {
		extends: [
			"@commitlint/config-conventional",
			"@commitlint/config-nx-scopes",
		],
		rules: {
			"scope-enum": async (_ctx) => [2, "always", [...projects]],
		},
	};
}

module.exports = getConfig();
