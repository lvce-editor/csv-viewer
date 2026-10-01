import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.csv-save'

export const test: Test = async ({ ContextMenu, Dialog, expect, FileSystem, KeyBoard, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/save.csv`
  const original = 'name,quantity,note\nApple,10,red\nPear,,green\nPlum,30,purple\n'
  await FileSystem.writeFile(uri, original)
  await Main.openUri(uri)
  const tab = Locator('.MainTab[title$="save.csv"]')
  const cell = Locator('[id="cell:0:2"]')
  const editor = Locator('[name="cellEditor"]')
  await expect(cell).toHaveText('10')
  const edit = async (row: number, value: string): Promise<void> => {
    await Locator(`[id="cell:${row}:2"]`).dispatchEvent('dblclick', { bubbles: true } as unknown as string)
    await expect(editor).toBeFocused()
    await editor.type(value)
    await KeyBoard.press('Enter')
    await expect(editor).toHaveCount(0)
    await expect(tab).toHaveClass('MainTabModified')
  }
  const assertDisk = async (expected: string): Promise<void> => {
    const actual = await FileSystem.readFile(uri)
    if (actual !== expected) throw new Error(`Unexpected CSV bytes: ${JSON.stringify(actual)}`)
  }

  await edit(0, '15')
  await assertDisk(original)
  await Dialog.mockConfirm(() => false)
  await Main.closeActiveEditor()
  await expect(tab).toBeVisible()
  await expect(cell).toHaveText('15')

  await KeyBoard.press('Control+s')
  await expect(tab).not.toHaveClass('MainTabModified')
  const replaced = original.replace('Apple,10,', 'Apple,15,')
  await assertDisk(replaced)
  await Main.closeActiveEditor()
  await Main.openUri(uri)
  await expect(cell).toHaveText('15')

  await edit(1, '42')
  await Locator('.TitleBarTopLevelEntry', { hasText: 'File' }).click()
  await ContextMenu.selectItem('Save')
  const filled = replaced.replace('Pear,,', 'Pear,42,')
  await assertDisk(filled)
  await expect(tab).not.toHaveClass('MainTabModified')
  await edit(0, '')
  await Locator('.TitleBarTopLevelEntry', { hasText: 'File' }).click()
  await ContextMenu.selectItem('Save All')
  const cleared = filled.replace('Apple,15,', 'Apple,,')
  await assertDisk(cleared)
  await expect(tab).not.toHaveClass('MainTabModified')
  await Main.closeActiveEditor()
  await Main.openUri(uri)
  await expect(cell).toHaveText('')
  await expect(Locator('[id="cell:1:2"]')).toHaveText('42')
  await expect(Locator('[id="cell:0:1"]')).toHaveText('Apple')
  await expect(Locator('[id="cell:0:3"]')).toHaveText('red')

  await cell.dispatchEvent('dblclick', { bubbles: true } as unknown as string)
  await expect(editor).toBeFocused()
  await editor.type('cancelled')
  await KeyBoard.press('Escape')
  await expect(cell).toHaveText('')
  await expect(tab).not.toHaveClass('MainTabModified')
  await assertDisk(cleared)
}
