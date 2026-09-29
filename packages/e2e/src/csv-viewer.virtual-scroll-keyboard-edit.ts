import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'csv-viewer.virtual-scroll-keyboard-edit'

export const test: Test = async ({ expect, FileSystem, KeyBoard, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const rows = Array.from({ length: 200 }, (_, index) => `row ${index + 1},value ${index + 1}`)
  await FileSystem.writeFile(`${tmpDir}/virtual-scroll.csv`, `name,value\n${rows.join('\n')}`)
  await Main.openUri(`${tmpDir}/virtual-scroll.csv`)

  const firstCell = Locator('[id="cell:0:1"]')
  await expect(firstCell).toHaveText('row 1')
  // A real click must focus the webview cell so subsequent keyboard events target it.
  // eslint-disable-next-line e2e/no-direct-click
  await firstCell.click()
  await expect(firstCell).toBeFocused()
  for (let index = 0; index < 100; index++) {
    await KeyBoard.press('ArrowDown')
    const focusedCell = Locator('.TableCellFocused')
    await expect(focusedCell).toHaveText(`row ${index + 2}`)
  }

  const scrolledCell = Locator('.TableCellFocused')
  await expect(scrolledCell).toHaveText('row 101')
  await expect(scrolledCell).toBeFocused()
  await scrolledCell.dispatchEvent('dblclick', { bubbles: true } as unknown as string)
  const editor = Locator('[name="cellEditor"]')
  await expect(editor).toHaveValue('row 101')
  await editor.type(' edited')
  await KeyBoard.press('Enter')
  await expect(editor).toHaveCount(0)
  const editedCell = Locator('.TableCellFocused')
  await expect(editedCell).toHaveText(' edited')
  await expect(editedCell).toBeFocused()
}
