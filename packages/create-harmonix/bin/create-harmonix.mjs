#!/usr/bin/env node

import { fileURLToPath } from 'node:url'
import { runMain, main } from '../dist/index.mjs'

globalThis.__harmonix_cli__ = {
  startTime: Date.now(),
  entry: fileURLToPath(import.meta.url)
}

runMain()
