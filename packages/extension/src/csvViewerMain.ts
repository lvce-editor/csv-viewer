/* eslint-disable unicorn/no-top-level-side-effects */
import { activate } from './parts/Main/Main.ts'

await activate()

export * from './parts/Main/Main.ts'
