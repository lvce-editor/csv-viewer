export const name = 'csv-viewer.edit-grid'

export const test = async ({ expect, FileSystem, KeyBoard, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const headerOnlyUri = `${tmpDir}/header-only.csv`
  const emptyUri = `${tmpDir}/empty.csv`
  await FileSystem.writeFile(headerOnlyUri, 'name,quantity,note\n')
  await FileSystem.writeFile(emptyUri, '')
  await Main.openUri(headerOnlyUri)

  const edit = async (row, column, value) => {
    const cell = Locator(`[id="cell:${row}:${column}"]`)
    await cell.dispatchEvent('dblclick', { bubbles: true })
    const editor = Locator('[name="cellEditor"]')
    await expect(editor).toBeFocused()
    await expect(editor).toHaveCSS('left', `${column === 0 ? 0 : 40 + (column - 1) * 120 + 1}px`)
    await expect(editor).toHaveCSS('top', `${36 + (row + 1) * 20 + 1}px`)
    await editor.type(value)
    await KeyBoard.press('Enter')
    await expect(cell).toHaveText(value)
  }

  const editWithSpace = async (row, column, value) => {
    const cell = Locator(`[id="cell:${row}:${column}"]`)
    await cell.click()
    await expect(cell).toBeFocused()
    await KeyBoard.press('Space')
    const editor = Locator('[name="cellEditor"]')
    await expect(editor).toBeFocused()
    await editor.type(value)
    await KeyBoard.press('Enter')
    await expect(cell).toHaveText(value)
  }

  await expect(Locator('[id="cell:0:1"]')).toBeVisible()
  await expect(Locator('[id="cell:0:2"]')).toBeVisible()
  await expect(Locator('[id="cell:0:3"]')).toBeVisible()
  await editWithSpace(0, 1, 'Apple pear')
  await edit(0, 2, '4')
  await edit(0, 3, 'fresh')
  await Locator('[name="addRow"]').click()
  await expect(Locator('[id="cell:1:3"]')).toBeVisible()
  await edit(1, 1, 'Pear')
  await Locator('[name="addColumn"]').click()
  await expect(Locator('.TableHeading').nth(4)).toHaveText('Column 4')
  await expect(Locator('[id="cell:0:4"]')).toBeVisible()
  await edit(0, 4, 'fruit')
  await expect(Locator('[id="cell:0:1"]')).toHaveText('Apple pear')
  await expect(Locator('[id="cell:0:2"]')).toHaveText('4')
  await expect(Locator('[id="cell:0:3"]')).toHaveText('fresh')
  await expect(Locator('[id="cell:1:1"]')).toHaveText('Pear')

  await Main.openUri(emptyUri)
  await expect(Locator('[id="cell:0:1"]')).toBeVisible()
  await Locator('[name="addColumn"]').click()
  await expect(Locator('[id="cell:0:2"]')).toBeVisible()
  await Locator('[name="addRow"]').click()
  await expect(Locator('[id="cell:0:2"]')).toBeVisible()
}
