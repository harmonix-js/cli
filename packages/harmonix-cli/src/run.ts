import process from 'node:process'
import { fileURLToPath } from 'node:url'

import { runCommand as _runCommand, runMain as _runMain } from 'citty'

import { commands } from './commands'
import { main } from './main'

globalThis.__harmonix_cli__ = globalThis.__harmonix_cli__ || {
  startTime: Date.now(),
  entry: fileURLToPath(
    new URL(
      import.meta.url.endsWith('.ts')
        ? '../bin/harmonix.mjs'
        : '../../bin/harmonix.mjs',
      import.meta.url
    )
  )
}

export const runMain = () => _runMain(main)

export const runCommand = async (
  name: string,
  argv: string[] = process.argv.slice(2),
  data: { overrides?: Record<string, any> } = {}
) => {
  if (!(name in commands)) {
    throw new Error(`Invalid command ${name}`)
  }

  return await _runCommand(await commands[name as keyof typeof commands](), {
    rawArgs: argv,
    data: {
      overrides: data.overrides || {}
    }
  })
}
