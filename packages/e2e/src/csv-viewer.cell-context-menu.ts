export const name = 'csv-viewer.cell-context-menu'

export const test = async ({ ContextMenu, expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/cell-context-menu.csv`
  await FileSystem.writeFile(uri, 'name,quantity\nApple,10\nPear,20\n')
  await Main.openUri(uri)

  const cell = Locator('[id="cell:0:1"]')
  const menu = Locator('.Menu')
  const menuItems = Locator('.MenuItem')
  await cell.dispatchEvent('contextmenu', {
    bubbles: true,
    button: 2,
    cancelable: true,
    clientX: 100,
    clientY: 100,
  })
  await expect(menu).toBeVisible()
  await expect(menuItems).toHaveCount(2)
  const addRowBelow = menuItems.nth(0)
  const addColumnRight = menuItems.nth(1)
  await expect(addRowBelow).toHaveText('Add row below')
  await expect(addColumnRight).toHaveText('Add column right')
  await ContextMenu.selectItem('Add row below')

  const insertedRowCell = Locator('[id="cell:1:1"]')
  const pearCell = Locator('[id="cell:2:1"]')
  await expect(insertedRowCell).toHaveText('')
  await expect(pearCell).toHaveText('Pear')
  await insertedRowCell.dispatchEvent('contextmenu', {
    bubbles: true,
    button: 2,
    cancelable: true,
    clientX: 100,
    clientY: 120,
  })
  await expect(menu).toBeVisible()
  await expect(menuItems).toHaveCount(2)
  await ContextMenu.selectItem('Add column right')

  const newColumnHeader = Locator('.TableHeading').nth(2)
  const appleCell = Locator('[id="cell:0:1"]')
  const newColumnCell = Locator('[id="cell:0:2"]')
  const quantityCell = Locator('[id="cell:0:3"]')
  await expect(newColumnHeader).toHaveText('Column 3')
  await expect(appleCell).toHaveText('Apple')
  await expect(newColumnCell).toHaveText('')
  await expect(quantityCell).toHaveText('10')

  await Main.save()
  await FileSystem.shouldHaveFile(uri, 'name,Column 3,quantity\nApple,,10\n,,\nPear,,20\n')
  await Main.closeAllEditors()
  await Main.openUri(uri)
  await expect(appleCell).toHaveText('Apple')
  await expect(newColumnCell).toHaveText('')
  await expect(quantityCell).toHaveText('10')
}
