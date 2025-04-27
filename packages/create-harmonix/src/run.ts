import process from 'node:process'
import { fileURLToPath } from 'node:url'

import { runCommand as _runCommand, runMain as _runMain } from 'citty'

import init from '../../harmonix-cli/src/commands/init'
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
  name: 'init',
  argv: string[] = process.argv.slice(2),
  data: { overrides?: Record<string, any> } = {}
) => {
  return await _runCommand(init, {
    rawArgs: argv,
    data: {
      overrides: data.overrides || {}
    }
  })
}