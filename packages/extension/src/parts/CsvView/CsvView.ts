import type { InstanceView } from '@lvce-editor/api'
import type { CsvViewState } from '../CsvViewState/CsvViewState.ts'
import { createInstance, type CsvViewInstance } from '../CreateInstance/CreateInstance.ts'

export const viewId = 'builtin.csv-viewer'

export const view: InstanceView<CsvViewInstance, CsvViewState> = {
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
  getComponentState: (instance) => instance.getComponentState(),
  id: viewId,
  kind: 'virtualDom',
  setComponentState: (instance, state) => instance.setComponentState(state),
  title: 'CSV Viewer',
}
