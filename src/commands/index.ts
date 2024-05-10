import type { CommandDef } from 'citty'

const _default = (r: any) => (r.default || r) as Promise<CommandDef>

export const commands = {
  init: () => import('./init').then(_default),
  start: () => import('./start').then(_default),
  add: () => import('./add').then(_default)
} as const
