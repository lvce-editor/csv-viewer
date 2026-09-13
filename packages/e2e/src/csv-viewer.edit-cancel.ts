import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'csv-viewer.edit-cancel'

export const test: Test = async ({ FileSystem, Main, Locator, KeyBoard, expect }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/cancel.csv`, 'key,value\na,1\n')
  await Main.openUri(`${tmpDir}/cancel.csv`)
  const cell = Locator('[name="cell:0:1"]')
  await expect(cell).toHaveText('a')
  await cell.dispatchEvent('dblclick', { bubbles: true } as unknown as string)
  const editor = Locator('[name="cellEditor"]')
  await expect(editor).toBeFocused()
  await expect(editor).toHaveValue('a')
  await editor.type('discarded')
  await expect(editor).toHaveValue('discarded')
  await KeyBoard.press('Escape')
  await expect(editor).toHaveCount(0)
  await expect(cell).toHaveText('a')
  await expect(cell).toBeFocused()
  await cell.dispatchEvent('dblclick', { bubbles: true } as unknown as string)
  await expect(editor).toHaveValue('a')
}
