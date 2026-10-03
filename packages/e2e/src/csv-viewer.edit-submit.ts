import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'csv-viewer.edit-submit'

export const test: Test = async ({ Command, expect, FileSystem, KeyBoard, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/submit.csv`, 'key,value\na,1\n')
  await Main.openUri(`${tmpDir}/submit.csv`)
  const cell = Locator('.TableBody .TableRow').nth(0).locator('.TableCell').nth(1)
  await expect(cell).toHaveText('a')
  const viewStates = (await Command.execute('Viewlet.getAllStates')) as Record<
    string,
    { readonly uid: number; readonly viewId: string }
  >
  const extensionView = Object.values(viewStates).find(({ viewId }) => viewId === 'builtin.csv-viewer')
  if (!extensionView) {
    throw new Error('Expected CSV extension view')
  }
  await Command.execute('Viewlet.executeViewletCommand', extensionView.uid, 'handleViewCommand', 'handleDoubleClick', 'cell:0:1')
  const editor = Locator('[name="cellEditor"]')
  await expect(editor).toBeFocused()
  await expect(editor).toHaveValue('a')
  await Command.execute('Viewlet.executeViewletCommand', extensionView.uid, 'handleInput', 'cellEditor', 'edited')
  await expect(editor).toHaveValue('edited')
  await KeyBoard.press('Enter')
  await expect(editor).toHaveCount(0)
  await expect(cell).toHaveText('edited')
  await expect(cell).toBeFocused()
  const nextCell = Locator('.TableBody .TableRow').nth(0).locator('.TableCell').nth(2)
  await expect(nextCell).toHaveText('1')
}
