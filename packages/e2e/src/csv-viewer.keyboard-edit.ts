import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'csv-viewer.keyboard-edit'

export const test: Test = async ({ expect, FileSystem, KeyBoard, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const fixture = 'name,quantity,note\nApple,10,red\nPear,20,green\nPlum,30,purple\n'
  await FileSystem.setFiles([
    { content: fixture, uri: `${tmpDir}/keyboard.csv` },
    { content: fixture, uri: `${tmpDir}/repeat.csv` },
  ])
  await Main.openUri(`${tmpDir}/keyboard.csv`)

  const quantityCell = Locator('[id="cell:0:2"]')
  const nameCell = Locator('[id="cell:0:1"]')
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  await nameCell.dispatchEvent('click', { bubbles: true } as unknown as string)
  await expect(nameCell).toBeFocused()
  await KeyBoard.press('ArrowRight')
  await expect(quantityCell).toBeFocused()
  await KeyBoard.press('Enter')

  const editor = Locator('[name="cellEditor"]')
  await expect(editor).toBeFocused()
  await expect(editor).toHaveValue('10')
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  await editor.type('19')
  await KeyBoard.press('Enter')
  await expect(editor).toHaveCount(0)
  await expect(quantityCell).toHaveText('19')
  const noteCell = Locator('[id="cell:0:3"]')
  await expect(nameCell).toHaveText('Apple')
  await expect(noteCell).toHaveText('red')

  await Main.openUri(`${tmpDir}/repeat.csv`)
  const textCell = Locator('[id="cell:1:1"]')
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  await textCell.dispatchEvent('click', { bubbles: true } as unknown as string)
  await expect(textCell).toBeFocused()
  await KeyBoard.press('Enter')
  await expect(editor).toBeFocused()
  await expect(editor).toHaveValue('Pear')
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  await editor.type('Pear edited')
  await KeyBoard.press('Enter')
  await expect(textCell).toHaveText('Pear edited')
}
