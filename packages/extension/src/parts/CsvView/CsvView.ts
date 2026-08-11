import type { View } from '@lvce-editor/api'
import { createInstance, type CsvViewInstance } from '../CreateInstance/CreateInstance.ts'

export const viewId = 'builtin.csv-viewer'

export const view: View<CsvViewInstance> = {
  create: createInstance,
  eventListeners: [
    {
      name: 'handleDoubleClick',
      params: ['handleDoubleClick', 'event.target.name'],
      preventDefault: true,
    },
    {
      name: 'handleKeyDown',
      params: ['handleKeyDown', 'event.target.name', 'event.key'],
    },
  ],
  id: viewId,
  kind: 'virtualDom',
  title: 'CSV Viewer',
}
