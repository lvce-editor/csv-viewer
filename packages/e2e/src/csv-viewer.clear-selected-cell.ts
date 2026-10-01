import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'csv-viewer.clear-selected-cell'

export const test: Test = async ({ expect, FileSystem, KeyBoard, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/clear-selected-cell.csv`, 'name,quantity,note\nApple,10,red\nPear,20,green\n')
  await Main.openUri(`${tmpDir}/clear-selected-cell.csv`)

  const firstQuantity = Locator('[id="cell:0:2"]')
  const secondQuantity = Locator('[id="cell:1:2"]')
  await expect(firstQuantity).toHaveText('10')
  await expect(secondQuantity).toHaveText('20')
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  await firstQuantity.dispatchEvent('click', { bubbles: true } as unknown as string)
  await expect(firstQuantity).toBeFocused()
  await KeyBoard.press('Delete')
  await expect(firstQuantity).toHaveText('')
  await expect(firstQuantity).toBeFocused()
  const firstName = Locator('[id="cell:0:1"]')
  const firstNote = Locator('[id="cell:0:3"]')
  await expect(firstName).toHaveText('Apple')
  await expect(firstNote).toHaveText('red')
  await expect(secondQuantity).toHaveText('20')
  await KeyBoard.press('Delete')
  await expect(firstQuantity).toHaveText('')

  // eslint-disable-next-line @typescript-eslint/no-deprecated
  await secondQuantity.dispatchEvent('click', { bubbles: true } as unknown as string)
  await expect(secondQuantity).toBeFocused()
  await KeyBoard.press('Backspace')
  await expect(secondQuantity).toHaveText('')
  await expect(secondQuantity).toBeFocused()
  const secondName = Locator('[id="cell:1:1"]')
  const secondNote = Locator('[id="cell:1:3"]')
  await expect(secondName).toHaveText('Pear')
  await expect(secondNote).toHaveText('green')

  // eslint-disable-next-line @typescript-eslint/no-deprecated
  await secondQuantity.dispatchEvent('dblclick', { bubbles: true } as unknown as string)
  const editor = Locator('[name="cellEditor"]')
  await expect(editor).toHaveValue('')
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  await editor.type('20')
  await KeyBoard.press('Delete')
  await expect(editor).toHaveValue('20')
  await KeyBoard.press('Backspace')
  await expect(editor).toHaveValue('20')
  await KeyBoard.press('Escape')
  await expect(editor).toHaveCount(0)
  await expect(secondQuantity).toHaveText('')
}
