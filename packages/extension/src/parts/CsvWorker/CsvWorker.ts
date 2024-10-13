import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.ts'
import * as LaunchCsvWorker from '../LaunchCsvWorker/LaunchCsvWorker.ts'

const { invoke } = GetOrCreateWorker.getOrCreateWorker(LaunchCsvWorker.launchCsvWorker)

export { invoke }
