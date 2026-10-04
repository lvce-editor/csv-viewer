import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'csv-viewer.virtual-scroll-keyboard-edit'

export const test: Test = async ({ Command, expect, FileSystem, KeyBoard, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const rows = Array.from({ length: 200 }, (_, index) => `row ${index + 1},value ${index + 1}`)
  await FileSystem.writeFile(`${tmpDir}/virtual-scroll.csv`, `name,value\n${rows.join('\n')}`)
  await Main.openUri(`${tmpDir}/virtual-scroll.csv`)

  const firstCell = Locator('[id="cell:0:1"]')
  await expect(firstCell).toHaveText('row 1')
  const viewStates = (await Command.execute('Viewlet.getAllStates')) as Record<
    string,
    { readonly uid: number; readonly viewId: string }
  >
  const extensionView = Object.values(viewStates).find(({ viewId }) => viewId === 'builtin.csv-viewer')
  if (!extensionView) {
    throw new Error('Expected CSV extension view')
  }
  await Command.execute('Viewlet.executeViewletCommand', extensionView.uid, 'handleViewEvent', 'click', 'cell:0:1')
  await expect(firstCell).toBeFocused()
  for (let index = 0; index < 100; index++) {
    await KeyBoard.press('ArrowDown')
    const focusedCell = Locator('.TableCellFocused')
    await expect(focusedCell).toHaveText(`row ${index + 2}`)
  }

  const scrolledCell = Locator('.TableCellFocused')
  await expect(scrolledCell).toHaveText('row 101')
  await expect(scrolledCell).toBeFocused()
  await Command.execute(
    'Viewlet.executeViewletCommand',
    extensionView.uid,
    'handleViewCommand',
    'handleDoubleClick',
    'cell:100:1',
  )
  const editor = Locator('[name="cellEditor"]')
  await expect(editor).toHaveValue('row 101')
  await expect(editor).toHaveCSS('left', '41px')
  await expect(editor).toBeVisible()
  await Command.execute('Viewlet.executeViewletCommand', extensionView.uid, 'handleInput', 'cellEditor', ' edited')
  await KeyBoard.press('Enter')
  await expect(editor).toHaveCount(0)
  const editedCell = Locator('.TableCellFocused')
  await expect(editedCell).toHaveText(' edited')
  await expect(editedCell).toBeFocused()
}
