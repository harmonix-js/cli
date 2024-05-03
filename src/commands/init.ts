import { defineCommand } from 'citty'

export default defineCommand({
	meta: {
		name: 'init',
		description: 'Initialize a new Harmony project'
	},
	async run(ctx) {
		console.log('Hello, World!', ctx.cmd)
	}
})