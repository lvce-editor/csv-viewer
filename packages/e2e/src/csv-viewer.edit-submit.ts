import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'csv-viewer.edit-submit'

export const test: Test = async ({ FileSystem, Main, Locator, KeyBoard, expect }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/submit.csv`, 'key,value\na,1\n')
  await Main.openUri(`${tmpDir}/submit.csv`)
  const cell = Locator('[name="cell:0:1"]')
  await expect(cell).toHaveText('a')
  await cell.dispatchEvent('dblclick', '{}')
  const editor = Locator('[name="cellEditor"]')
  await expect(editor).toBeFocused()
  await expect(editor).toHaveValue('a')
  await editor.type('edited')
  await expect(editor).toHaveValue('edited')
  await KeyBoard.press('Enter')
  await expect(editor).toHaveCount(0)
  await expect(cell).toHaveText('edited')
  await expect(cell).toBeFocused()
  await expect(Locator('[name="cell:0:2"]')).toHaveText('1')
}
