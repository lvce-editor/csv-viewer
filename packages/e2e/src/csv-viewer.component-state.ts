import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'csv-viewer.component-state'

interface ComponentInfo {
  readonly editable: boolean
  readonly moduleId: string
  readonly uid: number
}

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/state.csv`, 'name,value\noriginal,1\n')
  await Main.openUri(`${tmpDir}/state.csv`)
  const table = Locator('.Table')
  await expect(table).toBeVisible()
  const components = (await Command.execute('ComponentState.getComponents')) as readonly ComponentInfo[]
  const component = components.find((item) => item.moduleId === 'ExtensionView')
  if (!component?.editable) {
    throw new Error('Expected editable extension component state')
  }
  const state = await Command.execute('ComponentState.getState', component.uid)
  const { cells } = state
  if (cells[0][0] !== 'original') {
    throw new Error('Expected live CSV cells')
  }
  await Command.execute('ComponentState.setState', component.uid, { ...state, cells: [['edited', '2']] })
  const firstCell = Locator('.TableBody .TableRow').first().locator('.TableCell').nth(1)
  await expect(firstCell).toHaveText('edited')
}
