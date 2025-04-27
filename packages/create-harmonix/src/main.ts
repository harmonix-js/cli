import { defineCommand } from 'citty'

import { name, version, description } from '../package.json'
import init from '../../harmonix-cli/src/commands/init'
import { setupGlobalConsole } from '../../harmonix-cli/src/utils/console'

export const main = defineCommand({
  meta: {
    name,
    version,
    description
  },
  args: init.args,
  setup: async (ctx) => {
    setupGlobalConsole({ dev: true })

    await init.run?.(ctx)
  }
})
