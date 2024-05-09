import { defineCommand } from 'citty'
import { createHarmonix } from '@harmonix-js/core'

export default defineCommand({
	meta: {
		name: 'start',
		description: 'Start the Harmonix project'
	},
	args: {
		dir: {
			type: 'positional',
			description: 'Project directory',
			default: '.'
		}
	},
	async run(context) {
		await createHarmonix({ rootDir: context.args.dir }, { cwd: context.args.dir })
	},
})